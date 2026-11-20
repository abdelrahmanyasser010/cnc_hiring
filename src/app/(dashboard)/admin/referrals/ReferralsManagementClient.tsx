"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  Building2, 
  Phone, 
  Calendar, 
  Cpu, 
  Briefcase, 
  Search, 
  AlertCircle, 
  ExternalLink,
  Loader2,
  ChevronDown
} from "lucide-react";
import { updateReferralStatusAction } from "@/presentation/actions/admin.actions";

export interface ReferralItem {
  id: string;
  employerId: string;
  industry: string;
  jobTitle: string;
  machinesNeeded: string;
  experienceYears: number | null;
  governorate: string | null;
  salaryRange: string | null;
  notes: string | null;
  status: string;
  createdAt: string | Date;
  employer: {
    id: string;
    companyName: string;
    industryZone: string;
    user: {
      phoneNumber: string | null;
      email: string | null;
    };
  };
}

interface Props {
  initialRequests: ReferralItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING: {
    label: "جديد - قيد المراجعة",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
  },
  MATCHING: {
    label: "جاري الفرز والمطابقة",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
  },
  NOMINATED: {
    label: "تم ترشيح كفاءات للمصنع",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
  },
  HIRED: {
    label: "تم التعيين بنجاح 🎉",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  CLOSED: {
    label: "طلب مغلق",
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-200 dark:border-slate-700",
  },
};

export default function ReferralsManagementClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState<ReferralItem[]>(initialRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = selectedStatus === "ALL" || req.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      req.employer.companyName.toLowerCase().includes(q) ||
      req.industry.toLowerCase().includes(q) ||
      req.jobTitle.toLowerCase().includes(q) ||
      req.machinesNeeded.toLowerCase().includes(q) ||
      (req.employer.user.phoneNumber && req.employer.user.phoneNumber.includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setUpdatingId(requestId);
    startTransition(async () => {
      const res = await updateReferralStatusAction(requestId, newStatus);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
        );
      }
      setUpdatingId(null);
    });
  };

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    MATCHING: requests.filter((r) => r.status === "MATCHING").length,
    NOMINATED: requests.filter((r) => r.status === "NOMINATED").length,
    HIRED: requests.filter((r) => r.status === "HIRED").length,
    CLOSED: requests.filter((r) => r.status === "CLOSED").length,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Search and Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm text-right">
          <span className="text-xs text-foreground/50 font-medium">إجمالي الطلبات</span>
          <p className="text-2xl font-bold mt-1 text-foreground">{counts.ALL}</p>
        </div>
        <div className="bg-card border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 shadow-sm text-right">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">طلبات جديدة</span>
          <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{counts.PENDING}</p>
        </div>
        <div className="bg-card border border-blue-200 dark:border-blue-900/40 rounded-xl p-3.5 shadow-sm text-right">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">جاري المطابقة</span>
          <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{counts.MATCHING}</p>
        </div>
        <div className="bg-card border border-purple-200 dark:border-purple-900/40 rounded-xl p-3.5 shadow-sm text-right">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">تم الترشيح</span>
          <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{counts.NOMINATED}</p>
        </div>
        <div className="bg-card border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3.5 shadow-sm text-right">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">تم التعيين</span>
          <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{counts.HIRED}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card border border-border rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "الكل" },
            { id: "PENDING", label: "جديدة" },
            { id: "MATCHING", label: "مطابقة" },
            { id: "NOMINATED", label: "مرشحين" },
            { id: "HIRED", label: "تم التعيين" },
            { id: "CLOSED", label: "مغلقة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground/70 hover:bg-muted"
              }`}
            >
              {tab.label}
              <span className="ms-1.5 text-[10px] opacity-75">
                ({counts[tab.id as keyof typeof counts] ?? 0})
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالمصنع، الصناعة، الماكينات..."
            className="w-full text-xs py-2 ps-8 pe-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
          />
          <Search className="w-3.5 h-3.5 text-foreground/40 absolute start-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center text-foreground/50">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">لا توجد طلبات ترشيح مطابقة للفلتر المحدد</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const statusInfo = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
            const dateStr = new Date(req.createdAt).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            // Target search URL for matching
            const matchTalentUrl = `/talent?industry=${encodeURIComponent(req.industry)}&query=${encodeURIComponent(req.machinesNeeded.split(" ")[0] || "")}`;

            return (
              <div
                key={req.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow transition-shadow space-y-4"
              >
                {/* Header: Company & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        {req.employer.companyName}
                        <span className="text-[10px] font-normal text-foreground/50 bg-muted px-2 py-0.5 rounded-md">
                          {req.employer.industryZone}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-foreground/60 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-foreground/40" />
                          {dateStr}
                        </span>
                        {req.employer.user.phoneNumber && (
                          <a
                            href={`tel:${req.employer.user.phoneNumber}`}
                            className="flex items-center gap-1 text-primary hover:underline font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            {req.employer.user.phoneNumber}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={req.status}
                        disabled={updatingId === req.id || isPending}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className={`text-xs font-bold py-1.5 ps-3 pe-7 rounded-xl border appearance-none cursor-pointer focus:outline-none ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                      >
                        <option value="PENDING">جديد - قيد المراجعة</option>
                        <option value="MATCHING">جاري الفرز والمطابقة</option>
                        <option value="NOMINATED">تم ترشيح كفاءات</option>
                        <option value="HIRED">تم التعيين بنجاح 🎉</option>
                        <option value="CLOSED">طلب مغلق</option>
                      </select>
                      {updatingId === req.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin absolute end-2 top-2 text-foreground/50 pointer-events-none" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 absolute end-2 top-2 text-foreground/50 pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Requirements Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 rounded-xl p-3 border border-border/40 text-xs">
                  <div>
                    <span className="text-foreground/50 block mb-0.5 font-medium">الصناعة المطلوبة:</span>
                    <span className="font-bold text-foreground inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      {req.industry}
                    </span>
                  </div>

                  <div>
                    <span className="text-foreground/50 block mb-0.5 font-medium">المسمى الوظيفي:</span>
                    <span className="font-bold text-foreground">{req.jobTitle}</span>
                  </div>

                  <div>
                    <span className="text-foreground/50 block mb-0.5 font-medium">سنوات الخبرة والمحافظة:</span>
                    <span className="font-bold text-foreground">
                      {req.experienceYears ? `${req.experienceYears} سنوات` : "غير محدد"}
                      {req.governorate && ` • ${req.governorate}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-foreground/50 block mb-0.5 font-medium">الميزانية أو الراتب:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {req.salaryRange || "يحدد في المقابلة"}
                    </span>
                  </div>
                </div>

                {/* Machines Needed */}
                <div className="space-y-1">
                  <span className="text-xs text-foreground/50 font-medium block">
                    الماكينات ونوع التحكم المطلوب:
                  </span>
                  <div className="p-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary shrink-0" />
                    <span>{req.machinesNeeded}</span>
                  </div>
                </div>

                {/* Notes if present */}
                {req.notes && (
                  <div className="text-xs bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-foreground/80 leading-relaxed">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                      ملاحظات واشتراطات المصنع:
                    </span>
                    {req.notes}
                  </div>
                )}

                {/* Quick Action: Find Matching Talent */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="text-[11px] text-foreground/50">
                    منهجية الترشيح: التواصل مع الكوادر المطابقة أولاً، ثم إرسال الملف بموافقة الفني.
                  </div>

                  <Link
                    href={matchTalentUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    <span>مطابقة الكفاءات في قاعدة البيانات</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
