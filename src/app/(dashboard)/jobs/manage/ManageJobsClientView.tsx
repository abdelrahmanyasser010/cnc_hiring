"use client";

// src/app/(dashboard)/jobs/manage/ManageJobsClientView.tsx
// الواجهة التفاعلية لإدارة إعلانات التوظيف وشواغر المصانع داخل لوحة التحكم
// تحتفظ بالقائمة الجانبية بنسبة 100% وتتيح البحث والفرز ومراجعة المتقدمين وتعديل الحالة

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Search, 
  MapPin, 
  Cpu, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Users, 
  ExternalLink, 
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Check
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface ManagedJobItem {
  id: string;
  title: string;
  titleEn?: string;
  companyName: string;
  companyNameEn?: string;
  industryZone: string;
  location: string;
  controlRequired: string;
  machineType?: string;
  shift: string;
  salaryMin: number;
  salaryMax: number;
  status: "ACTIVE" | "CLOSED";
  applicationsCount: number;
  isVerified: boolean;
  publishedAt: string;
}

interface ManageJobsClientViewProps {
  initialJobs: ManagedJobItem[];
  userRole: string;
  isSuperAdmin: boolean;
}

const CONTROLLER_FILTERS = [
  { value: "ALL", labelAr: "كافة أنظمة التحكم", labelEn: "All Controllers" },
  { value: "FANUC", labelAr: "Fanuc (فانوك)", labelEn: "Fanuc" },
  { value: "SIEMENS", labelAr: "Siemens (سيمنز)", labelEn: "Siemens" },
  { value: "HEIDENHAIN", labelAr: "Heidenhain (هايدن هاين)", labelEn: "Heidenhain" },
  { value: "HAAS", labelAr: "Haas (هاس)", labelEn: "Haas" },
  { value: "MITSUBISHI", labelAr: "Mitsubishi (ميتسوبيشي)", labelEn: "Mitsubishi" },
  { value: "OTHER", labelAr: "أنظمة أخرى", labelEn: "Other" },
];

const MACHINE_FILTERS = [
  { value: "ALL", labelAr: "كافة الماكينات", labelEn: "All Machines" },
  { value: "LATHE", labelAr: "مخارط CNC", labelEn: "CNC Lathes" },
  { value: "MILLING_3AXIS", labelAr: "فرايز 3 محاور", labelEn: "3-Axis Milling" },
  { value: "MILLING_5AXIS", labelAr: "فرايز 5 محاور", labelEn: "5-Axis Milling" },
  { value: "WIRE_EDM", labelAr: "سلك وتآكل EDM", labelEn: "Wire EDM" },
  { value: "FIBER_LASER", labelAr: "فايبر ليزر", labelEn: "Fiber Laser" },
  { value: "ROUTER", labelAr: "راوتر CNC", labelEn: "CNC Router" },
  { value: "SWISS_TURN", labelAr: "خراطة سويسرية", labelEn: "Swiss Turn" },
];

