"use server";
// src/app/actions/candidate.ts
// Server Actions for Candidates (Unified identity - ADR-001)

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { candidateRepo } from "@/infrastructure/container";
import { redirect } from "next/navigation";

export async function updateCandidateAvailability(isAvailable: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    const candidate = await candidateRepo.findProfileByUserId(session.user.id);

    if (!candidate) {
      return { success: false, error: "لم يتم العثور على ملفك الشخصي كباحث عن عمل" };
    }

    await candidateRepo.updateAvailability(candidate.id, isAvailable);

    return { success: true };
  } catch (error) {
    console.error("[updateCandidateAvailability] error:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث حالة التوفر" };
  }
}

export async function candidateLogoutAction() {
  // Redirect to standard NextAuth signout
  redirect("/api/auth/signout?callbackUrl=/");
}
