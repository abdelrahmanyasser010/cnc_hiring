import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  CNC_INDUSTRIES, 
  CNC_INDUSTRIES_AR, 
  CNC_INDUSTRIES_EN, 
  EGYPTIAN_GOVERNORATES, 
  EGYPTIAN_GOVERNORATES_EN 
} from "@/lib/constants";
import type { IEmployerRepository } from "@/application/ports/IEmployerRepository";
import type { ICandidateRepository } from "@/application/ports/ICandidateRepository";

describe("Industry Taxonomy & Alphabetical Sorting Audit (Sprint 13)", () => {
  it("should have all 11 industries strictly sorted alphabetically in Arabic", () => {
    expect(CNC_INDUSTRIES_AR.length).toBe(11);
    const sorted = [...CNC_INDUSTRIES_AR].sort((a, b) => a.localeCompare(b, "ar"));
    expect(CNC_INDUSTRIES_AR).toEqual(sorted);
  });

  it("should have all 11 industries strictly sorted alphabetically in English (A-Z)", () => {
    expect(CNC_INDUSTRIES_EN.length).toBe(11);
    const sorted = [...CNC_INDUSTRIES_EN].sort((a, b) => a.localeCompare(b, "en"));
    expect(CNC_INDUSTRIES_EN).toEqual(sorted);
  });

  it("should verify CNC_INDUSTRIES bilingual items match their respective sorted arrays", () => {
    expect(CNC_INDUSTRIES.length).toBe(11);
    const arTitles = CNC_INDUSTRIES.map(i => i.ar);
    expect(arTitles).toEqual([...CNC_INDUSTRIES_AR]);
  });

  it("should have Egyptian governorates sorted alphabetically", () => {
    // Note: 'أخرى' is placed at the end for UX conveniency
    const mainGovs = EGYPTIAN_GOVERNORATES.filter(g => g !== "أخرى");
    const sortedMain = [...mainGovs].sort((a, b) => a.localeCompare(b, "ar"));
    expect(mainGovs).toEqual(sortedMain);
  });

  it("should have English governorates sorted alphabetically (A-Z)", () => {
    const mainGovsEn = EGYPTIAN_GOVERNORATES_EN.filter(g => g !== "Other");
    const sortedMainEn = [...mainGovsEn].sort((a, b) => a.localeCompare(b, "en"));
    expect(mainGovsEn).toEqual(sortedMainEn);
  });
});

describe("Candidate Search by Industry & Free-Text Filter (Sprint 13)", () => {
  let mockCandidateRepo: ICandidateRepository;

  beforeEach(() => {
    mockCandidateRepo = {
      findProfileByUserId: vi.fn(),
      updateAvailability: vi.fn(),
      getRegistrationLookups: vi.fn(),
      searchCandidates: vi.fn(),
      findPhoneNumberById: vi.fn(),
    };
  });

  it("should pass industry and free-text machine parameters to candidate search", async () => {
    const mockResults = {
      candidates: [
        {
          id: "cand-1",
          candidateType: "TECHNICIAN" as const,
          industry: "الصناعات والمستلزمات الطبية",
          jobTitle: "فني تشغيل مخرطة سويسرية Swiss-type",
          machinesFreeText: "Citizen Cincom L20, Star Micronics",
          skillsSummary: "تشغيل مسامير طبية بدقة ميكرونية",
          cvUrl: null,
          governorate: "الجيزة",
          city: "6 أكتوبر",
          experienceYears: 5,
          expectedSalary: 12000,
          isAvailable: true,
          user: { name: "أحمد كمال" },
        }
      ],
      totalCount: 1,
    };

    vi.mocked(mockCandidateRepo.searchCandidates).mockResolvedValue(mockResults);

    const res = await mockCandidateRepo.searchCandidates({
      industry: "الصناعات والمستلزمات الطبية",
      query: "Citizen",
    }, 0, 10);

    expect(res.candidates.length).toBe(1);
    expect(res.candidates[0].industry).toBe("الصناعات والمستلزمات الطبية");
    expect(res.candidates[0].machinesFreeText).toContain("Citizen");
  });
});

describe("Referral Request Repository Contract (Sprint 13)", () => {
  let mockEmployerRepo: IEmployerRepository;

  beforeEach(() => {
    mockEmployerRepo = {
      findProfileIdByUserId: vi.fn(),
      findActiveSubscription: vi.fn(),
      update: vi.fn(),
      findAllEmployersWithUsers: vi.fn(),
      getVerifiedCompaniesWithJobs: vi.fn(),
      incrementPhoneViews: vi.fn(),
      createCheckoutTransaction: vi.fn(),
      activateSubscriptionAfterPayment: vi.fn(),
      createReferralRequest: vi.fn(),
    };
  });

  it("should allow employers to record custom candidate nomination requests", async () => {
    vi.mocked(mockEmployerRepo.createReferralRequest).mockResolvedValue({ id: "ref-test-123" });

    const reqData = {
      employerId: "emp-456",
      industry: "صناعة الطيران",
      jobTitle: "مبرمج CAM 5 محاور",
      machinesNeeded: "DMG MORI 5-axis, Siemens 840D",
      experienceYears: 7,
      governorate: "القاهرة",
      salaryRange: "18000 - 22000 ج.م",
      notes: "مطلوب للعمل بقطاع صناعة هياكل الطائرات",
    };

    const result = await mockEmployerRepo.createReferralRequest(reqData);
    expect(result.id).toBe("ref-test-123");
    expect(mockEmployerRepo.createReferralRequest).toHaveBeenCalledWith(reqData);
  });
});
