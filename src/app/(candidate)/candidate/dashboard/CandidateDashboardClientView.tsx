// src/app/(candidate)/candidate/dashboard/CandidateDashboardClientView.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Settings, 
  Eye, 
  EyeOff, 
  Bell, 
  Bookmark, 
  FileText, 
  Layers, 
  LayoutDashboard,
  Cpu,
  Calendar,
  Building2,
  AlertCircle
} from "lucide-react";
import { updateCandidateAvailability } from "@/app/actions/candidate";
import { WORK_SHIFTS } from "@/lib/constants";

export interface CandidateApplicationItem {
  id: string;
  status: string;
  createdAt: string | Date;
  interviewDate?: string | Date | null;
  interviewLocation?: string | null;
  job: {
    id: string;
    title: string;
    companyName: string;
    governorate: string;
    city: string;
    machineType: string;
    controlRequired: string;
    salaryRange?: string | null;
  };
}

export interface CandidateDashboardData {
  candidate: {
    id: string;
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    isAvailable: boolean;
    jobTitle?: string | null;
    industry?: string | null;
    governorate?: string | null;
    city?: string | null;
    experienceYears: number;
    machinesFreeText?: string | null;
    preferredShift?: string | null;
    skillsSummary?: string | null;
    cvUrl?: string | null;
    completeness: number;
  };
  applications: CandidateApplicationItem[];
}

