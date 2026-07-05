// src/infrastructure/repositories/PrismaEmployerRepository.ts
// Adapter: Prisma implementation of IEmployerRepository
// ONLY file allowed to import Prisma for employer + subscription operations

import { db } from "@/lib/db";
import type {
  IEmployerRepository,
  ActiveSubscriptionRecord,
} from "@/application/ports/IEmployerRepository";

export class PrismaEmployerRepository implements IEmployerRepository {
  async findProfileIdByUserId(userId: string): Promise<string | null> {
    const profile = await db.employerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    return profile?.id ?? null;
  }

  async findActiveSubscription(
    employerProfileId: string
  ): Promise<ActiveSubscriptionRecord | null> {
    const sub = await db.subscription.findFirst({
      where: {
        employerId: employerProfileId,
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      include: {
        plan: {
          select: {
            name: true,
            maxActiveJobs: true,
            maxPhoneViews: true,
            canViewPhone: true,
            canExportData: true,
          },
        },
      },
    });

    if (!sub) return null;

    return {
      id: sub.id,
      employerId: sub.employerId,
      status: sub.status,
      endDate: sub.endDate!,
      phoneViewsUsed: sub.phoneViewsUsed,
      plan: {
        name: sub.plan.name,
        maxActiveJobs: sub.plan.maxActiveJobs,
        maxPhoneViews: sub.plan.maxPhoneViews,
        canViewPhone: sub.plan.canViewPhone,
        canExportData: sub.plan.canExportData,
      },
    };
  }

  async update(
    employerProfileId: string,
    data: { isVerified?: boolean }
  ): Promise<{ companyName: string }> {
    const updated = await db.employerProfile.update({
      where: { id: employerProfileId },
      data,
      select: { companyName: true },
    });
    return { companyName: updated.companyName };
  }

  async findAllEmployersWithUsers(): Promise<unknown[]> {
    return db.employerProfile.findMany({
      select: {
        id: true,
        companyName: true,
        industryZone: true,
        address: true,
        commercialRegId: true,
        businessLicenseUrl: true,
        isVerified: true,
        user: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getVerifiedCompaniesWithJobs(query?: string, zone?: string): Promise<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isVerified: true };

    if (query) {
      where.companyName = {
        contains: query,
        mode: "insensitive",
      };
    }

    if (zone) {
      where.industryZone = zone;
    }

    return db.employerProfile.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        industryZone: true,
        address: true,
        logoUrl: true,
        isVerified: true,
        jobs: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        companyName: "asc",
      },
    });
  }

  async incrementPhoneViews(subscriptionId: string): Promise<void> {
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { phoneViewsUsed: { increment: 1 } },
    });
  }

  async createCheckoutTransaction(
    employerId: string,
    planId: string,
    amount: number,
    idempotencyKey: string
  ): Promise<{ invoiceId: string; transactionId: string; planName: string; companyName?: string }> {
    const employer = await db.employerProfile.findUnique({
      where: { id: employerId },
      select: { id: true, companyName: true },
    });
    if (!employer) throw new Error("Employer profile not found.");

    let plan = await db.subscriptionPlan.findFirst({
      where: {
        OR: [{ id: planId }, { name: planId }, { name: { contains: planId } }],
      },
    });

    if (!plan) {
      const isPro = planId.toLowerCase().includes("pro") || planId.includes("الاحترافية");
      const isGold = planId.toLowerCase().includes("gold") || planId.includes("الذهبية") || planId.includes("vip");
      
      const planName = isGold ? "الباقة الذهبية (Gold VIP)" : isPro ? "الباقة الاحترافية (Pro)" : "الباقة الأساسية (Basic)";
      const priceEGP = isGold ? 5000 : isPro ? 2500 : 1000;
      const maxJobs = isGold ? -1 : isPro ? 5 : 2;
      const maxViews = isGold ? -1 : isPro ? 50 : 15;

      plan = await db.subscriptionPlan.upsert({
        where: { name: planName },
        update: {},
        create: {
          name: planName,
          description: `اشتراك شهري للمصانع - ${planName}`,
          priceEGP,
          durationDays: 30,
          maxActiveJobs: maxJobs,
          maxPhoneViews: maxViews,
          canViewPhone: true,
          canExportData: isPro || isGold,
        },
      });
    }

    let subscription = await db.subscription.findFirst({
      where: { employerId: employer.id, planId: plan.id },
    });

    if (!subscription) {
      subscription = await db.subscription.create({
        data: {
          employerId: employer.id,
          planId: plan.id,
          tenantId: employer.id,
          status: "PENDING",
          remainingJobPosts: plan.maxActiveJobs,
          remainingViews: plan.maxPhoneViews,
        },
      });
    }

    const invoice = await db.invoice.create({
      data: {
        subscriptionId: subscription.id,
        tenantId: employer.id,
        amount: amount,
        currency: "EGP",
      },
    });

    const transaction = await db.transaction.create({
      data: {
        invoiceId: invoice.id,
        tenantId: employer.id,
        idempotencyKey,
        status: "PENDING",
        amount: amount,
        currency: "EGP",
      },
    });

    return {
      invoiceId: invoice.id,
      transactionId: transaction.id,
      planName: plan.name,
      companyName: employer.companyName,
    };
  }

  async activateSubscriptionAfterPayment(
    idempotencyKey: string,
    gatewayRef: string
  ): Promise<{ success: boolean; employerId?: string; subscriptionId?: string; invoiceId?: string; amount?: number }> {
    const transaction = await db.transaction.findUnique({
      where: { idempotencyKey },
      include: {
        invoice: {
          include: {
            subscription: {
              include: { plan: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      console.warn(`[PrismaEmployerRepository] Transaction not found for idempotencyKey: ${idempotencyKey}`);
      return { success: false };
    }

    await db.$transaction([
      db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          gatewayRef,
        },
      }),
      db.subscription.update({
        where: { id: transaction.invoice.subscriptionId },
        data: {
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + transaction.invoice.subscription.plan.durationDays * 24 * 60 * 60 * 1000),
          phoneViewsUsed: 0,
          remainingJobPosts: transaction.invoice.subscription.plan.maxActiveJobs,
          remainingViews: transaction.invoice.subscription.plan.maxPhoneViews,
        },
      }),
    ]);

    return {
      success: true,
      employerId: transaction.invoice.subscription.employerId,
      subscriptionId: transaction.invoice.subscriptionId,
      invoiceId: transaction.invoiceId,
      amount: Number(transaction.amount),
    };
  }
}
