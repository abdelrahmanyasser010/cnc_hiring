// src/app/(dashboard)/talent/page.tsx
// قاعدة بيانات الفنيين والمهندسين المتاحة لأصحاب المصانع للبحث والتصفية والتواصل.

export const dynamic = "force-dynamic";

import React from "react";
import { candidateRepo } from "@/infrastructure/container";
import { AlertCircle } from "lucide-react";
import TalentFilters from "@/components/dashboard/TalentFilters";
import TalentCard from "@/components/dashboard/TalentCard";
import Pagination from "@/components/shared/Pagination";
import { TalentHeader } from "@/components/dashboard/TalentHeader";
import ReferralRequestSection from "@/components/dashboard/ReferralRequestSection";

interface PageProps {
  searchParams: Promise<{
    role?: string;
    industry?: string;
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
  reliabilityScore: number;
  preferredControl: string[];
  specializations: string[];
  machineTypes: string[];
  phoneNumber: string;
};

export default async function TalentPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const role = params.role || "";
  const industry = params.industry || "";
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
      industry: industry || undefined,
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
        industry: "قطع الغيار والتشغيل العام",
        jobTitle: "فني مخرطة وفريزة CNC",
        machinesFreeText: "مخرطة دوسان Fanuc، فريزة 3 محاور",
        skillsSummary: "قراءة رسومات هندسية ومعايرة أدوات القطع",
        preferredShift: "MORNING",
        cvUrl: null,
        governorate: "الشرقية (العاشر من رمضان)",
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
        industry: "الصناعات والمستلزمات الطبية",
        jobTitle: "مهندس برمجة CAM وتشغيل دقيق",
        machinesFreeText: "ماكينات خراطة سويسرية Swiss-type، مركز تشغيل 5 محاور",
        skillsSummary: "برمجة أطراف ومفاصل صناعية بدقة ميكرونية",
        preferredShift: "FLEXIBLE",
        cvUrl: "https://drive.google.com",
        governorate: "الجيزة",
        city: "6 أكتوبر",
        experienceYears: 8,
        expectedSalary: 16500,
        reliabilityScore: 95,
        preferredControl: ["FANUC", "SIEMENS", "HEIDENHAIN"] as string[],
        specializations: ["Mastercam", "SolidWorks"],
        machineTypes: [],
        phoneNumber: "01234567890",
      },
      {
        id: "mock-3",
        name: "سامح إبراهيم عبد العال",
        role: "TECHNICIAN" as const,
        industry: "الإسطمبات والفرم",
        jobTitle: "فني ضبط وتشغيل فريزة CNC إسطمبات حقن",
        machinesFreeText: "فريزة Hartford كنترول هاس، ماكينة سلك وشرارة",
        skillsSummary: "تشغيل صلب معالج وصلد حتى 55 HRC",
        preferredShift: "ROTATING",
        cvUrl: null,
        governorate: "القليوبية (العبور)",
        city: "مدينة العبور",
        experienceYears: 4,
        expectedSalary: 9500,
        reliabilityScore: 92,
        preferredControl: ["HAAS", "FANUC"] as string[],
        specializations: [],
        machineTypes: ["فريزة CNC"],
        phoneNumber: "01123456789",
      },
      {
        id: "mock-4",
        name: "إبراهيم خليل النحاس",
        role: "TECHNICIAN" as const,
        industry: "صناعة الطيران",
        jobTitle: "فني تشغيل معادن خاصة وتيتانيوم",
        machinesFreeText: "مراكز تشغيل متقدمة 4 محاور DMG MORI",
        skillsSummary: "تشغيل سبائك الطيران Inconel و Titanium",
        preferredShift: "EVENING",
        cvUrl: null,
        governorate: "القاهرة",
        city: "حلوان",
        experienceYears: 9,
        expectedSalary: 15000,
        reliabilityScore: 99,
        preferredControl: ["SIEMENS", "HEIDENHAIN"] as string[],
        specializations: [],
        machineTypes: ["فريزة CNC", "مخرطة CNC"],
        phoneNumber: "01098765432",
      },
      {
        id: "mock-5",
        name: "محمود عبد الغني حسن",
        role: "TECHNICIAN" as const,
        industry: "صناعة المسبوكات والأجزاء الثقيلة",
        jobTitle: "فني ضبط مخرطة CNC ورؤوس حفر",
        machinesFreeText: "مخرطة Mazak كنترول فانوك، ماكينة تجويف أفقي",
        skillsSummary: "خراطة صلب سبائكي وفلانشات صمامات بقطر حتى 600 مم",
        preferredShift: "MORNING",
        cvUrl: null,
        governorate: "الإسكندرية (برج العرب)",
        city: "برج العرب الجديدة",
        experienceYears: 5,
        expectedSalary: 11000,
        reliabilityScore: 94,
        preferredControl: ["FANUC"] as string[],
        specializations: [],
        machineTypes: ["مخرطة CNC"],
        phoneNumber: "01033445566",
      },
      {
        id: "mock-6",
        name: "م. كمال الدين الشربيني",
        role: "ENGINEER" as const,
        industry: "صناعة قطع غيار السيارات والمركبات",
        jobTitle: "مهندس تخطيط ومبرمج CAM إسطمبات صاج",
        machinesFreeText: "مركز تشغيل فريزة 5 محاور، PowerMill و SolidCAM",
        skillsSummary: "تصميم وبرمجة مسارات القطع عالية السرعة HSM",
        preferredShift: "FLEXIBLE",
        cvUrl: "https://drive.google.com/cv",
        governorate: "الشرقية (العاشر من رمضان)",
        city: "العاشر من رمضان",
        experienceYears: 7,
        expectedSalary: 17500,
        reliabilityScore: 97,
        preferredControl: ["HEIDENHAIN", "SIEMENS"] as string[],
        specializations: ["PowerMill", "SolidWorks"],
        machineTypes: [],
        phoneNumber: "01199887711",
      },
      {
        id: "mock-7",
        name: "كريم فتحي البحيري",
        role: "TECHNICIAN" as const,
        industry: "الإسطمبات والفرم",
        jobTitle: "فني ماكينات سلك وتآكل بالشرارة Wire EDM",
        machinesNeeded: "ماكينات Sodick سلك وماكينات تفريغ شرارة ZNC",
        machinesFreeText: "ماكينات Sodick سلك وماكينات تفريغ شرارة ZNC",
        skillsSummary: "قطع إسطمبات استيلاد وقطع سلك ميكروني بدقة ±0.005 مم",
        preferredShift: "EVENING",
        cvUrl: null,
        governorate: "المنوفية (قويسنا)",
        city: "قويسنا الصناعية",
        experienceYears: 3,
        expectedSalary: 8500,
        reliabilityScore: 90,
        preferredControl: ["OTHER", "FANUC"] as string[],
        specializations: [],
        machineTypes: ["سلك وتآكل بالشرارة EDM"],
        phoneNumber: "01288776633",
      },
      {
        id: "mock-8",
        name: "وائل سمير رضوان",
        role: "TECHNICIAN" as const,
        industry: "صناعات تشغيل وتشكيل الألواح والصاج",
        jobTitle: "مشغل فايبر ليزر وبلازما قص ألواح",
        machinesFreeText: "فايبر ليزر 12kW، ماكينة ثني درفلة CNC",
        skillsSummary: "قص ألواح استيل حتى 25 مم وضبط غازات النيتروجين والأكسجين",
        preferredShift: "ROTATING",
        cvUrl: null,
        governorate: "المنوفية (مدينة السادات)",
        city: "مدينة السادات",
        experienceYears: 4,
        expectedSalary: 9000,
        reliabilityScore: 91,
        preferredControl: ["OTHER"] as string[],
        specializations: [],
        machineTypes: ["فايبر ليزر وبلازما"],
        phoneNumber: "01077665522",
      },
      {
        id: "mock-9",
        name: "حسن جودة الجمل",
        role: "TECHNICIAN" as const,
        industry: "صناعة الصمامات وتجهيزات خطوط الأنابيب",
        jobTitle: "مشغل ومبرمج مخرطة سويسرية دقيقة Swiss-Type",
        machinesFreeText: "Citizen Cincom L20، مخرطة ستار Star SB-16",
        skillsSummary: "تشغيل مسامير وإبر صمامات وسبائك برونز نحاس",
        preferredShift: "MORNING",
        cvUrl: null,
        governorate: "القاهرة (مدينة بدر)",
        city: "مدينة بدر",
        experienceYears: 5,
        expectedSalary: 12000,
        reliabilityScore: 96,
        preferredControl: ["FANUC", "MITSUBISHI"] as string[],
        specializations: [],
        machineTypes: ["مخرطة CNC"],
        phoneNumber: "01166554433",
      },
      {
        id: "mock-10",
        name: "م. علاء طاهر الصياد",
        role: "ENGINEER" as const,
        industry: "صناعة قطع غيار السيارات والمركبات",
        jobTitle: "مهندس جودة وضبط أبعاد ومعايرة CMM",
        machinesFreeText: "ماكينة قياس إحداثي CMM Zeiss، ميكرومترات بصرية",
        skillsSummary: "فحص تقارير التفاوتات الهندسية GD&T وعينات أولية PPAP",
        preferredShift: "MORNING",
        cvUrl: "https://drive.google.com/cmm-cv",
        governorate: "الجيزة",
        city: "6 أكتوبر",
        experienceYears: 6,
        expectedSalary: 15500,
        reliabilityScore: 98,
        preferredControl: ["OTHER"] as string[],
        specializations: ["Quality Control", "GD&T"],
        machineTypes: [],
        phoneNumber: "01255443322",
      },
      {
        id: "mock-11",
        name: "عبد الرحمن يوسف شلبي",
        role: "TECHNICIAN" as const,
        industry: "قطع الغيار والتشغيل العام",
        jobTitle: "مشغل راوتر CNC خشب وديكورات ألومنيوم",
        machinesFreeText: "راوتر 3 محاور إيطالي Biesse، ماكينة تفريز خشب 4 محاور",
        skillsSummary: "تجهيز ألواح وتشكيل قوالب خشب ومواد مركبة ورخام",
        preferredShift: "FULL_TIME",
        cvUrl: null,
        governorate: "القليوبية (العبور)",
        city: "مدينة العبور",
        experienceYears: 3,
        expectedSalary: 8000,
        reliabilityScore: 89,
        preferredControl: ["OTHER"] as string[],
        specializations: [],
        machineTypes: ["راوتر CNC خشب ورخام"],
        phoneNumber: "01044332211",
      },
      {
        id: "mock-12",
        name: "مصطفى حامد القناوي",
        role: "TECHNICIAN" as const,
        industry: "صناعة المضخات والضواغط",
        jobTitle: "فني تشغيل وضبط فريزة 5 محاور VMC",
        machinesFreeText: "مركز تشغيل Hermle C42، فريزة Mazak Variaxis",
        skillsSummary: "تشغيل مراوح مضخات وريش توربينات بدقة متناهية",
        preferredShift: "ROTATING",
        cvUrl: null,
        governorate: "الجيزة (أبو رواش)",
        city: "أبو رواش الصناعية",
        experienceYears: 6,
        expectedSalary: 13000,
        reliabilityScore: 96,
        preferredControl: ["HEIDENHAIN", "SIEMENS"] as string[],
        specializations: [],
        machineTypes: ["فريزة CNC"],
        phoneNumber: "01133221100",
      },
    ];

    let filtered = allMockCandidates;
    if (role) {
      filtered = filtered.filter(c => c.role === role);
    }
    if (industry) {
      filtered = filtered.filter(c => c.industry === industry);
    }
    if (governorate) {
      filtered = filtered.filter(c => c.governorate.includes(governorate));
    }
    if (control) {
      filtered = filtered.filter(c => c.preferredControl.includes(control));
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
        (c.machinesFreeText && c.machinesFreeText.toLowerCase().includes(q))
      );
    }

    totalCount = filtered.length;
    totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    candidates = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* رأس الصفحة الديناميكي (عربي / إنجليزي) */}
      <TalentHeader />

      {/* خدمة طلب ترشيح كفاءة مخصصة من إدارة المنصة */}
      <ReferralRequestSection />


      {/* مكون البحث والفلاتر */}
      <TalentFilters
        currentRole={role}
        currentIndustry={industry}
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
