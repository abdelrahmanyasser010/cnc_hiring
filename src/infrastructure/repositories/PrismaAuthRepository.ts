// src/infrastructure/repositories/PrismaAuthRepository.ts
// Adapter: Prisma implementation of IAuthRepository

import { db } from "@/lib/db";
import type {
  IAuthRepository,
  EmployerRegistrationData,
  CandidateRegistrationData,
} from "@/application/ports/IAuthRepository";
import type { UserStatus } from "@/domain/types";

export class PrismaAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
    return db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
  }

  async findUserByPhone(phoneNumber: string): Promise<{ id: string } | null> {
    return db.user.findUnique({
      where: { phoneNumber },
      select: { id: true },
    });
  }

  async registerEmployer(data: EmployerRegistrationData): Promise<{ user: { id: string; email: string } }> {
    return db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          name: data.name,
          phoneNumber: data.phoneNumber ?? null,
          role: "EMPLOYER",
          status: "PENDING_EMAIL",
          employerProfile: {
            create: {
              companyName: data.companyName,
              industryZone: data.industryZone,
              address: data.address,
              businessLicenseUrl: data.businessLicenseUrl ?? null,
              isVerified: false,
            },
          },
        },
        select: { id: true, email: true },
      });

      await tx.emailVerifyToken.create({
        data: {
          userId: user.id,
          token: data.verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        },
      });

      return { user };
    });
  }

  async registerCandidate(data: CandidateRegistrationData): Promise<{ user: { id: string; email: string } }> {
    return db.$transaction(async (tx) => {
      let machineIds: string[] = [];
      let softwareIds: string[] = [];

      if (data.candidateType === "TECHNICIAN" && data.machineTypes && data.machineTypes.length > 0) {
        const dbMachines = await tx.machineType.findMany({
          where: { name: { in: data.machineTypes } },
        });
        machineIds = dbMachines.map((m) => m.id);
      } else if (data.specializations && data.specializations.length > 0) {
        const dbSoftwares = await tx.softwareSpecialization.findMany({
          where: { name: { in: data.specializations } },
        });
        softwareIds = dbSoftwares.map((s) => s.id);
      }

      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          name: data.name,
          phoneNumber: data.phoneNumber,
          role: "CANDIDATE",
          status: "PENDING_EMAIL",
          candidateProfile: {
            create: {
              candidateType: data.candidateType,
              governorate: data.governorate,
              city: data.city,
              experienceYears: data.experienceYears,
              expectedSalary: data.expectedSalary,
              machines: {
                create: machineIds.map((machineTypeId) => ({
                  machineTypeId,
                  level: "INTERMEDIATE",
                  experienceYears: data.experienceYears,
                })),
              },
              softwares: {
                create: softwareIds.map((softwareId) => ({
                  softwareId,
                  level: "INTERMEDIATE",
                  experienceYears: data.experienceYears,
                })),
              },
            },
          },
        },
        select: { id: true, email: true },
      });

      await tx.emailVerifyToken.create({
        data: {
          userId: user.id,
          token: data.verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return { user };
    });
  }

  async findEmailVerifyToken(token: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    user: { id: string; email: string; role: string; status: string };
  } | null> {
    const res = await db.emailVerifyToken.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true, role: true, status: true },
        },
      },
    });
    if (!res) return null;
    return {
      id: res.id,
      userId: res.userId,
      expiresAt: res.expiresAt,
      user: {
        id: res.user.id,
        email: res.user.email,
        role: res.user.role,
        status: res.user.status,
      },
    };
  }

  async verifyEmailToken(tokenId: string, userId: string, newStatus: UserStatus): Promise<void> {
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { emailVerified: true, status: newStatus },
      });
      await tx.emailVerifyToken.delete({
        where: { id: tokenId },
      });
    });
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await db.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(token: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    used: boolean;
  } | null> {
    return db.passwordResetToken.findUnique({
      where: { token },
      select: { id: true, userId: true, expiresAt: true, used: true },
    });
  }

  async resetPassword(tokenId: string, userId: string, passwordHash: string): Promise<void> {
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          passwordHash,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
      await tx.passwordResetToken.update({
        where: { id: tokenId },
        data: { used: true },
      });
    });
  }
}
