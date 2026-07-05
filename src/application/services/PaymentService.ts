// src/application/services/PaymentService.ts
// Application Service for managing payment checkouts and webhook processing
// Adheres to ADR-001/003/004 (no infrastructure coupling, event-driven)

import type { IPaymentProvider } from "@/application/ports/IPaymentProvider";
import type { IEmployerRepository } from "@/application/ports/IEmployerRepository";
import type { IEventDispatcher } from "@/domain/ports/IEventDispatcher";
import { PaymentSucceededEvent } from "@/domain/events/PaymentSucceeded";

export class PaymentService {
  constructor(
    private readonly paymentProvider: IPaymentProvider,
    private readonly employerRepo: IEmployerRepository,
    private readonly eventDispatcher?: IEventDispatcher
  ) {}

  async createCheckoutSession(
    employerId: string,
    planId: string,
    amount: number,
    customerEmail: string,
    customerPhone?: string
  ): Promise<{ paymentUrl: string; invoiceId: string; transactionId: string; gatewayOrderId: string }> {
    const idempotencyKey = `chk_${employerId}_${Date.now()}`;

    // 1. Create Pending Invoice and Transaction in repository
    const checkoutRecord = await this.employerRepo.createCheckoutTransaction(
      employerId,
      planId,
      amount,
      idempotencyKey
    );

    // 2. Initiate Payment with Gateway / Adapter
    const gatewayResult = await this.paymentProvider.initiatePayment({
      amount: amount, // Amount in nominal units (adapter handles piaster conversion if needed)
      currency: "EGP",
      idempotencyKey,
      customerEmail,
      customerPhone: customerPhone || "+201000000000",
      description: `ترقية اشتراك منصة hireCNC - ${checkoutRecord.planName}`,
      metadata: {
        employerId,
        planId,
        invoiceId: checkoutRecord.invoiceId,
        companyName: checkoutRecord.companyName || "Employer",
      },
    });

    return {
      paymentUrl: gatewayResult.paymentUrl,
      invoiceId: checkoutRecord.invoiceId,
      transactionId: checkoutRecord.transactionId,
      gatewayOrderId: gatewayResult.gatewayOrderId,
    };
  }

  async handleWebhook(
    payload: unknown,
    signature: string
  ): Promise<{ success: boolean; transactionId?: string; invoiceId?: string }> {
    // 1. Verify Webhook Signature with Gateway / Adapter
    const verification = await this.paymentProvider.verifyWebhook(payload, signature);

    if (!verification.isValid) {
      console.warn("[PaymentService] Webhook verification failed. Invalid signature or payload.");
      return { success: false };
    }

    if (verification.status !== "success") {
      console.info(`[PaymentService] Webhook verified but transaction status is ${verification.status}.`);
      return { success: true, transactionId: verification.transactionId };
    }

    // 2. Activate Subscription in repository
    const idempotencyKey = verification.idempotencyKey || "";
    const gatewayRef = verification.transactionId || "webhook_ref";

    const activation = await this.employerRepo.activateSubscriptionAfterPayment(
      idempotencyKey,
      gatewayRef
    );

    if (!activation.success) {
      console.warn(`[PaymentService] Could not activate subscription for idempotencyKey: ${idempotencyKey}`);
      return { success: false };
    }

    // 3. Dispatch Domain Event
    if (this.eventDispatcher && activation.employerId && activation.invoiceId && activation.subscriptionId) {
      await this.eventDispatcher.dispatch(
        new PaymentSucceededEvent({
          transactionId: gatewayRef,
          invoiceId: activation.invoiceId,
          subscriptionId: activation.subscriptionId,
          employerId: activation.employerId,
          amount: activation.amount || 0,
          currency: "EGP",
          gatewayRef,
        })
      );
    }

    return {
      success: true,
      transactionId: gatewayRef,
      invoiceId: activation.invoiceId,
    };
  }
}
