// src/components/shared/SocialProofSection.tsx
"use client";

import React from "react";
import { Star, ShieldCheck, Award, Users, CheckCircle, Quote, Building2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface SocialProofSectionProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  className?: string;
}

const TRUSTED_COMPANIES = [
  { 
    nameAr: "الهيئة العربية للتصنيع", 
    nameEn: "Arab Organization for Industrialization (AOI)", 
    zoneAr: "القاهرة", 
    zoneEn: "Cairo", 
    badgeAr: "شريك استراتيجي", 
    badgeEn: "Strategic Partner" 
  },
  { 
    nameAr: "العربي جروب للصناعات الهندسية", 
    nameEn: "El Araby Engineering Group", 
    zoneAr: "قويسنا الصناعية", 
    zoneEn: "Quesna Industrial Zone", 
    badgeAr: "موثق بالسجل", 
    badgeEn: "Verified Registry" 
  },
  { 
    nameAr: "السويدي للصناعات الهندسية", 
    nameEn: "Elsewedy Engineering Industries", 
    zoneAr: "العاشر من رمضان", 
    zoneEn: "10th of Ramadan", 
    badgeAr: "موثق بالسجل", 
    badgeEn: "Verified Registry" 
  },
  { 
    nameAr: "مسبك القاهرة للحديد والصلب", 
    nameEn: "Cairo Steel & Iron Foundry", 
    zoneAr: "6 أكتوبر", 
    zoneEn: "6th of October", 
    badgeAr: "شريك توظيف", 
    badgeEn: "Hiring Partner" 
  },
  { 
    nameAr: "الأمل للهندسة الميكانيكية وتصنيع الإسطمبات", 
    nameEn: "Al Amal Mechanical & Tooling", 
    zoneAr: "العاشر من رمضان", 
    zoneEn: "10th of Ramadan", 
    badgeAr: "موثق بالسجل", 
    badgeEn: "Verified Registry" 
  },
  { 
    nameAr: "الكرنك لتشغيل المعادن وخراطة CNC", 
    nameEn: "Karnak CNC Machining & Turning", 
    zoneAr: "العبور", 
    zoneEn: "Obour City", 
    badgeAr: "موثق بالسجل", 
    badgeEn: "Verified Registry" 
  },
  { 
    nameAr: "النيل للهندسة الدقيقة والميكانيكا", 
    nameEn: "Nile Precision Engineering", 
    zoneAr: "مدينة بدر", 
    zoneEn: "Badr City", 
    badgeAr: "شريك توظيف", 
    badgeEn: "Hiring Partner" 
  },
  { 
    nameAr: "الوطنية للمسبوكات والصناعات المغذية", 
    nameEn: "National Castings & OEM Parts", 
    zoneAr: "حلوان", 
    zoneEn: "Helwan", 
    badgeAr: "موثق بالسجل", 
    badgeEn: "Verified Registry" 
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    authorAr: "م. طارق عبد الرؤوف",
    authorEn: "Eng. Tarek Abdel-Raouf",
    roleAr: "مدير عام الإنتاج والتشغيل",
    roleEn: "General Director of Production & Machining",
    companyAr: "مصنع الأمل للصناعات الهندسية",
    companyEn: "Al Amal Engineering Industries",
    locationAr: "العاشر من رمضان",
    locationEn: "10th of Ramadan",
    rating: 5,
    contentAr: "المنصة أثبتت جدارة استثنائية في فرز وتوفير مبرمجي مخارط وفرايز CNC ذوي خبرة موثقة. نظام الترشيح القائم على الصناعة ونوع الكنترول وفر علينا أسابيع من المقابلات غير المجدية.",
    contentEn: "The platform demonstrated outstanding capability in evaluating and vetting CNC lathe and milling programmers. Matching by specific industry and controller types saved us weeks of unproductive interviews.",
    avatar: "T",
    dateAr: "منذ أسبوعين",
    dateEn: "2 weeks ago",
  },
  {
    id: 2,
    authorAr: "م. عصام حجازي",
    authorEn: "Eng. Essam Hegazy",
    roleAr: "المدير الفني العام",
    roleEn: "Technical General Manager",
    companyAr: "مجموعة حجازي لتشكيل المعادن وقوالب الحقن",
    companyEn: "Hegazy Tooling & Mold Manufacturing",
    locationAr: "6 أكتوبر",
    locationEn: "6th of October",
    rating: 5,
    contentAr: "الميزة الحقيقية هي الدقة الفنية في تصنيف الماكينات. عندما طلبنا مشغلي فريزة 5 محاور وكنترول Heidenhain، وصلتنا ترشيحات دقيقة تفهم التفاوتات الحرجة (Tolerances) ومعايير الجودة الصناعية مباشرة.",
    contentEn: "The true advantage is technical precision in machine categorization. When requesting 5-axis milling operators with Heidenhain controllers, we received qualified candidates who fully master critical tolerances and quality standards.",
    avatar: "E",
    dateAr: "منذ شهر",
    dateEn: "1 month ago",
  },
  {
    id: 3,
    authorAr: "م. شريف الهواري",
    authorEn: "Eng. Sherif El-Hawary",
    roleAr: "رئيس قسم التشغيل الآلي والبرمجة",
    roleEn: "Head of Automation & CAM Programming",
    companyAr: "مصانع النيل للهندسة الدقيقة",
    companyEn: "Nile Precision Engineering Plants",
    locationAr: "العبور",
    locationEn: "Obour City",
    rating: 5,
    contentAr: "التوثيق بالسجل التجاري وفحص الخبرة الحقيقية أعطانا ثقة كاملة في الكفاءات المرشحة. التعامل مهني ومنهجي يرتقي بمعايير التوظيف الصناعي في مصر.",
    contentEn: "Commercial registration verification and direct hands-on experience evaluation provided complete confidence in nominated specialists. Highly professional and methodical operation for Egypt's manufacturing sector.",
    avatar: "S",
    dateAr: "منذ 3 أسابيع",
    dateEn: "3 weeks ago",
  },
  {
    id: 4,
    authorAr: "أ. محمود نصار",
    authorEn: "Mr. Mahmoud Nassar",
    roleAr: "مدير الموارد البشرية والتوظيف الفني",
    roleEn: "HR & Technical Staffing Director",
    companyAr: "مسبك الجيزة للصناعات الميكانيكية",
    companyEn: "Giza Foundry & Mechanical Industries",
    locationAr: "أبو رواش",
    locationEn: "Abu Rawash",
    rating: 5,
    contentAr: "استقطاب مبرمجي Mastercam ومصممي قوالب الـ SolidWorks كان تحدياً مستمراً. المنصة قدمت حلاً مؤسسياً متكاملاً ربطنا بالكوادر الكفؤة بسرعة ومرونة.",
    contentEn: "Recruiting Mastercam programmers and SolidWorks mold designers was a persistent bottleneck. The platform delivered an institutional solution that connected us with vetted talent swiftly and reliably.",
    avatar: "M",
    dateAr: "منذ شهرين",
    dateEn: "2 months ago",
  },
];

