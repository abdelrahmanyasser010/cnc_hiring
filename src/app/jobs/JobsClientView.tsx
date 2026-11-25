"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Cpu, 
  DollarSign, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  Send, 
  X, 
  Plus, 
  Filter, 
  Building2, 
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Users
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface JobListItem {
  id: string;
  title: string;
  titleEn?: string;
  companyName: string;
  companyNameEn?: string;
  industryZone: string;
  industryZoneEn?: string;
  location: string;
  locationEn?: string;
  controlRequired: string;
  machineType?: string;
  shift?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin: number;
  salaryMax: number;
  hideSalary: boolean;
  status: string;
  applicationsCount: number;
  createdAt?: string | Date;
  isVerified?: boolean;
}

interface JobsClientViewProps {
  initialJobs: JobListItem[];
  isEmployer: boolean;
  userRole?: string;
  initialTab?: "public" | "manage";
}

const CONTROLLER_OPTIONS = [
  { value: "ALL", labelAr: "كافة أنظمة الكنترول", labelEn: "All Controllers" },
  { value: "FANUC", labelAr: "Fanuc (فانوك)", labelEn: "Fanuc" },
  { value: "SIEMENS", labelAr: "Siemens Sinumerik (سيمنز)", labelEn: "Siemens Sinumerik" },
  { value: "HEIDENHAIN", labelAr: "Heidenhain (هايدن هاين)", labelEn: "Heidenhain" },
  { value: "HAAS", labelAr: "Haas (هاس)", labelEn: "Haas" },
  { value: "MITSUBISHI", labelAr: "Mitsubishi (ميتسوبيشي)", labelEn: "Mitsubishi" },
  { value: "OTHER", labelAr: "أنظمة تحكم أخرى", labelEn: "Other" },
];

const MACHINE_OPTIONS = [
  { value: "ALL", labelAr: "كافة أنواع الماكينات", labelEn: "All Machines" },
  { value: "LATHE", labelAr: "مخارط CNC", labelEn: "CNC Lathes" },
  { value: "MILLING_3AXIS", labelAr: "فرايز 3 محاور VMC", labelEn: "3-Axis VMC" },
  { value: "MILLING_5AXIS", labelAr: "فرايز 5 محاور متقدمة", labelEn: "5-Axis Machining" },
  { value: "WIRE_EDM", labelAr: "سلك وتآكل بالشرارة EDM", labelEn: "Wire EDM" },
  { value: "FIBER_LASER", labelAr: "فايبر ليزر وبلازما", labelEn: "Fiber Laser" },
  { value: "ROUTER", labelAr: "راوتر CNC خشب ورخام", labelEn: "CNC Router" },
];

const LOCATION_OPTIONS = [
  { value: "ALL", labelAr: "كافة المناطق الصناعية", labelEn: "All Industrial Hubs" },
  { value: "العاشر من رمضان", labelAr: "العاشر من رمضان", labelEn: "10th of Ramadan" },
  { value: "6 أكتوبر", labelAr: "6 أكتوبر", labelEn: "6th of October" },
  { value: "برج العرب", labelAr: "برج العرب الصناعية", labelEn: "Borg El Arab" },
  { value: "مدينة السادات", labelAr: "مدينة السادات", labelEn: "Sadat City" },
  { value: "قويسنا", labelAr: "قويسنا الصناعية", labelEn: "Qwesna" },
  { value: "العبور", labelAr: "مدينة العبور", labelEn: "Obour City" },
  { value: "حلوان", labelAr: "حلوان والتبين", labelEn: "Helwan" },
  { value: "بدر", labelAr: "مدينة بدر والروبيكي", labelEn: "Badr City" },
];

const SHIFT_OPTIONS = [
  { value: "ALL", labelAr: "كافة نوبات العمل", labelEn: "All Shifts" },
  { value: "MORNING", labelAr: "وردية صباحية (8ص - 4م)", labelEn: "Morning Shift" },
  { value: "EVENING", labelAr: "وردية مسائية (4م - 12ص)", labelEn: "Evening Shift" },
  { value: "FULL_TIME", labelAr: "تفرغ كامل / ورديتين", labelEn: "Full-Time" },
  { value: "PART_TIME", labelAr: "دوام جزئي", labelEn: "Part-Time" },
];

