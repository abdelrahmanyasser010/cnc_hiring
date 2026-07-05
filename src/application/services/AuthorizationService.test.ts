import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AuthorizationService,
  RolePolicy,
  SubscriptionPolicy,
  FeaturePolicy,
  type UserContext,
  type IFeatureFlagEvaluator,
} from "./AuthorizationService";
import type { IEmployerRepository, SubscriptionDetails } from "@/application/ports/IEmployerRepository";

describe("AuthorizationService & Policies", () => {
  let mockEmployerRepo: IEmployerRepository;
  let mockFFEvaluator: IFeatureFlagEvaluator;
  let authService: AuthorizationService;

  beforeEach(() => {
    vi.resetAllMocks();
    mockEmployerRepo = {
      update: vi.fn(),
      findProfileIdByUserId: vi.fn(),
      findActiveSubscription: vi.fn(),
      findSubscriptionById: vi.fn(),
      upgradePlan: vi.fn(),
    };
    mockFFEvaluator = {
      isEnabled: vi.fn().mockResolvedValue(false),
    };
    authService = new AuthorizationService(mockEmployerRepo, mockFFEvaluator);
  });

  describe("RolePolicy", () => {
    const rolePolicy = new RolePolicy();

    it("should correctly identify SUPER_ADMIN", () => {
      const admin: UserContext = { id: "1", role: "SUPER_ADMIN", status: "ACTIVE" };
      const employer: UserContext = { id: "2", role: "EMPLOYER", status: "ACTIVE" };

      expect(rolePolicy.isAdmin(admin)).toBe(true);
      expect(rolePolicy.isAdmin(employer)).toBe(false);
    });

    it("should correctly identify Support Agent or Admin", () => {
      const support: UserContext = { id: "1", role: "SUPPORT_AGENT", status: "ACTIVE" };
      const admin: UserContext = { id: "2", role: "SUPER_ADMIN", status: "ACTIVE" };
      const candidate: UserContext = { id: "3", role: "CANDIDATE", status: "ACTIVE" };

      expect(rolePolicy.isSupportAgent(support)).toBe(true);
      expect(rolePolicy.isSupportAgent(admin)).toBe(true);
      expect(rolePolicy.isSupportAgent(candidate)).toBe(false);
    });

    it("should correctly identify Financial Admin or Admin", () => {
      const finance: UserContext = { id: "1", role: "FINANCIAL_ADMIN", status: "ACTIVE" };
      const admin: UserContext = { id: "2", role: "SUPER_ADMIN", status: "ACTIVE" };
      const employer: UserContext = { id: "3", role: "EMPLOYER", status: "ACTIVE" };

      expect(rolePolicy.isFinancialAdmin(finance)).toBe(true);
      expect(rolePolicy.isFinancialAdmin(admin)).toBe(true);
      expect(rolePolicy.isFinancialAdmin(employer)).toBe(false);
    });

    it("should correctly identify Employer and Candidate roles", () => {
      const employer: UserContext = { id: "1", role: "EMPLOYER", status: "ACTIVE" };
      const candidate: UserContext = { id: "2", role: "CANDIDATE", status: "ACTIVE" };

      expect(rolePolicy.isEmployer(employer)).toBe(true);
      expect(rolePolicy.isEmployer(candidate)).toBe(false);
      expect(rolePolicy.isCandidate(candidate)).toBe(true);
      expect(rolePolicy.isCandidate(employer)).toBe(false);
    });

    it("should check if user is ACTIVE", () => {
      const active: UserContext = { id: "1", role: "EMPLOYER", status: "ACTIVE" };
      const pending: UserContext = { id: "2", role: "EMPLOYER", status: "PENDING_APPROVAL" };
      const banned: UserContext = { id: "3", role: "EMPLOYER", status: "BANNED" };

      expect(rolePolicy.isActive(active)).toBe(true);
      expect(rolePolicy.isActive(pending)).toBe(false);
      expect(rolePolicy.isActive(banned)).toBe(false);
    });
  });

  describe("SubscriptionPolicy", () => {
    let subPolicy: SubscriptionPolicy;

    beforeEach(() => {
      subPolicy = new SubscriptionPolicy(mockEmployerRepo);
    });

    const createMockSub = (overrides: Partial<SubscriptionDetails> = {}): SubscriptionDetails => ({
      id: "sub_1",
      planId: "plan_1",
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 86400000),
      jobsUsed: 1,
      phoneViewsUsed: 5,
      plan: {
        name: "Pro Plan",
        price: 1000,
        maxActiveJobs: 5,
        canViewPhone: true,
        maxPhoneViews: 20,
        canExportData: true,
      },
      ...overrides,
    });

    it("should return false for canCreateJob if profile or subscription not found", async () => {
      vi.mocked(mockEmployerRepo.findProfileIdByUserId).mockResolvedValue(null);
      expect(await subPolicy.canCreateJob("user_1", 0)).toBe(false);

      vi.mocked(mockEmployerRepo.findProfileIdByUserId).mockResolvedValue("prof_1");
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(null);
      expect(await subPolicy.canCreateJob("user_1", 0)).toBe(false);
    });

    it("should allow creating jobs if maxActiveJobs is -1 (unlimited) or below limit", async () => {
      vi.mocked(mockEmployerRepo.findProfileIdByUserId).mockResolvedValue("prof_1");
      
      const unlimitedSub = createMockSub({
        plan: { name: "VIP", price: 5000, maxActiveJobs: -1, canViewPhone: true, maxPhoneViews: -1, canExportData: true },
      });
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(unlimitedSub);
      expect(await subPolicy.canCreateJob("user_1", 100)).toBe(true);

      const limitedSub = createMockSub();
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(limitedSub);
      expect(await subPolicy.canCreateJob("user_1", 4)).toBe(true);
      expect(await subPolicy.canCreateJob("user_1", 5)).toBe(false);
    });

    it("should evaluate canViewCandidatePhone correctly", async () => {
      vi.mocked(mockEmployerRepo.findProfileIdByUserId).mockResolvedValue("prof_1");
      
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(null);
      expect(await subPolicy.canViewCandidatePhone("user_1")).toBe(false);

      const noPhoneSub = createMockSub({
        plan: { name: "Basic", price: 0, maxActiveJobs: 1, canViewPhone: false, maxPhoneViews: 0, canExportData: false },
      });
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(noPhoneSub);
      expect(await subPolicy.canViewCandidatePhone("user_1")).toBe(false);

      const unlimitedSub = createMockSub({
        phoneViewsUsed: 50,
        plan: { name: "Pro", price: 1000, maxActiveJobs: 5, canViewPhone: true, maxPhoneViews: -1, canExportData: true },
      });
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(unlimitedSub);
      expect(await subPolicy.canViewCandidatePhone("user_1")).toBe(true);

      const limitedSub = createMockSub({
        phoneViewsUsed: 19,
        plan: { name: "Pro", price: 1000, maxActiveJobs: 5, canViewPhone: true, maxPhoneViews: 20, canExportData: true },
      });
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(limitedSub);
      expect(await subPolicy.canViewCandidatePhone("user_1")).toBe(true);

      const exhaustedSub = createMockSub({ phoneViewsUsed: 20 });
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(exhaustedSub);
      expect(await subPolicy.canViewCandidatePhone("user_1")).toBe(false);
    });

    it("should evaluate hasActiveSubscription and canExportData correctly", async () => {
      vi.mocked(mockEmployerRepo.findProfileIdByUserId).mockResolvedValue("prof_1");
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(null);
      expect(await subPolicy.hasActiveSubscription("user_1")).toBe(false);
      expect(await subPolicy.canExportData("user_1")).toBe(false);

      const sub = createMockSub();
      vi.mocked(mockEmployerRepo.findActiveSubscription).mockResolvedValue(sub);
      expect(await subPolicy.hasActiveSubscription("user_1")).toBe(true);
      expect(await subPolicy.canExportData("user_1")).toBe(true);
    });
  });

  describe("FeaturePolicy", () => {
    it("should check if flags are enabled via evaluator", async () => {
      const mockEval = { isEnabled: vi.fn() };
      const featurePolicy = new FeaturePolicy(mockEval);

      vi.mocked(mockEval.isEnabled).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      expect(await featurePolicy.isFeatureEnabled("ENABLE_AI_MATCHING")).toBe(true);
      expect(await featurePolicy.canUseAIMatching()).toBe(false);

      vi.mocked(mockEval.isEnabled).mockResolvedValue(true);
      expect(await featurePolicy.canUsePaymob()).toBe(true);
    });
  });

  describe("AuthorizationService Facade", () => {
    it("should allow access to dashboard only for active employers or admins", () => {
      const activeAdmin: UserContext = { id: "1", role: "SUPER_ADMIN", status: "ACTIVE" };
      const activeEmployer: UserContext = { id: "2", role: "EMPLOYER", status: "ACTIVE" };
      const pendingEmployer: UserContext = { id: "3", role: "EMPLOYER", status: "PENDING_APPROVAL" };
      const activeCandidate: UserContext = { id: "4", role: "CANDIDATE", status: "ACTIVE" };

      expect(authService.canAccessDashboard(activeAdmin)).toBe(true);
      expect(authService.canAccessDashboard(activeEmployer)).toBe(true);
      expect(authService.canAccessDashboard(pendingEmployer)).toBe(false);
      expect(authService.canAccessDashboard(activeCandidate)).toBe(false);
    });

    it("should allow access to candidate portal only for active candidates", () => {
      const activeCandidate: UserContext = { id: "1", role: "CANDIDATE", status: "ACTIVE" };
      const pendingCandidate: UserContext = { id: "2", role: "CANDIDATE", status: "PENDING_EMAIL" };
      const activeEmployer: UserContext = { id: "3", role: "EMPLOYER", status: "ACTIVE" };

      expect(authService.canAccessCandidatePortal(activeCandidate)).toBe(true);
      expect(authService.canAccessCandidatePortal(pendingCandidate)).toBe(false);
      expect(authService.canAccessCandidatePortal(activeEmployer)).toBe(false);
    });

    it("should instantiate with default feature evaluator if none provided", async () => {
      const defaultService = new AuthorizationService(mockEmployerRepo);
      expect(await defaultService.feature.isFeatureEnabled("ANY")).toBe(false);
    });
  });
});
