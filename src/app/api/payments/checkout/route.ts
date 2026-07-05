// src/app/api/payments/checkout/route.ts
// نقطة نهاية لإنشاء جلسة دفع ترقية الباقة لأصحاب المصانع عبر Paymob / Sandbox

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { paymentService, uploadRateLimiter } from "@/infrastructure/container";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const user = session.user as { id?: string; role?: string; email?: string };
    if (user.role !== "EMPLOYER" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "الترقية متاحة فقط لحسابات أصحاب المصانع والمنشآت" }, { status: 403 });
    }

    // فحص معدل الاستدعاء (Rate Limiter)
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
    const rateLimit = await uploadRateLimiter.limitRequest(`checkout:${user.id || ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `تجاوزت معدل طلبات الدفع. يرجى الانتظار ${rateLimit.resetSeconds} ثانية.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { planId, amount } = body;

    if (!planId || !amount) {
      return NextResponse.json({ error: "بيانات الباقة أو المبلغ مفقودة" }, { status: 400 });
    }

    const result = await paymentService.createCheckoutSession(
      user.id!,
      planId,
      Number(amount),
      user.email || "employer@hirecnc.com"
    );

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      invoiceId: result.invoiceId,
      gatewayOrderId: result.gatewayOrderId,
    });
  } catch (error) {
    console.error("[Checkout API] Error initiating checkout:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء الاتصال ببوابة الدفع، يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
