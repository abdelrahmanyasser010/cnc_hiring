"use server";
// src/presentation/actions/auth.actions.ts
// Server Actions: Registration for Employer & Candidate (Unified Identity - ADR-001)

import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { eventDispatcher, auditService, authRateLimiter, authRepo } from "@/infrastructure/container";
import type { UserStatus } from "@/domain/types";
import { UserRegisteredEvent } from "@/domain/events/UserRegistered";
import { headers } from "next/headers";

// ── Zod Schemas ───────────────────────────────────────────────────────────────

const EmployerRegisterSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  phoneNumber: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح (مثال: 01000000000)")
    .optional(),
  companyName: z.string().min(3, "اسم الشركة يجب أن يكون 3 أحرف على الأقل"),
  industryZone: z.string().min(2, "يرجى تحديد المنطقة الصناعية"),
  address: z.string().min(5, "يرجى إدخال العنوان بالتفصيل"),
  businessLicenseUrl: z.string().optional(),
});

const CandidateRegisterSchema = z.discriminatedUnion("candidateType", [
  z.object({
    candidateType: z.literal("TECHNICIAN"),
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    phoneNumber: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),
    governorate: z.string().min(3, "يرجى تحديد المحافظة"),
    city: z.string().min(3, "يرجى تحديد المدينة"),
    experienceYears: z.coerce.number().int().min(0),
    expectedSalary: z.coerce.number().min(0),
    machineTypes: z.array(z.string()).min(1, "يرجى اختيار نوع ماكينة واحد على الأقل"),
  }),
  z.object({
    candidateType: z.literal("ENGINEER"),
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    phoneNumber: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),
    governorate: z.string().min(3, "يرجى تحديد المحافظة"),
    city: z.string().min(3, "يرجى تحديد المدينة"),
    experienceYears: z.coerce.number().int().min(0),
    expectedSalary: z.coerce.number().min(0),
    specializations: z.array(z.string()).min(1, "يرجى اختيار تخصص واحد على الأقل"),
  }),
]);

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function registerEmployerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await authRateLimiter.limitRequest(ip);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "تجاوزت الحد الأقصى للمحاولات. يرجى الانتظار دقيقة والمحاولة لاحقاً.",
      };
    }

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber") || undefined,
      companyName: formData.get("companyName"),
      industryZone: formData.get("industryZone"),
      address: formData.get("address"),
      businessLicenseUrl: formData.get("businessLicenseUrl") || undefined,
    };

    const validated = EmployerRegisterSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "بيانات غير صالحة",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;
    const email = data.email.toLowerCase().trim();

    const existing = await authRepo.findUserByEmail(email);
    if (existing) {
      return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل" };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verificationToken = generateToken();

    const { user } = await authRepo.registerEmployer({
      email,
      passwordHash,
      name: data.name,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      industryZone: data.industryZone,
      address: data.address,
      businessLicenseUrl: data.businessLicenseUrl,
      verificationToken,
    });

    await eventDispatcher.dispatch(
      new UserRegisteredEvent({
        userId: user.id,
        email: user.email,
        role: "EMPLOYER",
        verificationToken,
      })
    );

    await auditService.log({
      actorId: user.id,
      action: "EMPLOYER_REGISTERED",
      entityType: "User",
      entityId: user.id,
      newValue: { email, companyName: data.companyName },
    });

    return {
      success: true,
      message: "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.",
    };
  } catch (error) {
    console.error("[registerEmployerAction]", error);
    return {
      success: false,
      message: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.",
    };
  }
}

