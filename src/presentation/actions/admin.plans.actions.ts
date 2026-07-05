"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PlanDTO } from "@/application/services/AdminPlanService";
import { adminPlanService } from "@/infrastructure/container";
import { revalidatePath } from "next/cache";

async function verifySuperAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  return (session.user as { role?: string }).role === "SUPER_ADMIN";
}

export async function getAdminPlansAction(): Promise<{
  success: boolean;
  plans?: PlanDTO[];
  error?: string;
}> {
  try {
    const isAdmin = await verifySuperAdmin();
    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام (SUPER_ADMIN)." };
    }

    const plans = await adminPlanService.listAllPlans();
    return { success: true, plans };
  } catch (err) {
    console.error("Error in getAdminPlansAction:", err);
    return { success: false, error: "حدث خطأ أثناء جلب الباقات والأسعار." };
  }
}

export async function updateAdminPlanAction(
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
): Promise<{ success: boolean; plan?: PlanDTO; error?: string }> {
  try {
    const isAdmin = await verifySuperAdmin();
    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام." };
    }

    const plan = await adminPlanService.updatePlan(id, data);
    revalidatePath("/admin/plans");
    revalidatePath("/billing");
    return { success: true, plan };
  } catch (err) {
    console.error("Error in updateAdminPlanAction:", err);
    return { success: false, error: "حدث خطأ أثناء تحديث بيانات الباقة." };
  }
}

export async function createAdminPlanAction(data: {
  name: string;
  description?: string;
  priceEGP: number;
  durationDays: number;
  maxActiveJobs: number;
  maxPhoneViews: number;
  canViewPhone?: boolean;
  canExportData?: boolean;
  sortOrder?: number;
}): Promise<{ success: boolean; plan?: PlanDTO; error?: string }> {
  try {
    const isAdmin = await verifySuperAdmin();
    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام." };
    }

    const plan = await adminPlanService.createPlan(data);
    revalidatePath("/admin/plans");
    revalidatePath("/billing");
    return { success: true, plan };
  } catch (err) {
    console.error("Error in createAdminPlanAction:", err);
    return { success: false, error: "حدث خطأ أثناء إنشاء الباقة الجديدة." };
  }
}

export async function toggleAdminPlanStatusAction(id: string): Promise<{
  success: boolean;
  isActive?: boolean;
  error?: string;
}> {
  try {
    const isAdmin = await verifySuperAdmin();
    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام." };
    }

    const isActive = await adminPlanService.togglePlanStatus(id);
    revalidatePath("/admin/plans");
    revalidatePath("/billing");
    return { success: true, isActive };
  } catch (err) {
    console.error("Error in toggleAdminPlanStatusAction:", err);
    return { success: false, error: "حدث خطأ أثناء تغيير حالة الباقة." };
  }
}