export function ManageJobsClientView({
  initialJobs,
  userRole,
  isSuperAdmin,
}: ManageJobsClientViewProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [jobs, setJobs] = useState<ManagedJobItem[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedController, setSelectedController] = useState("ALL");
  const [selectedMachine, setSelectedMachine] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "ACTIVE" | "CLOSED">("ALL");

  // تصفية الوظائف بناءً على المدخلات
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // بحث نصي
      const matchQuery = 
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.titleEn && job.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.industryZone.toLowerCase().includes(searchQuery.toLowerCase());

      // فلتر الكنترول
      const matchController = selectedController === "ALL" || job.controlRequired === selectedController;

      // فلتر نوع الماكينة
      const matchMachine = selectedMachine === "ALL" || job.machineType === selectedMachine;

      // فلتر الحالة
      const matchStatus = selectedStatus === "ALL" || job.status === selectedStatus;

      return matchQuery && matchController && matchMachine && matchStatus;
    });
  }, [jobs, searchQuery, selectedController, selectedMachine, selectedStatus]);

  // إحصائيات سريعة
  const totalVacancies = jobs.length;
  const activeVacancies = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalApplicants = jobs.reduce((acc, curr) => acc + curr.applicationsCount, 0);
  const closedVacancies = jobs.filter((j) => j.status === "CLOSED").length;

  // تبديل حالة الوظيفة (نشط / مغلق)
  const toggleJobStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "ACTIVE" ? "CLOSED" : "ACTIVE" }
          : job
      )
    );
  };

  return (
    <div className="space-y-6 text-start font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. Header Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isAr ? "منظومة إدارة شواغر المصانع والورش" : "Factory Vacancy Management System"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {isAr ? "إعلانات التوظيف وشواغر ماكينات الـ CNC" : "Machining Vacancies & Job Postings"}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/65 max-w-2xl leading-relaxed">
            {isAr 
              ? "متابعة وتحديث طلبات الكوادر الفنية، فرز المتقدمين، وجدولة الاختبارات العملية لماكينات الـ CNC لمصنعك."
              : "Manage CNC talent requisitions, review candidate applications, and schedule factory technical evaluations."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/jobs"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary/10 text-xs font-bold text-foreground/80 hover:text-foreground transition-all"
          >
            <Eye className="w-4 h-4 text-primary" />
            <span>{isAr ? "معاينة البورصة العامة" : "View Public Board"}</span>
            <ExternalLink className="w-3 h-3 text-foreground/40" />
          </Link>

          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? "نشر إعلان كادر جديد +" : "Post New Vacancy +"}</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-semibold">{isAr ? "إجمالي الشواغر" : "Total Requisitions"}</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {totalVacancies.toLocaleString(isAr ? "ar-EG" : "en-US")}
          </div>
          <p className="text-[11px] text-foreground/50">
            {isAr ? "شواغر مسجلة بالمنصة" : "Registered vacancies"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold">{isAr ? "شواغر نشطة تستقبل طلبات" : "Active Requisitions"}</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {activeVacancies.toLocaleString(isAr ? "ar-EG" : "en-US")}
          </div>
          <p className="text-[11px] text-foreground/50">
            {isAr ? "معروضة في البورصة العامة" : "Live on public board"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs font-semibold">{isAr ? "متقدمون جاهزون للمراجعة" : "Applicants for Review"}</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary">
            {totalApplicants.toLocaleString(isAr ? "ar-EG" : "en-US")}
          </div>
          <p className="text-[11px] text-foreground/50">
            {isAr ? "ملفات فنية مكتملة" : "Complete profiles"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-foreground/60">
            <span className="text-xs font-semibold">{isAr ? "شواغر مكتملة التوظيف" : "Closed Requisitions"}</span>
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {closedVacancies.toLocaleString(isAr ? "ar-EG" : "en-US")}
          </div>
          <p className="text-[11px] text-foreground/50">
            {isAr ? "تم التعاقد مع فنيين" : "Hired successfully"}
          </p>
        </div>

      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className={`w-4 h-4 absolute top-3.5 ${isAr ? "right-3.5" : "left-3.5"} text-foreground/40`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث بالمسمى الوظيفي، المصنع، أو المنطقة..." : "Search title, company, zone..."}
              className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden`}
            />
          </div>

          {/* Controller Filter */}
          <div>
            <select
              value={selectedController}
              onChange={(e) => setSelectedController(e.target.value)}
              className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
            >
              {CONTROLLER_FILTERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {isAr ? item.labelAr : item.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Machine Filter */}
          <div>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
            >
              {MACHINE_FILTERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {isAr ? item.labelAr : item.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-background border border-border rounded-xl">
            <button
              onClick={() => setSelectedStatus("ALL")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === "ALL" ? "bg-primary text-white shadow-xs" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {isAr ? "الكل" : "All"}
            </button>
            <button
              onClick={() => setSelectedStatus("ACTIVE")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === "ACTIVE" ? "bg-emerald-600 text-white shadow-xs" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {isAr ? "النشطة" : "Active"}
            </button>
            <button
              onClick={() => setSelectedStatus("CLOSED")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === "CLOSED" ? "bg-slate-700 text-white shadow-xs" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {isAr ? "المغلقة" : "Closed"}
            </button>
          </div>

        </div>
      </div>

      {/* 4. Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-foreground/30" />
            <h3 className="font-bold text-base text-foreground">
              {isAr ? "لا توجد إعلانات تطابق معايير الفلترة المحددة" : "No Requisitions Match These Filters"}
            </h3>
            <p className="text-xs text-foreground/60 max-w-sm mx-auto">
              {isAr 
                ? "جرب إزالة بعض الفلاتر أو استخدام كلمات بحث مختلفة للاطلاع على الوظائف المسجلة."
                : "Try clearing search filters or entering different keywords."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedController("ALL");
                setSelectedMachine("ALL");
                setSelectedStatus("ALL");
              }}
              className="mt-2 px-4 py-2 bg-secondary/10 text-foreground font-bold text-xs rounded-xl hover:bg-secondary/20 transition-colors"
            >
              {isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isActive = job.status === "ACTIVE";

            return (
              <div
                key={job.id}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-start"
              >
                {/* Left: Job & Plant Details */}
                <div className="space-y-2.5 max-w-2xl">
                  
                  {/* Status & Date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      }`}
                    >
                      {isActive ? (isAr ? "نشط - يستقبل متقدمين" : "Active - Accepting") : (isAr ? "مغلق - تم الاكتفاء" : "Closed")}
                    </span>

                    <span className="text-[11px] text-foreground/50">
                      {isAr ? `نُشر ${job.publishedAt}` : `Posted ${job.publishedAt}`}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-base sm:text-lg font-black text-foreground hover:text-primary transition-colors">
                    <Link href={`/jobs/${job.id}`}>
                      {isAr ? job.title : (job.titleEn || job.title)}
                    </Link>
                  </h3>

                  {/* Company & Zone */}
                  <div className="flex items-center gap-3 text-xs text-foreground/75 flex-wrap">
                    <span className="font-bold flex items-center gap-1.5 text-foreground">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? job.companyName : (job.companyNameEn || job.companyName)}</span>
                      {job.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.2 rounded-sm font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isAr ? "معتمد" : "Verified"}</span>
                        </span>
                      )}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-foreground/60">
                      <MapPin className="w-3.5 h-3.5 text-foreground/40" />
                      <span>{job.location}</span>
                    </span>
                  </div>

                  {/* Technical Specs Tags */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] bg-secondary/15 px-2.5 py-1 rounded-lg text-foreground/80 font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-primary" />
                      <span>{isAr ? "كنترول: " : "Control: "}{job.controlRequired}</span>
                    </span>

                    <span className="text-[11px] bg-secondary/15 px-2.5 py-1 rounded-lg text-foreground/80 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-foreground/60" />
                      <span>{job.shift}</span>
                    </span>

                    <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{job.salaryMin.toLocaleString(isAr ? "ar-EG" : "en-US")} - {job.salaryMax.toLocaleString(isAr ? "ar-EG" : "en-US")} {isAr ? "ج.م / شهرياً" : "EGP / Mo"}</span>
                    </span>
                  </div>

                </div>

                {/* Right: Applicants & Management Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                  
                  {/* Applicants Count Highlight */}
                  <div className="text-start lg:text-end">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-primary">
                        {job.applicationsCount}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {isAr ? "متقدم مسجل" : "applicants"}
                      </span>
                    </div>
                    <span className="text-[10px] text-foreground/50">
                      {isAr ? "جاهزون للمراجعة الفنية" : "Ready for technical review"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/jobs/${job.id}/applications`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{isAr ? "عرض المرشحين" : "Review Candidates"}</span>
                    </Link>

                    <button
                      onClick={() => toggleJobStatus(job.id)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "border-red-500/20 text-red-600 hover:bg-red-500/10"
                          : "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                      }`}
                      title={isAr ? "تبديل حالة الإعلان بين نشط ومغلق" : "Toggle active/closed"}
                    >
                      {isActive ? (isAr ? "إغلاق الشاغر" : "Close") : (isAr ? "إعادة التفعيل" : "Reactivate")}
                    </button>

                    <Link
                      href={`/jobs/${job.id}`}
                      target="_blank"
                      className="p-2 border border-border rounded-xl text-foreground/60 hover:text-foreground hover:bg-secondary/10 transition-colors"
                      title={isAr ? "معاينة الإعلان كما يظهر للجمهور" : "Preview live posting"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
