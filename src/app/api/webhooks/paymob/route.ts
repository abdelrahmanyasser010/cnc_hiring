// src/app/api/webhooks/paymob/route.ts
// مسار استقبال إشعارات وبوك Paymob (POST للإشعارات الخلفية، GET لتوجيه المتصفح بعد الدفع)

import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/infrastructure/container";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const hmacHeader =
      request.headers.get("hmac") ||
      request.headers.get("x-paymob-signature") ||
      request.headers.get("signature") ||
      "";

    const result = await paymentService.handleWebhook(payload, hmacHeader);

    if (!result.success) {
      return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error("[Paymob Webhook POST] Error processing webhook:", error);
    return NextResponse.json({ error: "Server error handling webhook" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const payload: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    const hmacParam = searchParams.get("hmac") || searchParams.get("signature") || "mock_signature";

    const result = await paymentService.handleWebhook(payload, hmacParam);

    const redirectUrl = new URL("/billing", request.url);
    if (result.success) {
      redirectUrl.searchParams.set("status", "success");
      if (result.invoiceId) {
        redirectUrl.searchParams.set("invoice", result.invoiceId);
      }
    } else {
      redirectUrl.searchParams.set("status", "failed");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[Paymob Webhook GET] Error processing browser callback:", error);
    const failUrl = new URL("/billing?status=error", request.url);
    return NextResponse.redirect(failUrl);
  }
}
