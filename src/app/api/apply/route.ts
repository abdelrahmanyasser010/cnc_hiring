// src/app/api/apply/route.ts
// مسار API لتقديم الفنيين على الوظائف وحساب نقاط التقييم التلقائي.
// NOTE: Prefer using the Server Action in presentation/actions/application.actions.ts
// This route is kept for backward compatibility with legacy clients only.

import { NextResponse } from "next/server";
import { candidateRepo, applicationRepo } from "@/infrastructure/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { applyRateLimiter } from "@/infrastructure/container";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = await applyRateLimiter.limitRequest(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "تجاوزت الحد الأقصى للتقديم للوظائف. يرجى المحاولة لاحقاً." },
        { status: 429 }
      );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId, answers } = body as { jobId: string; answers?: number[] };

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "بيانات التقديم غير مكتملة" },
        { status: 400 }
      );
    }

    // Find candidate profile via user session
    const candidateProfile = await candidateRepo.findProfileByUserId(session.user.id);

    if (!candidateProfile) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على ملفك الشخصي كباحث عن عمل" },
        { status: 404 }
      );
    }

    // 1. جلب أسئلة التصفية الخاصة بالوظيفة لحساب النتيجة
    const screeningQuestions = await applicationRepo.findScreeningQuestionsByJobId(jobId);

    let score = 100.0;

    if (screeningQuestions.length > 0 && answers) {
      let correctAnswersCount = 0;
      screeningQuestions.forEach((question, index: number) => {
        const submittedAnswer = answers[index];
        if (submittedAnswer === question.correctIndex) {
          correctAnswersCount++;
        }
      });
      score = (correctAnswersCount / screeningQuestions.length) * 100.0;
    }

    // 2. تسجيل طلب التقديم في قاعدة البيانات
    const application = await applicationRepo.createApplication({
      jobId,
      candidateProfileId: candidateProfile.id,
      status: "PENDING",
      score,
    });

    return NextResponse.json({
      success: true,
      message: "تم التقديم على الوظيفة وتقييم إجاباتك بنجاح",
      data: application,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { success: false, error: "فشل في تسجيل طلب التقديم" },
      { status: 500 }
    );
  }
}

