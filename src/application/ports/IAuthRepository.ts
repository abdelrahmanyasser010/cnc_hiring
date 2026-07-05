// src/application/ports/IAuthRepository.ts
// Port: Auth & User Registration data access contract

import type { UserStatus } from "@/domain/types";

export interface EmployerRegistrationData {
  email: string;
  passwordHash: string;
  name: string;
  phoneNumber?: string | null;
  companyName: string;
  industryZone: string;
  address: string;
  businessLicenseUrl?: string | null;
  verificationToken: string;
}

export interface CandidateRegistrationData {
  email: string;
  passwordHash: string;
  name: string;
  phoneNumber: string;
  candidateType: "TECHNICIAN" | "ENGINEER";
  governorate: string;
  city: string;
  experienceYears: number;
  expectedSalary: number;
  machineTypes?: string[];
  specializations?: string[];
  verificationToken: string;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<{ id: string; email: string } | null>;
  findUserByPhone(phoneNumber: string): Promise<{ id: string } | null>;
  
  registerEmployer(data: EmployerRegistrationData): Promise<{ user: { id: string; email: string } }>;
  registerCandidate(data: CandidateRegistrationData): Promise<{ user: { id: string; email: string } }>;
  
  findEmailVerifyToken(token: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    user: { id: string; email: string; role: string; status: string };
  } | null>;
  
  verifyEmailToken(tokenId: string, userId: string, newStatus: UserStatus): Promise<void>;
  
  createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findPasswordResetToken(token: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    used: boolean;
  } | null>;
  resetPassword(tokenId: string, userId: string, passwordHash: string): Promise<void>;
}
