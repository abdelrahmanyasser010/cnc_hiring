// src/lib/auth.ts
// NextAuth configuration — Unified Email+Password for ALL roles (ADR-001, ADR-002)
// Eliminates the candidate_session cookie system entirely

import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { authRateLimiter, auditService } from "@/infrastructure/container";

// Extend NextAuth types to carry role and status
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      status: string;
      refreshToken?: string;
    };
  }
  interface JWT {
    id: string;
    role: string;
    status: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور");
        }

        const identifier = credentials.email.toLowerCase().trim();
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phoneNumber: identifier },
            ],
          },
        });

        if (!user) {
          throw new Error("البريد الإلكتروني/رقم الهاتف أو كلمة المرور غير صحيحة");
        }

        // Rate limit login attempts per user ID (Sprint 3)
        const rateLimit = await authRateLimiter.limitRequest(`login:${user.id}`);
        if (!rateLimit.allowed) {
          throw new Error(
            `لقد تجاوزت الحد الأقصى لمحاولات تسجيل الدخول. يرجى الانتظار ${rateLimit.resetSeconds} ثانية والمحاولة مجدداً.`
          );
        }

        // 1. Check account lockout status (Sprint 3)
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const remainingMinutes = Math.ceil(
            (user.lockedUntil.getTime() - Date.now()) / (60 * 1000)
          );
          throw new Error(
            `هذا الحساب مقفل مؤقتاً لحمايتك. يرجى المحاولة بعد ${remainingMinutes} دقيقة.`
          );
        }

        // Check user is not banned or deleted
        if (user.status === "BANNED" || user.status === "DELETED") {
          throw new Error("هذا الحساب موقوف أو محذوف. يرجى التواصل مع الدعم");
        }

        // Check email is verified
        if (!user.emailVerified && user.status === "PENDING_EMAIL") {
          throw new Error("يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          const newFailedAttempts = user.failedLoginAttempts + 1;

          if (newFailedAttempts >= 5) {
            // Lock account for 15 minutes
            const lockTime = new Date(Date.now() + 15 * 60 * 1000);
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockedUntil: lockTime,
              },
            });

            // Log security lock event (ADR-006)
            await auditService.log({
              actorId: user.id,
              action: "ACCOUNT_LOCKED_OUT",
              entityType: "User",
              entityId: user.id,
              newValue: { lockedUntil: lockTime },
            });

            throw new Error("تم قفل حسابك مؤقتاً لمدة 15 دقيقة بسبب تكرار المحاولات الخاطئة.");
          } else {
            // Increment failed attempts count
            await db.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: newFailedAttempts },
            });

            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }
        }

        // Reset failed login attempts on success
        await db.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        // Generate and record refresh token in DB (Sprint 3)
        const refreshTokenString = crypto.randomBytes(64).toString("hex");
        await db.refreshToken.create({
          data: {
            userId: user.id,
            token: refreshTokenString,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          refreshToken: refreshTokenString,
        } as unknown as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
        token.status = (user as unknown as { status: string }).status;
        token.refreshToken = (user as unknown as { refreshToken?: string }).refreshToken;
      } else if (token.refreshToken) {
        // Database verification for live session validation and revocation (Sprint 3)
        try {
          const dbToken = await db.refreshToken.findUnique({
            where: { token: token.refreshToken as string },
            include: { user: { select: { status: true } } },
          });

          if (
            !dbToken ||
            dbToken.revoked ||
            dbToken.expiresAt < new Date() ||
            (dbToken.user.status !== "ACTIVE" && dbToken.user.status !== "PENDING_APPROVAL")
          ) {
            // Force session expiration if token is revoked or account is locked/banned
            return {} as typeof token;
          }
        } catch (error) {
          console.error("[NextAuth JWT Callback] Refresh token check failed:", error);
          // Don't crash but fail safe on database errors
          return {} as typeof token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.refreshToken = token.refreshToken as string;
      } else if (!token.id) {
        // Clear session user if token was cleared
        Object.assign(session, { user: null });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
