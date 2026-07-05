"use server";
// src/presentation/actions/application.actions.ts
// Server Actions: Job application processing

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus, Role, UserStatus } from "@/domain/types";
import { notificationService, authorizationService, auditService, applicationRepo } from "@/infrastructure/container";
import { Templates } from "@/lib/notifications/templates";

export interface ApplyResponse {
  success: boolean;
  error?: string;
  score?: number | null;
}

export async function applyToJobAction(
  jobId: string,
  answers: number[]
): Promise<ApplyResponse> {
  try {
    // 1. Get current candidate session (Unified identity - ADR-001)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "يجب تسجيل الدخول كباحث عن عمل للتقديم" };
    }

    const isCandidate = authorizationService.role.isCandidate({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isCandidate) {
      return { success: false, error: "عذراً، هذا الإجراء متاح فقط للباحثين عن عمل" };
    }

    // 2. Fetch candidate profile
    const candidate = await applicationRepo.findCandidateProfileIdByUserId(session.user.id);

    if (!candidate) {
      return { success: false, error: "لم يتم العثور على ملفك الشخصي كباحث عن عمل" };
    }

    // Fetch job details and employer profile for notifications
    const job = await applicationRepo.findJobById(jobId);

    if (!job) {
      return { success: false, error: "عذراً، الوظيفة التي تحاول التقديم عليها غير موجودة." };
    }

    // 3. Prevent duplicate applications
    const existingApplication = await applicationRepo.findApplicationByJobAndCandidate(jobId, candidate.id);

    if (existingApplication) {
      return { success: false, error: "لقد قمت بالتقديم على هذه الوظيفة بالفعل مسبقاً." };
    }

    // 4. Evaluate screening questions
    const questions = await applicationRepo.findScreeningQuestionsByJobId(jobId);

    let score: number | null = null;
    if (questions.length > 0) {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const candidateAnswer = answers[idx];
        if (candidateAnswer === q.correctIndex) {
          correctCount++;
        }
      });
      score = Math.round((correctCount / questions.length) * 100);
    }

    // 5. Create application record
    await applicationRepo.createApplication({
      jobId,
      candidateProfileId: candidate.id,
      status: "PENDING",
      score,
    });

    // 6. Send notification to employer via NotificationService (ADR-004 - Sprint 2)
    if (job.employer?.user?.phoneNumber) {
      await notificationService.sendWhatsApp({
        to: job.employer.user.phoneNumber,
        message: Templates.NEW_APPLICANT(job.employer.companyName, job.title),
      });
    }

    // Log application activity
    await auditService.log({
      actorId: session.user.id,
      action: "JOB_APPLICATION_SUBMITTED",
      entityType: "JobApplication",
      entityId: jobId,
      newValue: { score },
    });

    return { success: true, score };
  } catch (error) {
    console.error("[applyToJobAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء معالجة طلبك، يرجى المحاولة لاحقاً.",
    };
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: ApplicationStatus,
  interviewDate?: Date,
  interviewLocation?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "عذراً، يجب تسجيل الدخول للقيام بهذا الإجراء." };
    }

    const application = await applicationRepo.findApplicationDetailsById(applicationId);

    if (!application) {
      return { success: false, error: "طلب التقديم المطلوب غير موجود." };
    }

    // Authorization checks: owner of job or super admin
    const isOwner = application.job.employer.userId === session.user.id;
    const isAdmin = authorizationService.role.isAdmin({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isOwner && !isAdmin) {
      return { success: false, error: "عذراً، لا تملك الصلاحية لتحديث حالة هذا الطلب." };
    }

    // Update status
    const updateData: {
      status: ApplicationStatus;
      interviewDate?: Date;
      interviewLocation?: string;
    } = { status };

    if (status === "INTERVIEW") {
      if (interviewDate) updateData.interviewDate = interviewDate;
      if (interviewLocation) updateData.interviewLocation = interviewLocation;
    }

    await applicationRepo.updateApplication(applicationId, updateData);

    // Log update audit
    await auditService.log({
      actorId: session.user.id,
      action: `تم تحديث حالة طلب التقديم إلى ${status}`,
      entityType: "JobApplication",
      entityId: applicationId,
      oldValue: { status: application.status },
      newValue: { status },
    });

    // WhatsApp notifications for interview invite
    if (status === "INTERVIEW" && application.candidateProfile.user.phoneNumber) {
      const candidatePhone = application.candidateProfile.user.phoneNumber;
      const candidateName = application.candidateProfile.user.name ?? application.candidateProfile.user.email;

      let timeStr = "خلال الأيام القليلة القادمة (سيتم تأكيده هاتفياً)";
      if (interviewDate) {
        timeStr = new Date(interviewDate).toLocaleString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (tomorrow.getDay() === 5) tomorrow.setDate(tomorrow.getDate() + 1);
        timeStr = tomorrow.toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) + " الساعة 10:00 صباحاً";
      }

      const locationStr = interviewLocation || application.job.location || "عنوان المصنع المسجل";

      await notificationService.sendWhatsApp({
        to: candidatePhone,
        message: Templates.INTERVIEW_INVITE(candidateName, timeStr, locationStr),
      });
    }

    // Revalidate affected paths
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath(`/jobs/${application.jobId}/applications`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[updateApplicationStatusAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تحديث الحالة، يرجى المحاولة لاحقاً.",
    };
  }
}
