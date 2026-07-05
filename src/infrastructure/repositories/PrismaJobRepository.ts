// src/infrastructure/repositories/PrismaJobRepository.ts
// Adapter: Prisma implementation of IJobRepository with select optimizations and N+1 prevention

import { db } from "@/lib/db";
import type { IJobRepository, DashboardJob, JobDetailsPayload, JobApplicationWithCandidate } from "@/application/ports/IJobRepository";

export class PrismaJobRepository implements IJobRepository {
  async getJobsForDashboard(): Promise<DashboardJob[]> {
    const jobs = await db.job.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        controlRequired: true,
        salaryMin: true,
        salaryMax: true,
        hideSalary: true,
        status: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      location: j.location,
      controlRequired: j.controlRequired,
      salaryMin: Number(j.salaryMin),
      salaryMax: Number(j.salaryMax),
      hideSalary: j.hideSalary,
      status: j.status,
      applicationsCount: j._count.applications,
    }));
  }

  async getJobDetails(id: string): Promise<JobDetailsPayload | null> {
    const job = await db.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        controlRequired: true,
        location: true,
        experienceMin: true,
        experienceMax: true,
        salaryMin: true,
        salaryMax: true,
        hideSalary: true,
        description: true,
        createdAt: true,
        employer: {
          select: {
            companyName: true,
            industryZone: true,
            address: true,
            isVerified: true,
          },
        },
        screeningQuestions: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            correctIndex: true,
          },
        },
      },
    });

    if (!job || !job.employer) return null;

    return {
      id: job.id,
      title: job.title,
      controlRequired: job.controlRequired,
      location: job.location,
      experienceMin: job.experienceMin,
      experienceMax: job.experienceMax,
      salaryMin: Number(job.salaryMin),
      salaryMax: Number(job.salaryMax),
      hideSalary: job.hideSalary,
      description: job.description,
      createdAt: job.createdAt.toISOString(),
      employer: {
        companyName: job.employer.companyName,
        industryZone: job.employer.industryZone,
        address: job.employer.address,
        isVerified: job.employer.isVerified,
      },
      screeningQuestions: job.screeningQuestions,
    };
  }

  async getJobAndApplications(id: string): Promise<{ job: { id: string; title: string } | null; applications: JobApplicationWithCandidate[] }> {
    const job = await db.job.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!job) {
      return { job: null, applications: [] };
    }

    const dbApps = await db.jobApplication.findMany({
      where: { jobId: id },
      select: {
        id: true,
        score: true,
        status: true,
        createdAt: true,
        candidateProfile: {
          select: {
            id: true,
            candidateType: true,
            governorate: true,
            city: true,
            experienceYears: true,
            expectedSalary: true,
            reliabilityScore: true,
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
        },
      },
      orderBy: [
        { score: "desc" },
        { createdAt: "desc" },
      ],
    });

    const applications: JobApplicationWithCandidate[] = dbApps.map((app) => ({
      id: app.id,
      score: app.score,
      status: app.status,
      createdAt: app.createdAt,
      machinist: {
        id: app.candidateProfile.id,
        name: app.candidateProfile.user.name,
        role: app.candidateProfile.candidateType,
        governorate: app.candidateProfile.governorate,
        city: app.candidateProfile.city,
        experienceYears: app.candidateProfile.experienceYears,
        expectedSalary: Number(app.candidateProfile.expectedSalary),
        reliabilityScore: app.candidateProfile.reliabilityScore,
        preferredControl: app.candidateProfile.machines.map((m) => m.machineType.name),
        specializations: app.candidateProfile.softwares.map((s) => s.software.name),
        phoneNumber: app.candidateProfile.user.phoneNumber ?? "",
      },
    }));

    return { job, applications };
  }

  async findFirstEmployer(): Promise<{ id: string } | null> {
    const employer = await db.employerProfile.findFirst({
      select: { id: true },
    });
    return employer;
  }

  async createDemoEmployer(): Promise<{ id: string }> {
    return db.$transaction(async (tx) => {
      const mockUser = await tx.user.create({
        data: {
          name: "مصنع كريم التجريبي",
          email: `demo-${Date.now()}@hirecnc.eg`,
          phoneNumber: `010${Date.now().toString().slice(-8)}`,
          passwordHash: "$2b$10$dummyhashplaceholder",
          role: "EMPLOYER",
          status: "ACTIVE",
        },
      });

      const employer = await tx.employerProfile.create({
        data: {
          userId: mockUser.id,
          companyName: "مصنع كريم للتشغيل",
          industryZone: "العاشر من رمضان",
          address: "المنطقة الصناعية الثالثة",
          isVerified: true,
        },
      });

      return { id: employer.id };
    });
  }

  async createJob(data: {
    title: string;
    controlRequired: string;
    location: string;
    experienceMin: number;
    experienceMax: number;
    salaryMin: number;
    salaryMax: number;
    hideSalary: boolean;
    description: string;
    employerId: string;
  }): Promise<unknown> {
    return db.job.create({
      data: {
        title: data.title,
        controlRequired: data.controlRequired as import("@prisma/client").ControlType,
        location: data.location,
        experienceMin: data.experienceMin,
        experienceMax: data.experienceMax,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        hideSalary: data.hideSalary,
        description: data.description,
        employerId: data.employerId,
        tenantId: data.employerId,
        status: "ACTIVE",
        screeningQuestions: {
          create: [
            {
              question: "أي من أكواد الـ G-code التالية يُستخدم للتحرك السريع بدون قطع (Rapid Positioning)؟",
              options: ["G00", "G01", "G02", "G03"],
              correctIndex: 0,
            },
            {
              question: "ما هي الحركة الافتراضية لكود G02 في ماكينات الـ CNC؟",
              options: ["حركة خطية", "حركة دائرية مع عقارب الساعة", "حركة دائرية عكس عقارب الساعة", "توقف مؤقت"],
              correctIndex: 1,
            },
            {
              question: "أي رمز مما يلي يُسستخدم في ماكينات الـ CNC لتحديد سرعة دوران عمود الدوران (Spindle Speed)؟",
              options: ["S (سرعة الدوران)", "F (سرعة التغذية)", "T (رقم العدة)", "M (الأوامر المساعدة)"],
              correctIndex: 0,
            },
          ],
        },
      },
    });
  }

  async getActiveJobsForApi(): Promise<unknown[]> {
    return db.job.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        controlRequired: true,
        location: true,
        experienceMin: true,
        experienceMax: true,
        salaryMin: true,
        salaryMax: true,
        hideSalary: true,
        description: true,
        createdAt: true,
        employer: {
          select: {
            companyName: true,
            industryZone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async countActiveJobsByEmployer(employerId: string): Promise<number> {
    return db.job.count({
      where: {
        employerId,
        status: "ACTIVE",
      },
    });
  }
}
