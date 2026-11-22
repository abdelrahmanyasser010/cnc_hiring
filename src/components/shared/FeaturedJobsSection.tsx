"use client";

// src/components/shared/FeaturedJobsSection.tsx
// قسم شواغر ووظائف الـ CNC المميزة في الصفحة الرئيسية (مستوحى مباشرة من تصميم Featured Jobs في hirecnc.com).
// يتيح للفنيين والمهندسين استعراض الرواتب بالساعة/الشهر، الماكينات المطلوبة، ونظام الكنترول مع زر التقديم السريع.

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Cpu, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Search,
  Filter
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface FeaturedJob {
  id: string;
  title: { ar: string; en: string };
  company: { ar: string; en: string };
  zone: { ar: string; en: string };
  machineType: { ar: string; en: string };
  control: string;
  shift: { ar: string; en: string };
  salary: { ar: string; en: string };
  isUrgent?: boolean;
  postedDate: { ar: string; en: string };
}

const FEATURED_JOBS: FeaturedJob[] = [
  {
    id: "job-feat-1",
    title: { 
      ar: "فني تشغيل وبرمجة مخرطة CNC (خراطة دقيقة)", 
      en: "CNC Lathe Machinist & Programmer (Precision Turning)" 
    },
    company: { ar: "مصنع الأمل للهندسة الميكانيكية", en: "Al-Amal Precision Engineering" },
    zone: { ar: "العاشر من رمضان", en: "10th of Ramadan" },
    machineType: { ar: "مخرطة CNC محوران مع برج أدوات", en: "2-Axis CNC Lathe with Turret" },
    control: "Fanuc Oi-TF",
    shift: { ar: "وردية أولى (8 ساعات)", en: "1st Shift (8 hrs)" },
    salary: { ar: "18,000 - 24,000 ج.م/شهرياً", en: "EGP 18,000 - 24,000 / mo" },
    isUrgent: true,
    postedDate: { ar: "اليوم", en: "Today" }
  },
  {
    id: "job-feat-2",
    title: { 
      ar: "مشغّل فريزة CNC 5 محاور وفني ضبط محترف", 
      en: "5-Axis CNC Milling Setter & Operator" 
    },
    company: { ar: "العربي جروب للصناعات الهندسية", en: "El-Araby Engineering Group" },
    zone: { ar: "قويسنا الصناعية", en: "Quesna Industrial Zone" },
    machineType: { ar: "مركز تشغيل 5 محاور (Machining Center)", en: "5-Axis Machining Center" },
    control: "Siemens Sinumerik 840D",
    shift: { ar: "وردية صباحية منتظمة", en: "Regular Day Shift" },
    salary: { ar: "22,000 - 28,000 ج.م/شهرياً", en: "EGP 22,000 - 28,000 / mo" },
    isUrgent: true,
    postedDate: { ar: "منذ يومين", en: "2 days ago" }
  },
  {
    id: "job-feat-3",
    title: { 
      ar: "مهندس برمجة CAM وتخطيط مسارات قطع", 
      en: "CAM Programmer & Toolpath Specialist" 
    },
    company: { ar: "السويدي للصناعات الهندسية", en: "Elsewedy Engineering Industries" },
    zone: { ar: "6 أكتوبر", en: "6th of October" },
    machineType: { ar: "فرايز ومخارط متعددة المحاور", en: "Multi-Axis Mills & Lathes" },
    control: "Mastercam / PowerMill",
    shift: { ar: "دوام كامل (مكتب فني ومصنع)", en: "Full Time (Technical Office)" },
    salary: { ar: "25,000 - 35,000 ج.م/شهرياً", en: "EGP 25,000 - 35,000 / mo" },
    isUrgent: false,
    postedDate: { ar: "منذ 3 أيام", en: "3 days ago" }
  },
  {
    id: "job-feat-4",
    title: { 
      ar: "فني تشغيل مخرطة سويسرية دقيقة (Swiss Type)", 
      en: "Swiss-Type CNC Lathe Specialist" 
    },
    company: { ar: "الكرنك للصناعات الطبية والدقيقة", en: "Karnak Precision & Medical" },
    zone: { ar: "بدر", en: "Badr City" },
    machineType: { ar: "Citizen / Star Swiss Turn", en: "Citizen / Star Swiss Turn" },
    control: "Mitsubishi / Fanuc",
    shift: { ar: "وردية متغيرة مع بدلات", en: "Rotating Shift + Allowances" },
    salary: { ar: "19,000 - 25,000 ج.م/شهرياً", en: "EGP 19,000 - 25,000 / mo" },
    isUrgent: false,
    postedDate: { ar: "منذ 4 أيام", en: "4 days ago" }
  },
  {
    id: "job-feat-5",
    title: { 
      ar: "فني تشغيل سلك وتآكل بالشرارة (Wire Cut & EDM)", 
      en: "CNC Wire EDM & Sinker Specialist" 
    },
    company: { ar: "مسبوكات القاهرة لتصنيع الاسطمبات", en: "Cairo Foundry & Tooling" },
    zone: { ar: "المنطقة الحرة بمدينة نصر", en: "Nasr City Free Zone" },
    machineType: { ar: "ماكينة قطع بالسلك شارميلز", en: "Charmilles Wire Cut" },
    control: "Fanuc / Charmilles",
    shift: { ar: "وردية نهارية", en: "Day Shift" },
    salary: { ar: "17,000 - 23,000 ج.م/شهرياً", en: "EGP 17,000 - 23,000 / mo" },
    isUrgent: false,
    postedDate: { ar: "منذ 5 أيام", en: "5 days ago" }
  },
  {
    id: "job-feat-6",
    title: { 
      ar: "فني فحص جودة وتفتيش أبعاد ماكينات (CMM Inspector)", 
      en: "CMM Quality Inspector & Metrologist" 
    },
    company: { ar: "مصنع الإسكندرية لتصنيع التروس", en: "Alexandria Gears Manufacturing" },
    zone: { ar: "برج العرب الجديدة", en: "New Borg El Arab" },
    machineType: { ar: "ماكينة قياس إحداثي ثلاثي (CMM)", en: "Coordinate Measuring Machine" },
    control: "Zeiss Calypso / PC-DMIS",
    shift: { ar: "دوام كامل مع تأمين شامل", en: "Full Time + Full Insurance" },
    salary: { ar: "18,000 - 24,000 ج.م/شهرياً", en: "EGP 18,000 - 24,000 / mo" },
    isUrgent: true,
    postedDate: { ar: "هذا الأسبوع", en: "This Week" }
  }
];

