// src/app/(candidate)/candidate/dashboard/page.tsx
// لوحة تحكم الكوادر وفنيي الـ CNC (Candidate Dashboard).
// مستوحاة مباشرة من هيكل لوحة تحكم الكفاءات في المنصات العالمية (hirecnc.com/dashboard).

export const dynamic = "force-dynamic";

import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { candidateRepo } from "@/infrastructure/container";
import { db } from "@/lib/db";
import CandidateDashboardClientView, { CandidateApplicationItem } from "./CandidateDashboardClientView";

export const metadata = {
  title: "لوحة تحكم الكادر الفني | HIREX CNC",
  description: "متابعة كفاءة الملف الفني، طلبات التوظيف، وتنبيهات شواغر الـ CNC بالمصانع الهندسية المعتمدة.",
};

export default async function CandidateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const candidate = await candidateRepo.findProfileByUserId(session.user.id);

  if (!candidate) {
    redirect("/login");
  }

  // 1. حساب نسبة اكتمال الملف الفني
  let completeness = 0;
  if (candidate.user.name) completeness += 10;
  if (candidate.user.phoneNumber) completeness += 10;
  if (candidate.jobTitle) completeness += 10;
  if (candidate.industry) completeness += 10;
  if (candidate.governorate) completeness += 10;
  if (candidate.city) completeness += 10;
  if (candidate.experienceYears > 0) completeness += 10;
  if (candidate.machinesFreeText) completeness += 15;
  if (candidate.skillsSummary) completeness += 10;
  if (candidate.cvUrl) completeness += 5;

  // 2. جلب طلبات التوظيف الفعلية
  let applications: CandidateApplicationItem[] = [];
  try {
    const rawApps = await db.jobApplication.findMany({
      where: { candidateProfileId: candidate.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            controlRequired: true,
            salaryMin: true,
            salaryMax: true,
            employer: {
              select: {
                companyName: true,
                industryZone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    applications = rawApps.map((a) => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      interviewDate: a.interviewDate,
      interviewLocation: a.interviewLocation,
      job: {
        id: a.job.id,
        title: a.job.title,
        companyName: a.job.employer?.companyName || "مصنع شريك",
        governorate: a.job.employer?.industryZone || "المنطقة الصناعية",
        city: a.job.location || "مصر",
        machineType: "ماكينات CNC",
        controlRequired: a.job.controlRequired,
        salaryRange: `${Number(a.job.salaryMin)} - ${Number(a.job.salaryMax)} ج.م`,
      },
    }));
  } catch (error) {
    console.warn("Database failed to query candidate job applications:", error);
  }

  const dashboardData = {
    candidate: {
      id: candidate.id,
      name: candidate.user.name,
      email: candidate.user.email,
      phoneNumber: candidate.user.phoneNumber,
      isAvailable: candidate.isAvailable,
      jobTitle: candidate.jobTitle,
      industry: candidate.industry,
      governorate: candidate.governorate,
      city: candidate.city,
      experienceYears: candidate.experienceYears,
      machinesFreeText: candidate.machinesFreeText,
      skillsSummary: candidate.skillsSummary,
      cvUrl: candidate.cvUrl,
      completeness,
    },
    applications,
  };

  return <CandidateDashboardClientView data={dashboardData} />;
}
