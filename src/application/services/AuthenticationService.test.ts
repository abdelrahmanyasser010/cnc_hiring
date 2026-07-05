import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticationService } from "./AuthenticationService";
import type { IAuthRepository } from "@/application/ports/IAuthRepository";
import type { IUserRepository } from "@/application/ports/IUserRepository";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("AuthenticationService", () => {
  let mockAuthRepo: IAuthRepository;
  let mockUserRepo: IUserRepository;
  let authService: AuthenticationService;

  beforeEach(() => {
    vi.resetAllMocks();
    mockAuthRepo = {
      findUserByEmail: vi.fn(),
      findUserByPhone: vi.fn(),
      findUserById: vi.fn(),
      registerEmployer: vi.fn(),
      registerCandidate: vi.fn(),
      findEmailVerifyToken: vi.fn(),
      verifyEmailToken: vi.fn(),
      createPasswordResetToken: vi.fn(),
      findPasswordResetToken: vi.fn(),
      resetPassword: vi.fn(),
    };
    mockUserRepo = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
    };
    authService = new AuthenticationService(mockAuthRepo, mockUserRepo);
  });

  describe("validateCredentials", () => {
    it("should return error if user not found", async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
      const res = await authService.validateCredentials("test@example.com", "pass");
      expect(res.error).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    });

    it("should return error if user status is BANNED, DELETED, or SUSPENDED", async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        role: "EMPLOYER",
        status: "BANNED",
        passwordHash: "hash",
        emailVerified: true,
      });
      const res = await authService.validateCredentials("test@example.com", "pass");
      expect(res.error).toBe("حسابك موقوف أو محذوف. يرجى التواصل مع الدعم الفني");
    });

    it("should return error if user has no passwordHash (e.g. OAuth only or uninitialized)", async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        role: "EMPLOYER",
        status: "ACTIVE",
        passwordHash: null as unknown as string,
        emailVerified: true,
      });
      const res = await authService.validateCredentials("test@example.com", "pass");
      expect(res.error).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    });

    it("should return error if password comparison fails", async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        role: "EMPLOYER",
        status: "ACTIVE",
        passwordHash: "hashed_pwd",
        emailVerified: true,
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const res = await authService.validateCredentials("test@example.com", "wrongpass");
      expect(res.error).toBe("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    });

    it("should return user context on successful validation", async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
        id: "user_123",
        email: "test@example.com",
        role: "EMPLOYER",
        status: "ACTIVE",
        passwordHash: "hashed_pwd",
        emailVerified: true,
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const res = await authService.validateCredentials("test@example.com", "correctpass");
      expect(res.error).toBeUndefined();
      expect(res.user).toEqual({
        id: "user_123",
        email: "test@example.com",
        role: "EMPLOYER",
        status: "ACTIVE",
        emailVerified: true,
      });
    });
  });

  describe("isTokenValid", () => {
    it("should return true for future dates and false for past dates", () => {
      const future = new Date(Date.now() + 3600000);
      const past = new Date(Date.now() - 3600000);
      expect(authService.isTokenValid(future)).toBe(true);
      expect(authService.isTokenValid(past)).toBe(false);
    });
  });

  describe("determineVerifiedStatus", () => {
    it("should return PENDING_APPROVAL for EMPLOYER and ACTIVE for other roles", () => {
      expect(authService.determineVerifiedStatus("EMPLOYER")).toBe("PENDING_APPROVAL");
      expect(authService.determineVerifiedStatus("CANDIDATE")).toBe("ACTIVE");
      expect(authService.determineVerifiedStatus("SUPER_ADMIN")).toBe("ACTIVE");
    });
  });
});
