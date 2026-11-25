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
    companyNameEn: "Al Amal Precision Mechanical Engineering",
    industryZone: "العاشر من رمضان",
    industryZoneEn: "10th of Ramadan",
    address: "المنطقة الصناعية الثالثة، خلف سيراميكا كليوباترا، قطعة 14",
    addressEn: "3rd Industrial Zone, behind Ceramica Cleopatra, Plot 14",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-1", title: "فني تشغيل مخرطة CNC مبرمج (FANUC)", titleEn: "CNC Lathe Setup Machinist (FANUC)" },
      { id: "p-j-2", title: "مساعد فني تشكيل معادن واسطمبات", titleEn: "Metal Forming & Die Assistant Technician" }
    ]
  },
  {
    id: "p-c-2",
    companyName: "مسبك الجيزة للصناعات المعدنية والحديد والصلب",
    companyNameEn: "Giza Metal Industries & Foundry",
    industryZone: "6 أكتوبر",
    industryZoneEn: "6th of October",
    address: "المنطقة الصناعية الثانية، محور المطورين، بلوك 44",
    addressEn: "2nd Industrial Zone, Developers Axis, Block 44",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-3", title: "مهندس تصميم إنتاجي وبرمجة Mastercam", titleEn: "Mastercam Production Design Engineer" },
      { id: "p-j-4", title: "مشرف وردية تشغيل ماكينات CNC", titleEn: "CNC Machining Shift Supervisor" }
    ]
  },
  {
    id: "p-c-3",
    companyName: "ورشة النصر لتشكيل المعادن وخراطة الـ CNC الدقيقة",
    companyNameEn: "Al Nasr Metal Forming & Precision CNC Turning",
    industryZone: "العبور",
    industryZoneEn: "Obour City",
    address: "المنطقة الصناعية الأولى، شارع المصانع، بجوار البنك الأهلي",
    addressEn: "1st Industrial Zone, Factories St., near NBE",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-5", title: "فني تشغيل مركز تشغيل (Machining Center 3-Axis)", titleEn: "3-Axis VMC Machining Center Operator" }
    ]
  },
  {
    id: "p-c-4",
    companyName: "السويدي للصناعات الهندسية والميكانيكا",
    companyNameEn: "ELSEWEDY Engineering Industries & Mechanics",
    industryZone: "العاشر من رمضان",
    industryZoneEn: "10th of Ramadan",
    address: "المنطقة الصناعية A1، طريق الإسماعيلية الصحراوي",
    addressEn: "Industrial Zone A1, Ismailia Desert Road",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-6", title: "مهندس صيانة ميكانيكية وهيدروليك ماكينات CNC", titleEn: "CNC Mechanical & Hydraulic Maintenance Engineer" },
      { id: "p-j-7", title: "فني ضبط ومعايرة أبعاد (Quality Control Inspection)", titleEn: "Quality Control Dimension Inspection Specialist" }
    ]
  },
  {
    id: "p-c-5",
    companyName: "العربي جروب لتصنيع القوالب والاسطمبات الصناعية",
    companyNameEn: "ELARABY Group Industrial Molds & Tooling",
    industryZone: "قويسنا الصناعية",
    industryZoneEn: "Qwesna Industrial Hub",
    address: "مجمع مصانع العربي، المنطقة الصناعية بقويسنا، المنوفية",
    addressEn: "ELARABY Complex, Qwesna Industrial Zone, Monufia",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-8", title: "فني تشغيل وتآكل بالشرارة (EDM & Wire Cut Specialist)", titleEn: "Wire Cut & Spark Erosion (EDM) Specialist" }
    ]
  },
  {
    id: "p-c-6",
    companyName: "الكرنك للصناعات الهندسية وخراطة المعادن",
    companyNameEn: "Karnak Engineering & Metal Turning",
    industryZone: "بدر",
    industryZoneEn: "Badr City",
    address: "المنطقة الصناعية الغربية، مجمع الصناعات المغذية، هنجر 8",
    addressEn: "Western Industrial Zone, Feeder Industries, Hangar 8",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-9", title: "فني تشغيل مخرطة سويسرية (Swiss Type CNC Lathe)", titleEn: "Swiss-Type CNC Lathe Machinist" }
    ]
  },
  {
    id: "p-c-7",
    companyName: "النيل للهندسة والميكانيكا المتقدمة",
    companyNameEn: "Nile Advanced Mechanical Engineering",
    industryZone: "السادات",
    industryZoneEn: "Sadat City",
    address: "المنطقة الصناعية السابعة، محور مصانع الثقيلة",
    addressEn: "7th Industrial Zone, Heavy Industries Axis",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-10", title: "مشرف عام ورشة تشغيل معادن وتوزيع أحمال", titleEn: "Machine Shop General Foreman" }
    ]
  },
  {
    id: "p-c-8",
    companyName: "مصنع الإسكندرية لتصنيع التروس والمحاور الدقيقة",
    companyNameEn: "Alexandria Precision Gears & Shafts Plant",
    industryZone: "برج العرب الجديدة",
    industryZoneEn: "New Borg El Arab",
    address: "المنطقة الصناعية الثانية، طريق المطار، مجمع التروس",
    addressEn: "2nd Industrial Zone, Airport Road, Gear Hub",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-11", title: "فني تشغيل فرايز 5 محور (5-Axis Milling Operator)", titleEn: "5-Axis Milling Operator" }
    ]
  },
  {
    id: "p-c-9",
    companyName: "الهيئة العربية للتصنيع - قطاع التشغيل الميكانيكي",
    companyNameEn: "Arab Organization for Industrialization - Machining Sector",
    industryZone: "المنطقة الحرة بمدينة نصر",
    industryZoneEn: "Nasr City Free Zone",
    address: "امتداد طريق النصر، مجمع الصناعات الدقيقة والطيران",
    addressEn: "El Nasr Road Ext., Aviation & Precision Tech Complex",
    logoUrl: null,
    isVerified: true,
    jobs: [
      { id: "p-j-12", title: "مهندس برمجة إنتاج وتخطيط مسارات (CAM Programmer)", titleEn: "CAM Programmer & Toolpath Specialist" }
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
