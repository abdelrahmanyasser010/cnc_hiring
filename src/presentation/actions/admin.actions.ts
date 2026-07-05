"use server";
// src/presentation/actions/admin.actions.ts
// Server Actions: Admin platform management

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { authorizationService, auditService, employerRepo } from "@/infrastructure/container";
import type { Role, UserStatus } from "@/domain/types";

export interface AdminActionResponse {
  success: boolean;
  error?: string;
}

export async function toggleVerificationAction(
  employerId: string,
  isVerified: boolean
): Promise<AdminActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    // Use Policy-based Authorization (ADR-006)
    const isAdmin = authorizationService.role.isAdmin({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام (SUPER_ADMIN)." };
    }

    const updated = await employerRepo.update(employerId, { isVerified });

    // Logging via AuditService (ADR-006)
    await auditService.log({
      actorId: session.user.id,
      action: `تم ${isVerified ? "توثيق" : "إلغاء توثيق"} حساب الشركة: ${updated.companyName}`,
      entityType: "EmployerProfile",
      entityId: employerId,
      oldValue: { isVerified: !isVerified },
      newValue: { isVerified },
    });

    // Revalidate affected cache paths
    revalidatePath("/admin/verify");
    revalidatePath("/companies");
    revalidatePath("/jobs");
    revalidatePath("/jobs/[id]", "page");

    return { success: true };
  } catch (error) {
    console.error("[toggleVerificationAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تحديث حالة التوثيق، يرجى المحاولة لاحقاً.",
    };
  }
}
