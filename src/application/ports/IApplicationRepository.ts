// src/application/ports/IApplicationRepository.ts
// Port: Job Application & Candidate Profile data access contract

import type { ApplicationStatus } from "@/domain/types";

export interface ApplicationDetails {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  job: {
    id: string;
    title: string;
    location?: string | null;
    employer: {
      userId: string;
      companyName: string;
    };
  };
  candidateProfile: {
    id: string;
    user: {
      name?: string | null;
      email: string;
      phoneNumber?: string | null;
    };
  };
}

export interface IApplicationRepository {
  findCandidateProfileIdByUserId(userId: string): Promise<{ id: string } | null>;
  findJobById(jobId: string): Promise<{ id: string; title: string; employer: { userId: string; companyName: string; user: { phoneNumber?: string | null } } } | null>;
  findApplicationByJobAndCandidate(jobId: string, candidateProfileId: string): Promise<{ id: string } | null>;
  findScreeningQuestionsByJobId(jobId: string): Promise<{ id: string; correctIndex: number }[]>;
  createApplication(data: {
    jobId: string;
    candidateProfileId: string;
    status: ApplicationStatus;
    score: number | null;
  }): Promise<{ id: string }>;
  findApplicationDetailsById(id: string): Promise<ApplicationDetails | null>;
  updateApplication(id: string, data: {
    status?: ApplicationStatus;
    interviewDate?: Date;
    interviewLocation?: string;
    notes?: string;
  }): Promise<void>;
}
