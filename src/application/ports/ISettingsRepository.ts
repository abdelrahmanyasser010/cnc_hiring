// src/application/ports/ISettingsRepository.ts
// Port: System settings data access contract — no Prisma, no infrastructure coupling
// Implementations: PrismaSettingsRepository (infrastructure/repositories)

export interface SystemSettingRecord {
  key: string;
  value: string;
  type: string;
  category: string;
}

export interface ISettingsRepository {
  findByKey(key: string): Promise<SystemSettingRecord | null>;
  upsert(key: string, value: string, type?: string, category?: string): Promise<void>;
}
