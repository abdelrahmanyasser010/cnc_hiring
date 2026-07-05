// src/application/ports/IJobRepository.ts
// Port: Job data access contract

export interface DashboardJob {
  id: string;
  title: string;
  location: string;
  controlRequired: string;
  salaryMin: number;
  salaryMax: number;
  hideSalary: boolean;
  status: string;
  applicationsCount: number;
}

export interface JobDetailsPayload {
  id: string;
  title: string;
  controlRequired: string;
  location: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  hideSalary: boolean;
  description: string | null;
  createdAt: string;
  employer: {
    companyName: string;
    industryZone: string;
    address: string;
    isVerified: boolean;
  };
  screeningQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface JobApplicationWithCandidate {
  id: string;
  score: number | null;
  status: string;
  createdAt: Date;
  machinist: {
    id: string;
    name: string | null;
    role: string;
    governorate: string;
    city: string;
    experienceYears: number;
    expectedSalary: number;
    reliabilityScore: number;
    preferredControl: string[];
    specializations: string[];
    phoneNumber: string;
  };
}

export interface IJobRepository {
  getJobsForDashboard(): Promise<DashboardJob[]>;
  getJobDetails(id: string): Promise<JobDetailsPayload | null>;
  getJobAndApplications(id: string): Promise<{ job: { id: string; title: string } | null; applications: JobApplicationWithCandidate[] }>;
  findFirstEmployer(): Promise<{ id: string } | null>;
  createDemoEmployer(): Promise<{ id: string }>;
  createJob(data: {
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
  }): Promise<unknown>;
  getActiveJobsForApi(): Promise<unknown[]>;
  countActiveJobsByEmployer(employerId: string): Promise<number>;
}
