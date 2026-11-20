// src/components/shared/SocialProofSection.tsx
"use client";

import React from "react";
import { Star, ShieldCheck, Award, Users, CheckCircle, Quote, Building2, TrendingUp } from "lucide-react";

export interface SocialProofSectionProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  className?: string;
}

const TRUSTED_COMPANIES = [
  { name: "الهيئة العربية للتصنيع", zone: "القاهرة", badge: "شريك استراتيجي" },
  { name: "العربي جروب للاسطمبات", zone: "قويسنا الصناعية", badge: "موثق بالسجل" },
  { name: "السويدي للصناعات الهندسية", zone: "العاشر من رمضان", badge: "موثق بالسجل" },
  { name: "مسبك القاهرة للحديد والصلب", zone: "6 أكتوبر", badge: "شريك توظيف" },
  { name: "مصنع الأمل للهندسة الميكانيكية", zone: "العاشر من رمضان", badge: "موثق بالسجل" },
  { name: "الكرنك لتشكيل المعادن وخراطة CNC", zone: "العبور", badge: "موثق بالسجل" },
  { name: "النيل للهندسة الدقيقة والميكانيكا", zone: "بدر", badge: "شريك توظيف" },
  { name: "ورشة النصر للصناعات المغذية", zone: "شق التعبان", badge: "موثق بالسجل" },
];

const TESTIMONIALS = [
  {
    id: 1,
    author: "م. طارق عبد الرؤوف",
    role: "مدير عام الإنتاج والتشغيل",
    company: "مصنع الأمل للصناعات الهندسية",
    location: "العاشر من رمضان",
    rating: 5,
    content: "كنا نعاني لشهور في البحث عن مبرمجي مخرطة CNC محترفين. عبر منصة hireCNC استلمنا 5 سير ذاتية لفنيين مختبرين خلال 24 ساعة، وتم تعيين اثنين منهم فوراً. فلترة الكوادر والفحص الفني لديهم ممتاز جداً.",
    avatar: "ط",
    date: "منذ أسبوعين",
  },
  {
    id: 2,
    author: "م. عصام حجازي",
    role: "صاحب ومدير عام",
    company: "مجموعة حجازي لتشكيل المعادن واسطمبات القوالب",
    location: "6 أكتوبر",
    rating: 5,
    content: "الميزة الحقيقية في المنصة هي المطابقة الذكية والاختبارات الفنية التي يمر بها الفنيون. عندما أطلب فني تشغيل فرايز 3 و 5 محور، يصلني شخص متقن لـ G-code ومقاسات الميكرومتر بدقة بدون تضييع وقت في مقابلات عشوائية.",
    avatar: "ع",
    date: "منذ شهر",
  },
  {
    id: 3,
    author: "م. شريف الهواري",
    role: "رئيس قسم الصيانة والتشغيل الآلي",
    company: "مصانع النيل للهندسة الدقيقة",
    location: "العبور",
    rating: 5,
    content: "نظام الاشتراكات والتوثيق بالسجل التجاري أعطانا ثقة تامة بالمنصة. دعم التوظيف والتواصل السريع عبر الواتساب مهني لدرجة كبيرة. أنصح أي مصنع في مصر يعتمد على التشغيل الآلي بالتسجيل هنا فوراً.",
    avatar: "ش",
    date: "منذ 3 أسابيع",
  },
  {
    id: 4,
    author: "أ. محمود نصار",
    role: "مدير الموارد البشرية والتوظيف",
    company: "مسبك الجيزة للصناعات الميكانيكية",
    location: "أبو رواش",
    rating: 5,
    content: "توظيف مهندسي تصميم وبرمجة Mastercam كان عقبة دائمة عندنا في المصنع. hireCNC حل المشكلة تماماً ووفر لنا نخبة الكوادر المصرية بأسعار اشتراك عادلة جداً مقارنة بمكاتب التوظيف التقليدية.",
    avatar: "م",
    date: "منذ شهرين",
  },
];

export default function SocialProofSection({
  title = "ثقة أصحاب المصانع وقادة الصناعة في مصر",
  subtitle = "انضم لأكثر من 150 منشأة ومصنع موثق يعتمدون على hireCNC لتوفير النخبة الفنية ومهندسي الإنتاج",
  showStats = true,
  className = "",
}: SocialProofSectionProps) {
  return (
    <section dir="rtl" className={`py-16 bg-gradient-to-b from-slate-50/50 via-white to-slate-50 dark:from-slate-950/40 dark:via-slate-900/60 dark:to-slate-950/40 border-y border-border/60 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. رأس القسم والإحصائيات السريعة */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20 shadow-sm animate-pulse">
            <ShieldCheck className="w-4 h-4" />
            <span>شركاء التوظيف الموثقون (Verified Partners)</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {title}
          </h2>
          
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
            {subtitle}
          </p>

          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-primary font-black text-2xl sm:text-3xl mb-1">
                  <span>+150</span>
                  <Building2 className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">مصنع وورشة موثقة</div>
              </div>
              
              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-2xl sm:text-3xl mb-1">
                  <span>+1,200</span>
                  <Users className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">فني ومهندس CNC مختبر</div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-2xl sm:text-3xl mb-1">
                  <span>98%</span>
                  <Award className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">نسبة رضا أصحاب المصانع</div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-sky-600 dark:text-sky-400 font-black text-2xl sm:text-3xl mb-1">
                  <span>48 ساعة</span>
                  <TrendingUp className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">متوسط سرعة إغلاق الوظيفة</div>
              </div>
            </div>
          )}
        </div>

        {/* 2. شريط المصانع والشركات الشريكة الموثقة في مصر */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              أبرز الكيانات الصناعية والمصانع المشاركة في المنصة
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TRUSTED_COMPANIES.map((company, index) => (
              <div 
                key={index}
                className="bg-card/80 hover:bg-card border border-border/70 hover:border-primary/40 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center font-black text-xs mb-2 transition-colors">
                  {company.name.slice(0, 2)}
                </div>
                <div className="text-xs font-bold text-foreground/80 leading-tight line-clamp-1 mb-1">
                  {company.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-primary/80 font-medium">
                  <CheckCircle className="w-3 h-3 shrink-0 fill-primary text-white" />
                  <span>{company.zone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. شبكة آراء العملاء وتقييمات أصحاب المصانع (Testimonials Grid) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
              <Quote className="w-6 h-6 text-primary rotate-180" />
              <span>ماذا يقول أصحاب المصانع ومديرو التشغيل؟</span>
            </h3>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>4.9 / 5 تقييم عام</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-card border border-border/80 hover:border-primary/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* التقييم بالنجوم */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-foreground/40 font-medium">{t.date}</span>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed font-normal italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                {/* معلومات صاحب التعليق والمصنع */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-sky-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                    {t.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-foreground truncate">{t.author}</h4>
                      <span title="صاحب عمل موثق"><CheckCircle className="w-4 h-4 fill-primary text-white shrink-0" /></span>
                    </div>
                    <p className="text-xs text-foreground/60 truncate font-medium">{t.role}</p>
                    <p className="text-[11px] text-primary font-semibold truncate mt-0.5">
                      {t.company} — <span className="text-foreground/50">{t.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
