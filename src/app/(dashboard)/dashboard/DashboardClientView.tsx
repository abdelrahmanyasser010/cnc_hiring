"use client";

import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Activity, 
  Plus, 
  Search, 
  Target, 
  CreditCard,
  Building2,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface StatItem {
  titleAr: string;
  titleEn: string;
  value: string;
  changeAr: string;
  changeEn: string;
  iconType: "Briefcase" | "Users" | "Calendar" | "TrendingUp" | "Building2" | "CheckCircle";
  color: string;
}

export interface ActivityItem {
  id: string;
  name?: string;
  jobTitle?: string;
  experience?: string;
  score?: string;
  status?: string;
  statusTextAr?: string;
  statusTextEn?: string;
  statusColor?: string;
  actionAr?: string;
  actionEn?: string;
  user?: string | null;
  role?: string;
  createdAt?: string | Date;
}

export interface EmployerSubscriptionData {
  planName: string;
  endDate: string | Date;
  maxActiveJobs: number;
  activeJobsCount: number;
  maxPhoneViews: number;
  phoneViewsUsed: number;
}

interface Props {
  isAdmin: boolean;
  stats: StatItem[];
  activities: ActivityItem[];
  employerSubscription: EmployerSubscriptionData | null;
}

const ICON_MAP = {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Building2,
  CheckCircle,
};

