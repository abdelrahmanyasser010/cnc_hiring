// src/application/services/FeatureFlagService.ts
// Core Service: Feature flag evaluation with environment scope (ADR-007)
// ✅ CLEAN: No Prisma import — depends only on IFeatureFlagRepository port

import type { IFeatureFlagRepository, FlagEnvironment } from "@/application/ports/IFeatureFlagRepository";
import type { ICacheService } from "@/application/ports/ICacheService";

function getCurrentEnvironment(): FlagEnvironment {
  const env = process.env.APP_ENV ?? process.env.NODE_ENV ?? "development";
  switch (env) {
    case "production":
      return "PRODUCTION";
    case "test":
    case "staging":
      return "STAGING";
    default:
      return "DEVELOPMENT";
  }
}

export class FeatureFlagService {
  private readonly ttl = 60; // Cache for 60 seconds

  constructor(
    private readonly repo: IFeatureFlagRepository,
    private readonly cache: ICacheService
  ) {}

  async isEnabled(flagName: string, environment?: FlagEnvironment): Promise<boolean> {
    const env = environment ?? getCurrentEnvironment();
    const cacheKey = `ff:${flagName}:${env}`;

    const cached = await this.cache.get<boolean>(cacheKey);
    if (cached !== null) return cached;

    const flag = await this.repo.findByNameAndEnvironment(flagName, env);
    const isActive = flag?.isActive ?? false;
    await this.cache.set(cacheKey, isActive, this.ttl);
    return isActive;
  }

  async invalidate(flagName: string): Promise<void> {
    const envs: FlagEnvironment[] = ["DEVELOPMENT", "STAGING", "PRODUCTION"];
    await Promise.all(envs.map((env) => this.cache.del(`ff:${flagName}:${env}`)));
  }
}