export function JobsClientView({ initialJobs, isEmployer, userRole, initialTab = "public" }: JobsClientViewProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // Tab switch: 'public' for candidate job search, 'manage' for employer job management
  const [activeTab, setActiveTab] = useState<"public" | "manage">(initialTab);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedController, setSelectedController] = useState("ALL");
  const [selectedMachine, setSelectedMachine] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedShift, setSelectedShift] = useState("ALL");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedController !== "ALL") count++;
    if (selectedLocation !== "ALL") count++;
    if (selectedShift !== "ALL") count++;
    if (onlyBookmarked) count++;
    return count;
  }, [selectedController, selectedLocation, selectedShift, onlyBookmarked]);

  // Bookmarks state with localStorage persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hirex_saved_jobs");
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read bookmarked jobs from localStorage", e);
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("hirex_saved_jobs", JSON.stringify(next));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
      return next;
    });
  };

  // Quick Apply Modal State
  const [applyingJob, setApplyingJob] = useState<JobListItem | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantShift, setApplicantShift] = useState("MORNING");
  const [applicantNote, setApplicantNote] = useState("");
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const handleOpenQuickApply = (job: JobListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setApplyingJob(job);
    setApplySuccess(false);
  };

  const handleQuickApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantPhone.trim() || !applicantName.trim()) return;

    setIsSubmittingApply(true);
    // Simulate brief network submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmittingApply(false);
    setApplySuccess(true);
  };

  // Filter Jobs List
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // 1. Text Search Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query) || (job.titleEn && job.titleEn.toLowerCase().includes(query));
        const matchesCompany = (job.companyName || "").toLowerCase().includes(query) || (job.companyNameEn && job.companyNameEn.toLowerCase().includes(query));
        const matchesLocation = (job.location || "").toLowerCase().includes(query) || (job.locationEn && job.locationEn.toLowerCase().includes(query));
        const matchesControl = (job.controlRequired || "").toLowerCase().includes(query);
        const matchesMachine = (job.machineType || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesControl && !matchesMachine) {
          return false;
        }
      }

      // 2. Controller filter
      if (selectedController !== "ALL") {
        if (job.controlRequired !== selectedController) return false;
      }

      // 3. Location filter
      if (selectedLocation !== "ALL") {
        if (!job.location.includes(selectedLocation) && !job.industryZone.includes(selectedLocation)) {
          return false;
        }
      }

      // 4. Shift filter
      if (selectedShift !== "ALL") {
        if (job.shift && job.shift !== selectedShift) return false;
      }

      // 5. Bookmarks only filter
      if (onlyBookmarked) {
        if (!bookmarkedIds.includes(job.id)) return false;
      }

      return true;
    });
  }, [initialJobs, searchQuery, selectedController, selectedLocation, selectedShift, onlyBookmarked, bookmarkedIds]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedController("ALL");
    setSelectedMachine("ALL");
    setSelectedLocation("ALL");
    setSelectedShift("ALL");
    setOnlyBookmarked(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. Hero Header Banner */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background border-b border-border py-12 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? "بورصة وظائف ماكينات الـ CNC المعتمدة في مصر" : "Egypt Certified CNC Machine Shop Careers"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                {isAr ? "وظائف ماكينات الـ CNC والتشغيل الدقيق" : "Precision Machining & CNC Engineering Jobs"}
              </h1>
              <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-2xl">
                {isAr 
                  ? "تصفح أحدث فرص العمل المباشرة لفنيي ومبرمجي ومساعدي الـ CNC في كبرى مصانع وورش العاشر من رمضان، 6 أكتوبر، وبرج العرب مع إعلان واضح للرواتب والورديات وبدون عمولات."
                  : "Browse direct verified job requisitions for CNC machinists, setup technicians, and CAM programmers across Egypt's manufacturing zones with transparent wages and shift details."}
              </p>
            </div>

            {/* Employer Action Card */}
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3 shrink-0 max-w-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    {isAr ? "أنت صاحب مصنع أو مدير تشغيل؟" : "Factory Owner or Machine Shop Manager?"}
                  </h4>
                  <p className="text-[11px] text-foreground/60">
                    {isAr ? "أعلن عن طلب كادر واستقطب فنيين مفحوصين لمصنعك." : "Post a machining vacancy and reach vetted machinists."}
                  </p>
                </div>
              </div>
              <Link
                href="/jobs/new"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "أعلن عن وظيفة لمصنعك" : "Post a New Vacancy"}</span>
              </Link>
            </div>
          </div>

          {/* Mode Switch: Public Board vs Employer Management (if employer) */}
          <div className="flex items-center gap-2 border-b border-border/80 pt-4">
            <button
              onClick={() => setActiveTab("public")}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "public"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{isAr ? `تصفح وظائف CNC المتاحة (${filteredJobs.length})` : `All CNC Openings (${filteredJobs.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "manage"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isAr ? "إدارة إعلانات مصنعي ومتابعة المتقدمين" : "My Plant Requisitions & Applicants"}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === "public" ? (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 text-start">
              
              {/* Search Input & Mobile Filter Toggle */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-foreground/40 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr 
                      ? "ابحث بالماكينة، الكنترول، أو المنطقة الصناعية..." 
                      : "Search by machine, controller, or zone..."}
                    className="w-full ps-11 pe-4 py-3 bg-secondary/10 border border-border rounded-xl text-xs sm:text-sm text-foreground placeholder:text-foreground/40 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Toggle Button Bar */}
                <div className="sm:hidden flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="flex-1 py-2.5 px-3.5 rounded-xl border border-border bg-secondary/10 text-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-secondary/20 transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span>{isAr ? "خيارات التصفية والفلاتر" : "Filter Openings"}</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      onlyBookmarked 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400" 
                        : "bg-secondary/10 border-border text-foreground/70"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? "fill-amber-500" : ""}`} />
                    <span>({bookmarkedIds.length})</span>
                  </button>
                </div>
              </div>

              {/* Filter Selects Grid (collapsible on mobile, always grid on desktop) */}
              <div className={`gap-3 text-xs ${isMobileFiltersOpen ? "grid grid-cols-1" : "hidden sm:grid sm:grid-cols-2 lg:grid-cols-4"}`}>
                
                {/* Controller Filter */}
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "نظام الكنترول" : "Controller"}</span>
                  </label>
                  <select
                    value={selectedController}
                    onChange={(e) => setSelectedController(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-foreground text-xs focus:border-primary focus:outline-hidden"
                  >
                    {CONTROLLER_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {isAr ? c.labelAr : c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "المنطقة الصناعية" : "Industrial Zone"}</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-foreground text-xs focus:border-primary focus:outline-hidden"
                  >
                    {LOCATION_OPTIONS.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {isAr ? loc.labelAr : loc.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shift Filter */}
                <div className="space-y-1">
                  <label className="font-semibold text-foreground/70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "نظام الوردية" : "Work Shift"}</span>
                  </label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-foreground text-xs focus:border-primary focus:outline-hidden"
                  >
                    {SHIFT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {isAr ? s.labelAr : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bookmarked Jobs Toggle Button */}
                <div className="space-y-1 flex flex-col justify-end">
                  <button
                    onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      onlyBookmarked 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400" 
                        : "bg-secondary/10 border-border text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? "fill-amber-500" : ""}`} />
                    <span>{isAr ? `الوظائف المحفوظة (${bookmarkedIds.length})` : `Saved Jobs (${bookmarkedIds.length})`}</span>
                  </button>
                </div>

              </div>

              {/* Active Filter Tags & Reset */}
              {(searchQuery || selectedController !== "ALL" || selectedLocation !== "ALL" || selectedShift !== "ALL" || onlyBookmarked) && (
                <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
                  <span className="text-foreground/60">
                    {isAr ? `نتائج البحث: ${filteredJobs.length} وظيفة مطابقة` : `Results: ${filteredJobs.length} matching roles`}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline font-bold"
                  >
                    {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                  </button>
                </div>
              )}

            </div>

            {/* Jobs Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center text-foreground/60 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto text-3xl">
                  🔍
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {isAr ? "لم نجد وظائف مطابقة لمعايير البحث الحالية" : "No open vacancies matched your search criteria"}
                </h3>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  {isAr 
                    ? "جرّب تغيير نوع الكنترول، أو البحث باسم المنطقة الصناعية بشكل عام، أو إعادة ضبط الفلاتر."
                    : "Try expanding your controller filter or search across all industrial areas."}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  {isAr ? "عرض كافة الوظائف المتاحة" : "View All Open Jobs"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => {
                  const isSaved = bookmarkedIds.includes(job.id);
                  const salaryText = job.hideSalary
                    ? (isAr ? "الراتب يحدد في المقابلة" : "Salary: Discussed in Interview")
                    : isAr
                      ? `${job.salaryMin.toLocaleString("ar-EG")} - ${job.salaryMax.toLocaleString("ar-EG")} ج.م`
                      : `EGP ${job.salaryMin.toLocaleString("en-US")} - ${job.salaryMax.toLocaleString("en-US")}`;

                  return (
                    <div
                      key={job.id}
                      className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 text-start hover:border-primary/40 relative group"
                    >
                      {/* Job Main Details */}
                      <div className="space-y-3 flex-1 min-w-0">
                        
                        {/* Company & Verification Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 truncate max-w-[180px] sm:max-w-none">
                              <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="truncate">{isAr ? (job.companyName || "منشأة هندسية معتمدة") : (job.companyNameEn || job.companyName || "Certified Plant")}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0 whitespace-nowrap">
                              <CheckCircle className="w-3 h-3 fill-emerald-500 text-white shrink-0" />
                              <span>{isAr ? "موثق بالسجل التجاري" : "Verified Plant"}</span>
                            </span>
                          </div>

                          {/* Bookmark Action */}
                          <button
                            onClick={(e) => toggleBookmark(job.id, e)}
                            className={`p-2 rounded-xl border transition-all ${
                              isSaved 
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                                : "bg-secondary/10 border-border text-foreground/40 hover:text-amber-500 hover:border-amber-500/30"
                            }`}
                            title={isSaved ? (isAr ? "إزالة من المحفوظات" : "Remove bookmark") : (isAr ? "حفظ الوظيفة" : "Save job")}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-500" : ""}`} />
                          </button>
                        </div>

                        {/* Job Title */}
                        <Link href={`/jobs/${job.id}`}>
                          <h2 className="text-base sm:text-lg font-black text-foreground hover:text-primary transition-colors cursor-pointer">
                            <bdi dir="auto">{isAr ? job.title : (job.titleEn || job.title)}</bdi>
                          </h2>
                        </Link>

                        {/* Technical Spec Chips */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Controller Chip */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-[11px]">
                            <Cpu className="w-3.5 h-3.5 shrink-0" />
                            <span>{isAr ? "كنترول: " : "Control: "}{job.controlRequired}</span>
                          </span>

                          {/* Location Chip */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 border border-border text-foreground/75 font-semibold text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{isAr ? job.location : (job.locationEn || job.location)}</span>
                          </span>

                          {/* Shift Chip */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 border border-border text-foreground/75 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>
                              {job.shift === "EVENING"
                                ? (isAr ? "وردية مسائية" : "Evening Shift")
                                : job.shift === "FULL_TIME"
                                ? (isAr ? "دوام كامل" : "Full-Time")
                                : job.shift === "PART_TIME"
                                ? (isAr ? "دوام جزئي" : "Part-Time")
                                : (isAr ? "وردية صباحية" : "Morning Shift")}
                            </span>
                          </span>

                          {/* Salary Chip */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <DollarSign className="w-3.5 h-3.5 shrink-0" />
                            <span>{salaryText}</span>
                          </span>
                        </div>

                      </div>

                      {/* Right/Left Action Buttons */}
                      <div className="grid grid-cols-2 sm:flex sm:flex-row md:flex-col lg:flex-row items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-border shrink-0 w-full sm:w-auto">
                        
                        <button
                          onClick={(e) => handleOpenQuickApply(job, e)}
                          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-sm hover:-translate-y-0.5"
                        >
                          <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                          <span>{isAr ? "التقديم السريع" : "Quick Apply"}</span>
                        </button>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-foreground font-bold rounded-xl text-xs border border-border transition-all text-center"
                        >
                          <span>{isAr ? "تفاصيل الوظيفة" : "Details"}</span>
                          {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </Link>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Employer Management Tab */
          <div className="space-y-6 text-start">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-foreground">
                  {isAr ? "إدارة طلبات وإعلانات كفاءات مصنعك" : "Manage Your Plant Requisitions"}
                </h3>
                <p className="text-xs text-foreground/60 mt-1">
                  {isAr 
                    ? "تابع المتقدمين وفلترة مهاراتهم الفنية آلياً بناءً على نظام الكنترول ونوع الماكينة."
                    : "Track applicants, review test scores, and schedule factory trials."}
                </p>
              </div>

              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-xs shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "إضافة طلب كادر جديد +" : "Create Requisition +"}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {initialJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{job.title}</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                        نشط
                      </span>
                    </div>
                    <div className="text-xs text-foreground/60 flex items-center gap-3">
                      <span>{isAr ? job.location : (job.locationEn || job.location)}</span>
                      <span>•</span>
                      <span>{isAr ? "كنترول: " : "Control: "}{job.controlRequired}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-start">
                      <div className="text-xs font-bold text-foreground">
                        {job.applicationsCount} {isAr ? "متقدم" : "applicants"}
                      </div>
                      <div className="text-[10px] text-foreground/50">
                        {isAr ? "جاهز للمراجعة" : "Ready for review"}
                      </div>
                    </div>

                    <Link
                      href={`/jobs/${job.id}/applications`}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl border border-primary/20 transition-all"
                    >
                      {isAr ? "عرض المرشحين" : "Review Applicants"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* 3. Quick Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative text-start space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {isAr ? "التقديم السريع المباشر" : "1-Click Direct Application"}
                </span>
                <h3 className="text-base sm:text-lg font-black text-foreground mt-1.5">
                  <bdi dir="auto">{isAr ? applyingJob.title : (applyingJob.titleEn || applyingJob.title)}</bdi>
                </h3>
                <p className="text-xs text-foreground/60">
                  {isAr ? (applyingJob.companyName || "مصنع معتمد بالسجل التجاري") : (applyingJob.companyNameEn || applyingJob.companyName || "Verified Plant")}
                </p>
              </div>

              <button
                onClick={() => setApplyingJob(null)}
                className="p-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-secondary/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form or Success State */}
            {applySuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {isAr ? "تم إرسال طلبك بنجاح!" : "Application Submitted Successfully!"}
                </h4>
                <p className="text-xs text-foreground/70 max-w-sm mx-auto leading-relaxed">
                  {isAr 
                    ? "تم تسليم بياناتك الفنية وخبراتك لمدير الإنتاج بالمصنع. ستصلك رسالة عبر واتساب فور مراجعة ملفك لتحديد موعد المقابلة الفنية واختبار الورشة."
                    : "Your machining profile has been dispatched to the factory production team. You will receive a WhatsApp message for your trial appointment."}
                </p>
                <button
                  onClick={() => setApplyingJob(null)}
                  className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all"
                >
                  {isAr ? "إغلاق ومتابعة التصفح" : "Close"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickApplySubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {isAr ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder={isAr ? "مثال: محمود أحمد حسن" : "e.g. Mahmoud Ahmed"}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {isAr ? "رقم الموبايل (واتساب نشط)" : "WhatsApp Mobile Number"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden"
                  />
                  <span className="text-[10px] text-foreground/50">
                    {isAr ? "مهم جداً: سيتم إرسال إشعار موعد المقابلة على هذا الرقم عبر واتساب." : "Critical: Interview schedule will be sent via WhatsApp."}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {isAr ? "نوبة العمل المفضلة" : "Preferred Shift"}
                  </label>
                  <select
                    value={applicantShift}
                    onChange={(e) => setApplicantShift(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden"
                  >
                    <option value="MORNING">{isAr ? "وردية صباحية (8:00 ص - 4:00 م)" : "Morning Shift"}</option>
                    <option value="EVENING">{isAr ? "وردية مسائية (4:00 م - 12:00 ص)" : "Evening Shift"}</option>
                    <option value="FULL_TIME">{isAr ? "تفرغ كامل / ورديتين" : "Full-Time"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {isAr ? "ملاحظة سريعة لمدير المصنع (اختياري)" : "Quick Note to Plant Manager (Optional)"}
                  </label>
                  <textarea
                    rows={2}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder={isAr ? "مثال: متاح لبدء العمل فوراً، أتقن تجهيز الشغل ومبرمج Mastercam..." : "e.g. Available immediately, Mastercam certified..."}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:border-primary focus:outline-hidden resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 text-xs font-bold text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingApply}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isSubmittingApply ? (
                      <span>{isAr ? "جاري الإرسال..." : "Submitting..."}</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                        <span>{isAr ? "تأكيد إرسال الطلب" : "Confirm Application"}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
