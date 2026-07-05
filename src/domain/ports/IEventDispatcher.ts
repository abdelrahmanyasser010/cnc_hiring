// src/domain/ports/IEventDispatcher.ts
// Port: Domain Event Dispatcher contract (ADR-003)
// Belongs in the Domain layer so Domain events have zero outer dependencies.
// Allows swapping Local → BullMQ → Redis without changing business logic.

export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, unknown>;
}

export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => Promise<void> | void;

export interface IEventDispatcher {
  dispatch(event: DomainEvent): Promise<void>;
  register<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>
  ): void;
}
