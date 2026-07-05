// src/app/(dashboard)/talent/page.tsx
// قاعدة بيانات الفنيين والمهندسين المتاحة لأصحاب المصانع للبحث والتصفية والتواصل.

export const dynamic = "force-dynamic";

import React from "react";
import { candidateRepo } from "@/infrastructure/container";
import { AlertCircle, Users } from "lucide-react";
import TalentFilters from "@/components/dashboard/TalentFilters";
import TalentCard from "@/components/dashboard/TalentCard";
import Pagination from "@/components/shared/Pagination";
import { AR_DICTIONARY } from "@/lib/dictionary/ar";

const MOCK_DATE = new Date("2026-06-26T12:00:00Z");

interface PageProps {
  searchParams: Promise<{
    role?: string;
    governorate?: string;
    control?: string;
    query?: string;
    page?: string;
  }>;
}

export type CandidateData = {
  id: string;
  name: string | null;
  role: "TECHNICIAN" | "ENGINEER";
  governorate: string;
  city: string;
  experienceYears: number;
  expectedSalary: number;
  reliabilityScore: number;
  preferredControl: string[];
  specializations: string[];
  machineTypes: string[];
  phoneNumber: string;
};

export default async function TalentPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const role = params.role || "";
  const governorate = params.governorate || "";
  const control = params.control || "";
  const query = params.query || "";
  const currentPage = parseInt(params.page || "1", 10);
  const ITEMS_PER_PAGE = 6;

  let candidates: CandidateData[] = [];
  let totalCount = 0;
  let totalPages = 0;
  let isMockData = false;

  try {
    const result = await candidateRepo.searchCandidates({
      candidateType: (role === "TECHNICIAN" || role === "ENGINEER") ? role : undefined,
      governorate: governorate || undefined,
      control: control || undefined,
      query: query || undefined,
    }, (currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);

    candidates = result.candidates;
    totalCount = result.totalCount;
    totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  } catch (error) {
    console.warn("Database is unreachable, falling back to mock candidates.", error);
    isMockData = true;

    // بيانات تجريبية متكاملة لبيئة التطوير
    const allMockCandidates = [
      {
        id: "mock-1",
        name: "أحمد مرسي الشرقاوي",
        role: "TECHNICIAN" as const,
        governorate: "الشرقية",
        city: "العاشر من رمضان",
        experienceYears: 6,
        expectedSalary: 10500,
        reliabilityScore: 98,
        preferredControl: ["FANUC", "HAAS"] as string[],
        specializations: [],
        machineTypes: ["مخرطة CNC", "فريزة CNC"],
        phoneNumber: "01012345678",
      },
      {
        id: "mock-2",
        name: "م. حسام محمود الجيزاوي",
        role: "ENGINEER" as const,
        governorate: "الجيزة",
        city: "6 أكتوبر",
        experienceYears: 8,
        expectedSalary: 14500,
        reliabilityScore: 95,
        preferredControl: ["FANUC", "SIEMENS", "HEIDENHAIN"] as string[],
        specializations: ["Mastercam", "SolidWorks"],
        machineTypes: [],
        phoneNumber: "01234567890",
      },
      {
        id: "mock-3",
        name: "شريف جلال البساتيني",
        role: "TECHNICIAN" as const,
        governorate: "القاهرة",
        city: "البساتين",
        experienceYears: 4,
        expectedSalary: 8500,
        reliabilityScore: 88,
        preferredControl: ["FANUC"] as string[],
        specializations: [],
        machineTypes: ["فريزة CNC"],
        phoneNumber: "01122334455",
      },
      {
        id: "mock-4",
        name: "م. محمود عبد الوهاب",
        role: "ENGINEER" as const,
        governorate: "القاهرة",
        city: "مصر الجديدة",
        experienceYears: 5,
        expectedSalary: 12000,
        reliabilityScore: 97,
        preferredControl: ["SIEMENS", "HAAS"] as string[],
        specializations: ["AutoCAD", "Fusion 360", "SolidWorks"],
        machineTypes: [],
        phoneNumber: "01555667788",
      },
      {
        id: "mock-5",
        name: "سعيد علي حسن",
        role: "TECHNICIAN" as const,
        governorate: "الإسكندرية",
        city: "برج العرب",
        experienceYears: 10,
        expectedSalary: 13000,
        reliabilityScore: 99,
        preferredControl: ["FANUC", "MAZATROL"] as string[],
        specializations: [],
        machineTypes: ["مخرطة CNC", "راوتر ليزر/بلازما"],
        phoneNumber: "01009988776",
      },
      {
        id: "mock-6",
        name: "ياسر كمال المنوفي",
        role: "TECHNICIAN" as const,
        governorate: "المنوفية",
        city: "السادات",
        experienceYears: 3,
        expectedSalary: 7500,
        reliabilityScore: 82,
        preferredControl: ["HAAS"] as string[],
        specializations: [],
        machineTypes: ["ثناية CNC", "مقص CNC"],
        phoneNumber: "01223344556",
      }
    ].map(c => ({
      ...c,
      phoneNumber: c.phoneNumber.length >= 7 ? `${c.phoneNumber.slice(0, 3)}••••${c.phoneNumber.slice(-4)}` : c.phoneNumber,
      isAvailable: true,
      createdAt: MOCK_DATE,
      updatedAt: MOCK_DATE,
    }));

    // تصفية البيانات التجريبية محلياً
    let filteredMock = allMockCandidates;

    if (role) {
      filteredMock = filteredMock.filter((c) => c.role === role);
    }
    if (governorate) {
      filteredMock = filteredMock.filter((c) => c.governorate === governorate);
    }
    if (control) {
      filteredMock = filteredMock.filter((c) => c.preferredControl.includes(control));
    }
    if (query) {
      const q = query.toLowerCase();
      filteredMock = filteredMock.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.governorate.toLowerCase().includes(q)
      );
    }

    totalCount = filteredMock.length;
    totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    candidates = filteredMock.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }

  return (
    <div dir="rtl" className="space-y-8 text-right">
      
      {/* رأس الصفحة والمطور */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <span>{AR_DICTIONARY.talent.pageTitle}</span>
          </h1>
          <p className="text-sm text-foreground/60">
            {AR_DICTIONARY.talent.pageSubtitle}
          </p>
        </div>
      </div>

      {/* تنبيه بيئة التطوير المحلية */}
      {isMockData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
          <span>⚙️ تنبيه بيئة التطوير: تم استخدام بيانات تجريبية لعدم إمكانية الاتصال بقاعدة بيانات PostgreSQL حالياً.</span>
        </div>
      )}

      {/* مكون البحث والفلاتر */}
      <TalentFilters
        currentRole={role}
        currentGovernorate={governorate}
        currentControl={control}
        currentQuery={query}
      />

      {/* إجمالي النتائج */}
      <div className="text-xs font-semibold text-foreground/50">
        تم العثور على {totalCount.toLocaleString("ar-EG")} من الكوادر المتاحة
      </div>

      {/* شبكة عرض كروت الكوادر */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => {
            const serializableCandidate = {
              ...candidate,
              name: candidate.name || "فني مجهول",
              expectedSalary: Number(candidate.expectedSalary)
            };
            return (
              <TalentCard key={candidate.id} candidate={serializableCandidate} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground/80 mb-1">لا توجد نتائج تطابق فلاتر البحث</h3>
          <p className="text-sm text-foreground/50">
            حاول تغيير الفلاتر المحددة أو إعادة التعيين للوصول لكوادر أخرى.
          </p>
        </div>
      )}

      {/* أداة ترقيم الصفحات */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

    </div>
  );
}
