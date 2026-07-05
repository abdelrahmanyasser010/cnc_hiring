// src/application/ports/IAuditRepository.ts
// Port: Audit log persistence contract — no Prisma, no infrastructure coupling
// Implementations: PrismaAuditRepository (infrastructure/repositories)

export interface AuditEntry {
  actorId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
  tenantId?: string;
}

export interface IAuditRepository {
  create(entry: AuditEntry): Promise<void>;
}
