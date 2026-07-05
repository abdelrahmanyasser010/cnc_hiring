"use server";

// src/app/(dashboard)/jobs/actions.ts
// الـ Server Action المسؤول عن معالجة وإضافة الوظائف إلى قاعدة البيانات.
// يتم تشغيله مباشرة على السيرفر ويحمل مميزات الحماية وإدارة الكاش.

import { jobRepo, employerRepo, authorizationService } from "@/infrastructure/container";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { JobSchema } from "@/lib/schema";
import { runJobMatching } from "@/lib/matching";

export interface ActionResponse {
  success?: boolean;
  errors?: Record<string, string[]>;
  error?: string;
}

export async function createJobAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    title: formData.get("title"),
    controlRequired: formData.get("controlRequired"),
    location: formData.get("location"),
    experienceMin: formData.get("experienceMin"),
    experienceMax: formData.get("experienceMax"),
    salaryMin: formData.get("salaryMin"),
    salaryMax: formData.get("salaryMax"),
    hideSalary: formData.get("hideSalary") === "true",
    description: formData.get("description"),
  };

  // 1. التحقق من صحة المدخلات برمجياً باستخدام Zod Schema المشترك
  const validatedFields = JobSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. الحفظ في قاعدة البيانات والتأكد من حدود اشتراك صاحب العمل (Sprint 6)
  try {
    const session = await getServerSession(authOptions);
    let employerId: string | null = null;

    if (session?.user?.role === "EMPLOYER") {
      const profileId = await employerRepo.findProfileIdByUserId(session.user.id);
      if (profileId) {
        employerId = profileId;
        const activeJobCount = await jobRepo.countActiveJobsByEmployer(profileId);
        const canCreate = await authorizationService.subscription.canCreateJob(
          session.user.id,
          activeJobCount
        );

        if (!canCreate) {
          return {
            success: false,
            error: "لقد استنفدت الحد الأقصى للوظائف النشطة المسموح بنشرها في باقتك الحالية. يرجى ترقية اشتراكك للبدء في نشر وظائف جديدة.",
          };
        }
      }
    }

    if (!employerId) {
      let employer = await jobRepo.findFirstEmployer();
      if (!employer) {
        employer = await jobRepo.createDemoEmployer();
      }
      employerId = employer.id;
    }

    // إدخال السجل لقاعدة البيانات PostgreSQL مع التغذية التلقائية لأسئلة التصفية
    const newJob = await jobRepo.createJob({
      title: validatedFields.data.title,
      controlRequired: validatedFields.data.controlRequired,
      location: validatedFields.data.location,
      experienceMin: validatedFields.data.experienceMin,
      experienceMax: validatedFields.data.experienceMax,
      salaryMin: validatedFields.data.salaryMin,
      salaryMax: validatedFields.data.salaryMax,
      hideSalary: validatedFields.data.hideSalary,
      description: validatedFields.data.description,
      employerId,
    });

    // إرسال الإشعارات للمطابقين بشكل غير متزامن (بدون تعطيل رد السيرفر)
    runJobMatching(newJob as Parameters<typeof runJobMatching>[0]).catch(console.error);

  } catch (dbError) {
    console.error("Database error while creating job:", dbError);
    return {
      success: false,
      error: "فشل في حفظ البيانات في خادم قاعدة البيانات، يرجى المحاولة لاحقاً.",
    };
  }

  // 3. تحديث الكاش للرابط وتوجيه المستخدم (يجب أن يتم ذلك خارج try-catch لتفادي التقاط استثناء التوجيه)
  revalidatePath("/jobs");
  redirect("/jobs");
}
