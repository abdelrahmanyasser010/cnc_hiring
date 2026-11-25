// src/app/(dashboard)/admin/plans/page.tsx
// Server component for Super Admin Plans & Pricing Management page

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminPlansAction } from "@/presentation/actions/admin.plans.actions";
import PlanManagementClient from "./PlanManagementClient";
import { ShieldAlert } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة الباقات والأسعار | HIREX CNC مصر (للمديرين فقط)",
  description: "لوحة التحكم الحصرية لمدير النظام لتعديل أسعار الباقات وحصص التوظيف بشكل ديناميكي.",
};

export const dynamic = "force-dynamic";

const FALLBACK_ADMIN_PLANS = [
  {
    id: "plan-basic",
    name: "الباقة الأساسية (Basic)",
    description: "باقة البداية للمصانع والورش الصغيرة لنشر الوظائف والتواصل السريع.",
    priceEGP: 1000,
    durationDays: 30,
    maxActiveJobs: 2,
    maxPhoneViews: 15,
    canViewPhone: true,
    canExportData: false,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "plan-pro",
    name: "الباقة المتقدمة (Pro)",
    description: "الخيار الأفضل لمصانع الإنتاج المتوسطة مع حصة كشف هواتف موسعة.",
    priceEGP: 2500,
    durationDays: 30,
    maxActiveJobs: 5,
    maxPhoneViews: 50,
    canViewPhone: true,
    canExportData: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "plan-enterprise",
    name: "الباقة المؤسسية (Enterprise)",
    description: "لكبرى مجمعات التصنيع مع نشر وظائف غير محدود وأولوية الترشيح المباشر.",
    priceEGP: 5000,
    durationDays: 30,
    maxActiveJobs: 15,
    maxPhoneViews: 150,
    canViewPhone: true,
    canExportData: true,
    isActive: true,
    sortOrder: 3,
  },
];

export default async function AdminPlansPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; name?: string } | undefined;

  if (!session || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 border border-rose-500/30 rounded-2xl text-center text-white space-y-4">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">صلاحية وصول محظورة (SUPER_ADMIN Only)</h2>
        <p className="text-slate-400">
          عذراً، هذه اللوحة مخصصة لمسؤولي وملاك النظام فقط للتحكم في أسعار الاشتراكات والباقات التجارية في مصر.
        </p>
      </div>
    );
  }

  const res = await getAdminPlansAction();
  const plans = (res.plans && res.plans.length > 0) ? res.plans : FALLBACK_ADMIN_PLANS;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <PlanManagementClient initialPlans={plans} />
    </div>
  );
}
