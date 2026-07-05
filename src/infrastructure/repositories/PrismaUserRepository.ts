// src/infrastructure/repositories/PrismaUserRepository.ts
// Adapter: Prisma implementation of IUserRepository

import { db } from "@/lib/db";
import type { IUserRepository, CreateUserDTO, UserRecord } from "@/application/ports/IUserRepository";
import type { Role, UserStatus } from "@/domain/types";

export class PrismaUserRepository implements IUserRepository {
  private mapToRecord(user: {
    id: string;
    email: string;
    passwordHash: string | null;
    emailVerified: boolean;
    phoneNumber: string | null;
    role: string;
    status: string;
    lastLoginAt: Date | null;
    createdAt: Date;
  }): UserRecord {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash ?? "",
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      role: user.role as Role,
      status: user.status as UserStatus,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToRecord(user);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToRecord(user);
  }

  async findByPhone(phone: string): Promise<UserRecord | null> {
    const user = await db.user.findUnique({ where: { phoneNumber: phone } });
    if (!user) return null;
    return this.mapToRecord(user);
  }

  async create(data: CreateUserDTO): Promise<UserRecord> {
    const user = await db.user.create({
      data: {
        email: data.email,
        name: (data as CreateUserDTO & { name?: string }).name || data.email.split("@")[0] || "User",
        passwordHash: data.passwordHash,
        role: data.role,
        phoneNumber: data.phoneNumber ?? null,
        status: "PENDING_EMAIL",
      },
    });
    return this.mapToRecord(user);
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await db.user.update({
      where: { id },
      data: { status },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async updateEmailVerified(id: string, verified: boolean): Promise<void> {
    await db.user.update({
      where: { id },
      data: { emailVerified: verified },
    });
  }

  async softDelete(id: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { status: "DELETED", deletedAt: new Date() },
    });
  }
}
