"use client";

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
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UpgradePlanButton } from "./UpgradePlanButton";
import { BillingHeader } from "@/components/dashboard/BillingHeader";

export interface PlanData {
  id: string;
  name: string;
  description: string | null;
  priceEGP: number;
  durationDays: number;
  maxActiveJobs: number;
  maxPhoneViews: number;
  canViewPhone: boolean;
  canExportData: boolean;
}

export interface SubscriptionData {
  planName: string;
  price: string;
  renewalDate: string;
  isActive: boolean;
  maxActiveJobs: number;
  activeJobsCount: number;
  maxPhoneViews: number;
  phoneViewsUsed: number;
}

export interface InvoiceData {
  id: string;
  number: string;
  date: string;
  amount: string;
  method: string;
  status: string;
  statusText: string;
  statusColor: string;
}

interface Props {
  subscriptionData: SubscriptionData;
  dbPlans: PlanData[];
  invoices: InvoiceData[];
  paymentStatus?: string;
  isUpgradeReason?: boolean;
}

export default function BillingClientView({
  subscriptionData,
  dbPlans,
  invoices,
  paymentStatus,
  isUpgradeReason,
}: Props) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const jobsPercent = subscriptionData.maxActiveJobs === -1 
    ? 0 
    : Math.min(100, Math.round((subscriptionData.activeJobsCount / Math.max(1, subscriptionData.maxActiveJobs)) * 100));
  
  const phonePercent = subscriptionData.maxPhoneViews === -1 
    ? 0 
    : Math.min(100, Math.round((subscriptionData.phoneViewsUsed / Math.max(1, subscriptionData.maxPhoneViews)) * 100));

  // Localized plan name for standard accounts
  let displayPlanName = subscriptionData.planName;
  if (!isAr) {
    if (subscriptionData.planName.includes("مجانية") || subscriptionData.planName.includes("بدون اشتراك")) {
      displayPlanName = "Standard Tier (No Active Subscription)";
    } else if (subscriptionData.planName.includes("مشرف النظام") || subscriptionData.planName.includes("VIP")) {
      displayPlanName = "System Administrator (Unlimited VIP)";
    } else if (subscriptionData.planName.includes("الذهبية") || subscriptionData.planName.toLowerCase().includes("gold")) {
      displayPlanName = "Enterprise Plan (Gold VIP)";
    } else if (subscriptionData.planName.includes("الاحترافية") || subscriptionData.planName.toLowerCase().includes("pro")) {
      displayPlanName = "Advanced Plan (Pro)";
    } else if (subscriptionData.planName.includes("الأساسية") || subscriptionData.planName.toLowerCase().includes("basic")) {
      displayPlanName = "Basic Plan";
    }
  }

  return (
    <div className="space-y-8 text-start" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Payment Success/Failed Banners */}
      {paymentStatus === "success" && (
        <div className="bg-emerald-500/10 border-2 border-emerald-500 text-foreground p-5 rounded-2xl shadow-md flex items-center gap-3 animate-fade-in">
          <div className="p-2.5 bg-emerald-500 text-white rounded-xl shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {isAr ? "تمت عملية الدفع بنجاح!" : "Payment Completed Successfully!"}
            </h2>
            <p className="text-xs text-foreground/70 mt-0.5">
              {isAr 
                ? "تم تفعيل اشتراكك وتحديث رصيد نشر الوظائف وكشف أرقام الكفاءات في حسابك."
                : "Your subscription has been activated, and your job posting and candidate contact quotas have been updated."}
            </p>
          </div>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="bg-rose-500/10 border-2 border-rose-500 text-foreground p-5 rounded-2xl shadow-md flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 text-white rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">
              {isAr ? "فشلت أو ألغيت عملية الدفع!" : "Payment Failed or Cancelled"}
            </h2>
            <p className="text-xs text-foreground/70 mt-0.5">
              {isAr 
                ? "لم يتم خصم أي مبالغ أو تفعيل الاشتراك. يرجى المحاولة مرة أخرى أو اختيار وسيلة دفع أخرى."
                : "No charges were deducted from your account. Please try again or select an alternate payment method."}
            </p>
          </div>
        </div>
      )}

      {/* Alert banner if redirected from paywall */}
      {isUpgradeReason && (
        <div className="bg-amber-500/10 border-2 border-amber-500 text-foreground p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {isAr ? "لقد وصلت للحد الأقصى في باقتك الحالية!" : "Quota Limit Reached for Current Plan"}
              </h2>
              <p className="text-xs text-foreground/70 mt-0.5">
                {isAr 
                  ? "يرجى ترقية خطتك التشغيلية أدناه لنشر المزيد من إعلانات الوظائف أو كشف أرقام هواتف إضافية للكوادر."
                  : "Please upgrade your operational plan below to publish more job openings or reveal additional specialist contact details."}
              </p>
            </div>
          </div>
          <a href="#plans" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all shrink-0">
            {isAr ? "اختر باقة الترقية ↓" : "Select Upgrade Plan ↓"}
          </a>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {isAr ? "الاشتراكات والمعاملات المالية" : "Subscriptions & Billing"}
        </h1>
        <p className="text-sm text-foreground/60">
          {isAr 
            ? "تابع حالة اشتراك مصنعك الحالي، وحصص التوظيف المتبقية، واستعرض الفواتير السابقة."
            : "Monitor your active manufacturing facility subscription, remaining recruitment quotas, and invoice receipts."}
        </p>
      </div>

      {/* Grid: Plan details & Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Plan overview & Action (spanning 2 cols) */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-4 justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{displayPlanName}</h2>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${subscriptionData.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {subscriptionData.isActive 
                      ? (isAr ? "نشط" : "Active") 
                      : (isAr ? "غير نشط / منتهي" : "Inactive / Expired")}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-1">
                  {isAr 
                    ? `تاريخ التجديد القادم: ${subscriptionData.renewalDate}`
                    : `Next Renewal Date: ${subscriptionData.renewalDate}`}
                </p>
              </div>
            </div>
            
            <div className="text-start sm:text-end">
              <div className="text-2xl font-black text-foreground">{subscriptionData.price}</div>
              <span className="text-[10px] text-foreground/50">{isAr ? "شهرياً" : "Monthly"}</span>
            </div>
          </div>

          {/* Quotas bars */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm">
              {isAr ? "استهلاك باقة الاشتراك الحالية" : "Current Plan Quota Consumption"}
            </h3>
            
            {/* Active jobs progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/70">
                  {subscriptionData.maxActiveJobs === -1 
                    ? (isAr ? `${subscriptionData.activeJobsCount} وظيفة منشورة (غير محدود)` : `${subscriptionData.activeJobsCount} active jobs (Unlimited)`)
                    : (isAr ? `${subscriptionData.activeJobsCount} من أصل ${subscriptionData.maxActiveJobs} وظائف منشورة` : `${subscriptionData.activeJobsCount} of ${subscriptionData.maxActiveJobs} active job posts`)}
                </span>
                <span className="text-primary font-semibold">
                  {subscriptionData.maxActiveJobs === -1 ? "VIP" : `${jobsPercent}%`}
                </span>
              </div>
              <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: subscriptionData.maxActiveJobs === -1 ? "100%" : `${jobsPercent}%` }}></div>
              </div>
            </div>

            {/* Candidate profiles unlocked progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/70">
                  {subscriptionData.maxPhoneViews === -1 
                    ? (isAr ? `${subscriptionData.phoneViewsUsed} سيرة ذاتية تم كشفها (غير محدود)` : `${subscriptionData.phoneViewsUsed} CV reveals (Unlimited)`)
                    : (isAr ? `${subscriptionData.phoneViewsUsed} من أصل ${subscriptionData.maxPhoneViews} سيرة ذاتية تم كشفها` : `${subscriptionData.phoneViewsUsed} of ${subscriptionData.maxPhoneViews} CV & contact reveals`)}
                </span>
                <span className="text-green-600 font-semibold">
                  {subscriptionData.maxPhoneViews === -1 ? "VIP" : `${phonePercent}%`}
                </span>
              </div>
              <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: subscriptionData.maxPhoneViews === -1 ? "100%" : `${phonePercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Plan upgrades promo banner */}
          <div className="p-4 bg-slate-900/5 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-foreground">
                {isAr ? "ترقية الباقة للمصانع والمنشآت الكبرى" : "Enterprise Upgrades for Large Facilities"}
              </h4>
              <p className="text-foreground/60 mt-1 leading-relaxed">
                {isAr 
                  ? "تتيح لك الباقة الشاملة وصولاً غير محدود لقاعدة بيانات الكفاءات، مع ترويج مباشر وتنسيق استباقي عبر فريق الترشيح الفني."
                  : "The Enterprise Tier unlocks unlimited talent pool access, priority matching, and dedicated industrial referral coordination."}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <a href="#plans" className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20">
              {isAr ? "ترقية باقة التوظيف" : "Upgrade Subscription"}
            </a>
          </div>

        </div>

        {/* Right Column: Billing Alert & Security Details */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm">
              {isAr ? "طريقة الدفع المعتمدة" : "Accepted Payment Methods"}
            </h3>
            
            <div className="p-4 border border-border rounded-xl flex items-center justify-between">
              <span className="text-xs text-foreground/50 font-mono">**** **** **** 1092</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">{isAr ? "ميزة / فيزا / ماستركارد" : "Meeza / Visa / MC"}</span>
                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px] rounded-lg">💳</div>
              </div>
            </div>

            <p className="text-[11px] text-foreground/50">
              {isAr 
                ? "الدفع متاح عبر البطاقات البنكية، بطاقات ميزة، محافظ الهاتف المحمول، وأكواد فوري."
                : "Payments supported via Credit/Debit cards, Meeza, Mobile Wallets, and Fawry Pay codes."}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-950 p-6 rounded-2xl space-y-3 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm">
                {isAr ? "معايير الأمان المالي" : "Financial Security Standards"}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-foreground/70">
              {isAr 
                ? "تتم المعاملات المالية بالكامل تحت معايير أمان البنك المركزي المصري بالتعاون مع فوري وباي موب. لن نطلب منك أبداً كلمات سر البطاقات."
                : "All payments are processed securely in compliance with Central Bank of Egypt standards via Paymob and Fawry. Sensitive card details are never stored."}
            </p>
          </div>
        </div>

      </div>

      {/* Plan Tiers Grid */}
      <div id="plans" className="space-y-6 pt-6 border-t border-border">
        <BillingHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbPlans.length > 0 ? (
            dbPlans.map((plan) => {
              const isPro = plan.name.toLowerCase().includes("pro") || plan.name.includes("الاحترافية") || plan.name.includes("المتقدمة");
              const isGold = plan.name.toLowerCase().includes("gold") || plan.name.includes("الذهبية") || plan.name.includes("vip") || plan.name.includes("الشاملة");
              const isPrimary = isPro;
              const priceNum = Number(plan.priceEGP);

              const planTitle = isAr 
                ? plan.name 
                : isGold 
                  ? "Enterprise Plan (Gold VIP)" 
                  : isPro 
                    ? "Advanced Plan (Pro)" 
                    : "Basic Plan";

              const badgeText = isAr ? "الأكثر طلباً للمصانع" : "Most Recommended";

              return (
                <div 
                  key={plan.id}
                  className={`bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 transition-all ${
                    isPrimary ? "border-2 border-primary shadow-md relative" : "border border-border hover:border-primary/50"
                  }`}
                >
                  {isPrimary && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {badgeText}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-base ${isPrimary ? "text-primary" : ""}`}>{planTitle}</h3>
                      {isGold ? <ShieldCheck className="w-5 h-5 text-amber-500" /> : isPro ? <Sparkles className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <span className="text-3xl font-black">
                        {isAr ? `${priceNum.toLocaleString("ar-EG")} ج.م` : `${priceNum.toLocaleString("en-US")} EGP`}
                      </span>
                      <span className="text-xs text-foreground/50"> {isAr ? "/ شهرياً" : "/ month"}</span>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-foreground/70 min-h-[36px]">{plan.description}</p>
                    )}
                    <ul className="space-y-2.5 text-xs text-foreground/80 pt-2 border-t border-border/50">
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                        <span>
                          {plan.maxActiveJobs === -1 
                            ? (isAr ? "نشر وظائف نشطة غير محدود (VIP)" : "Unlimited active job posts (VIP)")
                            : (isAr ? `نشر ${plan.maxActiveJobs} وظائف نشطة متزامنة` : `Publish ${plan.maxActiveJobs} active concurrent job posts`)}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                        <span>
                          {plan.maxPhoneViews === -1 
                            ? (isAr ? "كشف بيانات وأرقام الكفاءات غير محدود" : "Unlimited specialist profile & contact reveals")
                            : (isAr ? `كشف بيانات وأرقام ${plan.maxPhoneViews} فني ومبرمج` : `Reveal ${plan.maxPhoneViews} specialist profiles & contacts`)}
                        </span>
                      </li>
                      {plan.canExportData && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${isPrimary ? "text-primary" : isGold ? "text-amber-500" : "text-green-500"}`} />
                          <span>{isAr ? "تصدير بيانات السير الذاتية إلى ملفات Excel" : "Export candidate profiles to Excel"}</span>
                        </li>
                      )}
                      {isGold && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{isAr ? "أولوية الترشيح المباشر لكوادر المصنع" : "Priority direct referral matching by platform team"}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <UpgradePlanButton 
                    planId={isGold ? "gold" : isPro ? "pro" : "basic"} 
                    amount={priceNum} 
                    label={isAr ? `اختيار ${plan.name}` : `Select ${planTitle}`} 
                    isPrimary={isPrimary} 
                  />
                </div>
              );
            })
          ) : (
            <>
              {/* Basic Plan Fallback */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/50 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base">{isAr ? "الباقة الأساسية (Basic)" : "Basic Plan (Workshops)"}</h3>
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">{isAr ? "1,000 ج.م" : "1,000 EGP"}</span>
                    <span className="text-xs text-foreground/50"> {isAr ? "/ شهرياً" : "/ month"}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{isAr ? "نشر 2 وظيفة نشطة متزامنة" : "2 active concurrent job postings"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{isAr ? "كشف 15 رقم هاتف للكفاءات الفنية" : "15 specialist contact reveals / month"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{isAr ? "لوحة تحكم إدارة المتقدمين" : "Applicant tracking dashboard"}</span>
                    </li>
                  </ul>
                </div>
                <UpgradePlanButton planId="basic" amount={1000} label={isAr ? "اختيار الباقة الأساسية" : "Select Basic Plan"} />
              </div>

              {/* Pro Plan Fallback */}
              <div className="bg-card border-2 border-primary rounded-2xl p-6 shadow-md relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {isAr ? "الأكثر طلباً للمصانع" : "Most Recommended"}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-primary">{isAr ? "الباقة المتقدمة (Pro)" : "Advanced Plan (Pro)"}</h3>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">{isAr ? "2,500 ج.م" : "2,500 EGP"}</span>
                    <span className="text-xs text-foreground/50"> {isAr ? "/ شهرياً" : "/ month"}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{isAr ? "نشر 5 وظائف نشطة متزامنة" : "5 active concurrent job postings"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{isAr ? "كشف 50 رقم هاتف للكفاءات الفنية" : "50 specialist contact reveals / month"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{isAr ? "أولوية التوصية في نتائج المطابقة الفنية" : "Priority recommendation in matching results"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{isAr ? "تصدير بيانات المتقدمين لملفات Excel" : "Export applicants data to Excel"}</span>
                    </li>
                  </ul>
                </div>
                <UpgradePlanButton planId="pro" amount={2500} label={isAr ? "ترقية للباقة المتقدمة" : "Upgrade to Pro Plan"} isPrimary={true} />
              </div>

              {/* Gold Plan Fallback */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base">{isAr ? "الباقة الشاملة (Gold VIP)" : "Enterprise Plan (Gold VIP)"}</h3>
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-black">{isAr ? "5,000 ج.م" : "5,000 EGP"}</span>
                    <span className="text-xs text-foreground/50"> {isAr ? "/ شهرياً" : "/ month"}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{isAr ? "نشر وظائف نشطة غير محدود" : "Unlimited active job postings"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{isAr ? "كشف أرقام هواتف غير محدود" : "Unlimited contact reveals & talent access"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{isAr ? "أولوية النشر المباشر بشبكة الكوادر الهندسية" : "Priority placement in verified engineering network"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{isAr ? "مدير حساب فني للمساعدة في التعيين والمطابقة" : "Dedicated technical account manager for candidate referrals"}</span>
                    </li>
                  </ul>
                </div>
                <UpgradePlanButton planId="gold" amount={5000} label={isAr ? "اختيار الباقة الشاملة" : "Select Enterprise Plan"} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-base mb-6">
          {isAr ? "سجل الفواتير والمعاملات المالية" : "Billing & Invoice History"}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-foreground/50 pb-3">
                <th className="pb-3 font-semibold">{isAr ? "رقم الفاتورة" : "Invoice #"}</th>
                <th className="pb-3 font-semibold">{isAr ? "تاريخ المعاملة" : "Date"}</th>
                <th className="pb-3 font-semibold">{isAr ? "طريقة الدفع" : "Method"}</th>
                <th className="pb-3 font-semibold">{isAr ? "المبلغ" : "Amount"}</th>
                <th className="pb-3 font-semibold text-center">{isAr ? "الحالة" : "Status"}</th>
                <th className="pb-3 font-semibold text-center">{isAr ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4 font-mono text-xs">{inv.number}</td>
                  <td className="py-4 text-xs">{inv.date}</td>
                  <td className="py-4 text-xs text-foreground/60">{inv.method}</td>
                  <td className="py-4 font-bold text-xs">{inv.amount}</td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${inv.statusColor}`}>
                      {isAr ? inv.statusText : (inv.status === "PAID" ? "Paid" : "Pending")}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary/5 transition-colors text-foreground/60" 
                      aria-label={isAr ? "تحميل الفاتورة" : "Download invoice"}
                      title={isAr ? "تحميل الفاتورة" : "Download invoice"}
                    >
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
