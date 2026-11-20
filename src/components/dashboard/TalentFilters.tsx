// src/components/dashboard/TalentFilters.tsx
"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, Factory, RefreshCw, X } from "lucide-react";
import { EGYPTIAN_GOVERNORATES, CNC_INDUSTRIES } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface TalentFiltersProps {
  currentRole?: string;
  currentIndustry?: string;
  currentGovernorate?: string;
  currentControl?: string;
  currentExperience?: string;
  currentQuery?: string;
}

export default function TalentFilters({
  currentRole = "",
  currentIndustry = "",
  currentGovernorate = "",
  currentControl = "",
  currentExperience = "",
  currentQuery = "",
}: TalentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // الحالة المحلية لحقل البحث النصي لتفادي التحديث المستمر أثناء الكتابة
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [prevQuery, setPrevQuery] = useState(currentQuery);

  if (currentQuery !== prevQuery) {
    setSearchQuery(currentQuery);
    setPrevQuery(currentQuery);
  }

  // دالة تحديث معلمات البحث في الرابط
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // إعادة تعيين الصفحة للأولى عند تغيير الفلاتر
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  // دالة البحث النصي عند إرسال النموذج (Submit)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("query", searchQuery);
  };

  // مسح جميع الفلاتر والعودة للوضع الافتراضي
  const handleClearFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  const hasActiveFilters = 
    currentRole || 
    currentIndustry ||
    currentGovernorate || 
    currentControl || 
    currentExperience || 
    currentQuery;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      
      {/* 1. التبديل السريع بين الكوادر (Role Toggle Tabs) */}
      <div className="flex border-b border-border pb-4 gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => updateFilter("role", "")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            !currentRole
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          {isAr ? "كافة الكوادر الفنية والهندسية" : "All CNC Specialists"}
        </button>
        <button
          onClick={() => updateFilter("role", "TECHNICIAN")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            currentRole === "TECHNICIAN"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          {isAr ? "فنيو التشغيل والـ Setup" : "Technicians & Operators"}
        </button>
        <button
          onClick={() => updateFilter("role", "ENGINEER")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            currentRole === "ENGINEER"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          {isAr ? "مهندسو البرمجة والـ CAM" : "CAM Engineers & Programmers"}
        </button>
      </div>

      {/* 2. شريط البحث النصي وقوائم الاختيار الأبجدية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
        
        {/* حقل البحث بالماكينة أو المسمى (4/12) */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold text-foreground/70">
            {isAr ? "البحث بالماكينة، المسمى أو الكفاءة" : "Search Machine, Title or Keyword"}
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={isAr ? "مثال: مخرطة دوسان، فريزة Haas، أوبريتور، العاشر..." : "e.g. Haas mill, Doosan lathe, Fanuc..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-14 py-2.5 bg-secondary/5 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary/50 text-start"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
              <Search className="w-3.5 h-3.5" />
            </div>
            {/* زر البحث الصغير */}
            <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    updateFilter("query", "");
                  }}
                  className="p-1 text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                {isAr ? "بحث" : "Go"}
              </button>
            </div>
          </div>
        </form>

        {/* فلتر الصناعة الأبجدي (3/12) */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-foreground/70">
            {isAr ? "الصناعة (مرتبة أبجدياً)" : "Industry (Alphabetical)"}
          </label>
          <div className="relative">
            <select
              value={currentIndustry}
              onChange={(e) => updateFilter("industry", e.target.value)}
              className="w-full pr-8 pl-3 py-2.5 bg-secondary/5 border border-border rounded-xl text-xs sm:text-sm text-foreground/80 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer text-start"
            >
              <option value="">{isAr ? "كافة الصناعات" : "All Industries"}</option>
              {CNC_INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.ar}>
                  {isAr ? ind.ar : ind.en}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-foreground/40">
              <Factory className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* فلتر المحافظة الأبجدي (3/12) */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-foreground/70">
            {isAr ? "المحافظة (مرتبة أبجدياً)" : "Governorate (Alphabetical)"}
          </label>
          <div className="relative">
            <select
              value={currentGovernorate}
              onChange={(e) => updateFilter("governorate", e.target.value)}
              className="w-full pr-8 pl-3 py-2.5 bg-secondary/5 border border-border rounded-xl text-xs sm:text-sm text-foreground/80 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer text-start"
            >
              <option value="">{isAr ? "كل محافظات مصر" : "All Governorates"}</option>
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-foreground/40">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* زر إعادة التعيين (2/12) */}
        <div className="lg:col-span-2 flex flex-col justify-end">
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              className="w-full py-2.5 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[42px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? "مسح الفلاتر" : "Reset"}</span>
            </button>
          ) : (
            <div className="h-[42px] hidden lg:block" />
          )}
        </div>

      </div>
    </div>
  );
}
