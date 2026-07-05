// src/infrastructure/repositories/PrismaPlanRepository.ts
// Adapter: Prisma implementation of IPlanRepository

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { IPlanRepository, PlanDTO } from "@/application/ports/IPlanRepository";

export class PrismaPlanRepository implements IPlanRepository {
  async listAllPlans(): Promise<PlanDTO[]> {
    const plans = await db.subscriptionPlan.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      priceEGP: Number(p.priceEGP),
      durationDays: p.durationDays,
      maxActiveJobs: p.maxActiveJobs,
      maxPhoneViews: p.maxPhoneViews,
      canViewPhone: p.canViewPhone,
      canExportData: p.canExportData,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    }));
  }

  async listActivePlans(): Promise<PlanDTO[]> {
    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      priceEGP: Number(p.priceEGP),
      durationDays: p.durationDays,
      maxActiveJobs: p.maxActiveJobs,
      maxPhoneViews: p.maxPhoneViews,
      canViewPhone: p.canViewPhone,
      canExportData: p.canExportData,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    }));
  }

  async createPlan(data: {
    name: string;
    description?: string;
    priceEGP: number;
    durationDays: number;
    maxActiveJobs: number;
    maxPhoneViews: number;
    canViewPhone?: boolean;
    canExportData?: boolean;
    sortOrder?: number;
  }): Promise<PlanDTO> {
    const p = await db.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description || "",
        priceEGP: new Prisma.Decimal(data.priceEGP),
        durationDays: data.durationDays,
        maxActiveJobs: data.maxActiveJobs,
        maxPhoneViews: data.maxPhoneViews,
        canViewPhone: data.canViewPhone ?? true,
        canExportData: data.canExportData ?? false,
        isActive: true,
        sortOrder: data.sortOrder ?? 10,
      },
    });

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      priceEGP: Number(p.priceEGP),
      durationDays: p.durationDays,
      maxActiveJobs: p.maxActiveJobs,
      maxPhoneViews: p.maxPhoneViews,
      canViewPhone: p.canViewPhone,
      canExportData: p.canExportData,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    };
  }

  async updatePlan(
    id: string,
    data: {
      name?: string;
      description?: string;
      priceEGP?: number;
      durationDays?: number;
      maxActiveJobs?: number;
      maxPhoneViews?: number;
      canViewPhone?: boolean;
      canExportData?: boolean;
      isActive?: boolean;
      sortOrder?: number;
    }
  ): Promise<PlanDTO> {
    const updateData: Prisma.SubscriptionPlanUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priceEGP !== undefined) updateData.priceEGP = new Prisma.Decimal(data.priceEGP);
    if (data.durationDays !== undefined) updateData.durationDays = data.durationDays;
    if (data.maxActiveJobs !== undefined) updateData.maxActiveJobs = data.maxActiveJobs;
    if (data.maxPhoneViews !== undefined) updateData.maxPhoneViews = data.maxPhoneViews;
    if (data.canViewPhone !== undefined) updateData.canViewPhone = data.canViewPhone;
    if (data.canExportData !== undefined) updateData.canExportData = data.canExportData;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const p = await db.subscriptionPlan.update({
      where: { id },
      data: updateData,
    });

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      priceEGP: Number(p.priceEGP),
      durationDays: p.durationDays,
      maxActiveJobs: p.maxActiveJobs,
      maxPhoneViews: p.maxPhoneViews,
      canViewPhone: p.canViewPhone,
      canExportData: p.canExportData,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    };
  }

  async togglePlanStatus(id: string): Promise<boolean> {
    const plan = await db.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new Error("Plan not found");

    const updated = await db.subscriptionPlan.update({
      where: { id },
      data: { isActive: !plan.isActive },
    });

    return updated.isActive;
  }
}
