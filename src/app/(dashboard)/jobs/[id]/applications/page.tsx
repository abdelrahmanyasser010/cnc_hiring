// src/app/(dashboard)/jobs/[id]/applications/page.tsx
// صفحة عرض المتقدمين لوظيفة محددة (Server Component).
// تقوم بجلب طلبات التقديم الحية لـ PostgreSQL مرتبة حسب نتيجة اختبار التصفية الأفضل أولاً.

export const dynamic = "force-dynamic";

import React from "react";
import { jobRepo } from "@/infrastructure/container";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, AlertCircle, FileSpreadsheet } from "lucide-react";
import ApplicantRow from "@/components/dashboard/ApplicantRow";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

type ApplicationWithMachinist = {
  id: string;
  score: number | null;
  status: string;
  createdAt: Date | string;
  machinist: {
    id: string;
    name: string;
    role: "TECHNICIAN" | "ENGINEER";
    governorate: string;
    city: string;
    experienceYears: number;
    expectedSalary: number | string | { toString(): string };
    reliabilityScore: number;
    preferredControl: string[];
    specializations: string[];
    machineTypes: string[];
    phoneNumber: string;
  };
};

const MOCK_JOB_APPLICATIONS: ApplicationWithMachinist[] = [
  {
    id: "app-mock-1",
    score: 100,
    status: "PENDING",
    createdAt: new Date("2026-06-26T12:00:00Z"),
    machinist: {
      id: "m-1",
      name: "أحمد مرسي الشرقاوي",
      role: "TECHNICIAN" as const,
      governorate: "الشرقية",
      city: "العاشر من رمضان",
      experienceYears: 6,
      expectedSalary: 10500,
      reliabilityScore: 98,
      preferredControl: ["FANUC", "HAAS"],
      specializations: [],
      machineTypes: ["مخرطة CNC", "فريزة CNC"],
      phoneNumber: "01012345678",
    },
  },
  {
    id: "app-mock-2",
    score: 66,
    status: "CONTACTED",
    createdAt: new Date("2026-06-26T11:00:00Z"),
    machinist: {
      id: "m-2",
      name: "م. حسام محمود الجيزاوي",
      role: "ENGINEER" as const,
      governorate: "الجيزة",
      city: "6 أكتوبر",
      experienceYears: 8,
      expectedSalary: 14500,
      reliabilityScore: 95,
      preferredControl: ["FANUC", "SIEMENS"],
      specializations: ["Mastercam", "SolidWorks"],
      machineTypes: [],
      phoneNumber: "01234567890",
    },
  },
  {
    id: "app-mock-3",
    score: 33,
    status: "PENDING",
    createdAt: new Date("2026-06-26T10:00:00Z"),
    machinist: {
      id: "m-3",
      name: "شريف جلال البساتيني",
      role: "TECHNICIAN" as const,
      governorate: "القاهرة",
      city: "البساتين",
      experienceYears: 4,
      expectedSalary: 8500,
      reliabilityScore: 88,
      preferredControl: ["FANUC"],
      specializations: [],
      machineTypes: ["فريزة CNC"],
      phoneNumber: "01122334455",
    },
  },
];

export default async function JobApplicationsPage({ params }: PageProps) {
  const { id } = await params;

  let job: { id: string; title: string } | null = null;
  let applications: ApplicationWithMachinist[] = [];
  let isMockData = false;

  try {
    const result = await jobRepo.getJobAndApplications(id);
    job = result.job;
    if (!job) {
      return notFound();
    }
    applications = result.applications as unknown as ApplicationWithMachinist[];
  } catch (error) {
    console.warn("Database connection failed, falling back to mock applicant list.", error);
    isMockData = true;

    // وظيفة تجريبية وبيانات متقدمين وهمية للتطوير والتجربة الفورية
    job = {
      id: id,
      title: "فني تشغيل مخرطة CNC مبرمج (تجريبي)",
    };

    applications = MOCK_JOB_APPLICATIONS;
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      
      {/* رأس الصفحة مع زر الرجوع */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-semibold">
            <span>لوحة التحكم</span>
            <span>/</span>
            <span>إدارة الوظائف</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground/90 flex items-center gap-2 mt-1">
            <Users className="w-6 h-6 text-primary" />
            <span>المتقدمين لوظيفة: {job.title}</span>
          </h1>
        </div>
        
        <Link 
          href="/jobs" 
          className="flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-primary transition-colors border border-border px-3 py-2 rounded-xl bg-card hover:bg-secondary/5"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>رجوع للوظائف</span>
        </Link>
      </div>

      {/* تنبيه بيئة التطوير */}
      {isMockData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
          <span>⚙️ تنبيه بيئة التطوير: تم استخدام قائمة متقدمين تجريبية لعدم إمكانية الاتصال بقاعدة بيانات PostgreSQL حالياً.</span>
        </div>
      )}

      {/* جدول عرض المتقدمين */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground/90 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span>سجلات المتقدمين (مرتبين حسب الكفاءة)</span>
          </h3>
          <span className="text-xs bg-secondary/10 px-2.5 py-0.5 rounded-lg text-foreground/60 font-semibold">
            إجمالي: {applications.length.toLocaleString("ar-EG")} فنيين
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-foreground/20" />
            <div className="text-sm font-semibold">لا توجد طلبات تقديم مسجلة لهذه الوظيفة بعد</div>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              عند قيام الكوادر الفنية بالتقديم على هذه الوظيفة من الموقع الخارجي واجتياز التقييم، ستظهر بياناتهم هنا فوراً.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/5 border-b border-border text-foreground/60 text-xs font-bold font-sans">
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4 text-right">المرشح والتصنيف</th>
                  <th className="p-4 text-center">اختبار التصفية</th>
                  <th className="p-4 text-center">مؤشر الجدية</th>
                  <th className="p-4 text-right">المنطقة والراتب</th>
                  <th className="p-4 text-center">تاريخ التقديم</th>
                  <th className="p-4 text-right w-44">الإجراء / الحالة</th>
                  <th className="p-4 text-center w-36">رقم الهاتف</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <ApplicantRow key={app.id} app={app} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
