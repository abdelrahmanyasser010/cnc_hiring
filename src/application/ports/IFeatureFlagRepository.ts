// src/application/ports/IFeatureFlagRepository.ts
// Port: Feature flag data access contract — no Prisma, no infrastructure coupling
// Implementations: PrismaFeatureFlagRepository (infrastructure/repositories)

export type FlagEnvironment = "DEVELOPMENT" | "STAGING" | "PRODUCTION";

export interface FeatureFlagRecord {
  name: string;
  environment: FlagEnvironment;
  isActive: boolean;
}

export interface IFeatureFlagRepository {
  findByNameAndEnvironment(
    name: string,
    environment: FlagEnvironment
  ): Promise<FeatureFlagRecord | null>;
}
