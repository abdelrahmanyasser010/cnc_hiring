// src/infrastructure/repositories/PrismaCandidateRepository.ts
// Adapter: Prisma implementation of ICandidateRepository

import { db } from "@/lib/db";
import type { ICandidateRepository, CandidateProfileRecord } from "@/application/ports/ICandidateRepository";
import { MACHINE_TYPES, SOFTWARE_SPECIALIZATIONS } from "@/lib/constants";

export class PrismaCandidateRepository implements ICandidateRepository {
  async findProfileByUserId(userId: string): Promise<CandidateProfileRecord | null> {
    const res = await db.candidateProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        isAvailable: true,
        governorate: true,
        city: true,
        experienceYears: true,
        expectedSalary: true,
        user: {
          select: {
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });

    if (!res) return null;

    return {
      id: res.id,
      isAvailable: res.isAvailable,
      governorate: res.governorate,
      city: res.city,
      experienceYears: res.experienceYears,
      expectedSalary: Number(res.expectedSalary),
      user: {
        name: res.user.name,
        phoneNumber: res.user.phoneNumber,
        email: res.user.email,
      },
    };
  }

  async updateAvailability(profileId: string, isAvailable: boolean): Promise<void> {
    await db.candidateProfile.update({
      where: { id: profileId },
      data: { isAvailable },
    });
  }

  async getRegistrationLookups(): Promise<{ machines: string[]; softwares: string[] }> {
    try {
      const [machines, softwares] = await Promise.all([
        db.machineType.findMany({
          orderBy: { name: "asc" },
          select: { name: true },
        }),
        db.softwareSpecialization.findMany({
          orderBy: { name: "asc" },
          select: { name: true },
        }),
      ]);

      return {
        machines: machines.length > 0 ? machines.map((m) => m.name) : MACHINE_TYPES,
        softwares: softwares.length > 0 ? softwares.map((s) => s.name) : SOFTWARE_SPECIALIZATIONS,
      };
    } catch {
      return {
        machines: MACHINE_TYPES,
        softwares: SOFTWARE_SPECIALIZATIONS,
      };
    }
  }

  async searchCandidates(
    filters: {
      candidateType?: "TECHNICIAN" | "ENGINEER";
      governorate?: string;
      city?: string;
      machineTypes?: string[];
      specializations?: string[];
      query?: string;
      control?: string;
    },
    skip: number,
    take: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ candidates: any[]; totalCount: number }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filters.candidateType) {
      where.candidateType = filters.candidateType;
    }
    if (filters.governorate) {
      where.governorate = filters.governorate;
    }
    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.machineTypes && filters.machineTypes.length > 0) {
      where.machines = {
        some: {
          machineType: {
            name: { in: filters.machineTypes },
          },
        },
      };
    }

    if (filters.specializations && filters.specializations.length > 0) {
      where.softwares = {
        some: {
          software: {
            name: { in: filters.specializations },
          },
        },
      };
    }

    if (filters.control) {
      where.machines = {
        some: {
          machineType: { name: { contains: filters.control } },
        },
      };
    }

    if (filters.query) {
      where.OR = [
        { city: { contains: filters.query, mode: "insensitive" } },
        { governorate: { contains: filters.query, mode: "insensitive" } },
        { user: { name: { contains: filters.query, mode: "insensitive" } } },
      ];
    }

    const [totalCount, dbCandidates] = await Promise.all([
      db.candidateProfile.count({ where }),
      db.candidateProfile.findMany({
        where,
        select: {
          id: true,
          candidateType: true,
          governorate: true,
          city: true,
          experienceYears: true,
          expectedSalary: true,
          reliabilityScore: true,
          isAvailable: true,
          user: {
            select: {
              name: true,
              phoneNumber: true,
            },
          },
          machines: {
            select: {
              machineType: {
                select: { name: true },
              },
            },
          },
          softwares: {
            select: {
              software: {
                select: { name: true },
              },
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const candidates = dbCandidates.map((c) => {
      const phone = c.user.phoneNumber ?? "";
      const maskedPhone = phone.length >= 7 
        ? `${phone.slice(0, 3)}••••${phone.slice(-4)}` 
        : phone;

      return {
        id: c.id,
        name: c.user.name,
        role: c.candidateType,
        governorate: c.governorate,
        city: c.city,
        experienceYears: c.experienceYears,
        expectedSalary: Number(c.expectedSalary),
        reliabilityScore: c.reliabilityScore,
        preferredControl: c.machines.map((m) => m.machineType.name),
        specializations: c.softwares.map((s) => s.software.name),
        machineTypes: c.machines.map((m) => m.machineType.name),
        phoneNumber: maskedPhone,
      };
    });

    return { candidates, totalCount };
  }

  async findPhoneNumberById(candidateId: string): Promise<string | null> {
    const res = await db.candidateProfile.findUnique({
      where: { id: candidateId },
      select: {
        user: {
          select: { phoneNumber: true },
        },
      },
    });
    return res?.user?.phoneNumber ?? null;
  }
}
