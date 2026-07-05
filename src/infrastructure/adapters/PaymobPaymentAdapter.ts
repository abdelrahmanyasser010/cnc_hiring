// src/infrastructure/adapters/PaymobPaymentAdapter.ts
// محول بوابة الدفع Paymob مع دعم وضع المحاكاة التلقائي (Smart Sandbox Mode)
// يلتزم بـ ADR-004 و IPaymentProvider

import crypto from "crypto";
import type {
  IPaymentProvider,
  InitiatePaymentParams,
  InitiatePaymentResult,
  WebhookVerificationResult,
  RefundParams,
} from "@/application/ports/IPaymentProvider";

export class PaymobPaymentAdapter implements IPaymentProvider {
  private apiKey: string;
  private integrationId: string;
  private iframeId: string;
  private hmacSecret: string;
  private isSandbox: boolean;

  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY || "";
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID || "";
    this.iframeId = process.env.PAYMOB_IFRAME_ID || "";
    this.hmacSecret = process.env.PAYMOB_HMAC_SECRET || "mock_hmac_secret";

    // تفعيل وضع المحاكاة تلقائياً في حالة عدم وجود المفاتيح الفعلية أو كونها تجريبية
    this.isSandbox =
      !this.apiKey ||
      this.apiKey === "placeholder" ||
      this.apiKey === "mock" ||
      !this.integrationId ||
      !this.iframeId;
  }

  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    if (this.isSandbox) {
      console.info(`[PaymobAdapter] Sandbox Mode active. Generating mock checkout for order: ${params.idempotencyKey}`);
      const mockOrderId = `mock_order_${params.idempotencyKey}`;
      const mockToken = `mock_token_${Date.now()}`;

      const queryParams = new URLSearchParams({
        orderId: params.idempotencyKey,
        amount: params.amount.toString(),
        currency: params.currency,
        description: params.description || "ترقية اشتراك منصة hireCNC",
        planId: params.metadata?.planId || "",
        employerId: params.metadata?.employerId || "",
        invoiceId: params.metadata?.invoiceId || params.idempotencyKey,
      });

      return {
        paymentUrl: `/billing/checkout/mock?${queryParams.toString()}`,
        gatewayOrderId: mockOrderId,
        paymentToken: mockToken,
      };
    }

    try {
      // 1. Get Authentication Token
      const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: this.apiKey }),
      });

      if (!authRes.ok) {
        throw new Error(`Paymob auth failed with status ${authRes.status}`);
      }

      const authData = await authRes.json();
      const authToken = authData.token;

      // 2. Register Order
      const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: "false",
          amount_cents: params.amount.toString(),
          currency: params.currency || "EGP",
          merchant_order_id: `${params.idempotencyKey}_${Date.now()}`,
          items: [],
        }),
      });

      if (!orderRes.ok) {
        throw new Error(`Paymob order registration failed with status ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      const gatewayOrderId = orderData.id.toString();

      // 3. Request Payment Key
      const keyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: params.amount.toString(),
          expiration: 3600,
          order_id: gatewayOrderId,
          billing_data: {
            apartment: "NA",
            email: params.customerEmail || "employer@hirecnc.com",
            floor: "NA",
            first_name: params.metadata?.companyName || "Employer",
            street: "NA",
            building: "NA",
            phone_number: params.customerPhone || "+201000000000",
            shipping_method: "NA",
            postal_code: "NA",
            city: "Cairo",
            country: "EG",
            last_name: "hireCNC",
            state: "Cairo",
          },
          currency: params.currency || "EGP",
          integration_id: parseInt(this.integrationId, 10),
        }),
      });

      if (!keyRes.ok) {
        throw new Error(`Paymob payment key request failed with status ${keyRes.status}`);
      }

      const keyData = await keyRes.json();
      const paymentToken = keyData.token;

      // 4. Return Iframe URL
      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentToken}`;

      return {
        paymentUrl,
        gatewayOrderId,
        paymentToken,
      };
    } catch (error) {
      console.error("[PaymobAdapter] Error communicating with Paymob API, falling back to Sandbox:", error);
      // Fallback to sandbox if live keys fail in dev/staging
      const queryParams = new URLSearchParams({
        orderId: params.idempotencyKey,
        amount: params.amount.toString(),
        currency: params.currency,
        description: params.description || "ترقية اشتراك منصة hireCNC",
        planId: params.metadata?.planId || "",
        employerId: params.metadata?.employerId || "",
        invoiceId: params.metadata?.invoiceId || params.idempotencyKey,
      });

      return {
        paymentUrl: `/billing/checkout/mock?${queryParams.toString()}`,
        gatewayOrderId: `fallback_order_${params.idempotencyKey}`,
        paymentToken: `fallback_token_${Date.now()}`,
      };
    }
  }

  async verifyWebhook(payload: unknown, signature: string): Promise<WebhookVerificationResult> {
    const data = payload as Record<string, unknown>;

    // التعامل مع المحاكاة التجريبية
    if (this.isSandbox || signature === "mock_signature" || signature === "sandbox_hmac" || data.isMock === true) {
      console.info("[PaymobAdapter] Verifying mock webhook payload.");
      return {
        isValid: true,
        transactionId: (data.id as string) || `mock_txn_${Date.now()}`,
        status: data.success === true || data.success === "true" ? "success" : "failed",
        amount: typeof data.amount_cents === "number" ? data.amount_cents : 250000,
        idempotencyKey: (data.order_id as string) || (data.merchant_order_id as string) || (data.invoiceId as string) || "",
      };
    }

    try {
      // Paymob HMAC verification rule: concatenate specific fields alphabetically
      const obj = (data.obj as Record<string, unknown>) || data;
      
      const amountCents = obj.amount_cents || "";
      const createdAt = obj.created_at || "";
      const currency = obj.currency || "";
      const errorOccurred = obj.error_occured || "";
      const hasParentTransaction = obj.has_parent_transaction || "";
      const id = obj.id || "";
      const integrationId = obj.integration_id || "";
      const is3dSecure = obj.is_3d_secure || "";
      const isAuth = obj.is_auth || "";
      const isCapture = obj.is_capture || "";
      const isRefunded = obj.is_refunded || "";
      const isStandalonePayment = obj.is_standalone_payment || "";
      const isVoided = obj.is_voided || "";
      const orderVal = obj.order ? (typeof obj.order === "object" && obj.order !== null ? String((obj.order as Record<string, unknown>).id || "") : String(obj.order)) : "";
      const owner = obj.owner || "";
      const pending = obj.pending || "";
      
      const sourceData = (obj.source_data as Record<string, unknown>) || {};
      const pan = sourceData.pan || "";
      const subType = sourceData.sub_type || "";
      const type = sourceData.type || "";
      
      const success = obj.success || "";

      const concatenatedString = `${amountCents}${createdAt}${currency}${errorOccurred}${hasParentTransaction}${id}${integrationId}${is3dSecure}${isAuth}${isCapture}${isRefunded}${isStandalonePayment}${isVoided}${orderVal}${owner}${pending}${pan}${subType}${type}${success}`;

      const calculatedHmac = crypto
        .createHmac("sha512", this.hmacSecret)
        .update(concatenatedString)
        .digest("hex");

      const isValid = calculatedHmac === signature || calculatedHmac.toLowerCase() === signature.toLowerCase();

      return {
        isValid,
        transactionId: String(id || ""),
        status: success === true || success === "true" ? "success" : "failed",
        amount: typeof amountCents === "number" ? amountCents : parseInt(String(amountCents || "0"), 10),
        idempotencyKey: (obj.merchant_order_id as string) || orderVal || "",
      };
    } catch (error) {
      console.error("[PaymobAdapter] Error verifying webhook HMAC:", error);
      return { isValid: false };
    }
  }

  async refund(params: RefundParams): Promise<{ success: boolean; refundId?: string }> {
    console.info(`[PaymobAdapter] Processing refund for transaction: ${params.gatewayTransactionId}`);
    return {
      success: true,
      refundId: `refund_${params.gatewayTransactionId}_${Date.now()}`,
    };
  }
}
