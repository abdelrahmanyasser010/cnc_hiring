// src/application/services/AuthenticationService.ts
// Core Service: Authentication & Token domain logic (ADR-006)
// ✅ CLEAN: Depends only on IAuthRepository and IUserRepository ports

import bcrypt from "bcryptjs";
import type { IAuthRepository } from "@/application/ports/IAuthRepository";
import type { IUserRepository } from "@/application/ports/IUserRepository";
import type { Role, UserStatus } from "@/domain/types";

export interface AuthUserResult {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
}

export class AuthenticationService {
  constructor(
    private readonly authRepo: IAuthRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async validateCredentials(email: string, passwordPlain: string): Promise<{ user?: AuthUserResult; error?: string }> {
    const user = await this.userRepo.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    if (user.status === "BANNED" || user.status === "DELETED" || user.status === "SUSPENDED") {
      return { error: "حسابك موقوف أو محذوف. يرجى التواصل مع الدعم الفني" };
    }

    if (!user.passwordHash) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
      },
    };
  }

  isTokenValid(expiresAt: Date): boolean {
    return expiresAt.getTime() > Date.now();
  }

  determineVerifiedStatus(role: Role): UserStatus {
    return role === "EMPLOYER" ? "PENDING_APPROVAL" : "ACTIVE";
  }
}