export function FeaturedJobsSection() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const filteredJobs = FEATURED_JOBS.filter((job) => {
    if (selectedFilter === "MILLING") return job.machineType.en.includes("Mill") || job.title.en.includes("Mill");
    if (selectedFilter === "TURNING") return job.machineType.en.includes("Lathe") || job.title.en.includes("Lathe") || job.machineType.en.includes("Swiss");
    if (selectedFilter === "CAM") return job.title.en.includes("CAM") || job.control.includes("Mastercam");
    return true;
  });

  return (
    <section id="jobs" className="py-20 bg-slate-900/40 border-b border-border/80 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <Briefcase className="w-4 h-4" />
              <span>{isAr ? "وظائف CNC النشطة بالمصانع" : "Active CNC Machine Shop Roles"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              {isAr ? "وظائف ماكينات الـ CNC المطلوبة في مصر الآن" : "Featured CNC Machinist & Programming Roles"}
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 max-w-2xl leading-relaxed">
              {isAr 
                ? "شواغر مباشرة من كبرى الورش والمصانع المعتمدة مع إعلان واضح للرواتب ونوع الكنترول ونظام الورديات دون وسطاء."
                : "Direct positions from verified industrial machine shops with transparent wage bands, controller specifications, and shift details."}
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none self-start md:self-auto">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === "ALL"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary/10 hover:bg-secondary/20 text-foreground/75"
              }`}
            >
              {isAr ? "كل التخصصات" : "All Roles"}
            </button>
            <button
              onClick={() => setSelectedFilter("TURNING")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === "TURNING"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary/10 hover:bg-secondary/20 text-foreground/75"
              }`}
            >
              {isAr ? "مخارط CNC وسويسري" : "Lathe & Swiss"}
            </button>
            <button
              onClick={() => setSelectedFilter("MILLING")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === "MILLING"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary/10 hover:bg-secondary/20 text-foreground/75"
              }`}
            >
              {isAr ? "فرايز ومراكز تشغيل" : "CNC Mills & 5-Axis"}
            </button>
            <button
              onClick={() => setSelectedFilter("CAM")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === "CAM"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary/10 hover:bg-secondary/20 text-foreground/75"
              }`}
            >
              {isAr ? "مبرمجو CAM ومصممون" : "CAM & CAD"}
            </button>
          </div>
        </div>

        {/* 1. Featured Spotlight Banner (مثل FEATURED OPPORTUNITY في hirecnc.com) */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-sky-800/40 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 end-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? "فرصة الأسبوع الصناعية الكبرى" : "Featured Enterprise Opportunity"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isAr 
                  ? "مطلوب فنيو تشغيل وبرمجة فرايز 5 محاور — مجمع الصناعات الدقيقة (الهيئة العربية للتصنيع)" 
                  : "5-Axis CNC Milling Machinists — Arab Organization for Industrialization (AOI)"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isAr 
                  ? "تشغيل قطاعات هندسية معقدة وفق تفاوتات ISO الدقيقة. حوافز إنتاج شهرية، سكن وانتقالات للمغتربين، وتأمين طبي شامل."
                  : "Precision machining on aerospace & defense components with tight ISO tolerances. Comprehensive benefits, performance bonuses, and relocation support."}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-sky-300 pt-1">
                <span className="font-bold text-white text-sm bg-sky-950/80 border border-sky-700/60 px-3 py-1 rounded-lg">
                  {isAr ? "26,000 - 34,000 ج.م / شهرياً + بدلات" : "EGP 26,000 - 34,000 / mo + Allowances"}
                </span>
                <span>• {isAr ? "المنطقة الحرة بمدينة نصر" : "Nasr City Free Zone"}</span>
                <span>• {isAr ? "كنترول Heidenhain TNC 640" : "Heidenhain TNC 640"}</span>
              </div>
            </div>

            <Link
              href="/register/candidate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center flex-shrink-0"
            >
              <span>{isAr ? "التقديم الفوري على الفرصة" : "Quick Apply to Featured Role"}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>

        {/* 2. Featured Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group relative"
            >
              {/* Header: Company & Urgent Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/60 font-medium">
                    <span>{isAr ? job.company.ar : job.company.en}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    <bdi dir="auto">{isAr ? job.title.ar : job.title.en}</bdi>
                  </h4>
                </div>

                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    <Zap className="w-3 h-3 fill-amber-500" />
                    <span>{isAr ? "عاجل" : "Urgent"}</span>
                  </span>
                )}
              </div>

              {/* Machinery & Control Specs */}
              <div className="space-y-2 py-2 border-y border-border/60 text-xs">
                <div className="flex items-center justify-between text-foreground/75">
                  <span className="text-foreground/50">{isAr ? "نوع الماكينة:" : "Machine:"}</span>
                  <span className="font-semibold truncate max-w-[170px]">{isAr ? job.machineType.ar : job.machineType.en}</span>
                </div>
                <div className="flex items-center justify-between text-foreground/75">
                  <span className="text-foreground/50">{isAr ? "الكنترول المطلوب:" : "Control:"}</span>
                  <span className="font-mono font-bold text-primary">{job.control}</span>
                </div>
                <div className="flex items-center justify-between text-foreground/75">
                  <span className="text-foreground/50">{isAr ? "المنطقة الصناعية:" : "Zone:"}</span>
                  <span className="flex items-center gap-1 text-foreground/80">
                    <MapPin className="w-3 h-3 text-primary/70" />
                    <span>{isAr ? job.zone.ar : job.zone.en}</span>
                  </span>
                </div>
              </div>

              {/* Salary & Quick Apply CTA */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-foreground/50 uppercase font-semibold">{isAr ? "الراتب المعلن:" : "Wage Band:"}</div>
                    <div className="font-mono font-black text-xs sm:text-sm text-foreground">
                      {isAr ? job.salary.ar : job.salary.en}
                    </div>
                  </div>
                  <div className="text-[11px] text-foreground/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-foreground/40" />
                    <span>{isAr ? job.postedDate.ar : job.postedDate.en}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/register/candidate?job=${job.id}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>{isAr ? "التقديم السريع" : "Quick Apply"}</span>
                  </Link>

                  <Link
                    href="/register/candidate"
                    className="inline-flex items-center justify-center gap-1 py-2.5 bg-secondary/15 hover:bg-secondary/25 text-foreground text-xs font-semibold rounded-xl border border-border transition-all text-center"
                  >
                    <span>{isAr ? "التفاصيل" : "Details"}</span>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Machine Taxonomy Row (Like Browse CNC Jobs by Role in hirecnc.com) */}
        <div className="p-6 sm:p-8 bg-card border border-border rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span>{isAr ? "تصفح شواغر الـ CNC حسب الماكينة والكنترول في مصر:" : "Browse CNC Roles by Machine & Control in Egypt:"}</span>
            </h4>
            <Link 
              href="/register/candidate"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{isAr ? "سجل كفاءتك الفنية للانضمام لقاعدة الترشيحات" : "Register your technical profile"}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { ar: "وظائف مخرطة Fanuc", en: "Fanuc Lathe Jobs" },
              { ar: "وظائف فريزة 5 محاور", en: "5-Axis Milling Jobs" },
              { ar: "وظائف Siemens Sinumerik", en: "Siemens 840D Jobs" },
              { ar: "وظائف مخارط سويسرية Swiss Type", en: "Swiss Lathe Jobs" },
              { ar: "وظائف مبرمجي Mastercam", en: "Mastercam Jobs" },
              { ar: "وظائف تآكل بالشرارة Wire Cut", en: "Wire Cut EDM Jobs" },
              { ar: "وظائف تفتيش جودة CMM", en: "CMM Quality Jobs" },
              { ar: "وظائف Heidenhain", en: "Heidenhain Jobs" },
            ].map((tag, idx) => (
              <Link
                key={idx}
                href="/register/candidate"
                className="px-3 py-1.5 rounded-lg bg-secondary/5 border border-border/80 text-foreground/75 hover:text-primary hover:border-primary/40 text-xs font-medium transition-colors"
              >
                {isAr ? tag.ar : tag.en}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
