// src/components/shared/SocialProofSection.tsx
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  Star, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle, 
  Quote, 
  Building2, 
  TrendingUp, 
  MapPin, 
  ArrowLeft, 
  ArrowRight, 
  Wrench,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
    specialtyAr: "تشغيل دقيق وهندسة طيران",
    specialtyEn: "Precision Aerospace Machining",
    badgeAr: "شريك استراتيجي معتمد", 
    badgeEn: "Strategic Certified Partner",
    activeJobs: 5,
    initials: "AOI"
  },
  { 
    nameAr: "العربي جروب للصناعات الهندسية", 
    nameEn: "El Araby Engineering Group", 
    zoneAr: "قويسنا الصناعية", 
    zoneEn: "Quesna Industrial Zone", 
    specialtyAr: "قوالب صاج وحقن إسطمبات",
    specialtyEn: "Tooling & Stamping Dies",
    badgeAr: "موثق بالسجل التجاري", 
    badgeEn: "Verified Registry",
    activeJobs: 4,
    initials: "ELARABY"
  },
  { 
    nameAr: "السويدي للصناعات الهندسية", 
    nameEn: "Elsewedy Engineering Industries", 
    zoneAr: "العاشر من رمضان", 
    zoneEn: "10th of Ramadan", 
    specialtyAr: "خراطة وتفريز ثقيل CNC",
    specialtyEn: "Heavy CNC Turning & Milling",
    badgeAr: "موثق بالسجل التجاري", 
    badgeEn: "Verified Registry",
    activeJobs: 3,
    initials: "ELSEWEDY"
  },
  { 
    nameAr: "مسبك القاهرة للحديد والصلب", 
    nameEn: "Cairo Steel & Iron Foundry", 
    zoneAr: "6 أكتوبر", 
    zoneEn: "6th of October", 
    specialtyAr: "تشغيل مسبوكات ومحابس ضغط",
    specialtyEn: "Castings & Flow Valves",
    badgeAr: "شريك توظيف صناعي", 
    badgeEn: "Industrial Hiring Partner",
    activeJobs: 2,
    initials: "CSI"
  },
  { 
    nameAr: "الأمل للهندسة الميكانيكية وتصنيع الإسطمبات", 
    nameEn: "Al Amal Mechanical & Tooling", 
    zoneAr: "العاشر من رمضان", 
    zoneEn: "10th of Ramadan", 
    specialtyAr: "فريزة 5 محاور وواير كت EDM",
    specialtyEn: "5-Axis Milling & Wire EDM",
    badgeAr: "موثق بالسجل التجاري", 
    badgeEn: "Verified Registry",
    activeJobs: 3,
    initials: "AMAL"
  },
  { 
    nameAr: "الكرنك لتشغيل المعادن وخراطة CNC", 
    nameEn: "Karnak CNC Machining & Turning", 
    zoneAr: "العبور الصناعية", 
    zoneEn: "Obour Industrial City", 
    specialtyAr: "خراطة مبرمجة كنترول Fanuc",
    specialtyEn: "Fanuc CNC Turning Center",
    badgeAr: "موثق بالسجل التجاري", 
    badgeEn: "Verified Registry",
    activeJobs: 2,
    initials: "KARNAK"
  },
  { 
    nameAr: "النيل للهندسة الدقيقة والميكانيكا", 
    nameEn: "Nile Precision Engineering", 
    zoneAr: "مدينة بدر الصناعية", 
    zoneEn: "Badr Industrial Zone", 
    specialtyAr: "تصنيع قطع غيار ومسننات دقيقة",
    specialtyEn: "Gears & Precision Components",
    badgeAr: "شريك توظيف صناعي", 
    badgeEn: "Industrial Hiring Partner",
    activeJobs: 4,
    initials: "NILE"
  },
  { 
    nameAr: "الوطنية للمسبوكات والصناعات المغذية", 
    nameEn: "National Castings & OEM Parts", 
    zoneAr: "حلوان الصناعية", 
    zoneEn: "Helwan Industrial Zone", 
    specialtyAr: "خراطة رأسية VTL وسبائك",
    specialtyEn: "Vertical Turret Lathe & Alloys",
    badgeAr: "موثق بالسجل التجاري", 
    badgeEn: "Verified Registry",
    activeJobs: 2,
    initials: "NC"
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
    contentAr: "المنصة أثبتت جدارة استثنائية في فرز وتوفير مبرمجي مخارط وفرايز CNC ذوي خبرة موثقة. نظام الترشيح القائم على نوع الماكينة والكنترول وفر علينا أسابيع من المقابلات غير المجدية.",
    contentEn: "The platform demonstrated outstanding capability in vetting CNC lathe and milling programmers. Matching by specific machine type and controller saved us weeks of unproductive interviews.",
    avatar: "ط",
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
    contentAr: "الميزة الحقيقية هي الدقة الفنية في تصنيف الماكينات. عندما طلبنا مشغلي فريزة 5 محاور وكنترول Heidenhain، وصلتنا ترشيحات دقيقة تفهم التفاوتات الحرجة (Tolerances) ومعايير الجودة الصناعية مباشرة دون أي هدر في وقت الإنتاج.",
    contentEn: "The true advantage is technical precision in machine categorization. When requesting 5-axis milling operators with Heidenhain controllers, we received qualified candidates who fully master critical tolerances and quality standards.",
    avatar: "ع",
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
    contentAr: "التوثيق بالسجل التجاري وفحص الخبرة الحقيقية أعطانا ثقة كاملة في الكفاءات المرشحة. التعامل مهني ومنهجي يرتقي بمعايير التوظيف الصناعي في مصر، وسرعة ترشيح الكفاءات فاجأت فريق العمل لدينا.",
    contentEn: "Commercial registration verification and direct hands-on experience evaluation provided complete confidence in nominated specialists. Highly professional and methodical operation for Egypt's manufacturing sector.",
    avatar: "ش",
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
    contentAr: "استقطاب مبرمجي Mastercam ومصممي قوالب الـ SolidWorks كان تحدياً مستمراً. المنصة قدمت حلاً مؤسسياً متكاملاً ربطنا بالكوادر الكفؤة بسرعة ومرونة، وبلا أي نسب عمولة مبالغ فيها.",
    contentEn: "Recruiting Mastercam programmers and SolidWorks mold designers was a persistent bottleneck. The platform delivered an institutional solution that connected us with vetted talent swiftly and reliably with zero contingency fee percentages.",
    avatar: "م",
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = isAr 
        ? (direction === "left" ? 340 : -340)
        : (direction === "left" ? -340 : 340);
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const displayTitle = title || (isAr 
    ? "ثقة كبرى المنشآت الصناعية والمصانع الهندسية في مصر" 
    : "Trusted by Egypt's Premier Machining & Industrial Facilities");

  const displaySubtitle = subtitle || (isAr
    ? "أكثر من 150 منشأة ومصنعاً هندسياً يعتمدون على المنصة لتوفير الكوادر الفنية المعتمدة ومهندسي الإنتاج والبرمجة"
    : "Over 150 verified manufacturing plants rely on our specialized platform for certified CNC machinists and production engineers");

  return (
    <section 
      dir={isAr ? "rtl" : "ltr"} 
      className={`py-14 sm:py-16 bg-gradient-to-b from-slate-50/70 via-white to-slate-50 dark:from-slate-950/60 dark:via-slate-900/80 dark:to-slate-950/60 border-y border-border/60 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* 1. Header & High-Level Metrics */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? "شركاء التوظيف والتشغيل المعتمدون" : "Verified Industrial Machining Partners"}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {displayTitle}
          </h2>
          
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            {displaySubtitle}
          </p>

          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-card border border-border/80 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary font-black text-2xl mb-1">
                  <span>+150</span>
                  <Building2 className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/80">
                  {isAr ? "مصنع ومنشأة هندسية موثقة" : "Verified Industrial Plants"}
                </div>
              </div>
              
              <div className="bg-card border border-border/80 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-2xl mb-1">
                  <span>+1,200</span>
                  <Users className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/80">
                  {isAr ? "فني ومبرمج CNC معتمد" : "Certified Machining Specialists"}
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-500 font-black text-2xl mb-1">
                  <span>98%</span>
                  <Award className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/80">
                  {isAr ? "معدل الرضا التشغيلي للمصانع" : "Operational Satisfaction Rate"}
                </div>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 font-black text-2xl mb-1">
                  <span>48h</span>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-xs font-bold text-foreground/80">
                  {isAr ? "متوسط سرعة الترشيح والمطابقة" : "Average Matching Speed"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Prominent Industrial Companies (Single Horizontal Scrollable Row for Laptop and Mobile) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                {isAr ? "دليل المصانع الهندسية الشريكة" : "Partner Facilities Directory"}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-foreground mt-1.5">
                {isAr ? "أبرز المنشآت الهندسية والمصانع الشريكة" : "Featured Engineering & Machining Facilities"}
              </h3>
            </div>

            {/* Scroll Navigation Controls + View All Link */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link 
                href="/companies" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
              >
                <span>{isAr ? "عرض الكل (+150 مصنع)" : "View all (+150)"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => scrollHorizontally("left")}
                  aria-label="التمرير لليمين"
                  className="p-1.5 rounded-lg hover:bg-secondary/15 text-foreground transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHorizontally("right")}
                  aria-label="التمرير لليسار"
                  className="p-1.5 rounded-lg hover:bg-secondary/15 text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Single Row Horizontal Scrolling Container (Smooth & Clean) */}
          <div 
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            {TRUSTED_COMPANIES.map((company, index) => {
              const name = isAr ? company.nameAr : company.nameEn;
              const zone = isAr ? company.zoneAr : company.zoneEn;
              const specialty = isAr ? company.specialtyAr : company.specialtyEn;
              const badge = isAr ? company.badgeAr : company.badgeEn;

              return (
                <Link
                  key={index}
                  href="/companies"
                  className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-card hover:bg-card/90 border border-border hover:border-primary/50 rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-sm text-start group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Initials Badge + Verified Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center font-mono font-black text-xs">
                        {company.initials}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{badge}</span>
                      </span>
                    </div>

                    {/* Company Name */}
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {name}
                      </h4>
                      <p className="text-xs text-foreground/60 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{zone}</span>
                      </p>
                    </div>

                    {/* Machine & Specialty Focus */}
                    <div className="text-xs text-foreground/75 bg-secondary/10 dark:bg-slate-900/60 p-2.5 rounded-xl border border-border/60 flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium truncate">{specialty}</span>
                    </div>
                  </div>

                  {/* Card Bottom: Active Requisitions Count + Interactive CTA */}
                  <div className="pt-3.5 mt-3.5 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                    <span className="text-foreground/60 font-semibold text-[11px]">
                      {company.activeJobs} {isAr ? "شواغر تشغيل نشطة" : "Active Requisitions"}
                    </span>
                    <span className="inline-flex items-center gap-1 group-hover:underline">
                      <span>{isAr ? "تصفح الشواغر" : "Explore"}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Authentic Testimonials Grid */}
        <div className="space-y-8 pt-2">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3.5 py-1 rounded-full">
              {isAr ? "تقييمات قادة الإنتاج والهندسة" : "Industrial Leadership Feedback"}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground mt-2.5">
              {isAr ? "آراء أصحاب المصانع ومديري التشغيل" : "Testimonials from Production & Plant Managers"}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1.5">
              {isAr ? "تجارب حقيقية لمديري المصانع ومسؤولي التعيينات الفنية في المناطق الصناعية" : "Real shop floor experiences from plant directors and technical recruiters across industrial zones"}
            </p>
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
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors flex flex-col justify-between space-y-4 text-start relative group"
                >
                  <Quote className="w-7 h-7 text-primary/15 absolute top-5 end-5 pointer-events-none" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      &quot;{content}&quot;
                    </p>
                  </div>

                  <div className="space-y-3 pt-3.5 border-t border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {t.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{author}</h4>
                        <p className="text-[11px] text-foreground/60 truncate">{role}</p>
                        <div className="flex items-center gap-1 text-[11px] text-primary font-semibold truncate mt-0.5">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{company} • {location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-foreground/50 pt-1">
                      <span>{date}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {isAr ? "تعيين مكتمل" : "Hired"}
                      </span>
                    </div>

                    <Link
                      href="/companies"
                      className="w-full text-center py-2 px-3 rounded-xl bg-secondary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-1 border border-border"
                    >
                      <span>{isAr ? "عرض الشواغر والملف الفني للمصنع" : "View Plant Requisitions"}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </Link>
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
