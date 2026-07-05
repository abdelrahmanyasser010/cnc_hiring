// src/application/ports/ICacheService.ts
// Port: Caching contract (ADR-004)
// Implementations: Memory (now), Redis (future)

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flush(): Promise<void>;
}
