// src/app/(dashboard)/billing/page.tsx
// صفحة الاشتراكات والفواتير وإدارة المدفوعات لأصحاب المصانع.
// يتم جلب البيانات ديناميكياً عبر معمارية الـ Repositories.

import React from "react";
import { 
  CreditCard, 
  Clock, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dashboardRepo, planRepo } from "@/infrastructure/container";
import { redirect } from "next/navigation";
import { UpgradePlanButton } from "./UpgradePlanButton";
import { AR_DICTIONARY } from "@/lib/dictionary/ar";

interface BillingPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  // 1. التحقق من تسجيل الدخول
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const isUpgradeReason = resolvedParams.reason === "upgrade";
  const paymentStatus = resolvedParams.status as string | undefined;

  const user = session.user as { id?: string; role?: string };
  const isAdmin = user.role === "SUPER_ADMIN";

  // 2. جلب إحصائيات وباقة الاشتراك الحية عبر الـ Repository
  let subscriptionData = {
    planName: "باقة مجانية (بدون اشتراك نشط)",
    price: "0 ج.م",
    renewalDate: "غير محدد",
    isActive: false,
    maxActiveJobs: 1,
    activeJobsCount: 0,
    maxPhoneViews: 0,
    phoneViewsUsed: 0,
  };

  if (isAdmin) {
    subscriptionData = {
      planName: "مشرف النظام (VIP غير محدود)",
      price: "غير قابل للتطبيق",
      renewalDate: "دائم",
      isActive: true,
      maxActiveJobs: -1,
      activeJobsCount: 0,
      maxPhoneViews: -1,
      phoneViewsUsed: 0,
    };
  } else if (user.id) {
    try {
      const stats = await dashboardRepo.getEmployerStats(user.id);
      if (stats.subscription) {
        subscriptionData = {
          planName: stats.subscription.planName,
          price: stats.subscription.planName.includes("Pro") || stats.subscription.planName.includes("الذهبية") ? "5,000 ج.م" : "2,500 ج.م",
          renewalDate: new Date(stats.subscription.endDate).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
          isActive: true,
          maxActiveJobs: stats.subscription.maxActiveJobs,
          activeJobsCount: stats.subscription.activeJobsCount,
          maxPhoneViews: stats.subscription.maxPhoneViews,
          phoneViewsUsed: stats.subscription.phoneViewsUsed,
        };
      } else {
        subscriptionData.activeJobsCount = stats.activeJobs;
      }
    } catch (error) {
      console.warn("Could not load real billing stats:", error);
    }
  }

  const jobsPercent = subscriptionData.maxActiveJobs === -1 ? 0 : Math.min(100, Math.round((subscriptionData.activeJobsCount / Math.max(1, subscriptionData.maxActiveJobs)) * 100));
  const phonePercent = subscriptionData.maxPhoneViews === -1 ? 0 : Math.min(100, Math.round((subscriptionData.phoneViewsUsed / Math.max(1, subscriptionData.maxPhoneViews)) * 100));

  // جلب الباقات النشطة من جدول SubscriptionPlan عبر الـ Repository لعرض الأسعار والحصص ديناميكياً
  const dbPlans = await planRepo.listActivePlans();

  // بيانات تجريبية للفواتير السابقة
  const invoices = [
    {
      id: "1",
      number: "INV-2026-008",
      date: "26 يونيو 2026",
      amount: "2,500 جنيه مصري",
      method: "بوابة Paymob (بطاقة ميزة)",
      status: "PAID",
      statusText: "مدفوعة",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      id: "2",
      number: "INV-2026-003",
      date: "26 مايو 2026",
      amount: "2,500 جنيه مصري",
      method: "كود دفع فوري (Fawry Cash)",
      status: "PAID",
      statusText: "مدفوعة",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
  ];

  return (
    <div className="space-y-8 text-right">
      
      {/* Payment Success/Failed Banners */}
      {paymentStatus === "success" && (
        <div className="bg-emerald-500/10 border-2 border-emerald-500 text-foreground p-5 rounded-2xl shadow-md flex items-center gap-3 animate-fade-in">
          <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400">تمت عملية الدفع بنجاح!</h2>
            <p className="text-xs text-foreground/70 mt-0.5">تم تفعيل اشتراكك وتحديث رصيد الوظائف ومشاهدات الهواتف في حسابك الفعلي.</p>
          </div>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="bg-rose-500/10 border-2 border-rose-500 text-foreground p-5 rounded-2xl shadow-md flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 text-white rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">فشلت أو ألغيت عملية الدفع!</h2>
            <p className="text-xs text-foreground/70 mt-0.5">لم يتم خصم أي مبالغ أو تفعيل الاشتراك. يرجى المحاولة مرة أخرى أو اختيار وسيلة دفع أخرى.</p>
          </div>
        </div>
      )}

      {/* Alert banner if redirected from paywall */}
      {isUpgradeReason && (
        <div className="bg-amber-500/10 border-2 border-amber-500 text-foreground p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-600 dark:text-amber-400">لقد وصلت للحد الأقصى في باقتك الحالية!</h2>
              <p className="text-xs text-foreground/70 mt-0.5">يرجى ترقية اشتراكك أدناه لنشر المزيد من الوظائف أو كشف أرقام هواتف إضافية للكوادر.</p>
            </div>
          </div>
          <a href="#plans" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0">
            اختر باقة الترقية ↓
          </a>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">الاشتراكات والمعاملات المالية</h1>
        <p className="text-sm text-foreground/60">تابع حالة اشتراك مصنعك الحالي، وحصص التوظيف المتبقية، واستعرض الفواتير السابقة.</p>
      </div>

      {/* Grid: Plan details & Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Plan overview & Action (spanning 2 cols) */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-4 justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{subscriptionData.planName}</h2>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${subscriptionData.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {subscriptionData.isActive ? "نشط" : "غير نشط / منتهي"}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-1">تاريخ التجديد القادم: {subscriptionData.renewalDate}</p>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <div className="text-2xl font-black text-foreground">{subscriptionData.price}</div>
              <span className="text-[10px] text-foreground/50">شهرياً</span>
            </div>
          </div>

          {/* Quotas bars */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm">استهلاك باقة الاشتراك الحالية</h3>
            
            {/* Active jobs progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/70">
                  {subscriptionData.maxActiveJobs === -1 ? `${subscriptionData.activeJobsCount} وظيفة منشورة (غير محدود)` : `${subscriptionData.activeJobsCount} من أصل ${subscriptionData.maxActiveJobs} وظائف منشورة`}
                </span>
                <span className="text-primary font-semibold">{subscriptionData.maxActiveJobs === -1 ? "VIP" : `${jobsPercent}% مستهلك`}</span>
              </div>
              <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: subscriptionData.maxActiveJobs === -1 ? "100%" : `${jobsPercent}%` }}></div>
              </div>
            </div>

            {/* Candidate profiles unlocked progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/70">
                  {subscriptionData.maxPhoneViews === -1 ? `${subscriptionData.phoneViewsUsed} سيرة ذاتية تم كشفها (غير محدود)` : `${subscriptionData.phoneViewsUsed} من أصل ${subscriptionData.maxPhoneViews} سيرة ذاتية تم كشفها`}
                </span>
                <span className="text-green-600 font-semibold">{subscriptionData.maxPhoneViews === -1 ? "VIP" : `${phonePercent}% مستهلك`}</span>
              </div>
              <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: subscriptionData.maxPhoneViews === -1 ? "100%" : `${phonePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Plan upgrades promo banner */}
          <div className="p-4 bg-slate-900/5 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-start gap-3 justify-end">
            <div className="flex-1 text-right text-xs">
              <h4 className="font-bold text-foreground">هل تريد تصفية غير محدودة وترويج فيسبوك؟</h4>
              <p className="text-foreground/60 mt-1">
                قم بالترقية للباقة الذهبية للوصول لجروبات الفنيين الكبرى (600 ألف فني) والوصول المباشر لقاعدة البيانات بلا حدود.
              </p>
            </div>
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="#plans" className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20">
              ترقية باقة التوظيف
            </a>
            <button className="px-5 py-2.5 border border-border hover:bg-secondary/5 font-semibold text-sm rounded-xl transition-all">
              إلغاء الاشتراك
            </button>
          </div>

        </div>

        {/* Right Column: Billing Alert & Details (spanning 1 col) */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm">طريقة الدفع الافتراضية</h3>
            
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <span className="text-xs text-foreground/50 font-mono">**** **** **** 1092</span>
              <div className="flex items-center gap-2 justify-start">
                <span className="text-xs font-semibold">ميزة Meeza</span>
                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px] rounded-lg">💳</div>
              </div>
            </div>

            <button className="w-full py-2.5 border border-border hover:bg-secondary/5 font-semibold text-xs rounded-xl transition-all">
              تعديل بيانات الدفع
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-950 p-6 rounded-2xl space-y-3 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400">
            <div className="flex items-center gap-2 justify-start text-amber-800 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h4 className="font-bold text-sm">ملاحظة أمنية لأصحاب المصانع</h4>
            </div>
            <p className="text-xs leading-relaxed text-foreground/70">
              تتم المعاملات المالية بالكامل تحت معايير أمان البنك المركزي المصري بالتعاون مع فوري وباي موب. لن نطلب منك أبداً كلمات سر البطاقات.
            </p>
          </div>
        </div>

      </div>

      {/* Plan Tiers Grid */}
      <div id="plans" className="space-y-6 pt-6 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">{AR_DICTIONARY.billing.pageTitle}</h2>
          <p className="text-xs text-foreground/60">{AR_DICTIONARY.billing.pageSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbPlans.length > 0 ? (
            dbPlans.map((plan) => {
              const isPro = plan.name.toLowerCase().includes("pro") || plan.name.includes("الاحترافية");
              const isGold = plan.name.toLowerCase().includes("gold") || plan.name.includes("الذهبية") || plan.name.includes("vip");
              const isPrimary = isPro;
              const priceNum = Number(plan.priceEGP);

              return (
                <div 
                  key={plan.id}
                  className={`bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 transition-all ${
                    isPrimary ? "border-2 border-primary shadow-md relative" : "border border-border hover:border-primary/50"
                  }`}
                >
                  {isPrimary && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      الأكثر طلباً للمصانع
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-base ${isPrimary ? "text-primary" : ""}`}>{plan.name}</h3>
                      {isGold ? <ShieldCheck className="w-5 h-5 text-amber-500" /> : isPro ? <Sparkles className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <span className="text-3xl font-black">{priceNum.toLocaleString("ar-EG")} ج.م</span>
                      <span className="text-xs text-foreground/50"> / شهرياً</span>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-foreground/70 min-h-[36px]">{plan.description}</p>
                    )}
                    <ul className="space-y-2.5 text-xs text-foreground/80 pt-2 border-t border-border/50">
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                        <span>{plan.maxActiveJobs === -1 ? "نشر وظائف نشطة غير محدود (VIP)" : `نشر ${plan.maxActiveJobs} وظائف نشطة متزامنة`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                        <span>{plan.maxPhoneViews === -1 ? "كشف أرقام تليفونات غير محدود" : `كشف أرقام تليفون ${plan.maxPhoneViews} فني ومبرمج`}</span>
                      </li>
                      {plan.canExportData && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                          <span>تصدير بيانات السير الذاتية إلى ملفات Excel</span>
                        </li>
                      )}
                      {isGold && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>ترويج مباشر على جروبات فيسبوك الفنيين (600 ألف فني)</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <UpgradePlanButton 
                    planId={isGold ? "gold" : isPro ? "pro" : "basic"} 
                    amount={priceNum} 
                    label={`اختيار ${plan.name}`} 
                    isPrimary={isPrimary} 
                  />
                </div>
              );
            })
          ) : (
            <>
              {/* Basic Plan */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base">الباقة الأساسية (Basic)</h3>
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">1,000 ج.م</span>
                    <span className="text-xs text-foreground/50"> / شهرياً</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /><span>نشر 2 وظيفة نشطة متزامنة</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /><span>كشف 15 رقم هاتف للكفاءات الفنية</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /><span>لوحة تحكم إدارة المتقدمين</span></li>
                  </ul>
                </div>
                <UpgradePlanButton planId="basic" amount={1000} label="اختيار الباقة الأساسية" />
              </div>

              {/* Pro Plan */}
              <div className="bg-card border-2 border-primary rounded-2xl p-6 shadow-md relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  الأكثر طلباً للمصانع
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-primary">الباقة الاحترافية (Pro)</h3>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">2,500 ج.م</span>
                    <span className="text-xs text-foreground/50"> / شهرياً</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0" /><span>نشر 5 وظائف نشطة متزامنة</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0" /><span>كشف 50 رقم هاتف للكفاءات الفنية</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0" /><span>أولوية التوصية في نتائج المطابقة الذكية</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0" /><span>تصدير بيانات المتقدمين لملفات Excel</span></li>
                  </ul>
                </div>
                <UpgradePlanButton planId="pro" amount={2500} label="ترقية للباقة الاحترافية" isPrimary={true} />
              </div>

              {/* Gold Plan */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base">الباقة الذهبية (Gold VIP)</h3>
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">5,000 ج.م</span>
                    <span className="text-xs text-foreground/50"> / شهرياً</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0" /><span>نشر وظائف نشطة غير محدود</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0" /><span>كشف أرقام هواتف غير محدود</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0" /><span>ترويج ممول على جروبات الفيسبوك (600ألف فني)</span></li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500 shrink-0" /><span>مدير حساب شخصي للمساعدة في التوظيف</span></li>
                  </ul>
                </div>
                <UpgradePlanButton planId="gold" amount={5000} label="اختيار الباقة الذهبية" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-base mb-6">سجل الفواتير السابقة</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-foreground/50 pb-3">
                <th className="pb-3 font-semibold">رقم الفاتورة</th>
                <th className="pb-3 font-semibold">تاريخ المعاملة</th>
                <th className="pb-3 font-semibold">طريقة الدفع</th>
                <th className="pb-3 font-semibold text-left">المبلغ</th>
                <th className="pb-3 font-semibold text-center">الحالة</th>
                <th className="pb-3 font-semibold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4 font-mono text-xs">{inv.number}</td>
                  <td className="py-4">{inv.date}</td>
                  <td className="py-4 text-xs text-foreground/60">{inv.method}</td>
                  <td className="py-4 text-left font-bold">{inv.amount}</td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${inv.statusColor}`}>
                      {inv.statusText}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button className="p-1.5 rounded-lg border border-border hover:bg-secondary/5 transition-colors text-foreground/60" aria-label="تحميل الفاتورة">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
