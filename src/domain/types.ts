// src/domain/types.ts
// Core Domain Types & Enums (ADR-004: Hexagonal Architecture)
// Pure TypeScript definitions decoupled from ORM/Prisma.

export type Role =
  | "SUPER_ADMIN"
  | "SUPPORT_AGENT"
  | "FINANCIAL_ADMIN"
  | "EMPLOYER"
  | "CANDIDATE";

export type UserStatus =
  | "PENDING_EMAIL"
  | "ACTIVE"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "SUSPENDED"
  | "BANNED"
  | "DELETED";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED"
  | "CONTACTED"
  | "INTERVIEW"
  | "NO_SHOW";