export async function registerCandidateAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await authRateLimiter.limitRequest(ip);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "تجاوزت الحد الأقصى للمحاولات. يرجى الانتظار دقيقة والمحاولة لاحقاً.",
      };
    }

    const rawData = {
      candidateType: formData.get("role"), // matches technician or engineer
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber"),
      governorate: formData.get("governorate"),
      city: formData.get("city"),
      experienceYears: formData.get("experienceYears"),
      expectedSalary: formData.get("expectedSalary"),
      machineTypes: formData.getAll("machineTypes"),
      specializations: formData.getAll("specializations"),
    };

    const validated = CandidateRegisterSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "بيانات غير صالحة",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;
    const email = data.email.toLowerCase().trim();

    const existing = await authRepo.findUserByEmail(email);
    if (existing) {
      return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل" };
    }

    const existingPhone = await authRepo.findUserByPhone(data.phoneNumber);
    if (existingPhone) {
      return { success: false, message: "رقم الهاتف هذا مسجل بالفعل" };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verificationToken = generateToken();

    const { user } = await authRepo.registerCandidate({
      email,
      passwordHash,
      name: data.name,
      phoneNumber: data.phoneNumber,
      candidateType: data.candidateType,
      governorate: data.governorate,
      city: data.city,
      experienceYears: data.experienceYears,
      expectedSalary: data.expectedSalary,
      machineTypes: "machineTypes" in data ? data.machineTypes : undefined,
      specializations: "specializations" in data ? data.specializations : undefined,
      verificationToken,
    });

    await eventDispatcher.dispatch(
      new UserRegisteredEvent({
        userId: user.id,
        email: user.email,
        role: "CANDIDATE",
        verificationToken,
      })
    );

    await auditService.log({
      actorId: user.id,
      action: "CANDIDATE_REGISTERED",
      entityType: "User",
      entityId: user.id,
      newValue: { email, candidateType: data.candidateType },
    });

    return {
      success: true,
      message: "تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.",
    };
  } catch (error) {
    console.error("[registerCandidateAction]", error);
    return {
      success: false,
      message: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.",
    };
  }
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  try {
    const tokenRecord = await authRepo.findEmailVerifyToken(token);

    if (!tokenRecord) {
      return { success: false, message: "رابط التحقق غير صالح أو منتهي الصلاحية" };
    }

    if (tokenRecord.expiresAt < new Date()) {
      return { success: false, message: "انتهت صلاحية رابط التحقق. يرجى طلب رابط جديد" };
    }

    const newStatus =
      tokenRecord.user.role === "EMPLOYER" ? "PENDING_APPROVAL" : "ACTIVE";

    await authRepo.verifyEmailToken(tokenRecord.id, tokenRecord.userId, newStatus as UserStatus);

    return {
      success: true,
      message:
        newStatus === "PENDING_APPROVAL"
          ? "تم تأكيد بريدك الإلكتروني. حسابك قيد مراجعة الإدارة."
          : "تم تأكيد بريدك الإلكتروني. يمكنك الدخول الآن.",
    };
  } catch (error) {
    console.error("[verifyEmailAction]", error);
    return { success: false, message: "حدث خطأ. يرجى المحاولة لاحقاً." };
  }
}

export async function requestPasswordResetAction(email: string): Promise<ActionResult> {
  try {
    const user = await authRepo.findUserByEmail(email.toLowerCase().trim());

    // To prevent email enumeration, return success even if user not found
    if (!user) {
      return {
        success: true,
        message: "إذا كان البريد الإلكتروني مسجلاً، فستصلك رسالة تحوي رابط إعادة تعيين كلمة المرور.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepo.createPasswordResetToken(user.id, resetToken, expiresAt);

    // Audit log reset request
    await auditService.log({
      actorId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "User",
      entityId: user.id,
    });

    // Output to console / simulator for verification and developer usage
    console.log(`\n🔑 [Reset Password Link] → http://localhost:3000/reset-password?token=${resetToken}\n`);

    return {
      success: true,
      message: "تم إرسال رابط إعادة تعيين كلمة المرور بنجاح. يرجى مراجعة البريد الإلكتروني.",
    };
  } catch (error) {
    console.error("[requestPasswordResetAction] error:", error);
    return {
      success: false,
      message: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.",
    };
  }
}

export async function resetPasswordAction(token: string, newPassword: string): Promise<ActionResult> {
  try {
    const tokenRecord = await authRepo.findPasswordResetToken(token);

    if (!tokenRecord || tokenRecord.used) {
      return {
        success: false,
        message: "رابط إعادة التعيين غير صالح أو تم استخدامه بالفعل.",
      };
    }

    if (tokenRecord.expiresAt < new Date()) {
      return {
        success: false,
        message: "انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.",
      };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await authRepo.resetPassword(tokenRecord.id, tokenRecord.userId, passwordHash);

    // Audit log successful reset
    await auditService.log({
      actorId: tokenRecord.userId,
      action: "PASSWORD_RESET_SUCCESSFUL",
      entityType: "User",
      entityId: tokenRecord.userId,
    });

    return {
      success: true,
      message: "تم تعيين كلمة المرور الجديدة بنجاح. يمكنك تسجيل الدخول الآن.",
    };
  } catch (error) {
    console.error("[resetPasswordAction] error:", error);
    return {
      success: false,
      message: "حدث خطأ غير متوقع أثناء إعادة تعيين كلمة المرور.",
    };
  }
}

