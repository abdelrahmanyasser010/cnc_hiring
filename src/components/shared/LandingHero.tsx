"use client";

// src/components/shared/LandingHero.tsx
// قسم البطل الرئيسي في الصفحة الرئيسية (Hero Section). يدعم تغيير اللغة ديناميكياً وعرض كارت المحاكاة.

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LandingHero() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 bg-radial-[circle_at_bottom_left] from-primary/10 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
        
        {/* Right Column: Copy & CTAs */}
        <div className="flex flex-col gap-5 sm:gap-6 text-start">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
            <span>⚡ {isAr ? "المنصة الأولى والوحيدة لتوظيف فنيي ومهندسي الـ CNC في مصر" : "Egypt's #1 Dedicated CNC Industrial Staffing Platform"}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight md:leading-tight tracking-tight text-foreground">
            {isAr ? "ماتشيلش هم عمالة المصنع.." : "Never Worry About Factory Staffing.."} <br />
            <span className="text-primary bg-gradient-to-l from-primary to-sky-600 bg-clip-text text-transparent">
              {isAr ? "أفضل الفنيين والمهندسين بين إيديك" : "The Best CNC Specialists At Your Fingertips"}
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed max-w-xl">
            {isAr 
              ? "نوفر لأصحاب الورش والمصانع في العاشر من رمضان، 6 أكتوبر، وكل مصر وصولاً مباشراً لأكثر من 5,000 فني ومهندس CNC ومبرمج وخراط محترف وموثق. قدم طلبك الآن وسنقوم بتصفية المتقدمين ذكياً."
              : "We provide workshop and factory owners across 10th of Ramadan, 6th of October, and Egypt with direct access to over 5,000+ verified CNC setters, CAM programmers, and machinists. Submit your job request now for smart AI screening."
            }
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-4">
            <Link 
              href="/register" 
              className="px-5 sm:px-6 py-3 bg-primary text-white text-xs sm:text-sm md:text-base font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/35 hover:-translate-y-0.5 text-center"
            >
              {isAr ? "ابدأ البحث عن فنيين ومهندسين الآن" : "Start Hiring CNC Specialists Now"}
            </Link>
            <Link 
              href="#pricing" 
              className="px-5 sm:px-6 py-3 border border-border text-foreground hover:bg-secondary/5 text-xs sm:text-sm md:text-base font-medium rounded-xl transition-all hover:-translate-y-0.5 text-center"
            >
              {isAr ? "عرض الباقات والأسعار" : "View Pricing & Plans"}
            </Link>
          </div>
        </div>
        
        {/* Left Column: Premium SVG Graphic representing Machine Shop Dashboard */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            
            {/* Header inside graphic card */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-foreground/50 font-mono">dashboard.hirecnc.eg</span>
            </div>
            
            {/* Fake Candidates Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {isAr ? "أ م" : "AM"}
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <div className="font-semibold text-sm truncate">{isAr ? "أحمد محمود (خراط مبرمج CNC)" : "Ahmed Mahmoud (CNC Programmer)"}</div>
                  <div className="text-xs text-foreground/60 truncate">{isAr ? "خبرة 5 سنوات • كنترول Fanuc" : "5 Yrs Exp • Fanuc Control"}</div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{isAr ? "نشط" : "Active"}</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {isAr ? "م ع" : "MA"}
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <div className="font-semibold text-sm truncate">{isAr ? "محمد علي (فني تشغيل فريزة)" : "Mohamed Ali (Milling Operator)"}</div>
                  <div className="text-xs text-foreground/60 truncate">{isAr ? "خبرة 3 سنوات • كنترول Siemens" : "3 Yrs Exp • Siemens Control"}</div>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{isAr ? "مقابلة اليوم" : "Interview Today"}</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {isAr ? "ح ح" : "HH"}
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <div className="font-semibold text-sm truncate">{isAr ? "حسن حسين (مبرمج Mastercam)" : "Hassan Hussein (CAM Programmer)"}</div>
                  <div className="text-xs text-foreground/60 truncate">{isAr ? "خبرة 8 سنوات • تصميم ميكانيكي" : "8 Yrs Exp • Mechanical Design"}</div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{isAr ? "نشط" : "Active"}</span>
              </div>
            </div>
            
            {/* Mini Stats graph representation */}
            <div className="mt-4 p-3 border border-border rounded-xl bg-background">
              <div className="flex justify-between items-center text-xs text-foreground/60 mb-2">
                <span>{isAr ? "جدية الكوادر المتقدمة" : "Candidate Reliability Score"}</span>
                <span className="text-green-600 font-semibold">{isAr ? "98.5% حضور" : "98.5% Attendance"}</span>
              </div>
              <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[98.5%] rounded-full"></div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}