export default function SocialProofSection({
  title,
  subtitle,
  showStats = true,
  className = "",
}: SocialProofSectionProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const displayTitle = title || (isAr 
    ? "ثقة كبرى المنشآت الصناعية والمصانع في مصر" 
    : "Trusted by Egypt's Premier Machining & Industrial Facilities");

  const displaySubtitle = subtitle || (isAr
    ? "انضم لأكثر من 150 منشأة ومصنعاً هندسياً يعتمدون على المنصة لتوفير الكوادر الفنية المعتمدة ومهندسي الإنتاج"
    : "Join over 150 verified manufacturing plants relying on our specialized platform for certified CNC specialists and production engineers");

  return (
    <section 
      dir={isAr ? "rtl" : "ltr"} 
      className={`py-16 bg-gradient-to-b from-slate-50/50 via-white to-slate-50 dark:from-slate-950/40 dark:via-slate-900/60 dark:to-slate-950/40 border-y border-border/60 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Header & High-Level Metrics */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20 shadow-sm animate-pulse">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? "شركاء التوظيف والتشغيل المعتمدون" : "Verified Industrial Machining Partners"}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {displayTitle}
          </h2>
          
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
            {displaySubtitle}
          </p>

          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-primary font-black text-2xl sm:text-3xl mb-1">
                  <span>+150</span>
                  <Building2 className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">
                  {isAr ? "منشأة ومصنع موثق بالسجل" : "Verified Industrial Plants"}
                </div>
              </div>
              
              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-2xl sm:text-3xl mb-1">
                  <span>+1,200</span>
                  <Users className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">
                  {isAr ? "كادر فني وهندسي معتمد" : "Certified Machining Specialists"}
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-2xl sm:text-3xl mb-1">
                  <span>98%</span>
                  <Award className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">
                  {isAr ? "معدل الرضا التشغيلي للمصانع" : "Operational Satisfaction Rate"}
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-sky-600 dark:text-sky-400 font-black text-2xl sm:text-3xl mb-1">
                  <span>48h</span>
                  <TrendingUp className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/70">
                  {isAr ? "متوسط سرعة المطابقة الفنية" : "Average Technical Matching"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Industrial Companies & Partners Marquee Grid */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
              {isAr ? "أبرز المنشآت الهندسية والمصانع الشريكة" : "Prominent Industrial & Machining Facilities"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TRUSTED_COMPANIES.map((company, index) => {
              const name = isAr ? company.nameAr : company.nameEn;
              const zone = isAr ? company.zoneAr : company.zoneEn;
              const initial = isAr ? company.nameAr.slice(0, 2) : company.nameEn.slice(0, 2).toUpperCase();

              return (
                <div 
                  key={index}
                  className="bg-card/80 hover:bg-card border border-border/70 hover:border-primary/40 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center font-black text-xs mb-2 transition-colors">
                    {initial}
                  </div>
                  <div className="text-xs font-bold text-foreground/80 leading-tight line-clamp-1 mb-1" title={name}>
                    {name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-primary/80 font-medium">
                    <span title={isAr ? company.badgeAr : company.badgeEn}>
                      <CheckCircle className="w-3 h-3 shrink-0 fill-primary text-white" />
                    </span>
                    <span className="truncate">{zone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Authentic Testimonials Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              {isAr ? "تقييمات قادة الإنتاج والهندسة" : "Industrial Leadership Feedback"}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-foreground mt-2">
              {isAr ? "آراء أصحاب المصانع ومديري التشغيل" : "Testimonials from Production & Plant Managers"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => {
              const author = isAr ? t.authorAr : t.authorEn;
              const role = isAr ? t.roleAr : t.roleEn;
              const company = isAr ? t.companyAr : t.companyEn;
              const location = isAr ? t.locationAr : t.locationEn;
              const content = isAr ? t.contentAr : t.contentEn;
              const date = isAr ? t.dateAr : t.dateEn;

              return (
                <div 
                  key={t.id}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-start relative group hover:border-primary/40"
                >
                  <Quote className="w-7 h-7 text-primary/20 absolute top-4 end-4 group-hover:text-primary/30 transition-colors" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed italic">
                      &quot;{content}&quot;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {t.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-foreground truncate">{author}</h4>
                      <p className="text-[11px] text-foreground/60 truncate">{role}</p>
                      <div className="flex items-center gap-1 text-[10px] text-primary/80 font-medium truncate mt-0.5">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{company} • {location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-foreground/40 self-end">
                    {date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
