"use client";

// src/app/companies/CompaniesClientView.tsx
// واجهة دليل الشركات والمصانع التفاعلية للمستخدمين مع دعم الفلترة ثنائية اللغة والبحث المباشر.

import React, { useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Briefcase, CheckCircle2, ArrowLeft, ArrowRight, Search, Users2, Filter } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface EmployerWithJobs {
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
}

interface CompaniesClientViewProps {
  initialCompanies: EmployerWithJobs[];
}

const INDUSTRIAL_ZONES_BILINGUAL = [
  { ar: "جميع المناطق الصناعية", en: "All Industrial Zones", value: "" },
  { ar: "العاشر من رمضان", en: "10th of Ramadan", value: "العاشر من رمضان" },
  { ar: "6 أكتوبر", en: "6th of October", value: "6 أكتوبر" },
  { ar: "العبور", en: "Obour City", value: "العبور" },
  { ar: "برج العرب الجديدة", en: "New Borg El Arab", value: "برج العرب الجديدة" },
  { ar: "قويسنا الصناعية", en: "Quesna Industrial Zone", value: "قويسنا الصناعية" },
  { ar: "السادات", en: "Sadat City", value: "السادات" },
  { ar: "بدر", en: "Badr City", value: "بدر" },
  { ar: "المنطقة الحرة بمدينة نصر", en: "Nasr City Free Zone", value: "المنطقة الحرة بمدينة نصر" },
];

export function CompaniesClientView({ initialCompanies }: CompaniesClientViewProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const filteredCompanies = initialCompanies.filter((comp) => {
    const matchesSearch = !searchQuery.trim() || 
      comp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZone = !selectedZone || comp.industryZone === selectedZone;

    return matchesSearch && matchesZone;
  });

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0] ? parts[0][0] : ""}${parts[1] ? parts[1][0] : ""}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950/40 py-12 px-4 sm:px-6 lg:px-8 text-start font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/60 hover:text-primary transition-all"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? "الرجوع للصفحة الرئيسية" : "Back to Home"}</span>
            </Link>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Building2 className="w-7 h-7" />
              </div>
              <span>{isAr ? "دليل المصانع والشركات الشريكة المعتمدة" : "Verified Industrial Facilities & Machine Shops"}</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-foreground/70 max-w-2xl leading-relaxed">
              {isAr 
                ? "استكشف مجمعات التصنيع والورش وشركاء التوظيف المعتمدين والموثقين (ISO & Trade Verified) في مختلف المناطق والمدن الصناعية بمصر."
                : "Explore verified machining plants, precision toolrooms, and vetted manufacturing partners across Egypt's industrial hubs."
              }
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-card border border-border px-4 py-2.5 rounded-2xl shadow-sm">
            <Users2 className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs font-bold text-foreground font-mono">{filteredCompanies.length}</div>
              <div className="text-[11px] text-foreground/60">{isAr ? "منشأة معتمدة" : "Active Facilities"}</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث باسم المصنع أو الكيان الصناعي..." : "Search by factory or shop name..."}
              className="w-full bg-secondary/5 border border-border rounded-xl ps-10 pe-4 py-2.5 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Zone Selector */}
          <div className="md:col-span-5 relative">
            <Filter className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-secondary/5 border border-border rounded-xl ps-10 pe-8 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
            >
              {INDUSTRIAL_ZONES_BILINGUAL.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {isAr ? zone.ar : zone.en}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 border border-border rounded-2xl bg-card space-y-2">
            <div className="text-sm font-semibold">
              {isAr ? "لم يتم العثور على منشآت تطابق هذا البحث." : "No facilities found matching your criteria."}
            </div>
            <p className="text-xs text-foreground/50">
              {isAr ? "يرجى تجربة البحث باسم آخر أو اختيار منطقة صناعية أخرى." : "Try adjusting your search terms or selecting another zone."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div 
                key={company.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between space-y-5 group"
              >
                {/* Header & Logo */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base flex-shrink-0 shadow-xs">
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                        {company.companyName}
                      </h3>
                      {company.isVerified && (
                        <span title={isAr ? "منشأة معتمدة بالمنظومة" : "Verified Facility"}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        </span>
                      )}
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md mt-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{company.industryZone}</span>
                    </div>
                  </div>
                </div>

                {/* Address & Shop Info */}
                <div className="text-xs text-foreground/60 line-clamp-2 leading-relaxed bg-secondary/5 p-3 rounded-xl border border-border/50">
                  <div className="font-semibold text-foreground/80 mb-0.5">{isAr ? "الموقع الجغرافي للمصنع:" : "Facility Address:"}</div>
                  {company.address}
                </div>

                {/* Active Jobs in Shop */}
                <div className="pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-bold text-foreground/80 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "الترشيحات الفنية النشطة" : "Active CNC Openings"}</span>
                    </span>
                    <span className="bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {company.jobs.length} {isAr ? "شاغر" : "Open"}
                    </span>
                  </div>

                  {company.jobs.length > 0 ? (
                    <div className="space-y-1.5">
                      {company.jobs.slice(0, 2).map((job) => (
                        <div key={job.id} className="text-xs text-foreground/75 truncate bg-card p-2 rounded-lg border border-border flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{job.title}</span>
                          <span className="text-[10px] text-emerald-600 font-bold flex-shrink-0">{isAr ? "مطلوب" : "Hiring"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-foreground/40 italic py-1">
                      {isAr ? "لا توجد شواغر معلنة حالياً لهذا المصنع." : "No current public openings."}
                    </div>
                  )}
                  {/* Card Action Link */}
                  <Link
                    href={company.jobs.length > 0 ? `/jobs/${company.jobs[0].id}` : `/#jobs`}
                    className="w-full mt-3 py-2.5 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-primary/20 hover:shadow-sm"
                  >
                    <span>{isAr ? "استعراض شواغر المصنع والتقديم" : "View Openings & Apply"}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
