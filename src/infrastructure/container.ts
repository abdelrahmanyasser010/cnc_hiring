// src/infrastructure/container.ts
// Dependency Injection composition root (ADR-004)
// Wires interfaces to their database/cache/messaging implementations
// Outermost entry point for all Application Service instances

import { AuditService } from "@/application/services/AuditService";
import { FeatureFlagService } from "@/application/services/FeatureFlagService";
import { SettingsService } from "@/application/services/SettingsService";
import { AuthorizationService } from "@/application/services/AuthorizationService";
import { NotificationService } from "@/application/services/NotificationService";
import { RateLimiter } from "@/application/services/RateLimiter";

import { PrismaAuditRepository } from "./repositories/PrismaAuditRepository";
import { PrismaFeatureFlagRepository } from "./repositories/PrismaFeatureFlagRepository";
import { PrismaSettingsRepository } from "./repositories/PrismaSettingsRepository";
import { PrismaEmployerRepository } from "./repositories/PrismaEmployerRepository";
import { PrismaBlogRepository } from "./repositories/PrismaBlogRepository";
import { PrismaApplicationRepository } from "./repositories/PrismaApplicationRepository";
import { PrismaAuthRepository } from "./repositories/PrismaAuthRepository";

import { cache } from "./adapters/MemoryCacheAdapter";
import { logger } from "./adapters/ConsoleLoggerAdapter";
import { WhatsAppNotificationAdapter } from "./adapters/WhatsAppNotificationAdapter";

import { PrismaUserRepository } from "./repositories/PrismaUserRepository";
import { PrismaCandidateRepository } from "./repositories/PrismaCandidateRepository";
import { PrismaDashboardRepository } from "./repositories/PrismaDashboardRepository";
import { AuthenticationService } from "@/application/services/AuthenticationService";
import { eventDispatcher } from "./adapters/LocalEventDispatcher";

import { PrismaJobRepository } from "./repositories/PrismaJobRepository";
import { PaymobPaymentAdapter } from "./adapters/PaymobPaymentAdapter";
import { PaymentService } from "@/application/services/PaymentService";
import { PrismaPlanRepository } from "./repositories/PrismaPlanRepository";
import { AdminPlanService } from "@/application/services/AdminPlanService";

// ─── Instantiate Repositories and Adapters ──────────────────────────────────
export const auditRepo = new PrismaAuditRepository();
export const featureFlagRepo = new PrismaFeatureFlagRepository();
export const settingsRepo = new PrismaSettingsRepository();
export const employerRepo = new PrismaEmployerRepository();
export const blogRepo = new PrismaBlogRepository();
export const applicationRepo = new PrismaApplicationRepository();
export const authRepo = new PrismaAuthRepository();
export const userRepo = new PrismaUserRepository();
export const candidateRepo = new PrismaCandidateRepository();
export const dashboardRepo = new PrismaDashboardRepository();
export const jobRepo = new PrismaJobRepository();
export const planRepo = new PrismaPlanRepository();
const notificationProvider = new WhatsAppNotificationAdapter();
export const paymentProvider = new PaymobPaymentAdapter();

// ─── Instantiate and Export wired Application Services ───────────────────────
export const auditService = new AuditService(auditRepo, logger);
export const featureFlagService = new FeatureFlagService(featureFlagRepo, cache);
export const settingsService = new SettingsService(settingsRepo, cache);
export const authorizationService = new AuthorizationService(employerRepo, featureFlagService);
export const notificationService = new NotificationService(notificationProvider, logger);
export const authenticationService = new AuthenticationService(authRepo, userRepo);
export const paymentService = new PaymentService(paymentProvider, employerRepo, eventDispatcher);
export const adminPlanService = new AdminPlanService(planRepo);
export { eventDispatcher };

// ─── Instantiate and Export Rate Limiters ────────────────────────────────────
export const authRateLimiter = new RateLimiter(cache, 5, 60);     // 5 attempts per minute
export const uploadRateLimiter = new RateLimiter(cache, 3, 60);   // 3 uploads per minute
export const applyRateLimiter = new RateLimiter(cache, 10, 60);   // 10 applications per minute
export const phoneRevealRateLimiter = new RateLimiter(cache, 20, 60); // 20 phone reveals per minute
