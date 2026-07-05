// src/application/services/AuthorizationService.ts
// Core Service: Policy-based authorization (ADR-006)
// ✅ CLEAN: No Prisma import — depends only on IEmployerRepository port and feature flag evaluator
// RolePolicy + OwnershipPolicy + SubscriptionPolicy + FeaturePolicy

import type { Role, UserStatus } from "@/domain/types";
import type { IEmployerRepository } from "@/application/ports/IEmployerRepository";

export interface UserContext {
  id: string;
  role: Role;
  status: UserStatus;
}

export interface IFeatureFlagEvaluator {
  isEnabled(flagName: string): Promise<boolean>;
}

// ─── Role Policy ─────────────────────────────────────────────────────────────

export class RolePolicy {
  isAdmin(user: UserContext): boolean {
    return user.role === "SUPER_ADMIN";
  }

  isSupportAgent(user: UserContext): boolean {
    return user.role === "SUPPORT_AGENT" || user.role === "SUPER_ADMIN";
  }

  isFinancialAdmin(user: UserContext): boolean {
    return user.role === "FINANCIAL_ADMIN" || user.role === "SUPER_ADMIN";
  }

  isEmployer(user: UserContext): boolean {
    return user.role === "EMPLOYER";
  }

  isCandidate(user: UserContext): boolean {
    return user.role === "CANDIDATE";
  }

  isActive(user: UserContext): boolean {
    return user.status === "ACTIVE";
  }
}

// ─── Subscription Policy ─────────────────────────────────────────────────────

export class SubscriptionPolicy {
  constructor(private readonly employerRepo: IEmployerRepository) {}

  private async getActiveSubscription(userId: string) {
    const profileId = await this.employerRepo.findProfileIdByUserId(userId);
    if (!profileId) return null;
    return this.employerRepo.findActiveSubscription(profileId);
  }

  async canCreateJob(userId: string, currentJobCount: number): Promise<boolean> {
    const sub = await this.getActiveSubscription(userId);
    if (!sub) return false;
    if (sub.plan.maxActiveJobs === -1) return true; // Unlimited
    return currentJobCount < sub.plan.maxActiveJobs;
  }

  async canViewCandidatePhone(userId: string): Promise<boolean> {
    const sub = await this.getActiveSubscription(userId);
    if (!sub) return false;
    if (!sub.plan.canViewPhone) return false;
    if (sub.plan.maxPhoneViews === -1) return true; // Unlimited
    return sub.phoneViewsUsed < sub.plan.maxPhoneViews;
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const sub = await this.getActiveSubscription(userId);
    return sub !== null;
  }

  async canExportData(userId: string): Promise<boolean> {
    const sub = await this.getActiveSubscription(userId);
    return sub?.plan.canExportData ?? false;
  }
}

// ─── Feature Policy ──────────────────────────────────────────────────────────

export class FeaturePolicy {
  constructor(private readonly ffEvaluator: IFeatureFlagEvaluator) {}

  async isFeatureEnabled(featureName: string): Promise<boolean> {
    return this.ffEvaluator.isEnabled(featureName);
  }

  async canUseAIMatching(): Promise<boolean> {
    return this.isFeatureEnabled("ENABLE_AI_MATCHING");
  }

  async canUsePaymob(): Promise<boolean> {
    return this.isFeatureEnabled("ENABLE_PAYMOB");
  }
}

// ─── AuthorizationService (Facade) ───────────────────────────────────────────

export class AuthorizationService {
  readonly role = new RolePolicy();
  readonly feature: FeaturePolicy;
  readonly subscription: SubscriptionPolicy;

  constructor(
    employerRepo: IEmployerRepository,
    ffEvaluator?: IFeatureFlagEvaluator
  ) {
    this.subscription = new SubscriptionPolicy(employerRepo);
    this.feature = new FeaturePolicy(ffEvaluator ?? { isEnabled: async () => false });
  }

  /** Verify a user can perform dashboard actions (active + correct role) */
  canAccessDashboard(user: UserContext): boolean {
    return (
      this.role.isActive(user) &&
      (this.role.isEmployer(user) || this.role.isAdmin(user))
    );
  }

  /** Verify a user can access candidate portal */
  canAccessCandidatePortal(user: UserContext): boolean {
    return this.role.isActive(user) && this.role.isCandidate(user);
  }
}
