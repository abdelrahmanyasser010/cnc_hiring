// src/infrastructure/repositories/PrismaSettingsRepository.ts
// Adapter: Prisma implementation of ISettingsRepository
// ONLY file allowed to import Prisma for system settings operations

import { db } from "@/lib/db";
import type {
  ISettingsRepository,
  SystemSettingRecord,
} from "@/application/ports/ISettingsRepository";

export class PrismaSettingsRepository implements ISettingsRepository {
  async findByKey(key: string): Promise<SystemSettingRecord | null> {
    const setting = await db.systemSetting.findUnique({
      where: { key },
      select: { key: true, value: true, type: true, category: true },
    });

    if (!setting) return null;

    return {
      key: setting.key,
      value: setting.value,
      type: setting.type,
      category: setting.category,
    };
  }

  async upsert(
    key: string,
    value: string,
    type = "String",
    category = "SYSTEM"
  ): Promise<void> {
    await db.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, type, category },
    });
  }
}
