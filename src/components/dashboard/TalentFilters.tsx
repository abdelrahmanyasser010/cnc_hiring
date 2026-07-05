// src/components/dashboard/TalentFilters.tsx
"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, Cpu, RefreshCw, X } from "lucide-react";
import { EGYPTIAN_GOVERNORATES, CONTROL_TYPES, CONTROL_LABELS } from "@/lib/constants";

interface TalentFiltersProps {
  currentRole?: string;
  currentGovernorate?: string;
  currentControl?: string;
  currentExperience?: string;
  currentQuery?: string;
}

export default function TalentFilters({
  currentRole = "",
  currentGovernorate = "",
  currentControl = "",
  currentExperience = "",
  currentQuery = "",
}: TalentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    currentGovernorate || 
    currentControl || 
    currentExperience || 
    currentQuery;

  return (
    <div dir="rtl" className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* 1. التبديل السريع بين الأدوار (Role Toggle Tabs) */}
      <div className="flex border-b border-border pb-4 gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => updateFilter("role", "")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            !currentRole
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          كل الكوادر
        </button>
        <button
          onClick={() => updateFilter("role", "TECHNICIAN")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            currentRole === "TECHNICIAN"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          الفنيين (Technicians)
        </button>
        <button
          onClick={() => updateFilter("role", "ENGINEER")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            currentRole === "ENGINEER"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-secondary/5 hover:bg-secondary/10 text-foreground/75"
          }`}
        >
          المهندسين (Engineers)
        </button>
      </div>

      {/* 2. شريط البحث النصي وقوائم الاختيار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        
        {/* حقل البحث النصي (12/12 -> 5/12 في الشاشات الكبيرة) */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-semibold text-foreground/70">البحث بالاسم أو المدينة</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="ابحث بالاسم، المدينة أو المحافظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-16 py-3 bg-secondary/5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 text-right"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
              <Search className="w-4 h-4" />
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
                  className="p-1.5 text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                بحث
              </button>
            </div>
          </div>
        </form>

        {/* فلتر المحافظة (3/12) */}
        <div className="lg:col-span-3 space-y-2">
          <label className="block text-xs font-semibold text-foreground/70">المحافظة / النطاق الجغرافي</label>
          <div className="relative">
            <select
              value={currentGovernorate}
              onChange={(e) => updateFilter("governorate", e.target.value)}
              className="w-full pr-10 pl-3 py-3 bg-secondary/5 border border-border rounded-xl text-sm text-foreground/80 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="">كل محافظات مصر</option>
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* فلتر الكنترول (الماكينة) (3/12) */}
        <div className="lg:col-span-3 space-y-2">
          <label className="block text-xs font-semibold text-foreground/70">نوع الكنترول (الماكينات المفضلة)</label>
          <div className="relative">
            <select
              value={currentControl}
              onChange={(e) => updateFilter("control", e.target.value)}
              className="w-full pr-10 pl-3 py-3 bg-secondary/5 border border-border rounded-xl text-sm text-foreground/80 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="">كل أنواع الكنترول</option>
              {CONTROL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {CONTROL_LABELS[type]}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* فلتر الخبرة / مسح التصفية (2/12) */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full py-3 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[46px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة تعيين</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
