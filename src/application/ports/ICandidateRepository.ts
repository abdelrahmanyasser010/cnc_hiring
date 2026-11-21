// src/application/ports/ICandidateRepository.ts
// Port: Candidate data access contracts

export interface CandidateProfileRecord {
  id: string;
  isAvailable: boolean;
  industry?: string | null;
  jobTitle?: string | null;
  machinesFreeText?: string | null;
  skillsSummary?: string | null;
  preferredShift?: string | null;
  cvUrl?: string | null;
  governorate: string;
  city: string;
  experienceYears: number;
  expectedSalary: number;
  user: {
    name: string | null;
    phoneNumber: string | null;
    email: string;
  };
}

export interface CandidateSearchResult {
  id: string;
  candidateType: "TECHNICIAN" | "ENGINEER";
  industry?: string | null;
  jobTitle?: string | null;
  machinesFreeText?: string | null;
  skillsSummary?: string | null;
  preferredShift?: string | null;
  cvUrl?: string | null;
  governorate: string;
  city: string;
  experienceYears: number;
  expectedSalary: number;
  isAvailable: boolean;
  user: {
    name: string | null;
  };
}

export interface ICandidateRepository {
  findProfileByUserId(userId: string): Promise<CandidateProfileRecord | null>;
  updateAvailability(profileId: string, isAvailable: boolean): Promise<void>;
  getRegistrationLookups(): Promise<{ machines: string[]; softwares: string[] }>;
  searchCandidates(filters: {
    candidateType?: "TECHNICIAN" | "ENGINEER";
    industry?: string;
    governorate?: string;
    city?: string;
    machineTypes?: string[];
    specializations?: string[];
    query?: string;
    control?: string;
  }, skip: number, take: number): Promise<{ candidates: CandidateSearchResult[]; totalCount: number }>;
  findPhoneNumberById(candidateId: string): Promise<string | null>;
}
