// src/infrastructure/adapters/MemoryCacheAdapter.ts
// Adapter: In-memory cache (ADR-004, Phase 15)
// Swap for Redis adapter without changing any service code

import type { ICacheService } from "@/application/ports/ICacheService";

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

export class MemoryCacheAdapter implements ICacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }

  async flush(): Promise<void> {
    this.store.clear();
  }
}

export const cache = new MemoryCacheAdapter();
