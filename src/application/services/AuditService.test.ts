import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditService, type AuditEntry } from "./AuditService";
import type { IAuditRepository } from "@/application/ports/IAuditRepository";
import type { ILoggerService } from "@/application/ports/ILoggerService";

describe("AuditService", () => {
  let mockRepo: IAuditRepository;
  let mockLogger: ILoggerService;
  let auditService: AuditService;

  beforeEach(() => {
    vi.resetAllMocks();
    mockRepo = {
      create: vi.fn().mockResolvedValue(undefined),
      findByActor: vi.fn(),
      findByEntity: vi.fn(),
      findRecent: vi.fn(),
    };
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };
    auditService = new AuditService(mockRepo, mockLogger);
  });

  const sampleEntry: AuditEntry = {
    actorId: "user_123",
    action: "USER_LOGIN",
    entityType: "User",
    entityId: "user_123",
    correlationId: "corr_abc",
  };

  it("should create an audit log entry in repository and log info", async () => {
    await auditService.log(sampleEntry);

    expect(mockRepo.create).toHaveBeenCalledOnce();
    expect(mockRepo.create).toHaveBeenCalledWith(sampleEntry);
    expect(mockLogger.info).toHaveBeenCalledOnce();
    expect(mockLogger.info).toHaveBeenCalledWith("[Audit] USER_LOGIN", {
      correlationId: "corr_abc",
      userId: "user_123",
      entityType: "User",
      entityId: "user_123",
    });
  });

  it("should not crash if repository create throws an error and should log error", async () => {
    const repoError = new Error("Database connection error");
    vi.mocked(mockRepo.create).mockRejectedValueOnce(repoError);

    // Should resolve without throwing
    await expect(auditService.log(sampleEntry)).resolves.toBeUndefined();

    expect(mockRepo.create).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      "[Audit] Failed to write audit log",
      repoError,
      {
        action: "USER_LOGIN",
        actorId: "user_123",
      }
    );
  });

  it("should work without a logger service provided", async () => {
    const serviceWithoutLogger = new AuditService(mockRepo);
    await expect(serviceWithoutLogger.log(sampleEntry)).resolves.toBeUndefined();
    expect(mockRepo.create).toHaveBeenCalledWith(sampleEntry);
  });

  it("should not throw when repo fails and no logger is provided", async () => {
    const serviceWithoutLogger = new AuditService(mockRepo);
    vi.mocked(mockRepo.create).mockRejectedValueOnce(new Error("DB failed"));
    await expect(serviceWithoutLogger.log(sampleEntry)).resolves.toBeUndefined();
  });
});
