// src/application/services/AuditService.ts
// Core Service: Centralized audit logging (ADR-006)
// ✅ CLEAN: No Prisma import — depends only on IAuditRepository port
// Every sensitive action flows through here

import type { IAuditRepository, AuditEntry } from "@/application/ports/IAuditRepository";
import type { ILoggerService } from "@/application/ports/ILoggerService";

// Re-export AuditEntry so consumers don't need to know the port location
export type { AuditEntry } from "@/application/ports/IAuditRepository";

export class AuditService {
  constructor(
    private readonly repo: IAuditRepository,
    private readonly logger?: ILoggerService
  ) {}

  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.repo.create(entry);

      this.logger?.info(`[Audit] ${entry.action}`, {
        correlationId: entry.correlationId,
        userId: entry.actorId,
        entityType: entry.entityType,
        entityId: entry.entityId,
      });
    } catch (error) {
      // Audit log failure MUST NEVER crash the main flow
      this.logger?.error("[Audit] Failed to write audit log", error, {
        action: entry.action,
        actorId: entry.actorId,
      });
    }
  }
}


