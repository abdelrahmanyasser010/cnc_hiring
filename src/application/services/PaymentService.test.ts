// src/application/services/PaymentService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentService } from "./PaymentService";
import type { IPaymentProvider } from "@/application/ports/IPaymentProvider";
import type { IEmployerRepository } from "@/application/ports/IEmployerRepository";
import type { IEventDispatcher } from "@/domain/ports/IEventDispatcher";

describe("PaymentService (Sprint 8)", () => {
  let paymentProviderMock: IPaymentProvider;
  let employerRepoMock: IEmployerRepository;
  let eventDispatcherMock: IEventDispatcher;
  let service: PaymentService;

  beforeEach(() => {
    paymentProviderMock = {
      initiatePayment: vi.fn().mockResolvedValue({
        paymentUrl: "https://paymob.mock/iframe/123",
        gatewayOrderId: "mock_order_123",
        paymentToken: "tok_123",
      }),
      verifyWebhook: vi.fn(),
      refund: vi.fn(),
    };

    employerRepoMock = {
      findProfileIdByUserId: vi.fn(),
      findActiveSubscription: vi.fn(),
      update: vi.fn(),
      findAllEmployersWithUsers: vi.fn(),
      getVerifiedCompaniesWithJobs: vi.fn(),
      incrementPhoneViews: vi.fn(),
      createCheckoutTransaction: vi.fn().mockResolvedValue({
        invoiceId: "inv_1",
        transactionId: "txn_1",
        planName: "الباقة الاحترافية (Pro)",
        companyName: "مصنع الأمل",
      }),
      activateSubscriptionAfterPayment: vi.fn().mockResolvedValue({
        success: true,
        employerId: "emp_1",
        subscriptionId: "sub_1",
        invoiceId: "inv_1",
        amount: 2500,
      }),
    };

    eventDispatcherMock = {
      dispatch: vi.fn().mockResolvedValue(undefined),
      register: vi.fn(),
      clearHandlers: vi.fn(),
    };

    service = new PaymentService(paymentProviderMock, employerRepoMock, eventDispatcherMock);
  });

  it("should create checkout session and initiate payment with gateway", async () => {
    const res = await service.createCheckoutSession("emp_1", "pro", 2500, "test@hirecnc.com");

    expect(employerRepoMock.createCheckoutTransaction).toHaveBeenCalledWith(
      "emp_1",
      "pro",
      2500,
      expect.stringContaining("chk_emp_1_")
    );
    expect(paymentProviderMock.initiatePayment).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 2500,
        currency: "EGP",
        customerEmail: "test@hirecnc.com",
      })
    );
    expect(res.paymentUrl).toBe("https://paymob.mock/iframe/123");
    expect(res.invoiceId).toBe("inv_1");
  });

  it("should fail webhook handling if signature is invalid", async () => {
    vi.mocked(paymentProviderMock.verifyWebhook).mockResolvedValue({
      isValid: false,
    });

    const res = await service.handleWebhook({ foo: "bar" }, "bad_sig");

    expect(res.success).toBe(false);
    expect(employerRepoMock.activateSubscriptionAfterPayment).not.toHaveBeenCalled();
  });

  it("should activate subscription and dispatch event when webhook is valid and success", async () => {
    vi.mocked(paymentProviderMock.verifyWebhook).mockResolvedValue({
      isValid: true,
      status: "success",
      transactionId: "paymob_txn_999",
      amount: 2500,
      idempotencyKey: "chk_emp_1_12345",
    });

    const res = await service.handleWebhook({ success: true }, "valid_sig");

    expect(res.success).toBe(true);
    expect(employerRepoMock.activateSubscriptionAfterPayment).toHaveBeenCalledWith(
      "chk_emp_1_12345",
      "paymob_txn_999"
    );
    expect(eventDispatcherMock.dispatch).toHaveBeenCalledTimes(1);
  });
});