export default function CandidateDashboardClientView({ data }: { data: CandidateDashboardData }) {
  const { candidate, applications } = data;
  const [isAvailable, setIsAvailable] = useState(candidate.isAvailable);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "alerts" | "applications" | "bookmarks">("dashboard");

  const toggleAvailability = async () => {
    setIsPending(true);
    const nextStatus = !isAvailable;
    const res = await updateCandidateAvailability(nextStatus);
    if (res.success) {
      setIsAvailable(nextStatus);
    }
    setIsPending(false);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "AY";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "قيد الفرز والمراجعة الفنية",
          className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
          icon: Clock,
        };
      case "CONTACTED":
        return {
          label: "تم التواصل من المصنع",
          className: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/50",
          icon: ShieldCheck,
        };
      case "INTERVIEW":
        return {
          label: "تم حجز مقابلة واختبار عملي",
          className: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
          icon: Calendar,
        };
      case "ACCEPTED":
        return {
          label: "مقبول - تم تقديم عرض العمل",
          className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
          icon: CheckCircle,
        };
      case "REJECTED":
        return {
          label: "اعتذار فني",
          className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          className: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. Left Sidebar Navigation (Matching hirecnc.com/dashboard) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-right ${
                activeTab === "dashboard"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/75 hover:bg-secondary/10 hover:text-primary"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>لوحة التحكم (Dashboard)</span>
            </button>

            <Link
              href="/candidate/profile"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-foreground/75 hover:bg-secondary/10 hover:text-primary transition-all text-right"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>ملفي الفني والسيرة الذاتية</span>
            </Link>

            <button
              onClick={() => setActiveTab("alerts")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === "alerts"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/75 hover:bg-secondary/10 hover:text-primary"
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>تنبيهات الوظائف (Job Alerts)</span>
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === "applications"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/75 hover:bg-secondary/10 hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>طلبات التوظيف (Applications)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "applications" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === "bookmarks"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/75 hover:bg-secondary/10 hover:text-primary"
              }`}
            >
              <Bookmark className="w-4 h-4 shrink-0" />
              <span>الوظائف المحفوظة (Bookmarks)</span>
            </button>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <Cpu className="w-4 h-4" />
              <span>فحص الكفاءة الفنية الميداني</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحصل الملفات التي تجتاز تقييم الـ G-code واختبار المعايرة على شارة &quot;كادر معتمد&quot; وتزيد فرص المقابلات بنسبة 3 أضعاف.
            </p>
            <Link
              href="/candidate/profile"
              className="inline-block text-xs font-bold text-sky-300 hover:text-sky-200 underline"
            >
              استكمال فحص الماكينات والكنترول ←
            </Link>
          </div>
        </aside>

        {/* 2. Main Dashboard Content (Matching Image 2 layout) */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                مرحباً بك، {candidate.name}
              </h1>
              <p className="text-xs sm:text-sm text-foreground/60 mt-1">
                تابع كفاءة ملفك الفني وحالة ترشيحات المقابلات مع المصانع الهندسية المعتمدة
              </p>
            </div>

            <Link
              href="/candidate/profile"
              className="inline-flex items-center gap-2 text-xs font-bold bg-secondary/10 hover:bg-secondary/20 border border-border px-4 py-2 rounded-xl text-foreground transition-colors self-start sm:self-auto"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تعديل السيرة الذاتية والبيانات</span>
            </Link>
          </div>

          {/* Two-Column Hero Readiness Row (Matching Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Card: Profile Readiness & Completion Meter */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-start">
              
              {/* Circular Gauge Meter */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-secondary/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - candidate.completeness / 100)}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-xs flex items-center justify-center shadow-sm mb-0.5">
                    {getInitials(candidate.name)}
                  </div>
                  <span className="text-xs font-black text-foreground font-mono">
                    {candidate.completeness}%
                  </span>
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-2.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-foreground/50">🔍 حالة التوفر:</span>
                  <span className={isAvailable ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                    {isAvailable ? "متاح للعمل فوراً" : "مستقر ويبحث عن فرص أفضل"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground/50 shrink-0">💼 التخصص:</span>
                  <span className="font-bold text-foreground truncate">
                    {candidate.jobTitle || "فني / مبرمج CNC"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground/50 shrink-0">📍 المنطقة:</span>
                  <span className="font-medium text-foreground truncate">
                    {candidate.governorate ? `${candidate.governorate} - ${candidate.city}` : "المناطق الصناعية الرئيسية"}
                  </span>
                </div>

                {candidate.preferredShift && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-foreground/50 shrink-0">⏱️ الوردية المفضلة:</span>
                    <span className="font-bold text-foreground truncate">
                      {WORK_SHIFTS.find((s) => s.id === candidate.preferredShift)?.ar || candidate.preferredShift}
                    </span>
                  </div>
                )}

                {candidate.machinesFreeText && (
                  <div className="flex items-center gap-2 text-[11px] text-primary bg-primary/10 px-2.5 py-1 rounded-lg font-medium truncate">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{candidate.machinesFreeText}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Card: Profile Visibility to Recruiters Box */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 text-start">
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isAvailable ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                    {isAvailable ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      ظهور الملف الفني لمسؤولي التوظيف بالمصانع
                    </h3>
                    <p className="text-[11px] text-foreground/60">
                      {isAvailable ? "ملفك الفني متاح للترشيح المباشر وتلقي عروض المقابلات" : "ملفك مخفي حالياً ولا يظهر في بنك الكفاءات"}
                    </p>
                  </div>
                </div>

                {/* Modern Toggle Switch */}
                <button
                  type="button"
                  onClick={toggleAvailability}
                  disabled={isPending}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAvailable ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label="تغيير حالة ظهور الملف"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? "ltr:translate-x-5 rtl:-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-foreground/70 bg-secondary/10 p-3 rounded-xl border border-border/60 leading-relaxed">
                السيرة الذاتية وملف الكفاءة الفنية سيكونان ظاهرين داخل بنك الكفاءات ومتاحين لمديري التشغيل بالمصانع المعتمدة فقط طالما الخيار مفعّل.
              </div>

              <Link
                href="/candidate/profile"
                className="text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors self-start"
              >
                <span>تحديث البيانات وخبرات الماكينات للحصول على ترشيحات أفضل</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>

            </div>

          </div>

          {/* 3. My Job Applications Section (Matching Image 2) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  طلبات التوظيف ومتابعة المقابلات (My Job Applications)
                </h2>
                <p className="text-xs text-foreground/60 mt-0.5">
                  فقط طلبات التوظيف التي تم إرسالها عبر المنصة يتم إدراجها هنا لمتابعة مراحل الفرز والمقابلة الفنية واختبار الورشة.
                </p>
              </div>

              <Link
                href="/#jobs"
                className="text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>تصفح شواغر التشغيل</span>
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5">
                {applications.map((app) => {
                  const statusInfo = getStatusBadge(app.status);
                  const StatusIcon = statusInfo.icon;
                  const dateFormatted = new Date(app.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={app.id}
                      className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start group hover:border-primary/40"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {app.job.title}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{statusInfo.label}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/60">
                          <span className="flex items-center gap-1 font-semibold text-foreground/80">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            <span>{app.job.companyName}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{app.job.governorate} - {app.job.city}</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono text-primary font-bold">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{app.job.machineType} ({app.job.controlRequired})</span>
                          </span>
                          <span className="text-[11px] text-foreground/40">
                            تاريخ التقديم: {dateFormatted}
                          </span>
                        </div>

                        {app.interviewDate && (
                          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 p-2.5 rounded-xl text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>
                              <strong>موعد المقابلة والاختبار الفني:</strong> {new Date(app.interviewDate).toLocaleString("ar-EG")}
                              {app.interviewLocation && ` • في: ${app.interviewLocation}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        <Link
                          href="/#jobs"
                          className="px-3.5 py-1.5 rounded-xl border border-border hover:border-primary/50 text-xs font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <span>عرض تفاصيل الشاغر</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State matching Image 2 */
              <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-primary flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8 opacity-80" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    لم تتقدم لأي شواغر تشغيل بعد
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    تصفح شواغر مخارط وفرايز الـ CNC المتاحة في العاشر من رمضان و6 أكتوبر وبرج العرب، وقدّم مباشرة بضغطة زر.
                  </p>
                </div>
                <Link
                  href="/#jobs"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>تصفح شواغر التشغيل وقدّم الآن</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Machine Recommendations & Targeted Requisitions */}
          <div className="bg-gradient-to-r from-primary/5 via-sky-500/5 to-card border border-primary/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    شواغر تشغيل موصى بها تناسب ماكيناتك ومهاراتك
                  </h3>
                  <p className="text-xs text-foreground/60">
                    مستخلصة تلقائياً طبقاً لنوع الماكينة ونظام الكنترول المسجل في ملفك الفني
                  </p>
                </div>
              </div>
              <Link
                href="/#jobs"
                className="text-xs font-bold text-primary hover:underline hidden sm:inline-block"
              >
                عرض كل الوظائف ←
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-foreground">مشغل فريزة 5 محاور وكنترول Heidenhain</span>
                    <span className="text-primary font-mono">16,000 ج.م</span>
                  </div>
                  <p className="text-xs text-foreground/60">مصنع الأمل للهندسة الميكانيكية • العاشر من رمضان</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/50">
                  <span className="text-emerald-600 font-semibold">تأمين صحي + وجبة + مواصلات</span>
                  <Link href="/#jobs" className="text-primary font-bold hover:underline">تقديم فوري ←</Link>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-foreground">خراط مبرمج CNC (Fanuc Series Oi)</span>
                    <span className="text-primary font-mono">13,500 ج.م</span>
                  </div>
                  <p className="text-xs text-foreground/60">السويدي للصناعات الهندسية • قويسنا الصناعية</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/50">
                  <span className="text-emerald-600 font-semibold">حوافز إنتاج شهرية مجزية</span>
                  <Link href="/#jobs" className="text-primary font-bold hover:underline">تقديم فوري ←</Link>
                </div>
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
