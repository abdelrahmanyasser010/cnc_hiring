// src/app/(dashboard)/admin/referrals/page.tsx
// شاشة إدارة طلبات الترشيح المباشر (Direct Referrals) من إدارة المنصة.
// تتيح للمسؤول مراجعة طلبات المصانع، الفرز حسب الصناعة والماكينات، وتحديث الحالة.

export const dynamic = "force-dynamic";

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { employerRepo } from "@/infrastructure/container";
import ReferralsManagementClient, { ReferralItem } from "./ReferralsManagementClient";
import { Sparkles } from "lucide-react";

export default async function AdminReferralsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let requests: ReferralItem[] = [];

  try {
    const rawRequests = await employerRepo.getAllReferralRequests();
    requests = rawRequests.map((r) => ({
      id: r.id,
      employerId: r.employerId,
      industry: r.industry,
      jobTitle: r.jobTitle,
      machinesNeeded: r.machinesNeeded,
      experienceYears: r.experienceYears,
      governorate: r.governorate,
      salaryRange: r.salaryRange,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt,
      employer: {
        id: r.employer.id,
        companyName: r.employer.companyName,
        industryZone: r.employer.industryZone,
        user: {
          phoneNumber: r.employer.user.phoneNumber,
          email: r.employer.user.email,
        },
      },
    }));
  } catch (error) {
    console.warn("Database failed to load referral requests. Falling back to mock referrals.", error);
    // Mock requests for offline / demo environments
    requests = [
      {
        id: "ref-1",
        employerId: "emp-mock-1",
        industry: "الإسطمبات والفرم",
        jobTitle: "فني فريزة CNC مبرمج 5 محاور",
        machinesNeeded: "DMG MORI DMU 50, Heidenhain TNC 640",
        experienceYears: 5,
        governorate: "الشرقية",
        salaryRange: "14000 - 18000 ج.م",
        notes: "نحتاج كفاءة عالية في تصنيع إسطمبات حقن البلاستيك والتشطيب الدقيق بالـ CAM.",
        status: "PENDING",
        createdAt: "2026-11-20T00:00:00.000Z",
        employer: {
          id: "emp-mock-1",
          companyName: "شركة الدلتا للصناعات الهندسية والإسطمبات",
          industryZone: "العاشر من رمضان",
          user: {
            phoneNumber: "01099887766",
            email: "hr@delta-molds.com",
          },
        },
      },
      {
        id: "ref-2",
        employerId: "emp-mock-2",
        industry: "الصناعات والمستلزمات الطبية",
        jobTitle: "مشغل ومبرمج مخارط سويسرية دقيقة (Swiss Turn)",
        machinesNeeded: "Citizen Cincom, Star Micronics, Fanuc",
        experienceYears: 3,
        governorate: "القاهرة",
        salaryRange: "12000 - 16000 ج.م",
        notes: "تصنيع مسامير وشرائح عظام وتجهيزات جراحية مع دقة ميكرونية وتسامحات حرجة.",
        status: "MATCHING",
        createdAt: "2026-11-18T10:00:00.000Z",
        employer: {
          id: "emp-mock-2",
          companyName: "المتحدة للغرسات والمستلزمات الطبية",
          industryZone: "مدينة بدر",
          user: {
            phoneNumber: "01122334455",
            email: "factory@united-medical.com",
          },
        },
      },
      {
        id: "ref-3",
        employerId: "emp-mock-3",
        industry: "صناعة الطيران",
        jobTitle: "مهندس تشغيل وبرمجة تيتانيوم وإنكونيل",
        machinesNeeded: "Mazak Integrex, Mazatrol / Mastercam",
        experienceYears: 6,
        governorate: "حلوان",
        salaryRange: "20000 - 25000 ج.م",
        notes: "تشغيل معادن فائقة الصلابة وفق متطلبات الجودة الصارمة.",
        status: "NOMINATED",
        createdAt: "2026-11-15T08:30:00.000Z",
        employer: {
          id: "emp-mock-3",
          companyName: "المصرية لمهمات الطيران والصناعات الدقيقة",
          industryZone: "حلوان",
          user: {
            phoneNumber: "01234567890",
            email: "procurement@aero-egypt.com",
          },
        },
      },
    ];
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-foreground">طلبات الترشيح المباشر للكفاءات</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              خدمة الرعايات الحصرية
            </span>
          </div>
          <p className="text-xs text-foreground/60 mt-1 max-w-2xl leading-relaxed">
            متابعة طلبات أصحاب المصانع الذين يرغبون في ترشيح مباشر لكوادر CNC متخصصة بمواصفات ماكينات وصناعات دقيقة.
          </p>
        </div>
      </div>

      {/* Main Client Workspace */}
      <ReferralsManagementClient initialRequests={requests} />
    </div>
  );
}
