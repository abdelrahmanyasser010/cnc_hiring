// src/infrastructure/repositories/PrismaFeatureFlagRepository.ts
// Adapter: Prisma implementation of IFeatureFlagRepository
// ONLY file allowed to import Prisma for feature flag operations

import { db } from "@/lib/db";
import type {
  IFeatureFlagRepository,
  FeatureFlagRecord,
  FlagEnvironment,
} from "@/application/ports/IFeatureFlagRepository";

export class PrismaFeatureFlagRepository implements IFeatureFlagRepository {
  async findByNameAndEnvironment(
    name: string,
    environment: FlagEnvironment
  ): Promise<FeatureFlagRecord | null> {
    const flag = await db.featureFlag.findUnique({
      where: { name_environment: { name, environment } },
      select: { name: true, environment: true, isActive: true },
    });

    if (!flag) return null;

    return {
      name: flag.name,
      environment: flag.environment as FlagEnvironment,
      isActive: flag.isActive,
    };
  }
}
