// src/app/api/subscription-status/route.ts
// API endpoint للتحقق من حالة اشتراك صاحب العمل الحالي.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { employerRepo } from "@/infrastructure/container";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ hasActiveSubscription: false, reason: "unauthenticated" });
    }

    const user = session.user as { id?: string; role?: string };

    // مدير النظام يتجاوز فحص الاشتراك دائماً
    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json({ hasActiveSubscription: true, plan: "admin" });
    }

    // للـ MVP: نسمح بالوصول في حال عدم وجود اشتراك لتسهيل الاختبار
    // في النسخة الإنتاجية، يتم تفعيل الفحص الصارم هنا
    const profileId = await employerRepo.findProfileIdByUserId(user.id!);

    if (!profileId) {
      return NextResponse.json({ hasActiveSubscription: false, reason: "no_profile" });
    }

    const activeSubscription = await employerRepo.findActiveSubscription(profileId);

    // MVP Mode: Enforced now (MVP_FREE_ACCESS = false)
    const MVP_FREE_ACCESS = false;

    if (!activeSubscription && MVP_FREE_ACCESS) {
      return NextResponse.json({
        hasActiveSubscription: true,
        plan: "trial",
        message: "وضع تجريبي - يرجى الاشتراك للاستمرار في الاستخدام بعد انتهاء التجربة",
      });
    }

    return NextResponse.json({
      hasActiveSubscription: !!activeSubscription,
      plan: activeSubscription?.plan.name ?? null,
      endDate: activeSubscription?.endDate ?? null,
    });

  } catch (error) {
    console.error("Subscription status check error:", error);
    // في حال خطأ، نسمح بالوصول لتفادي إيقاف الموقع
    return NextResponse.json({ hasActiveSubscription: true, plan: "error_fallback" });
  }
}
