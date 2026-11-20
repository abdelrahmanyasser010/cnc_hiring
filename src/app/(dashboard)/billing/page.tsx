// src/app/(dashboard)/billing/page.tsx
// صفحة الاشتراكات والفواتير وإدارة المدفوعات لأصحاب المصانع (Server Component).
// تجلب البيانات من الـ Repositories وتمررها لـ BillingClientView الداعم لتعدد اللغات والـ RTL/LTR.

export const dynamic = "force-dynamic";

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dashboardRepo, planRepo } from "@/infrastructure/container";
import { redirect } from "next/navigation";
import BillingClientView, { PlanData } from "./BillingClientView";

interface BillingPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  // 1. التحقق من تسجيل الدخول
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const isUpgradeReason = resolvedParams.reason === "upgrade";
  const paymentStatus = resolvedParams.status as string | undefined;

  const user = session.user as { id?: string; role?: string };
  const isAdmin = user.role === "SUPER_ADMIN";

  // 2. جلب إحصائيات وباقة الاشتراك الحية عبر الـ Repository
  let subscriptionData = {
    planName: "باقة مجانية (بدون اشتراك نشط)",
    price: "0 ج.م",
    renewalDate: "غير محدد",
    isActive: false,
    maxActiveJobs: 1,
    activeJobsCount: 0,
    maxPhoneViews: 0,
    phoneViewsUsed: 0,
  };

  if (isAdmin) {
    subscriptionData = {
      planName: "مشرف النظام (VIP غير محدود)",
      price: "غير محدود",
      renewalDate: "دائم",
      isActive: true,
      maxActiveJobs: -1,
      activeJobsCount: 0,
      maxPhoneViews: -1,
      phoneViewsUsed: 0,
    };
  } else if (user.id) {
    try {
      const stats = await dashboardRepo.getEmployerStats(user.id);
      if (stats.subscription) {
        subscriptionData = {
          planName: stats.subscription.planName,
          price: stats.subscription.planName.includes("Pro") || stats.subscription.planName.includes("الذهبية") ? "5,000 ج.م" : "2,500 ج.م",
          renewalDate: new Date(stats.subscription.endDate).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
          isActive: true,
          maxActiveJobs: stats.subscription.maxActiveJobs,
          activeJobsCount: stats.subscription.activeJobsCount,
          maxPhoneViews: stats.subscription.maxPhoneViews,
          phoneViewsUsed: stats.subscription.phoneViewsUsed,
        };
      } else {
        subscriptionData.activeJobsCount = stats.activeJobs;
      }
    } catch (error) {
      console.warn("Could not load real billing stats:", error);
    }
  }

  // 3. جلب الباقات النشطة من جدول SubscriptionPlan
  let dbPlans: PlanData[] = [];
  try {
    const rawPlans = await planRepo.listActivePlans();
    dbPlans = rawPlans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      priceEGP: Number(p.priceEGP),
      durationDays: p.durationDays,
      maxActiveJobs: p.maxActiveJobs,
      maxPhoneViews: p.maxPhoneViews,
      canViewPhone: p.canViewPhone,
      canExportData: p.canExportData,
    }));
  } catch (err) {
    console.warn("Could not load plans from database:", err);
  }

  // 4. سجل الفواتير السابقة
  const invoices = [
    {
      id: "1",
      number: "INV-2026-008",
      date: "26 يونيو 2026",
      amount: "2,500 ج.م",
      method: "بوابة Paymob (بطاقة ميزة / بنكية)",
      status: "PAID",
      statusText: "مدفوعة",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      id: "2",
      number: "INV-2026-003",
      date: "26 مايو 2026",
      amount: "2,500 ج.م",
      method: "كود دفع فوري (Fawry Pay)",
      status: "PAID",
      statusText: "مدفوعة",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
  ];

  return (
    <BillingClientView 
      subscriptionData={subscriptionData}
      dbPlans={dbPlans}
      invoices={invoices}
      paymentStatus={paymentStatus}
      isUpgradeReason={isUpgradeReason}
    />
  );
}
