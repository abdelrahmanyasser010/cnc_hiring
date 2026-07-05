// src/infrastructure/repositories/PrismaApplicationRepository.ts
// Adapter: Prisma implementation of IApplicationRepository

import { db } from "@/lib/db";
import type { IApplicationRepository, ApplicationDetails } from "@/application/ports/IApplicationRepository";
import type { ApplicationStatus } from "@/domain/types";

export class PrismaApplicationRepository implements IApplicationRepository {
  async findCandidateProfileIdByUserId(userId: string): Promise<{ id: string } | null> {
    return db.candidateProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  async findJobById(jobId: string): Promise<{ id: string; title: string; employer: { userId: string; companyName: string; user: { phoneNumber?: string | null } } } | null> {
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        employer: {
          select: {
            userId: true,
            companyName: true,
            user: {
              select: { phoneNumber: true },
            },
          },
        },
      },
    });

    if (!job || !job.employer) return null;

    return {
      id: job.id,
      title: job.title,
      employer: {
        userId: job.employer.userId,
        companyName: job.employer.companyName,
        user: {
          phoneNumber: job.employer.user?.phoneNumber,
        },
      },
    };
  }

  async findApplicationByJobAndCandidate(jobId: string, candidateProfileId: string): Promise<{ id: string } | null> {
    return db.jobApplication.findUnique({
      where: {
        jobId_candidateProfileId: {
          jobId,
          candidateProfileId,
        },
      },
      select: { id: true },
    });
  }

  async findScreeningQuestionsByJobId(jobId: string): Promise<{ id: string; correctIndex: number }[]> {
    return db.screeningQuestion.findMany({
      where: { jobId },
      orderBy: { id: "asc" },
      select: { id: true, correctIndex: true },
    });
  }

  async createApplication(data: {
    jobId: string;
    candidateProfileId: string;
    status: ApplicationStatus;
    score: number | null;
  }): Promise<{ id: string }> {
    return db.jobApplication.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      select: { id: true },
    });
  }

  async findApplicationDetailsById(id: string): Promise<ApplicationDetails | null> {
    const res = await db.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            employer: {
              select: { userId: true, companyName: true },
            },
          },
        },
        candidateProfile: {
          include: {
            user: {
              select: { name: true, email: true, phoneNumber: true },
            },
          },
        },
      },
    });

    if (!res) return null;

    return {
      id: res.id,
      jobId: res.jobId,
      status: res.status as ApplicationStatus,
      job: {
        id: res.job.id,
        title: res.job.title,
        location: res.job.location,
        employer: {
          userId: res.job.employer.userId,
          companyName: res.job.employer.companyName,
        },
      },
      candidateProfile: {
        id: res.candidateProfile.id,
        user: {
          name: res.candidateProfile.user.name,
          email: res.candidateProfile.user.email,
          phoneNumber: res.candidateProfile.user.phoneNumber,
        },
      },
    };
  }

  async updateApplication(id: string, data: {
    status?: ApplicationStatus;
    interviewDate?: Date;
    interviewLocation?: string;
    notes?: string;
  }): Promise<void> {
    await db.jobApplication.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    });
  }
}
