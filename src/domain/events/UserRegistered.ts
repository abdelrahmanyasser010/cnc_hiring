// src/domain/events/UserRegistered.ts
import type { DomainEvent } from "@/domain/ports/IEventDispatcher";

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  role: "EMPLOYER" | "CANDIDATE";
  verificationToken: string;
}

export class UserRegisteredEvent implements DomainEvent {
  readonly eventName = "UserRegistered";
  readonly occurredAt = new Date();

  constructor(public readonly payload: Record<string, unknown> & UserRegisteredPayload) {}
}
