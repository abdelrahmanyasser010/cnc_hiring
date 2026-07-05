// src/application/ports/ICandidateRepository.ts
// Port: Candidate data access contracts

export interface CandidateProfileRecord {
  id: string;
  isAvailable: boolean;
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
    governorate?: string;
    city?: string;
    machineTypes?: string[];
    specializations?: string[];
  }, skip: number, take: number): Promise<{ candidates: CandidateSearchResult[]; totalCount: number }>;
  findPhoneNumberById(candidateId: string): Promise<string | null>;
}
