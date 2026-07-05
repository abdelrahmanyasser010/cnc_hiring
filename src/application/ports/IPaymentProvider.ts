// src/application/ports/IPaymentProvider.ts
// Port: Payment gateway contract (ADR-004)
// Implementations: Paymob, Fawry, Stripe

export interface InitiatePaymentParams {
  amount: number; // In smallest currency unit (piasters for EGP)
  currency: string;
  idempotencyKey: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface InitiatePaymentResult {
  paymentUrl: string;
  gatewayOrderId: string;
  paymentToken?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  transactionId?: string;
  status?: "success" | "failed" | "pending";
  amount?: number;
  idempotencyKey?: string;
}

export interface RefundParams {
  gatewayTransactionId: string;
  amount: number;
  reason?: string;
}

export interface IPaymentProvider {
  initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;
  verifyWebhook(
    payload: unknown,
    signature: string
  ): Promise<WebhookVerificationResult>;
  refund(params: RefundParams): Promise<{ success: boolean; refundId?: string }>;
}
