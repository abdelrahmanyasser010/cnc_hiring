// src/application/ports/IDashboardRepository.ts
// Port: Dashboard metrics and activities data access contract

export interface AdminStatsPayload {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  pendingVerifications: number;
  activities: {
    id: string;
    user: string | null;
    role: string;
    action: string;
    createdAt: Date;
  }[];
}

export interface EmployerStatsPayload {
  companyName: string;
  isVerified: boolean;
  activeJobs: number;
  totalApplications: number;
  pendingInterviews: number;
  activities: {
    id: string;
    name: string | null;
    jobTitle: string;
    experience: string;
    score: string;
    status: string;
    createdAt: Date;
  }[];
  subscription?: {
    planName: string;
    maxActiveJobs: number;
    activeJobsCount: number;
    maxPhoneViews: number;
    phoneViewsUsed: number;
    isActive: boolean;
    endDate: Date;
  } | null;
}

export interface IDashboardRepository {
  getAdminStats(): Promise<AdminStatsPayload>;
  getEmployerStats(userId: string): Promise<EmployerStatsPayload>;
}
