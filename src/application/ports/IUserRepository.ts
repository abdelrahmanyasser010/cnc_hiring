// src/application/ports/IUserRepository.ts
// Port: User data access contract (ADR-004: Hexagonal Architecture)
// No Prisma imports — pure TypeScript interface

import type { Role, UserStatus } from "@/domain/types";

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  role: Role;
  phoneNumber?: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  role: Role;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findByPhone(phone: string): Promise<UserRecord | null>;
  create(data: CreateUserDTO): Promise<UserRecord>;
  updateStatus(id: string, status: UserStatus): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
  updateEmailVerified(id: string, verified: boolean): Promise<void>;
  softDelete(id: string): Promise<void>;
}
