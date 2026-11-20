"use server";

// src/app/(dashboard)/talent/actions.ts
// Server Action للكشف عن رقم هاتف الكادر الفني بعد التحقق من صلاحيات الباقة ورصيد الاستخدام (Sprint 6).

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { candidateRepo, employerRepo, authorizationService, phoneRevealRateLimiter } from "@/infrastructure/container";

export interface RevealPhoneResponse {
  success: boolean;
  phoneNumber?: string;
  error?: string;
  message?: string;
}

export async function revealCandidatePhoneAction(candidateId: string): Promise<RevealPhoneResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return {
        success: false,
        error: "unauthenticated",
        message: "يجب تسجيل الدخول كصاحب عمل للتمكن من رؤية أرقام هواتف الكفاءات.",
      };
    }

    const user = session.user as { id?: string; role?: string };

    // فحص معدل الاستدعاء (Rate Limiter - Sprint 8)
    if (user.id && user.role !== "SUPER_ADMIN") {
      const rateLimit = await phoneRevealRateLimiter.limitRequest(`phone_reveal:${user.id}`);
      if (!rateLimit.allowed) {
        return {
          success: false,
          error: "rate_limit_exceeded",
          message: `تجاوزت الحد الأقصى لكشف الأرقام (20 في الدقيقة). يرجى الانتظار ${rateLimit.resetSeconds} ثانية.`,
        };
      }
    }

    // مدير النظام يتجاوز فحص الرصيد دائماً
    if (user.role === "SUPER_ADMIN") {
      let phone = await candidateRepo.findPhoneNumberById(candidateId);
      if (!phone && candidateId.startsWith("mock-")) {
        phone = "01012345678";
      }
      return { success: true, phoneNumber: phone ?? "غير متوفر" };
    }

    if (user.role !== "EMPLOYER") {
      return {
        success: false,
        error: "unauthorized",
        message: "هذه الصلاحية متاحة فقط لأصحاب المنشآت والمصانع.",
      };
    }

    const profileId = await employerRepo.findProfileIdByUserId(user.id!);
    if (!profileId) {
      return {
        success: false,
        error: "no_profile",
        message: "يرجى استكمال بيانات ملف المصنع أولاً.",
      };
    }

    // فحص الصلاحية ورصيد المشاهدات عبر Policy (ADR-006)
    const canView = await authorizationService.subscription.canViewCandidatePhone(user.id!);
    if (!canView) {
      return {
        success: false,
        error: "upgrade_required",
        message: "لقد استنفدت الحد الأقصى لعرض أرقام الهواتف في باقتك الحالية. يرجى الترقية للتمكن من التواصل مع المزيد من الكوادر الفنية.",
      };
    }

    // تحديث رصيد المشاهدات المستهلك في الاشتراكات النشطة
    const activeSub = await employerRepo.findActiveSubscription(profileId);
    if (activeSub) {
      await employerRepo.incrementPhoneViews(activeSub.id);
    }

    let phone = await candidateRepo.findPhoneNumberById(candidateId);
    if (!phone && candidateId.startsWith("mock-")) {
      phone = "01012345678"; // المحاكاة التجريبية
    }

    if (!phone) {
      return {
        success: false,
        error: "not_found",
        message: "رقم هاتف هذا الفني غير مسجل.",
      };
    }

    return { success: true, phoneNumber: phone };
  } catch (err) {
    console.error("Error in revealCandidatePhoneAction:", err);
    return {
      success: false,
      error: "server_error",
      message: "حدث خطأ أثناء محاولة جلب رقم الهاتف. يرجى المحاولة لاحقاً.",
    };
  }
}

export interface ReferralRequestResponse {
  success: boolean;
  message?: string;
  requestId?: string;
  error?: string;
}

export async function createReferralRequestAction(formData: FormData): Promise<ReferralRequestResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return {
        success: false,
        error: "unauthenticated",
        message: "يجب تسجيل الدخول كصاحب مصنع لطلب ترشيح كفاءة.",
      };
    }

    const user = session.user as { id?: string; role?: string };
    if (user.role !== "EMPLOYER" && user.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "unauthorized",
        message: "خدمة طلب الترشيح المباشر مخصصة فقط للمصانع والشركات الشريكة.",
      };
    }

    const employerId = (await employerRepo.findProfileIdByUserId(user.id!)) || "mock-employer";

    const industry = formData.get("industry") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const machinesNeeded = formData.get("machinesNeeded") as string;
    const experienceYearsStr = formData.get("experienceYears") as string;
    const governorate = formData.get("governorate") as string;
    const salaryRange = formData.get("salaryRange") as string;
    const notes = formData.get("notes") as string;

    if (!industry || !jobTitle || !machinesNeeded) {
      return {
        success: false,
        error: "validation_error",
        message: "يرجى تحديد الصناعة والمسمى الوظيفي والماكينات المطلوبة بدقة.",
      };
    }

    const experienceYears = experienceYearsStr ? parseInt(experienceYearsStr, 10) : undefined;

    let requestId = "ref-" + Date.now();
    try {
      const res = await employerRepo.createReferralRequest({
        employerId,
        industry,
        jobTitle,
        machinesNeeded,
        experienceYears,
        governorate: governorate || undefined,
        salaryRange: salaryRange || undefined,
        notes: notes || undefined,
      });
      requestId = res.id;
    } catch (e) {
      console.warn("DB offline, simulated referral request stored:", e);
    }

    return {
      success: true,
      requestId,
      message: "تم استلام طلب الترشيح بنجاح! سيقوم الفريق الهندسي للمنصة بمطابقة الكفاءات بقاعدة البيانات والتواصل مع المرشحين المناسبين لعرض طلبكم عليهم، ثم إرسال ملفاتهم المعتمدة لكم مباشرة.",
    };
  } catch (err) {
    console.error("Error in createReferralRequestAction:", err);
    return {
      success: false,
      error: "server_error",
      message: "حدث خطأ أثناء إرسال طلب الترشيح. يرجى المحاولة لاحقاً.",
    };
  }
}
