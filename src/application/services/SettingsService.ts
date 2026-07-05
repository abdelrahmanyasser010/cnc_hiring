// src/application/services/SettingsService.ts
// Core Service: Dynamic system settings (ADR-007)
// ✅ CLEAN: No Prisma import — depends only on ISettingsRepository port

import type { ISettingsRepository } from "@/application/ports/ISettingsRepository";
import type { ICacheService } from "@/application/ports/ICacheService";

export class SettingsService {
  private readonly ttl = 300; // Cache 5 minutes

  constructor(
    private readonly repo: ISettingsRepository,
    private readonly cache: ICacheService
  ) {}

  async get(key: string): Promise<string | null> {
    const cacheKey = `setting:${key}`;
    const cached = await this.cache.get<string>(cacheKey);
    if (cached !== null) return cached;

    const setting = await this.repo.findByKey(key);
    if (!setting) return null;

    await this.cache.set(cacheKey, setting.value, this.ttl);
    return setting.value;
  }

  async getBoolean(key: string, defaultValue = false): Promise<boolean> {
    const val = await this.get(key);
    if (val === null) return defaultValue;
    return val === "true" || val === "1";
  }

  async getNumber(key: string, defaultValue = 0): Promise<number> {
    const val = await this.get(key);
    if (val === null) return defaultValue;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  async getJSON<T>(key: string, defaultValue: T): Promise<T> {
    const val = await this.get(key);
    if (val === null) return defaultValue;
    try {
      return JSON.parse(val) as T;
    } catch {
      return defaultValue;
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.repo.upsert(key, value);
    await this.cache.del(`setting:${key}`);
  }
}


