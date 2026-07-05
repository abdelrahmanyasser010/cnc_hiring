// src/domain/events/PaymentSucceeded.ts
import type { DomainEvent } from "@/domain/ports/IEventDispatcher";

export interface PaymentSucceededPayload {
  transactionId: string;
  invoiceId: string;
  subscriptionId: string;
  employerId: string;
  amount: number;
  currency: string;
  gatewayRef: string;
}

export class PaymentSucceededEvent implements DomainEvent {
  readonly eventName = "PaymentSucceeded";
  readonly occurredAt = new Date();

  constructor(public readonly payload: Record<string, unknown> & PaymentSucceededPayload) {}
}
