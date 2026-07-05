// src/infrastructure/repositories/PrismaDashboardRepository.ts
// Adapter: Prisma implementation of IDashboardRepository with query batching and select optimizations

import { db } from "@/lib/db";
import type { IDashboardRepository, AdminStatsPayload, EmployerStatsPayload } from "@/application/ports/IDashboardRepository";

export class PrismaDashboardRepository implements IDashboardRepository {
  async getAdminStats(): Promise<AdminStatsPayload> {
    const [totalCandidates, totalEmployers, totalJobs, pendingVerifications, auditLogs] = await Promise.all([
      db.candidateProfile.count(),
      db.employerProfile.count(),
      db.job.count({ where: { status: "ACTIVE" } }),
      db.employerProfile.count({ where: { isVerified: false } }),
      db.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          createdAt: true,
          actor: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      }),
    ]);

    const activities = auditLogs.map((log) => ({
      id: log.id,
      user: log.actor?.name ?? "مستخدم غير معروف",
      role: log.actor?.role === "SUPER_ADMIN" ? "مدير النظام" : "صاحب عمل",
      action: log.action,
      createdAt: log.createdAt,
    }));

    return {
      totalCandidates,
      totalEmployers,
      totalJobs,
      pendingVerifications,
      activities,
    };
  }

  async getEmployerStats(userId: string): Promise<EmployerStatsPayload> {
    const employerProfile = await db.employerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        companyName: true,
        isVerified: true,
      },
    });

    if (!employerProfile) {
      throw new Error("Employer profile not found.");
    }

    const [activeJobs, totalApplications, pendingInterviews, dbApplications, activeSub] = await Promise.all([
      db.job.count({
        where: { employerId: employerProfile.id, status: "ACTIVE" },
      }),
      db.jobApplication.count({
        where: {
          job: { employerId: employerProfile.id },
        },
      }),
      db.jobApplication.count({
        where: {
          job: { employerId: employerProfile.id },
          status: "INTERVIEW",
        },
      }),
      db.jobApplication.findMany({
        where: {
          job: { employerId: employerProfile.id },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          score: true,
          status: true,
          createdAt: true,
          candidateProfile: {
            select: {
              experienceYears: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          job: {
            select: {
              title: true,
            },
          },
        },
      }),
      db.subscription.findFirst({
        where: { employerId: employerProfile.id, status: "ACTIVE", endDate: { gt: new Date() } },
        select: {
          id: true,
          status: true,
          endDate: true,
          phoneViewsUsed: true,
          plan: {
            select: {
              name: true,
              maxActiveJobs: true,
              maxPhoneViews: true,
              canViewPhone: true,
            },
          },
        },
      }),
    ]);

    const activities = dbApplications.map((app) => ({
      id: app.id,
      name: app.candidateProfile.user.name,
      jobTitle: app.job.title,
      experience: `خبرة ${app.candidateProfile.experienceYears} سنوات`,
      score: app.score !== null ? `${app.score}%` : "بدون اختبار",
      status: app.status,
      createdAt: app.createdAt,
    }));

    const subscription = activeSub ? {
      planName: activeSub.plan.name,
      maxActiveJobs: activeSub.plan.maxActiveJobs,
      activeJobsCount: activeJobs,
      maxPhoneViews: activeSub.plan.maxPhoneViews,
      phoneViewsUsed: activeSub.phoneViewsUsed,
      isActive: true,
      endDate: activeSub.endDate || new Date(),
    } : null;

    return {
      companyName: employerProfile.companyName,
      isVerified: employerProfile.isVerified,
      activeJobs,
      totalApplications,
      pendingInterviews,
      activities,
      subscription,
    };
  }
}
