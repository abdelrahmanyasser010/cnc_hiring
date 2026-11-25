"use client";

// src/components/shared/LandingHero.tsx
// قسم البطل الرئيسي في الصفحة الرئيسية (Hero Section). 
// مصمم كغلاف صناعي فخم (Industrial Hero Cover) يتبع أفضل ممارسات منصات التوظيف المتخصصة للـ CNC (مثل hireCNC).

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LandingHero() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-slate-950 text-white border-b border-slate-800/80">
      {/* Background Industrial Texture & Clean Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity scale-100 transition-transform duration-1000"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80')"
        }}
      />
      
      {/* Deep Industrial Gradients preserving Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center w-full min-w-0">
          
          {/* Main Copy & Dual CTA (7 cols on lg) */}
          <div className="lg:col-span-7 min-w-0 w-full flex flex-col gap-4 sm:gap-6 text-start">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 text-sky-400 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full max-w-full w-fit">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 shrink-0"></span>
              <span className="truncate sm:whitespace-normal">
                {isAr 
                  ? "منظومة توظيف كوادر الـ CNC المعتمدة بمصر" 
                  : "Egypt's Dedicated CNC Staffing Network"}
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-3xl xl:text-5xl font-black leading-tight sm:leading-tight lg:leading-[1.18] tracking-tight text-white break-words w-full">
              {isAr ? (
                <>
                  توظيف مشغلي ومبرمجي ماكينات الـ CNC <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-sky-400 via-primary to-cyan-300 bg-clip-text text-transparent">
                    لكبرى المصانع والورش الإنتاجية في مصر
                  </span>
                </>
              ) : (
                <>
                  Precision CNC Machinists & Programmers <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-sky-400 via-primary to-cyan-300 bg-clip-text text-transparent">
                    For Egypt's Leading Machine Shops & Plants
                  </span>
                </>
              )}
            </h1>
            
            {/* Subheading */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {isAr 
                ? "منظومة ربط فني مباشر بين مشغلي ومبرمجي ماكينات الـ CNC (فرايز، مخارط، 5 محاور، سلك) وكبرى مصانع وورش مصر في العاشر من رمضان، 6 أكتوبر، وبرج العرب وفق معايير الجودة والتفاوت الهندسي."
                : "Direct, vetted technical placement connecting CNC machinists (operators, setters, 5-axis & CAM programmers) with leading manufacturing facilities across Egypt's key industrial zones."
              }
            </p>
            
            {/* Dual Marketplace Action - Clean, Solid & Un-truncated */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 w-full">
              
              {/* Machinist Action (Primary Solid Cyan/Blue) */}
              <Link 
                href="/register/candidate" 
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-md shadow-primary/25 text-center active:scale-[0.99] sm:whitespace-nowrap shrink-0"
              >
                <span>{isAr ? "سجل كفني أو مبرمج CNC" : "Register as Machinist"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
              </Link>
              
              {/* Factory / Machine Shop Action (High-Contrast Solid White) */}
              <Link 
                href="/register" 
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 text-sm sm:text-base font-bold rounded-xl transition-all shadow-sm text-center active:scale-[0.99] border border-white sm:whitespace-nowrap shrink-0"
              >
                <span>{isAr ? "وظّف كفاءات لمصنعك" : "Hire CNC Machinists"}</span>
              </Link>
            </div>

            {/* Subtle Secondary Talent Link */}
            <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 pt-1">
              <span>{isAr ? "تبحث عن كادر محدد فوراً؟" : "Looking for specific CNC skills?"}</span>
              <Link 
                href="/talent" 
                className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4 flex items-center gap-1 transition-colors"
              >
                <span>{isAr ? "استكشف قاعدة الكفاءات المتاحة" : "Browse available talent pool"}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>

            {/* Trust Metrics Pill Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/80 max-w-xl text-slate-300 text-xs">
              <div className="text-start">
                <div className="font-bold text-sm sm:text-base text-white font-mono">1,400+</div>
                <div className="text-slate-400 text-[10px] sm:text-[11px] leading-tight mt-0.5">{isAr ? "فني ومبرمج" : "Machinists"}</div>
              </div>
              <div className="text-start">
                <div className="font-bold text-sm sm:text-base text-white font-mono">180+</div>
                <div className="text-slate-400 text-[10px] sm:text-[11px] leading-tight mt-0.5">{isAr ? "مصنع شريك" : "Facilities"}</div>
              </div>
              <div className="text-start">
                <div className="font-bold text-sm sm:text-base text-sky-400 font-mono">100%</div>
                <div className="text-slate-400 text-[10px] sm:text-[11px] leading-tight mt-0.5">{isAr ? "فحص تخصصي" : "Vetted CNC"}</div>
              </div>
            </div>

          </div>
          
          {/* Right Column: Verified Industrial Talent Showcase (5 cols on lg - Solid & Crisp) */}
          <div className="lg:col-span-5 min-w-0 w-full relative">
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-4 xl:p-6 shadow-xl relative">
              
              {/* Authentic Header with Live Status Dot */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    {isAr ? "أحدث الكفاءات المنضمة لبنك التوظيف" : "Recently Joined CNC Specialists"}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-sky-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full font-medium shrink-0">
                  {isAr ? "المناطق الصناعية • مصر" : "Egypt Industrial Hubs"}
                </span>
              </div>
              
              {/* Live Candidate Cards with Real Shop Floor Specs */}
              <div className="space-y-2.5 sm:space-y-3">
                
                {/* Candidate 1 */}
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-sky-300 text-xs shrink-0 font-mono">
                    CNC
                  </div>
                  <div className="flex-1 min-w-0 text-start">
                    <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                      {isAr ? "أحمد محمود (خراط مبرمج CNC)" : "Ahmed Mahmoud (CNC Lathe Programmer)"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 min-w-0 flex items-center gap-1 mt-0.5">
                      <span className="truncate">{isAr ? "خبرة 6 سنوات • Fanuc" : "6 Yrs • Fanuc Oi-TF"}</span>
                      <span className="text-slate-600 shrink-0">•</span>
                      <span className="text-sky-400 shrink-0">{isAr ? "العاشر من رمضان" : "10th Ramadan"}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap">
                    {isAr ? "متاح فوري" : "Available"}
                  </span>
                </div>

                {/* Candidate 2 */}
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-cyan-300 text-xs shrink-0 font-mono">
                    5-AX
                  </div>
                  <div className="flex-1 min-w-0 text-start">
                    <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                      {isAr ? "محمد علي (فني تشغيل فريزة 5 محاور)" : "Mohamed Ali (5-Axis Milling Setter)"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 min-w-0 flex items-center gap-1 mt-0.5">
                      <span className="truncate">{isAr ? "خبرة 4 سنوات • Siemens" : "4 Yrs • Siemens 840D"}</span>
                      <span className="text-slate-600 shrink-0">•</span>
                      <span className="text-sky-400 shrink-0">{isAr ? "6 أكتوبر" : "6th October"}</span>
                    </div>
                  </div>
                  <span className="bg-amber-950 text-amber-400 border border-amber-800/60 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap">
                    {isAr ? "ترشيح جارٍ" : "Interviewing"}
                  </span>
                </div>

                {/* Candidate 3 */}
                <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-xs shrink-0 font-mono">
                    CAM
                  </div>
                  <div className="flex-1 min-w-0 text-start">
                    <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                      {isAr ? "حسن حسين (مبرمج Mastercam & SolidCAM)" : "Hassan Hussein (CAM Specialist)"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 min-w-0 flex items-center gap-1 mt-0.5">
                      <span className="truncate">{isAr ? "خبرة 8 سنوات • أسطمبات" : "8 Yrs • Tooling & CAM"}</span>
                      <span className="text-slate-600 shrink-0">•</span>
                      <span className="text-sky-400 shrink-0">{isAr ? "برج العرب" : "Borg El Arab"}</span>
                    </div>
                  </div>
                  <span className="bg-blue-950 text-blue-400 border border-blue-800/60 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap">
                    {isAr ? "موثق الخبرة" : "Verified Exp"}
                  </span>
                </div>
              </div>
              
              {/* Quality & Readiness Footnote */}
              <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? "فحص عملي لأنظمة الكنترول والـ G-code قبل المقابلة" : "Practical machine control & G-code vetting"}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold shrink-0">100%</span>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
