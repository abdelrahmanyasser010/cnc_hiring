// src/application/services/RateLimiter.ts
// Core Service: Rate Limiter using fixed window algorithm over ICacheService (ADR-004, Phase 15)
// Fully decoupled from cache implementation (Memory or Redis)

import type { ICacheService } from "@/application/ports/ICacheService";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export class RateLimiter {
  constructor(
    private readonly cache: ICacheService,
    private readonly limit: number = 5,
    private readonly windowSeconds: number = 60
  ) {}

  async limitRequest(key: string): Promise<RateLimitResult> {
    const cacheKey = `ratelimit:${key}`;
    const now = Math.floor(Date.now() / 1000);

    interface RateLimitData {
      count: number;
      resetTime: number;
    }

    const cached = await this.cache.get<RateLimitData>(cacheKey);

    if (!cached) {
      const resetTime = now + this.windowSeconds;
      await this.cache.set<RateLimitData>(cacheKey, { count: 1, resetTime }, this.windowSeconds);
      return {
        allowed: true,
        remaining: this.limit - 1,
        resetSeconds: this.windowSeconds,
      };
    }

    if (now > cached.resetTime) {
      const resetTime = now + this.windowSeconds;
      await this.cache.set<RateLimitData>(cacheKey, { count: 1, resetTime }, this.windowSeconds);
      return {
        allowed: true,
        remaining: this.limit - 1,
        resetSeconds: this.windowSeconds,
      };
    }

    if (cached.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: Math.max(0, cached.resetTime - now),
      };
    }

    cached.count += 1;
    const remainingTime = Math.max(0, cached.resetTime - now);
    await this.cache.set<RateLimitData>(cacheKey, cached, remainingTime);

    return {
      allowed: true,
      remaining: this.limit - cached.count,
      resetSeconds: remainingTime,
    };
  }
}
