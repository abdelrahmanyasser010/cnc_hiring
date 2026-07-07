// src/app/(dashboard)/dashboard/page.tsx
// الشاشة الرئيسية للإحصائيات العامة (Overview / Metrics).
// يتم استعراض إحصائيات المنصة الكبرى للأدمن، أو أرقام التوظيف التفصيلية لصاحب العمل.

export const dynamic = "force-dynamic";

import React from "react";
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dashboardRepo } from "@/infrastructure/container";
import { redirect } from "next/navigation";
import Link from "next/link";

const MOCK_RECENT_ACTIVITIES = [
  {
    id: "mock-log-1",
    user: "مشرف النظام (أدمن)",
    role: "مدير النظام",
    action: "تم توثيق حساب شركة: الشركة المصرية للصناعات المعدنية",
    createdAt: new Date("2026-06-26T12:00:00Z"),
  },
  {
    id: "mock-log-2",
    user: "مصنع النيل لتشغيل المعادن",
    role: "صاحب عمل",
    action: "تم نشر وظيفة جديدة: فني مخرطة CNC مبرمج",
    createdAt: new Date("2026-06-26T11:00:00Z"),
  },
  {
    id: "mock-log-3",
    user: "أحمد مرسي الشرقاوي",
    role: "فني فريزة CNC",
    action: "تم التقديم على وظيفة فني مخرطة CNC بنجاح واجتياز التقييم بنسبة 100%",
    createdAt: new Date("2026-06-26T10:00:00Z"),
  },
  {
    id: "mock-log-4",
    user: "مشرف النظام (أدمن)",
    role: "مدير النظام",
    action: "تم نشر مقال تقني جديد بالمدونة: شرح استخدام الكود G01",
    createdAt: new Date("2026-06-25T12:00:00Z"),
  },
];

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AdminActivity {
  id: string;
  user: string | null;
  role: string;
  action: string;
  createdAt: Date;
}

interface EmployerActivity {
  id: string;
  name: string;
  jobTitle: string;
  experience: string;
  score: string;
  status: string;
  statusText: string;
  statusColor: string;
}

