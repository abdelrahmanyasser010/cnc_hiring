// src/app/page.tsx
// هذا هو الملف الرئيسي للصفحة الرئيسية للموقع (Landing Page).
// في Next.js (App Router)، تعتبر هذه الصفحة افتراضياً Server Component يتم تجهيزها على السيرفر بسرعة فائقة.

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
      
      {/* 1. Header (قائمة التنقل العلوية) */}
      <header className="sticky top-0 z-50 glass shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <span className="bg-primary text-white p-1 rounded-lg">hire</span>
              <span>CNC Egypt</span>
            </div>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
              <a href="#about" className="hover:text-primary transition-colors">عن المنصة</a>
              <a href="#metrics" className="hover:text-primary transition-colors">إحصائياتنا</a>
              <a href="#pricing" className="hover:text-primary transition-colors">الباقات والأسعار</a>
              <Link href="/companies" className="hover:text-primary transition-colors">دليل الشركات</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">المدونة المعرفية</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/login" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              دخول أصحاب العمل
            </a>
            <a 
              href="/register" 
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              أعلن عن وظيفة
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (قسم البطل الرئيسي) */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-radial-[circle_at_bottom_left] from-primary/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Right Column: Copy & CTAs */}
          <div className="flex flex-col gap-6 text-right sm:items-start md:text-right">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">
              ⚡ المنصة الأولى والوحيدة لتوظيف فنيي ومهندسي الـ CNC في مصر
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
              ماتشيلش هم عمالة المصنع.. <br />
              <span className="text-primary bg-gradient-to-l from-primary to-sky-600 bg-clip-text text-transparent">أفضل الفنيين والمهندسين بين إيديك</span>
            </h1>
            
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-xl">
              نوفر لأصحاب الورش والمصانع في العاشر من رمضان، 6 أكتوبر، وكل مصر وصولاً مباشراً لأكثر من 5,000 فني ومهندس CNC ومبرمج وخراط محترف وموثق. قدم طلبك الآن وسنقوم بتصفية المتقدمين ذكياً.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <a 
                href="/register" 
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/35 hover:-translate-y-0.5"
              >
                ابدأ البحث عن فنيين ومهندسين الآن
              </a>
              <a 
                href="#pricing" 
                className="px-6 py-3 border border-border text-foreground hover:bg-secondary/5 font-medium rounded-xl transition-all hover:-translate-y-0.5"
              >
                عرض الباقات والأسعار
              </a>
            </div>
          </div>
          
          {/* Left Column: Premium SVG Graphic representing Machine Shop Dashboard */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl relative">
              
              {/* Header inside graphic card */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-foreground/50 font-mono">dashboard.hirecnc.eg</span>
              </div>
              
              {/* Fake Candidates Cards in Arabic */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">أ م</div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-sm">أحمد محمود (خراط مبرمج CNC)</div>
                    <div className="text-xs text-foreground/60">خبرة 5 سنوات • كنترول Fanuc</div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">نشط</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">م ع</div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-sm">محمد علي (فني تشغيل فريزة)</div>
                    <div className="text-xs text-foreground/60">خبرة 3 سنوات • كنترول Siemens</div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-0.5 rounded-full font-medium">مقابلة اليوم</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">ح ح</div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-sm">حسن حسين (مبرمج Mastercam)</div>
                    <div className="text-xs text-foreground/60">خبرة 8 سنوات • تصميم ميكانيكي</div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">نشط</span>
                </div>
              </div>
              
              {/* Mini Stats graph representation */}
              <div className="mt-4 p-3 border border-border rounded-xl bg-background">
                <div className="flex justify-between items-center text-xs text-foreground/60 mb-2">
                  <span>جدية الكوادر المتقدمة</span>
                  <span className="text-green-600 font-semibold">98.5% حضور</span>
                </div>
                <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98.5%] rounded-full"></div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. Metrics Section (إحصائيات المنصة) */}
      <section id="metrics" className="py-16 border-y border-border bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">5,000+</span>
              <span className="text-sm text-foreground/60">فني ومهندس ومبرمج CNC مسجل</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">150+</span>
              <span className="text-sm text-foreground/60">مصنع وورشة مشتركين</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">450+</span>
              <span className="text-sm text-foreground/60">مقابلة مجدولة وناجحة</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-extrabold text-primary">96%</span>
              <span className="text-sm text-foreground/60">نسبة حضور المقابلات والالتزام</span>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. Pricing / الباقات والأسعار المخصصة لمصر */}
      <section id="pricing" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="flex flex-col items-center gap-3 mb-16">
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">باقات مرنة ومناسبة لعملك</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">باقات أصحاب المصانع والورش</h2>
            <p className="text-foreground/60 max-w-xl">اختر الباقة المناسبة لاحتياجات ورشتك أو مصنعك وابدأ باستقبال المتقدمين والوصول المباشر للفنيين والمهندسين خلال دقائق.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Bronze */}
            <div className="flex flex-col bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all relative">
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">الباقة البرونزية (صغار الورش)</h3>
                <p className="text-sm text-foreground/60 mb-6">الحل الأمثل للورش الصغيرة ذات الميزانية الاقتصادية.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-foreground">900</span>
                  <span className="text-sm text-foreground/60 font-semibold">جنيه مصري / شهرياً</span>
                </div>
                
                <hr className="border-border mb-6" />
                
                <ul className="space-y-4 text-sm text-foreground/80 mb-8">
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>نشر وظيفة واحدة نشطة في نفس الوقت</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>رؤية 5 سير ذاتية للفنيين والمهندسين شهرياً</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start text-foreground/40">
                    <svg className="w-5 h-5 text-foreground/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span>أسئلة تصفية ذكية (تقييم فني آلي)</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start text-foreground/40">
                    <svg className="w-5 h-5 text-foreground/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span>إرسال تفاصيل المقابلات عبر واتساب تلقائياً</span>
                  </li>
                </ul>
              </div>
              <a 
                href="/register?plan=bronze" 
                className="mt-auto w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-all text-center"
              >
                اشترك الآن
              </a>
            </div>

            {/* Card 2: Silver (Popular) */}
            <div className="flex flex-col bg-card border-2 border-primary rounded-2xl p-8 hover:shadow-2xl transition-all relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                الأكثر شهرة
              </div>
              
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">الباقة الفضية (مصانع متوسطة)</h3>
                <p className="text-sm text-foreground/60 mb-6">للمؤسسات والمصانع التي تحتاج تدفق مستمر للعمالة الملتزمة.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-foreground">2,500</span>
                  <span className="text-sm text-foreground/60 font-semibold">جنيه مصري / شهرياً</span>
                </div>
                
                <hr className="border-border mb-6" />
                
                <ul className="space-y-4 text-sm text-foreground/80 mb-8">
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>نشر وظائف غير محدودة</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>رؤية 30 سيرة ذاتية للفنيين والمهندسين شهرياً</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>أسئلة تصفية ذكية (تقييم فني آلي)</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>إرسال تفاصيل المقابلات عبر واتساب تلقائياً</span>
                  </li>
                </ul>
              </div>
              
              <a 
                href="/register?plan=silver" 
                className="mt-auto w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 transition-all text-center shadow-lg shadow-primary/25"
              >
                اشترك الآن
              </a>
            </div>

            {/* Card 3: Gold */}
            <div className="flex flex-col bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all relative">
              <div className="text-right">
                <h3 className="text-xl font-bold mb-2">الباقة الذهبية (المؤسسات الكبرى)</h3>
                <p className="text-sm text-foreground/60 mb-6">الحل الشامل للشركات التي تبحث عن موثوقية قصوى وتدقيق متقدم.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-foreground">6,000</span>
                  <span className="text-sm text-foreground/60 font-semibold">جنيه مصري / شهرياً</span>
                </div>
                
                <hr className="border-border mb-6" />
                
                <ul className="space-y-4 text-sm text-foreground/80 mb-8">
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>نشر غير محدود للوظائف</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>رؤية غير محدودة للفنيين والمهندسين وتصدير الملفات</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>تصفية ذكية متقدمة مع دعم فني عبر المكالمات</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>ترويج لوظائفك على جروباتنا على فيسبوك (600ألف فني ومهندس)</span>
                  </li>
                </ul>
              </div>
              <a 
                href="/register?plan=gold" 
                className="mt-auto w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-all text-center"
              >
                اشترك الآن
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer (الفوتر والمستندات القانونية) */}
      <footer className="mt-auto bg-secondary text-secondary-foreground border-t border-border/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="text-right">
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <span className="bg-primary text-white p-1 rounded-lg">hire</span>
              <span>CNC Egypt</span>
            </div>
            <p className="text-sm text-secondary-foreground/60 leading-relaxed">
              منصة التوظيف والحلول الرقمية لربط أصحاب مصانع التشغيل بفنيي ومهندسي ومبرمجي الـ CNC المهرة في مصر.
            </p>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold mb-4 text-sm">روابط سريعة</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/70">
              <a href="#about" className="hover:text-primary transition-colors">عن المنصة</a>
              <a href="#pricing" className="hover:text-primary transition-colors">الباقات والأسعار</a>
              <Link href="/companies" className="hover:text-primary transition-colors">دليل الشركات</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">المدونة المعرفية</Link>
              <a href="/login" className="hover:text-primary transition-colors">دخول المصانع</a>
            </div>
          </div>

          <div className="text-right">
            <h4 className="font-semibold mb-4 text-sm">تكاملات وسياسات</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/70">
              <span className="flex items-center gap-2 justify-start">🔒 دفع آمن مع فوري وباي موب</span>
              <span className="flex items-center gap-2 justify-start">💬 إشعارات المقابلات مؤتمتة عبر الواتساب</span>
              <a href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-border/10 text-center text-xs text-secondary-foreground/40">
          جميع الحقوق محفوظة © {new Date().getFullYear()} hireCNC Egypt. تم التطوير هندسياً بمقاييس عالية.
        </div>
      </footer>
      
    </div>
  );
}

