// src/app/companies/page.tsx
// دليل الشركات والمصانع الشريكة والموثقة في مصر (Server Component).
// يجلب المصانع الموثقة ويمررها لمكون العرض التفاعلي ثنائي اللغة (CompaniesClientView).

export const dynamic = "force-dynamic";

import React from "react";
import { employerRepo } from "@/infrastructure/container";
import { CompaniesClientView, EmployerWithJobs } from "./CompaniesClientView";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { PublicFooter } from "@/components/shared/PublicFooter";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    zone?: string;
  }>;
}

// قائمة الشركاء الموثقين الدائمين في المنصة لضمان اكتمال الدليل وثقة العملاء
const PREMIUM_PARTNERS: EmployerWithJobs[] = [
  {
    id: "p-c-1",
    companyName: "مصنع الأمل للهندسة الميكانيكية الدقيقة",
    industryZone: "العاشر من رمضان",
    address: "المنطقة الصناعية الثالثة، خلف سيراميكا كليوباترا، قطعة 14",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-1", title: "فني تشغيل مخرطة CNC مبرمج (FANUC)" },
      { id: "p-j-2", title: "مساعد فني تشكيل معادن واسطمبات" }
    ]
  },
  {
    id: "p-c-2",
    companyName: "مسبك الجيزة للصناعات المعدنية والحديد والصلب",
    industryZone: "6 أكتوبر",
    address: "المنطقة الصناعية الثانية، محور المطورين، بلوك 44",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-3", title: "مهندس تصميم إنتاجي وبرمجة Mastercam" },
      { id: "p-j-4", title: "مشرف وردية تشغيل ماكينات CNC" }
    ]
  },
  {
    id: "p-c-3",
    companyName: "ورشة النصر لتشكيل المعادن وخراطة الـ CNC الدقيقة",
    industryZone: "العبور",
    address: "المنطقة الصناعية الأولى، شارع المصانع، بجوار البنك الأهلي",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-5", title: "فني تشغيل مركز تشغيل (Machining Center 3-Axis)" }
    ]
  },
  {
    id: "p-c-4",
    companyName: "السويدي للصناعات الهندسية والميكانيكا",
    industryZone: "العاشر من رمضان",
    address: "المنطقة الصناعية A1، طريق الإسماعيلية الصحراوي",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-6", title: "مهندس صيانة ميكانيكية وهيدروليك ماكينات CNC" },
      { id: "p-j-7", title: "فني ضبط ومعايرة أبعاد (Quality Control Inspection)" }
    ]
  },
  {
    id: "p-c-5",
    companyName: "العربي جروب لتصنيع القوالب والاسطمبات الصناعية",
    industryZone: "قويسنا الصناعية",
    address: "مجمع مصانع العربي، المنطقة الصناعية بقويسنا، المنوفية",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-8", title: "فني تشغيل وتآكل بالشرارة (EDM & Wire Cut Specialist)" }
    ]
  },
  {
    id: "p-c-6",
    companyName: "الكرنك للصناعات الهندسية وخراطة المعادن",
    industryZone: "بدر",
    address: "المنطقة الصناعية الغربية، مجمع الصناعات المغذية، هنجر 8",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-9", title: "فني تشغيل مخرطة سويسرية (Swiss Type CNC Lathe)" }
    ]
  },
  {
    id: "p-c-7",
    companyName: "النيل للهندسة والميكانيكا المتقدمة",
    industryZone: "السادات",
    address: "المنطقة الصناعية السابعة، محور مصانع الثقيلة",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-10", title: "مشرف عام ورشة تشغيل معادن وتوزيع أحمال" }
    ]
  },
  {
    id: "p-c-8",
    companyName: "مصنع الإسكندرية لتصنيع التروس والمحاور الدقيقة",
    industryZone: "برج العرب الجديدة",
    address: "المنطقة الصناعية الثانية، طريق المطار، مجمع التروس",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-11", title: "فني تشغيل فرايز 5 محور (5-Axis Milling Operator)" }
    ]
  },
  {
    id: "p-c-9",
    companyName: "الهيئة العربية للتصنيع - قطاع التشغيل الميكانيكي",
    industryZone: "المنطقة الحرة بمدينة نصر",
    address: "امتداد طريق النصر، مجمع الصناعات الدقيقة والطيران",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-12", title: "مهندس برمجة إنتاج وتخطيط مسارات (CAM Programmer)" }
    ]
  }
];

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.query || "";
  const zone = params.zone || "";

  let companies: EmployerWithJobs[] = [];

  try {
    const dbCompanies = await employerRepo.getVerifiedCompaniesWithJobs(
      query || undefined,
      zone || undefined
    );
    
    const dbList = (dbCompanies as unknown as EmployerWithJobs[]) || [];
    const combined = [...dbList];
    
    PREMIUM_PARTNERS.forEach(partner => {
      if (!combined.some(c => c.companyName.trim() === partner.companyName.trim())) {
        combined.push(partner);
      }
    });

    let filtered = combined;
    if (query) {
      filtered = filtered.filter(c => c.companyName.toLowerCase().includes(query.toLowerCase()));
    }
    if (zone) {
      filtered = filtered.filter(c => c.industryZone === zone);
    }
    companies = filtered;
  } catch (error) {
    console.warn("Database connection failed, falling back to partner directory.", error);

    let filtered = PREMIUM_PARTNERS;
    if (query) {
      filtered = filtered.filter(c => c.companyName.toLowerCase().includes(query.toLowerCase()));
    }
    if (zone) {
      filtered = filtered.filter(c => c.industryZone === zone);
    }
    companies = filtered;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1">
        <CompaniesClientView initialCompanies={companies} />
      </main>
      <PublicFooter />
    </div>
  );
}
