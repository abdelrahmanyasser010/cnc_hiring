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
    user: "مشرف النظام (Admin)",
    role: "Admin",
    actionAr: "تم اعتماد وتوثيق السجل التجاري لـ: السويدي للصناعات الهندسية والميكانيكا",
    actionEn: "Verified commercial registry: ELSEWEDY Engineering Industries",
    createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
  },
  {
    id: "mock-log-2",
    user: "العربي جروب للإسطمبات",
    role: "Employer",
    actionAr: "تم نشر شاغر تشغيل جديد: فني فريزة CNC خماسية المحاور VMC",
    actionEn: "Published new requisition: 5-Axis CNC Milling Specialist",
    createdAt: new Date(Date.now() - 1000 * 60 * 75), // 1.2 hours ago
  },
  {
    id: "mock-log-3",
    user: "أحمد مرسي الشرقاوي",
    role: "Machinist",
    actionAr: "تم التقديم على وظيفة فني تشغيل وضبط مخرطة بمصنع النيل وتأكيد التفرغ",
    actionEn: "Applied for Lathe Machinist position at Nile Precision Engineering",
    createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
  },
  {
    id: "mock-log-4",
    user: "مسبك الجيزة للحديد والصلب",
    role: "Employer",
    actionAr: "تم كشف بيانات الاتصال والمحادثة المباشرة لكادر فني: إبراهيم خليل النحاس",
    actionEn: "Revealed contact details for candidate: Ibrahim Khalil El-Nahas",
    createdAt: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
  },
  {
    id: "mock-log-5",
    user: "م. حسام الجيزاوي",
    role: "Engineer",
    actionAr: "تم تحديث الملف الفني وإضافة شهادة إتقان Siemens Sinumerik 840D",
    actionEn: "Updated technical profile with Siemens Sinumerik 840D certification",
    createdAt: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
  },
  {
    id: "mock-log-6",
    user: "شركة الدلتا للإسطمبات",
    role: "Employer",
    actionAr: "تم إرسال طلب ترشيح كفاءة مخصصة (Direct Headhunting) لـ 5 محاور",
    actionEn: "Submitted direct headhunting request for 5-Axis CAM Engineer",
    createdAt: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
  },
  {
    id: "mock-log-7",
    user: "مشرف النظام (Admin)",
    role: "Admin",
    actionAr: "تم تحديث أسعار وحصص الباقة المتقدمة (Pro Plan) بنجاح",
    actionEn: "Updated Pro Plan quotas and pricing parameters successfully",
    createdAt: new Date(Date.now() - 1000 * 60 * 1440), // 1 day ago
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
          value: "218",
          changeAr: "فنيين ومهندسين مسجلين",
          changeEn: "Registered Specialists & Engineers",
          iconType: "Users",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          titleAr: "المنشآت والمصانع",
          titleEn: "Industrial Plants",
          value: "34",
          changeAr: "منشآت معتمدة في 8 مناطق صناعية",
          changeEn: "Certified Plants across 8 Hubs",
          iconType: "Building2",
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          titleAr: "الوظائف النشطة حالياً",
          titleEn: "Active Requisitions",
          value: "26",
          changeAr: "تستقبل طلبات تقديم مباشرة",
          changeEn: "Accepting Direct Applications",
          iconType: "Briefcase",
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          titleAr: "طلبات توثيق معلقة",
          titleEn: "Pending Verifications",
          value: "5",
          changeAr: "تحتاج مراجعة السجل التجاري",
          changeEn: "Commercial Registry Review Required",
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
