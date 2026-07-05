// src/infrastructure/repositories/PrismaAuditRepository.ts
// Adapter: Prisma implementation of IAuditRepository
// ONLY file allowed to import Prisma for audit operations

import { db } from "@/lib/db";
import type { IAuditRepository, AuditEntry } from "@/application/ports/IAuditRepository";

export class PrismaAuditRepository implements IAuditRepository {
  async create(entry: AuditEntry): Promise<void> {
    await db.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldValue: entry.oldValue ? (entry.oldValue as object) : undefined,
        newValue: entry.newValue ? (entry.newValue as object) : undefined,
        correlationId: entry.correlationId,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        tenantId: entry.tenantId,
      },
    });
  }
}
