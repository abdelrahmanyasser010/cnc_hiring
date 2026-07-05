// src/infrastructure/adapters/PaymobPaymentAdapter.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { PaymobPaymentAdapter } from "./PaymobPaymentAdapter";

describe("PaymobPaymentAdapter (Smart Sandbox Mode - Sprint 8)", () => {
  let adapter: PaymobPaymentAdapter;

  beforeEach(() => {
    // Ensure env keys are empty/placeholder to trigger sandbox mode
    process.env.PAYMOB_API_KEY = "placeholder";
    adapter = new PaymobPaymentAdapter();
  });

  it("should generate mock checkout URL when running in sandbox mode", async () => {
    const result = await adapter.initiatePayment({
      amount: 2500,
      currency: "EGP",
      idempotencyKey: "chk_test_order",
      customerEmail: "employer@hirecnc.com",
      description: "ترقية اشتراك الباقة الاحترافية",
      metadata: { planId: "pro", employerId: "emp_123" },
    });

    expect(result.paymentUrl).toContain("/billing/checkout/mock");
    expect(result.paymentUrl).toContain("orderId=chk_test_order");
    expect(result.paymentUrl).toContain("amount=2500");
    expect(result.gatewayOrderId).toBe("mock_order_chk_test_order");
  });

  it("should verify mock webhook signature successfully in sandbox mode", async () => {
    const payload = {
      id: "mock_txn_9999",
      order_id: "chk_test_order",
      success: "true",
      amount_cents: 250000,
      isMock: true,
    };

    const result = await adapter.verifyWebhook(payload, "mock_signature");

    expect(result.isValid).toBe(true);
    expect(result.status).toBe("success");
    expect(result.transactionId).toBe("mock_txn_9999");
    expect(result.amount).toBe(250000);
  });
});
