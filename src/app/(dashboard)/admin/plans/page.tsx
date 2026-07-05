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
  title: "إدارة الباقات والأسعار | hireCNC مصر (للمديرين فقط)",
  description: "لوحة التحكم الحصرية لمدير النظام لتعديل أسعار الباقات وحصص التوظيف بشكل ديناميكي.",
};

export const dynamic = "force-dynamic";

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
  const plans = res.plans || [];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <PlanManagementClient initialPlans={plans} />
    </div>
  );
}
