"use client";

// src/components/shared/LandingContent.tsx
// محتوى الإحصائيات والباقات والفوتر في الصفحة الرئيسية. يدعم الترجمة الفورية بالكامل بين العربية والإنجليزية.

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Check, Lock, MessageSquare } from "lucide-react";

export function LandingContent() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <>
      {/* 3. Metrics Section (إحصائيات المنصة) */}
      <section id="metrics" className="py-16 border-y border-border bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-card/50 border border-border/50">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">5,000+</span>
              <span className="text-xs sm:text-sm text-foreground/70 font-medium">
                {isAr ? "فني ومهندس ومبرمج CNC مسجل" : "Registered CNC Specialists & Programmers"}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-card/50 border border-border/50">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">150+</span>
              <span className="text-xs sm:text-sm text-foreground/70 font-medium">
                {isAr ? "مصنع وورشة مشتركين" : "Subscribed Factories & Workshops"}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-card/50 border border-border/50">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">450+</span>
              <span className="text-xs sm:text-sm text-foreground/70 font-medium">
                {isAr ? "مقابلة مجدولة وناجحة" : "Successful Scheduled Interviews"}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-card/50 border border-border/50">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">96%</span>
              <span className="text-xs sm:text-sm text-foreground/70 font-medium">
                {isAr ? "نسبة حضور المقابلات والالتزام" : "Interview Attendance & Reliability Rate"}
              </span>
            </div>
            
          </div>
        </div>
      </section>

      {/* منهجية العمل والربط الصناعي (Pillars from Brief) */}
      <section id="about" className="py-20 bg-background border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary text-xs sm:text-sm font-bold tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full">
              {isAr ? "منظومة الربط والترشيح الصناعي التخصصي" : "Specialized Industrial Referral Methodology"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mt-3">
              {isAr ? "الفرز الفني والترشيح المباشر لكوادر التشغيل الميكانيكي والـ CNC" : "Precise Technical Evaluation & Direct Referrals for CNC Machining"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-foreground/65 mt-3 leading-relaxed">
              {isAr 
                ? "منظومة رقمية متخصصة تهدف لتلبية الاحتياجات التشغيلية للمصانع والورش الهندسية في مصر، بمراعاة المعايير الفنية لأنظمة التحكم (CNC Controllers) وتطبيقات الصناعات التحويلية."
                : "An engineering-first platform tailored to production workshops and factories across Egypt, aligned with controller standards and sector-specific machining requirements."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg mb-4">
                01
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2">
                {isAr ? "التقسيم بالصناعة أولاً" : "Industry-First Architecture"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">
                {isAr 
                  ? "تصنيف دقيق يغطي 11 قطاعاً حيوياً (الإسطمبات، المستلزمات الطبية، الطيران، السيارات، البترول والغاز، تشكيل الصاج، وغيرها) لضمان توافق بيئة العمل."
                  : "Structured classification covering 11 critical sectors (Molds & Dies, Medical, Aerospace, Automotive, Oil & Gas, Sheet Metal, etc.) ensuring work environment alignment."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg mb-4">
                02
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2">
                {isAr ? "مرونة توصيف الماكينات والمهام" : "Free-Text Machine & Title Flexibility"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">
                {isAr 
                  ? "حرية تامة في تدوين المسميات الدقيقة، طرازات الماكينات، وأنظمة الكنترول (Fanuc، Siemens، Heidenhain) لتطابق واقع بيئة الإنتاج الفعلية دون قيود جامدة."
                  : "Complete flexibility for defining exact machine models, controller variants (Fanuc, Siemens, Heidenhain), and machining operations reflecting production reality."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg mb-4">
                03
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2">
                {isAr ? "الترشيح المباشر بموافقة مسبقة" : "Direct Nomination & Candidate Consent"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">
                {isAr 
                  ? "إدارة المنصة تطابق متطلبات المنشأة وترشح الكفاءات استباقياً، ولا تتم مشاركة بيانات الاتصال إلا بعد التنسيق المسبق مع المرشح والتأكد من ملاءمته وجاهزيته."
                  : "Proactive candidate matching and nomination; contact details are shared only after candidate consultation and verified readiness."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Pricing / الباقات والأسعار المخصصة لمصر */}
      <section id="pricing" className="py-20 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="flex flex-col items-center gap-3 mb-12 sm:mb-16">
            <span className="text-primary text-xs sm:text-sm font-bold tracking-wide uppercase bg-primary/10 px-3.5 py-1 rounded-full">
              {isAr ? "اشتراك شفاف وثابت • بدون عمولات نسب مئوية" : "Flat Rate Subscriptions • Zero Placement Fees"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {isAr ? "باقات المنشآت الصناعية والورش الإنتاجية" : "Machine Shop & Manufacturing Facility Plans"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-foreground/70 max-w-2xl leading-relaxed">
              {isAr 
                ? "باقات اشتراك تشغيلية واضحة بدون عمولات توظيف خفية أو اقتطاع نسب من رواتب الفنيين. اختر الخطة المناسبة لحجم مصنعك."
                : "Transparent flat-rate plans with zero contingency placement percentage fees. Select the hiring model tailored to your shop's capacity."
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            
            {/* Card 1: Bronze */}
            <div className="flex flex-col bg-card border border-border rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all relative text-start">
              <div className="text-xs italic text-foreground/60 bg-secondary/5 border-s-2 border-primary/40 ps-3 py-2 rounded-e-lg mb-4 font-serif">
                {isAr 
                  ? "«نحتاج تعيين فنيين بشكل محدد ودوري بأقل تكلفة دون التزام باقات سنوية ضخمة»" 
                  : "\"We need cost-effective, periodic hiring without heavy annual commitments\""}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                {isAr ? "الباقة الأساسية (الورش الإنتاجية)" : "Basic Plan (Job Shops)"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/60 mb-6">
                {isAr ? "مخصصة للورش والمنشآت ذات متطلبات التوظيف الدورية المحددة." : "Designed for machine shops with periodic technical staffing needs."}
              </p>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">900</span>
                <span className="text-xs sm:text-sm text-foreground/60 font-semibold">{isAr ? "جنيه مصري / شهرياً" : "EGP / month"}</span>
              </div>
              
              <hr className="border-border mb-6" />
              
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-foreground/80 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "نشر وظيفة واحدة نشطة في نفس الوقت" : "1 active job post at a time"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "رؤية 5 سير ذاتية للفنيين والمهندسين شهرياً" : "Reveal 5 specialist CVs & phone numbers / month"}</span>
                </li>
                <li className="flex items-start gap-2.5 text-foreground/50">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/30 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "أسئلة تصفية ذكية (تقييم فني آلي)" : "Smart technical screening questions"}</span>
                </li>
                <li className="flex items-start gap-2.5 text-foreground/50">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/30 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "إرسال تفاصيل المقابلات عبر واتساب تلقائياً" : "Automated WhatsApp interview invitations"}</span>
                </li>
              </ul>
              
              <Link 
                href="/register?plan=bronze" 
                className="mt-auto w-full py-3 bg-secondary text-secondary-foreground font-semibold text-xs sm:text-sm rounded-xl hover:bg-secondary/90 transition-all text-center block"
              >
                {isAr ? "اختيار الخطة" : "Select Plan"}
              </Link>
            </div>

            {/* Card 2: Silver (Popular) */}
            <div className="flex flex-col bg-card border-2 border-primary rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all relative text-start shadow-lg shadow-primary/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[11px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                {isAr ? "الأكثر ملاءمة للمصانع" : "Most Popular for Plants"}
              </div>
              
              <div className="text-xs italic text-foreground/60 bg-primary/5 border-s-2 border-primary ps-3 py-2 rounded-e-lg mb-4 mt-2 font-serif">
                {isAr 
                  ? "«نحتاج تدفقاً مستمراً من الكوادر الفنية لمصنعنا دون دفع عمولات 20% و25% عن كل تعيين»" 
                  : "\"We need an ongoing pipeline of vetted machinists without paying 20-25% contingency placement fees\""}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                {isAr ? "الباقة المتقدمة (المصانع المتوسطة)" : "Advanced Plan (Production Plants)"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/60 mb-6">
                {isAr ? "للمصانع الإنتاجية التي تتطلب استمراراً في تدفق وتعيين الكوادر الفنية." : "For production facilities requiring continuous talent acquisition and technical pipeline."}
              </p>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">2,500</span>
                <span className="text-xs sm:text-sm text-foreground/60 font-semibold">{isAr ? "جنيه مصري / شهرياً" : "EGP / month"}</span>
              </div>
              
              <hr className="border-border mb-6" />
              
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-foreground/80 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-foreground">{isAr ? "نشر وظائف غير محدودة" : "Unlimited active job posts"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-foreground">{isAr ? "رؤية 30 سيرة ذاتية للفنيين والمهندسين شهرياً" : "Reveal 30 specialist CVs & numbers / month"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "أسئلة تصفية ذكية (تقييم فني آلي)" : "Smart technical screening questions"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "إرسال تفاصيل المقابلات عبر واتساب تلقائياً" : "Automated WhatsApp interview invitations"}</span>
                </li>
              </ul>
              
              <Link 
                href="/register?plan=silver" 
                className="mt-auto w-full py-3 bg-primary text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-primary/95 transition-all text-center shadow-md shadow-primary/25 block"
              >
                {isAr ? "اختيار الخطة" : "Select Plan"}
              </Link>
            </div>

            {/* Card 3: Gold */}
            <div className="flex flex-col bg-card border border-border rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all relative text-start">
              <div className="text-xs italic text-foreground/60 bg-secondary/5 border-s-2 border-primary/40 ps-3 py-2 rounded-e-lg mb-4 font-serif">
                {isAr 
                  ? "«مجمع صناعي كبير يحتاج وصولاً غير محدود لقاعدة الكوادر وأولوية في الترشيح المباشر»" 
                  : "\"Large enterprise facility requiring full database access and direct priority recruitment\""}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                {isAr ? "الباقة الشاملة (المجمعات الصناعية والشركات الكبرى)" : "Enterprise Plan (Industrial Complexes)"}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/60 mb-6">
                {isAr ? "حل مؤسسي شامل يتيح الوصول الكامل لقاعدة البيانات وخدمات الدعم المباشر." : "Comprehensive institutional solution offering unrestricted talent access and dedicated support."}
              </p>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">6,000</span>
                <span className="text-xs sm:text-sm text-foreground/60 font-semibold">{isAr ? "جنيه مصري / شهرياً" : "EGP / month"}</span>
              </div>
              
              <hr className="border-border mb-6" />
              
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-foreground/80 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-foreground">{isAr ? "نشر غير محدود للوظائف" : "Unlimited active job posts"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-foreground">{isAr ? "رؤية غير محدودة وتصدير لبيانات الكفاءات" : "Unlimited candidate reveals & data export"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "تصفية متقدمة مع خط دعم فني مباشر" : "Advanced screening with dedicated engineering line"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{isAr ? "أولوية نشر الوظائف في شبكة الكوادر الهندسية والتشغيلية المعتمدة" : "Priority distribution across verified industrial engineering networks"}</span>
                </li>
              </ul>
              
              <Link 
                href="/register?plan=gold" 
                className="mt-auto w-full py-3 bg-secondary text-secondary-foreground font-semibold text-xs sm:text-sm rounded-xl hover:bg-secondary/90 transition-all text-center block"
              >
                {isAr ? "اختيار الخطة" : "Select Plan"}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer (الفوتر والمستندات القانونية) */}
      <footer className="mt-auto bg-secondary text-secondary-foreground border-t border-border/10 py-12 text-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <span className="bg-primary text-white p-1 rounded-lg">hire</span>
              <span>CNC {isAr ? "Egypt" : "Egypt"}</span>
            </div>
            <p className="text-xs sm:text-sm text-secondary-foreground/70 leading-relaxed max-w-sm">
              {isAr 
                ? "منصة التوظيف والحلول الرقمية الأولى لربط أصحاب مصانع التشغيل بفنيي ومهندسي ومبرمجي الـ CNC المهرة في مصر."
                : "Egypt's premier digital hiring platform connecting machining factories with skilled CNC technicians and CAM engineers."
              }
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm text-secondary-foreground">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-secondary-foreground/70">
              <a href="#about" className="hover:text-primary transition-colors">{isAr ? "عن المنصة" : "About Platform"}</a>
              <a href="#pricing" className="hover:text-primary transition-colors">{isAr ? "الباقات والأسعار" : "Pricing & Plans"}</a>
              <Link href="/companies" className="hover:text-primary transition-colors">{isAr ? "دليل الشركات" : "Factory Directory"}</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">{isAr ? "المدونة المعرفية" : "Knowledge Blog"}</Link>
              <Link href="/login" className="hover:text-primary transition-colors">{isAr ? "دخول المصانع" : "Employer Login"}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm text-secondary-foreground">{isAr ? "تكاملات وسياسات" : "Integrations & Policies"}</h4>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-secondary-foreground/70">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{isAr ? "دفع آمن مع فوري وباي موب" : "Secure payments via Fawry & Paymob"}</span>
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{isAr ? "إشعارات المقابلات مؤتمتة عبر الواتساب" : "Automated WhatsApp interview notifications"}</span>
              </span>
              <Link href="/privacy" className="hover:text-primary transition-colors mt-1 block">
                {isAr ? "سياسة الخصوصية والاستخدام" : "Privacy Policy & Terms"}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-border/10 text-center text-xs text-secondary-foreground/50">
          {isAr 
            ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} hireCNC Egypt. تم التطوير هندسياً بمقاييس عالية.`
            : `All rights reserved © ${new Date().getFullYear()} hireCNC Egypt. Engineered to high industry standards.`
          }
        </div>
      </footer>
    </>
  );
}