export default function DashboardClientView({
  isAdmin,
  stats,
  activities,
  employerSubscription,
}: Props) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="space-y-8 text-start" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. Subscription Quota Bar Widget (For Employers) */}
      {!isAdmin && employerSubscription && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {employerSubscription.planName}
              </span>
              <h2 className="text-base font-bold text-foreground">
                {isAr ? "حالة استهلاك باقة الاشتراك" : "Subscription Quota Status"}
              </h2>
            </div>
            <p className="text-xs text-foreground/60">
              {isAr ? "تاريخ انتهاء الباقة الحالي: " : "Current renewal date: "}
              {new Date(employerSubscription.endDate).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            {/* Active Jobs Bar */}
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground/70">{isAr ? "الوظائف النشطة" : "Active Jobs"}</span>
                <span className="text-primary font-bold">
                  {employerSubscription.maxActiveJobs === -1 
                    ? (isAr ? `${employerSubscription.activeJobsCount} (غير محدود)` : `${employerSubscription.activeJobsCount} (VIP)`)
                    : `${employerSubscription.activeJobsCount} / ${employerSubscription.maxActiveJobs}`}
                </span>
              </div>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: employerSubscription.maxActiveJobs === -1 ? "100%" : `${Math.min(100, (employerSubscription.activeJobsCount / Math.max(1, employerSubscription.maxActiveJobs)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Phone Views Bar */}
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground/70">{isAr ? "مشاهدات أرقام الهواتف" : "Phone Reveals"}</span>
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {employerSubscription.maxPhoneViews === -1 
                    ? (isAr ? `${employerSubscription.phoneViewsUsed} (غير محدود)` : `${employerSubscription.phoneViewsUsed} (VIP)`)
                    : `${employerSubscription.phoneViewsUsed} / ${employerSubscription.maxPhoneViews}`}
                </span>
              </div>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: employerSubscription.maxPhoneViews === -1 ? "100%" : `${Math.min(100, (employerSubscription.phoneViewsUsed / Math.max(1, employerSubscription.maxPhoneViews)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <Link
              href="/billing?reason=upgrade"
              className="w-full sm:w-auto px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{isAr ? "ترقية الباقة" : "Upgrade Plan"}</span>
              <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = ICON_MAP[stat.iconType] || Briefcase;
          return (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-foreground/50 font-semibold">
                  {isAr ? stat.titleAr : stat.titleEn}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-[10px] text-foreground/50 font-semibold">
                  {isAr ? stat.changeAr : stat.changeEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Area: Activities / Submissions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column (2 cols): Applicants Table / Audit Log */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:col-span-2">
          {isAdmin ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>{isAr ? "آخر العمليات المسجلة بالنظام (Audit Logs)" : "Recent System Activity Logs"}</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-xs text-foreground/40 text-center py-6">
                    {isAr ? "لا توجد سجلات نشاط مسجلة حالياً." : "No activity logs recorded."}
                  </p>
                ) : (
                  activities.map((log) => (
                    <div key={log.id} className="p-3 border border-border rounded-xl bg-secondary/5 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-foreground/80 leading-relaxed">
                          {isAr ? log.actionAr : (log.actionEn || log.actionAr)}
                        </p>
                        {log.user && (
                          <div className="flex items-center gap-2 text-[10px] text-foreground/45 font-bold">
                            <span>{isAr ? "المسؤول:" : "Actor:"} {log.user} ({log.role})</span>
                          </div>
                        )}
                      </div>
                      {log.createdAt && (
                        <span className="text-[10px] text-foreground/40 font-mono self-center">
                          {new Date(log.createdAt).toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">
                  {isAr ? "آخر طلبات التقديم المستلمة لوظائفك" : "Recent Candidate Applications"}
                </h2>
                <Link href="/jobs/manage" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                  <span>{isAr ? "إدارة كل الشواغر" : "Manage All Vacancies"}</span>
                  <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                  <thead>
                    <tr className="border-b border-border text-xs text-foreground/50">
                      <th className="pb-3 font-semibold">{isAr ? "المرشح" : "Candidate"}</th>
                      <th className="pb-3 font-semibold">{isAr ? "الوظيفة المتقدم لها" : "Applied Role"}</th>
                      <th className="pb-3 font-semibold text-center">{isAr ? "التقييم الفني" : "Match Score"}</th>
                      <th className="pb-3 font-semibold text-center">{isAr ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {activities.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-foreground/40">
                          {isAr ? "لا توجد طلبات تقديم مستلمة حتى الآن." : "No applications received yet."}
                        </td>
                      </tr>
                    ) : (
                      activities.map((app) => (
                        <tr key={app.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="py-4">
                            <div className="font-bold text-foreground/90">{app.name}</div>
                            <div className="text-[10px] text-foreground/50 mt-0.5">{app.experience}</div>
                          </td>
                          <td className="py-4 font-semibold text-foreground/75">{app.jobTitle}</td>
                          <td className="py-4 text-center font-mono font-bold text-primary">{app.score}</td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${app.statusColor}`}>
                              {isAr ? app.statusTextAr : app.statusTextEn}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Side Column (1 col): Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-base mb-4">
              {isAdmin 
                ? (isAr ? "إدارة أقسام النظام" : "System Administration") 
                : (isAr ? "إجراءات سريعة للمصنع" : "Factory Quick Actions")}
            </h3>
            
            <div className="space-y-3">
              {isAdmin ? (
                <>
                  <Link 
                    href="/admin/referrals" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-primary/10 text-primary">🎯</span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "طلبات الترشيح المباشر" : "Direct Referrals"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "مراجعة متطلبات المصانع وترشيح الكفاءات" : "Match factory requisitions"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>

                  <Link 
                    href="/admin/verify" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-red-500/10 text-red-500">🛡️</span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "توثيق المنشآت الصناعية" : "Factory Verification"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "مراجعة وثائق السجل التجاري" : "Review commercial registries"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>
                  
                  <Link 
                    href="/admin/blog" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-primary/10 text-primary">📝</span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "المدونة الهندسية" : "Engineering Blog"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "إدارة المقالات والمعرفة الفنية" : "Manage articles & technical SEO"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>

                  <Link 
                    href="/talent" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-green-500/10 text-green-600">🔍</span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "قاعدة بيانات الكفاءات" : "Machinist Database"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "تصفح كوادر الـ CNC المعتمدة" : "Browse verified CNC talent"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/jobs/new" 
                    className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-primary text-white"><Plus className="w-4 h-4" /></span>
                      <div>
                        <h4 className="text-xs font-semibold text-primary">{isAr ? "نشر وظيفة تشغيل جديدة +" : "Post New Job Requisition +"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "طلب فنيين أو مبرمجين لمصنعك" : "Request machinists or programmers"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-primary group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""} transition-transform`} />
                  </Link>

                  <Link 
                    href="/talent" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-secondary/10 text-foreground/80"><Search className="w-4 h-4" /></span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "قاعدة بيانات كوادر الـ CNC" : "Search CNC Talent Pool"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "تصفية بالصناعة والماكينة والمحافظة" : "Filter by industry, machine & zone"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>

                  <Link 
                    href="/talent#referral-request" 
                    className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400"><Target className="w-4 h-4" /></span>
                      <div>
                        <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                          {isAr ? "طلب ترشيح كفاءة خاصة" : "Request Tailored Nomination"}
                        </h4>
                        <p className="text-[10px] text-foreground/50">
                          {isAr ? "مطابقة فنية مباشرة من إدارة المنصة" : "Direct headhunting by platform engineers"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-amber-600 ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>

                  <Link 
                    href="/billing" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-secondary/10 text-foreground/80"><CreditCard className="w-4 h-4" /></span>
                      <div>
                        <h4 className="text-xs font-semibold">{isAr ? "باقات واشتراكات التوظيف" : "Plans & Subscriptions"}</h4>
                        <p className="text-[10px] text-foreground/50">{isAr ? "متابعة الرصيد وتجديد الباقة" : "Manage quotas & invoices"}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-foreground/30 group-hover:text-foreground ${isAr ? "rotate-180" : ""} transition-colors`} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
