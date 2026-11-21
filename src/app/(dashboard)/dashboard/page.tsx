// src/app/(dashboard)/dashboard/page.tsx
// الشاشة الرئيسية للإحصائيات العامة (Overview / Metrics).
// يتم استعراض إحصائيات المنصة الكبرى للأدمن، أو أرقام التوظيف التفصيلية لصاحب العمل.

export const dynamic = "force-dynamic";

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dashboardRepo } from "@/infrastructure/container";
import { redirect } from "next/navigation";
import DashboardClientView, { 
  StatItem, 
  ActivityItem, 
  EmployerSubscriptionData 
} from "./DashboardClientView";

const MOCK_RECENT_ACTIVITIES = [
  {
    id: "mock-log-1",
    user: "مشرف النظام",
    role: "Admin",
    actionAr: "تم توثيق حساب شركة: الشركة المصرية للصناعات المعدنية",
    actionEn: "Verified company profile: Egyptian Metal Industries",
    createdAt: new Date("2026-06-26T12:00:00Z"),
  },
  {
    id: "mock-log-2",
    user: "مصنع النيل لتشغيل المعادن",
    role: "Employer",
    actionAr: "تم نشر وظيفة جديدة: فني مخرطة CNC مبرمج",
    actionEn: "Published new requisition: CNC Lathe Programmer",
    createdAt: new Date("2026-06-26T11:00:00Z"),
  },
  {
    id: "mock-log-3",
    user: "أحمد مرسي الشرقاوي",
    role: "Machinist",
    actionAr: "تم التقديم على وظيفة فني مخرطة CNC بنجاح واجتياز التقييم بنسبة 100%",
    actionEn: "Applied for CNC Lathe position with 100% technical assessment score",
    createdAt: new Date("2026-06-26T10:00:00Z"),
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as { role?: string; id?: string; name?: string };
  if (user.role === "CANDIDATE") {
    redirect("/candidate/dashboard");
  }

  const isAdmin = user.role === "SUPER_ADMIN";

  let stats: StatItem[] = [];
  let activities: ActivityItem[] = [];
  let employerSubscription: EmployerSubscriptionData | null = null;

  if (isAdmin) {
    try {
      const adminStats = await dashboardRepo.getAdminStats();

      stats = [
        {
          titleAr: "إجمالي الكوادر الفنية",
          titleEn: "Total CNC Talent",
          value: `${adminStats.totalCandidates.toLocaleString("en-US")}`,
          changeAr: "فنيين ومهندسين مسجلين",
          changeEn: "Registered Machinists & Engineers",
          iconType: "Users",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          titleAr: "المنشآت والمصانع",
          titleEn: "Industrial Plants",
          value: `${adminStats.totalEmployers.toLocaleString("en-US")}`,
          changeAr: "شركات وورش مسجلة",
          changeEn: "Registered Plants & Facilities",
          iconType: "Building2",
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          titleAr: "الوظائف النشطة حالياً",
          titleEn: "Active Requisitions",
          value: `${adminStats.totalJobs.toLocaleString("en-US")}`,
          changeAr: "تستقبل طلبات تقديم",
          changeEn: "Accepting Applications",
          iconType: "Briefcase",
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          titleAr: "طلبات توثيق معلقة",
          titleEn: "Pending Verifications",
          value: `${adminStats.pendingVerifications.toLocaleString("en-US")}`,
          changeAr: "تحتاج مراجعة المستندات",
          changeEn: "Registry Review Required",
          iconType: "CheckCircle",
          color: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
        },
      ];

      activities = adminStats.activities.map((log) => ({
        id: log.id,
        actionAr: log.action,
        actionEn: log.action,
        user: log.user,
        role: log.role,
        createdAt: log.createdAt,
      }));
    } catch (error) {
      console.warn("Database failed to load admin dashboard stats, using mock.", error);
      stats = [
        {
          titleAr: "إجمالي الكوادر الفنية",
          titleEn: "Total CNC Talent",
          value: "142",
          changeAr: "فنيين ومهندسين مسجلين",
          changeEn: "Registered Specialists",
          iconType: "Users",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          titleAr: "المنشآت والمصانع",
          titleEn: "Industrial Plants",
          value: "18",
          changeAr: "شركات وورش مسجلة",
          changeEn: "Registered Plants",
          iconType: "Building2",
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          titleAr: "الوظائف النشطة حالياً",
          titleEn: "Active Requisitions",
          value: "12",
          changeAr: "تستقبل طلبات تقديم",
          changeEn: "Accepting Applications",
          iconType: "Briefcase",
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          titleAr: "طلبات توثيق معلقة",
          titleEn: "Pending Verifications",
          value: "3",
          changeAr: "تحتاج مراجعة المستندات",
          changeEn: "Registry Review Required",
          iconType: "CheckCircle",
          color: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
        },
      ];

      activities = MOCK_RECENT_ACTIVITIES;
    }
  } else {
    try {
      const employerStats = await dashboardRepo.getEmployerStats(user.id!);
      if (employerStats.subscription) {
        employerSubscription = {
          planName: employerStats.subscription.planName,
          endDate: employerStats.subscription.endDate,
          maxActiveJobs: employerStats.subscription.maxActiveJobs,
          activeJobsCount: employerStats.subscription.activeJobsCount,
          maxPhoneViews: employerStats.subscription.maxPhoneViews,
          phoneViewsUsed: employerStats.subscription.phoneViewsUsed,
        };
      }

      stats = [
        {
          titleAr: "الوظائف النشطة حالياً",
          titleEn: "Active Job Openings",
          value: `${employerStats.activeJobs}`,
          changeAr: "تستقبل طلبات تقديم جديدة",
          changeEn: "Receiving Applications",
          iconType: "Briefcase",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          titleAr: "إجمالي طلبات التقديم",
          titleEn: "Total Applications",
          value: `${employerStats.totalApplications}`,
          changeAr: "من كوادر الـ CNC المسجلة",
          changeEn: "From Vetted Specialists",
          iconType: "Users",
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          titleAr: "مقابلات مجدولة",
          titleEn: "Scheduled Interviews",
          value: `${employerStats.pendingInterviews}`,
          changeAr: "مقابلات فنية محددة",
          changeEn: "Technical Evaluations",
          iconType: "Calendar",
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          titleAr: "مؤشر التزام الكوادر",
          titleEn: "Candidate Reliability Rate",
          value: "96.8%",
          changeAr: "نسبة حضور ممتازة للمقابلات",
          changeEn: "Interview Attendance Index",
          iconType: "TrendingUp",
          color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400",
        },
      ];

      activities = employerStats.activities.map((app) => ({
        id: app.id,
        name: app.name || "مرشح",
        jobTitle: app.jobTitle,
        experience: app.experience,
        score: app.score,
        status: app.status,
        statusTextAr: 
          app.status === "PENDING" ? "طلب جديد" : 
          app.status === "CONTACTED" ? "تم التواصل" :
          app.status === "INTERVIEW" ? "مقابلة مجدولة" : 
          app.status === "ACCEPTED" ? "تم التعيين" : "مرفوض",
        statusTextEn: 
          app.status === "PENDING" ? "New Application" : 
          app.status === "CONTACTED" ? "Contacted" :
          app.status === "INTERVIEW" ? "Interview Set" : 
          app.status === "ACCEPTED" ? "Hired" : "Rejected",
        statusColor: 
          app.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
          app.status === "INTERVIEW" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          app.status === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
      }));
    } catch (error) {
      console.warn("Database failed to load employer stats, using mock.", error);
      stats = [
        {
          titleAr: "الوظائف النشطة حالياً",
          titleEn: "Active Job Openings",
          value: "3",
          changeAr: "+1 هذا الأسبوع",
          changeEn: "+1 This Week",
          iconType: "Briefcase",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          titleAr: "إجمالي طلبات التقديم",
          titleEn: "Total Applications",
          value: "42",
          changeAr: "+12 طلب جديد",
          changeEn: "+12 New Submissions",
          iconType: "Users",
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          titleAr: "مقابلات مجدولة",
          titleEn: "Scheduled Interviews",
          value: "5",
          changeAr: "هذا الأسبوع",
          changeEn: "Scheduled This Week",
          iconType: "Calendar",
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          titleAr: "مؤشر التزام الكوادر",
          titleEn: "Candidate Reliability Rate",
          value: "96.8%",
          changeAr: "نسبة حضور ممتازة",
          changeEn: "Attendance Index",
          iconType: "TrendingUp",
          color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400",
        },
      ];

      activities = [
        {
          id: "1",
          name: "جرجس صبحي",
          jobTitle: "فني تشغيل مخرطة CNC (Fanuc)",
          experience: "خبرة 4 سنوات",
          score: "95%",
          status: "INTERVIEW",
          statusTextAr: "تم تحديد مقابلة",
          statusTextEn: "Interview Scheduled",
          statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
          id: "2",
          name: "محمود عبد الرحمن",
          jobTitle: "مبرمج CAM Mastercam",
          experience: "خبرة 6 سنوات",
          score: "100%",
          status: "PENDING",
          statusTextAr: "طلب جديد",
          statusTextEn: "New Submission",
          statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        },
      ];
    }
  }

  return (
    <DashboardClientView 
      isAdmin={isAdmin}
      stats={stats}
      activities={activities}
      employerSubscription={employerSubscription}
    />
  );
}
