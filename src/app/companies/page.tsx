// src/app/companies/page.tsx
// دليل الشركات والمصانع الشريكة والموثقة في مصر (Server Component).
// يعرض المصانع الموثقة فقط وقائمة وظائفها النشطة مع فلاتر البحث حسب المنطقة أو الاسم.

export const dynamic = "force-dynamic";

import { employerRepo } from "@/infrastructure/container";
import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Briefcase, CheckCircle, ArrowRight, Search, AlertCircle } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    zone?: string;
  }>;
}

type EmployerWithJobs = {
  id: string;
  companyName: string;
  industryZone: string;
  address: string;
  logoUrl: string | null;
  isVerified: boolean;
  jobs: {
    id: string;
    title: string;
  }[];
};

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.query || "";
  const zone = params.zone || "";

  let companies: EmployerWithJobs[] = [];
  let isMockData = false;

  try {
    const dbCompanies = await employerRepo.getVerifiedCompaniesWithJobs(
      query || undefined,
      zone || undefined
    );
    companies = dbCompanies as unknown as EmployerWithJobs[];
  } catch (error) {
    console.warn("Database connection failed, falling back to mock company directory.", error);
    isMockData = true;

    // دليل شركات تجريبي لبيئة التطوير
    const allMockCompanies = [
      {
        id: "mock-c-1",
        companyName: "مصنع الأمل للهندسة الميكانيكية",
        industryZone: "العاشر من رمضان",
        address: "المنطقة الصناعية الثالثة، خلف السلاب",
        logoUrl: null,
        isVerified: true,
        jobs: [
          { id: "mock-j-1", title: "فني تشغيل مخرطة CNC مبرمج" },
          { id: "mock-j-2", title: "مساعد فني تشكيل معادن" }
        ]
      },
      {
        id: "mock-c-2",
        companyName: "مسبك الجيزة للحديد والصلب",
        industryZone: "6 أكتوبر",
        address: "المنطقة الصناعية الثانية، بلوك 4",
        logoUrl: null,
        isVerified: true,
        jobs: [
          { id: "mock-j-3", title: "مهندس تصميم إنتاجي CNC" }
        ]
      },
      {
        id: "mock-c-3",
        companyName: "ورشة النصر لتشكيل المعادن وخراطة الـ CNC",
        industryZone: "العبور",
        address: "المنطقة الصناعية الأولى، بجوار البنك الأهلي",
        logoUrl: null,
        isVerified: true,
        jobs: []
      }
    ];

    let filtered = allMockCompanies;
    if (query) {
      filtered = filtered.filter(c => c.companyName.toLowerCase().includes(query.toLowerCase()));
    }
    if (zone) {
      filtered = filtered.filter(c => c.industryZone === zone);
    }
    companies = filtered;
  }

  // الحصول على الأحرف الأولى للاسم كشعار بديل
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0] ? parts[0][0] : ""}${parts[1] ? parts[1][0] : ""}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950/40 text-right py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* 1. زر الرجوع ورأس الصفحة */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold text-foreground/60 hover:text-primary transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرجوع للرئيسية</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-black text-foreground/95 flex items-center gap-2 mt-2">
              <Building2 className="w-8 h-8 text-primary" />
              <span>دليل الشركات والمصانع الشريكة</span>
            </h1>
            <p className="text-sm text-foreground/50">
              استكشف شركاء التوظيف المعتمدين والموثقين (Verified) في المدن والمناطق الصناعية بمصر.
            </p>
          </div>
        </div>

        {/* تنبيه بيئة التطوير */}
        {isMockData && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
            <span>⚙️ تنبيه بيئة التطوير: تم استخدام قائمة شركات تجريبية لعدم إمكانية الاتصال بقاعدة بيانات PostgreSQL حالياً.</span>
          </div>
        )}

        {/* 2. شريط البحث السريع والفلترة (تمثيل مرئي تفاعلي) */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <form className="flex-1 flex items-center gap-2 bg-secondary/5 border border-border px-3 py-2 rounded-xl focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              name="query"
              defaultValue={query}
              placeholder="ابحث باسم المصنع أو الشركة..." 
              className="bg-transparent border-none text-sm w-full focus:outline-none focus:ring-0 text-right"
            />
          </form>
          
          <div className="flex gap-2">
            <select
              name="zone"
              defaultValue={zone}
              className="px-4 py-2 border border-border bg-card rounded-xl text-xs font-semibold hover:bg-secondary/5 transition-all focus:outline-none appearance-none pr-8 relative text-right"
            >
              <option value="">كل المناطق الصناعية</option>
              <option value="العاشر من رمضان">العاشر من رمضان</option>
              <option value="6 أكتوبر">6 أكتوبر</option>
              <option value="العبور">العبور</option>
              <option value="السادات">السادات</option>
            </select>
            
            <button className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer">
              تصفية
            </button>
          </div>
        </div>

        {/* 3. شبكة عرض المصانع الموثقة */}
        {companies.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-xl mx-auto shadow-sm space-y-3">
            <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto" />
            <h3 className="text-lg font-bold text-foreground/80">لا توجد منشآت تطابق البحث</h3>
            <p className="text-sm text-foreground/50">
              يرجى تعديل خيارات البحث أو كتابة كلمة مفتاحية أخرى في حقل التصفية.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div 
                key={company.id} 
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between gap-6"
              >
                
                {/* رأس الكارت: اللوجو والاسم */}
                <div className="flex items-start gap-4">
                  {company.logoUrl ? (
                    <Image 
                      src={company.logoUrl} 
                      alt={company.companyName} 
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                      {getInitials(company.companyName)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground/90 flex items-center gap-1.5 leading-snug">
                      <span>{company.companyName}</span>
                      <CheckCircle className="w-4 h-4 fill-primary text-white shrink-0" />
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-foreground/50">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{company.industryZone}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-border/60" />

                {/* الوظائف النشطة المفتوحة */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50 font-bold">
                    <Briefcase className="w-4 h-4 text-foreground/45" />
                    <span>الفرص المتاحة: {company.jobs.length.toLocaleString("ar-EG")} وظائف نشطة</span>
                  </div>

                  {company.jobs.length > 0 ? (
                    <div className="space-y-2">
                      {company.jobs.map((job) => (
                        <Link 
                          key={job.id} 
                          href={`/jobs/${job.id}`}
                          className="block p-2.5 bg-secondary/5 hover:bg-primary/5 hover:text-primary border border-border/50 hover:border-primary/20 rounded-xl text-xs font-semibold transition-all text-foreground/75"
                        >
                          ⚡ {job.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-foreground/40 italic">لا توجد وظائف معلنة حالياً في هذه المنشأة.</p>
                  )}
                </div>

                {/* ذيل الكارت */}
                <div className="pt-2 text-xs text-foreground/40 font-medium">
                  الموقع: {company.address}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
