// src/infrastructure/adapters/LocalEventDispatcher.ts
// Adapter: Local in-process event dispatcher (ADR-003)
// Swap for BullMQ/Redis dispatcher without changing any business logic

import type {
  DomainEvent,
  EventHandler,
  IEventDispatcher,
} from "@/domain/ports/IEventDispatcher";
import type { UserRegisteredEvent } from "@/domain/events/UserRegistered";

export class LocalEventDispatcher implements IEventDispatcher {
  private readonly handlers = new Map<string, EventHandler[]>();

  register<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>
  ): void {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler as EventHandler]);
  }

  async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(
            `[EventDispatcher] Handler failed for event ${event.eventName}:`,
            error
          );
        }
      })
    );
  }
}

// Singleton instance — replace with DI container later
export const eventDispatcher = new LocalEventDispatcher();

// Register default handlers for system domain events (ADR-003)
eventDispatcher.register<UserRegisteredEvent>("USER_REGISTERED", async (event: UserRegisteredEvent) => {
  const { email, verificationToken } = event.payload;
  console.log(`\n📧 [Email Verification Sent] → To: ${email}`);
  console.log(`🔗 Verification Link: http://localhost:3000/verify-email?token=${verificationToken}\n`);
});