export default async function DashboardPage() {
  // 1. التحقق من جلسة تسجيل الدخول
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as { role?: string; id?: string; name?: string };
  const isAdmin = user.role === "SUPER_ADMIN";

  let stats: DashboardStat[] = [];
  let adminActivities: AdminActivity[] = [];
  let employerActivities: EmployerActivity[] = [];
  let isMockData = false;
  let employerSubscription: {
    planName: string;
    maxActiveJobs: number;
    activeJobsCount: number;
    maxPhoneViews: number;
    phoneViewsUsed: number;
    isActive: boolean;
    endDate: Date;
  } | null | undefined = null;

  if (isAdmin) {
    // ----------------------------------------------------
    // لوحة تحكم الأدمن (Super Admin Dashboard)
    // ----------------------------------------------------
    try {
      // الاستعلامات الفعلية لقاعدة البيانات عبر الـ repository
      const adminStats = await dashboardRepo.getAdminStats();

      stats = [
        {
          title: "إجمالي الكوادر الفنية",
          value: `${adminStats.totalCandidates.toLocaleString("ar-EG")} كادر`,
          change: "فنيين ومهندسين مسجلين",
          icon: Users,
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          title: "أصحاب المصانع",
          value: `${adminStats.totalEmployers.toLocaleString("ar-EG")} منشأة`,
          change: "شركات وورش مسجلة",
          icon: Briefcase,
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          title: "الوظائف النشطة حالياً",
          value: `${adminStats.totalJobs.toLocaleString("ar-EG")} وظيفة`,
          change: "معلنة وتستقبل تقديمات",
          icon: Briefcase,
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          title: "طلبات توثيق معلقة",
          value: `${adminStats.pendingVerifications.toLocaleString("ar-EG")} طلبات`,
          change: "تحتاج مراجعة المستندات",
          icon: ShieldCheck,
          color: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
        },
      ];

      adminActivities = adminStats.activities;
    } catch (error) {
      console.warn("Database failed to load admin dashboard stats, using mock.", error);
      isMockData = true;

      stats = [
        {
          title: "إجمالي الكوادر الفنية",
          value: "١٤٢ كادر",
          change: "فنيين ومهندسين مسجلين",
          icon: Users,
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          title: "أصحاب المصانع",
          value: "١٨ منشأة",
          change: "شركات وورش مسجلة",
          icon: Briefcase,
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          title: "الوظائف النشطة حالياً",
          value: "١٢ وظيفة",
          change: "معلنة وتستقبل تقديمات",
          icon: Briefcase,
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          title: "طلبات توثيق معلقة",
          value: "٣ طلبات",
          change: "تحتاج مراجعة المستندات",
          icon: ShieldCheck,
          color: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
        },
      ];

      adminActivities = MOCK_RECENT_ACTIVITIES;
    }
  } else {
    // ----------------------------------------------------
    // لوحة تحكم صاحب العمل (Employer Dashboard)
    // ----------------------------------------------------
    try {
      const employerStats = await dashboardRepo.getEmployerStats(user.id!);
      employerSubscription = employerStats.subscription;

      stats = [
        {
          title: "الوظائف النشطة حالياً",
          value: `${employerStats.activeJobs.toLocaleString("ar-EG")} وظائف`,
          change: "تستقبل طلبات تقديم جديدة",
          icon: Briefcase,
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          title: "إجمالي طلبات التقديم",
          value: `${employerStats.totalApplications.toLocaleString("ar-EG")} طلب`,
          change: "من فنيين ومهندسين متقدمين",
          icon: Users,
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          title: "مقابلات مجدولة",
          value: `${employerStats.pendingInterviews.toLocaleString("ar-EG")} مقابلات`,
          change: "تم تحديد موعد مقابلة فنية",
          icon: Calendar,
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          title: "مستوى التزام الفنيين",
          value: "96.8%",
          change: "نسبة حضور ممتازة للمقابلات",
          icon: TrendingUp,
          color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400",
        },
      ];

      employerActivities = employerStats.activities.map((app) => ({
        id: app.id,
        name: app.name || "متقدم مجهول",
        jobTitle: app.jobTitle,
        experience: app.experience,
        score: app.score,
        status: app.status,
        statusText: 
          app.status === "PENDING" ? "طلب جديد" : 
          app.status === "CONTACTED" ? "تم التواصل" :
          app.status === "INTERVIEW" ? "مقابلة مجدولة" : 
          app.status === "ACCEPTED" ? "تم التعيين" : "مرفوض",
        statusColor: 
          app.status === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
          app.status === "INTERVIEW" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          app.status === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
      }));
    } catch (error) {
      console.warn("Database failed to load employer stats, using mock.", error);
      isMockData = true;

      stats = [
        {
          title: "الوظائف النشطة حالياً",
          value: "3 وظائف",
          change: "+1 هذا الأسبوع",
          icon: Briefcase,
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
        },
        {
          title: "إجمالي طلبات التقديم",
          value: "42 طلب",
          change: "+12 طلب جديد",
          icon: Users,
          color: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
        },
        {
          title: "مقابلات مجدولة",
          value: "5 مقابلات",
          change: "هذا الأسبوع",
          icon: Calendar,
          color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
        },
        {
          title: "مستوى التزام الفنيين",
          value: "96.8%",
          change: "نسبة حضور ممتازة",
          icon: TrendingUp,
          color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400",
        },
      ];

      employerActivities = [
        {
          id: "1",
          name: "جرجس صبحي",
          jobTitle: "فني تشغيل مخرطة CNC",
          experience: "خبرة 4 سنوات",
          score: "95%",
          status: "INTERVIEW",
          statusText: "تم تحديد مقابلة",
          statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
          id: "2",
          name: "محمود عبد الرحمن",
          jobTitle: "مبرمج Mastercam",
          experience: "خبرة 6 سنوات",
          score: "100%",
          status: "PENDING",
          statusText: "طلب جديد",
          statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        },
        {
          id: "3",
          name: "إسلام محمد",
          jobTitle: "مشغل فريزة CNC",
          experience: "خبرة 2 سنة",
          score: "80%",
          status: "CONTACTED",
          statusText: "تم التواصل",
          statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        },
        {
          id: "4",
          name: "كريم أحمد",
          jobTitle: "فني تشغيل وصيانة CNC",
          experience: "خبرة 5 سنوات",
          score: "90%",
          status: "ACCEPTED",
          statusText: "تم التعيين",
          statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        },
      ];
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      
      {/* عنوان الصفحة والترحيب */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {isAdmin ? "لوحة الإدارة والتحكم المركزي" : "لوحة الإحصائيات العامة"}
        </h1>
        <p className="text-sm text-foreground/60">
          مرحباً بك مجدداً، {user.name}. 
          {isAdmin ? " إليك ملخص نشاط منصة التوظيف ومتابعة العمليات." : " إليك ملخص عمليات التوظيف في مصنعك."}
        </p>
      </div>

      {/* تنبيه بيئة المحاكاة */}
      {isMockData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
          <span>⚙️ وضع المحاكاة: يتم عرض إحصائيات تجريبية لعدم إمكانية الاتصال بقاعدة البيانات حالياً.</span>
        </div>
      )}

      {/* شريط استهلاك الباقة (Quota Banner Widget) لصاحب العمل */}
      {!isAdmin && employerSubscription && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {employerSubscription.planName}
              </span>
              <h2 className="text-base font-bold text-foreground">حالة استهلاك باقة الاشتراك</h2>
            </div>
            <p className="text-xs text-foreground/60">
              تاريخ انتهاء الباقة الحالي: {new Date(employerSubscription.endDate).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            {/* Active Jobs Bar */}
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground/70">الوظائف النشطة</span>
                <span className="text-primary font-bold">
                  {employerSubscription.maxActiveJobs === -1 ? `${employerSubscription.activeJobsCount} (غير محدود)` : `${employerSubscription.activeJobsCount} / ${employerSubscription.maxActiveJobs}`}
                </span>
              </div>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: employerSubscription.maxActiveJobs === -1 ? "100%" : `${Math.min(100, (employerSubscription.activeJobsCount / employerSubscription.maxActiveJobs) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Phone Views Bar */}
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground/70">مشاهدات أرقام الهواتف</span>
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {employerSubscription.maxPhoneViews === -1 ? `${employerSubscription.phoneViewsUsed} (غير محدود)` : `${employerSubscription.phoneViewsUsed} / ${employerSubscription.maxPhoneViews}`}
                </span>
              </div>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: employerSubscription.maxPhoneViews === -1 ? "100%" : `${Math.min(100, (employerSubscription.phoneViewsUsed / employerSubscription.maxPhoneViews) * 100)}%` }}
                ></div>
              </div>
            </div>

            <Link
              href="/billing?reason=upgrade"
              className="w-full sm:w-auto px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>ترقية الباقة</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      )}

      {/* كروت الإحصائيات الأربعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-foreground/50 font-semibold">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-[10px] text-foreground/50 font-semibold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* القسم الرئيسي: الأحداث الأخيرة والروابط السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* العمود الأيمن (كبير): الأحداث أو طلبات التقديم */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:col-span-2">
          {isAdmin ? (
            // عرض سجل نشاط النظام (Audit Log) للأدمن
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>آخر العمليات والأحداث المسجلة في النظام (Audit Logs)</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {adminActivities.length === 0 ? (
                  <p className="text-xs text-foreground/40 text-center py-6">لا توجد سجلات نشاط مسجلة في النظام حالياً.</p>
                ) : (
                  adminActivities.map((log) => (
                    <div key={log.id} className="p-3 border border-border rounded-xl bg-secondary/5 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1 flex-1">
                        <p className="font-semibold text-foreground/80 leading-relaxed">{log.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-foreground/45 font-bold">
                          <span>المسؤول: {log.user} ({log.role})</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-foreground/40 font-mono self-center">
                        {new Date(log.createdAt).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // عرض طلبات التقديم للمصنع
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">آخر طلبات التقديم المستلمة وظائفك</h2>
                <Link href="/jobs" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                  عرض كل الوظائف <ChevronRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-border text-xs text-foreground/50">
                      <th className="pb-3 font-semibold">المرشح</th>
                      <th className="pb-3 font-semibold">الوظيفة المتقدم لها</th>
                      <th className="pb-3 font-semibold text-center">التقييم الذكي</th>
                      <th className="pb-3 font-semibold text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {employerActivities.map((app) => (
                      <tr key={app.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-foreground/90">{app.name}</div>
                          <div className="text-[10px] text-foreground/50 mt-0.5">{app.experience}</div>
                        </td>
                        <td className="py-4 font-semibold text-foreground/75">{app.jobTitle}</td>
                        <td className="py-4 text-center font-mono font-bold text-primary">{app.score}</td>
                        <td className="py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${app.statusColor}`}>
                            {app.statusText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* العمود الأيسر (صغير): روابط سريعة وبطاقات التنبيه */}
        <div className="flex flex-col gap-6">
          
          {/* لوحة الروابط السريعة */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-base mb-4">
              {isAdmin ? "إدارة أقسام النظام" : "روابط سريعة لأصحاب العمل"}
            </h3>
            
            <div className="space-y-3">
              {isAdmin ? (
                <>
                  <Link 
                    href="/admin/verify" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-red-500/10 text-red-500">🛡️</span>
                      <div className="text-right">
                        <h4 className="text-xs font-semibold">توثيق المصانع</h4>
                        <p className="text-[10px] text-foreground/50">مراجعة وثائق السجل التجاري</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground rotate-180 transition-colors" />
                  </Link>
                  
                  <Link 
                    href="/admin/blog" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-primary/10 text-primary">📝</span>
                      <div className="text-right">
                        <h4 className="text-xs font-semibold">المدونة والمقالات</h4>
                        <p className="text-[10px] text-foreground/50">إدارة المعرفة التقنية و الـ SEO</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground rotate-180 transition-colors" />
                  </Link>

                  <Link 
                    href="/talent" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-green-500/10 text-green-600">🔍</span>
                      <div className="text-right">
                        <h4 className="text-xs font-semibold">البحث في الفنيين</h4>
                        <p className="text-[10px] text-foreground/50">تصفح قاعدة البيانات الوطنية للفنيين</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground rotate-180 transition-colors" />
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/jobs/new" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-primary/10 text-primary">💼</span>
                      <div className="text-right">
                        <h4 className="text-xs font-semibold">نشر وظيفة جديدة</h4>
                        <p className="text-[10px] text-foreground/50">أضف متطلبات الماكينات والراتب</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground rotate-180 transition-colors" />
                  </Link>
                  
                  <Link 
                    href="/talent" 
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-green-500/10 text-green-600">🔍</span>
                      <div className="text-right">
                        <h4 className="text-xs font-semibold">تصفح الفنيين المتاحين</h4>
                        <p className="text-[10px] text-foreground/50">البحث الجغرافي وحسب المهارة</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground rotate-180 transition-colors" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* نصائح توطين وإرشاد */}
          <div className="bg-gradient-to-l from-slate-900 to-slate-950 text-slate-100 rounded-2xl shadow-sm p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">💡</span>
              <h4 className="font-bold text-sm text-slate-50">إرشادات إدارة النظام</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 text-right">
              {isAdmin 
                ? "تأكد من مراجعة التراخيص السجل التجاري المرفوعة من المصانع حديثاً لمنحهم شارة التوثيق الزرقاء للبدء في نشر وظائفهم وجذب الفنيين."
                : "الفني في مصر يستجيب أسرع بـ 4 مرات عبر الواتساب مقارنة بالبريد الإلكتروني. استخدم خيار (دعوة المقابلة الفنية) لإرسال تفاصيل الموعد مباشرة على واتساب المرشح."
              }
            </p>
            <div className="flex justify-end">
              <span className="text-[10px] bg-slate-800 text-primary px-3 py-1 rounded-full font-bold">
                {isAdmin ? "صلاحيات Super Admin" : "ميزة واتساب مفعلة"}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
