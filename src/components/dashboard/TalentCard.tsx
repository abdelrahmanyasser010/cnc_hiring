// src/components/dashboard/TalentCard.tsx
"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Cpu, 
  Calendar, 
  DollarSign, 
  Star, 
  Phone, 
  Factory,
  Wrench,
  FileText,
  Clock
} from "lucide-react";
import { CONTROL_LABELS, WORK_SHIFTS } from "@/lib/constants";
import { revealCandidatePhoneAction } from "@/app/(dashboard)/talent/actions";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface CandidateData {
  id: string;
  name: string;
  role: "TECHNICIAN" | "ENGINEER";
  industry?: string | null;
  jobTitle?: string | null;
  machinesFreeText?: string | null;
  skillsSummary?: string | null;
  preferredShift?: string | null;
  cvUrl?: string | null;
  governorate: string;
  city: string;
  experienceYears: number;
  expectedSalary: number;
  reliabilityScore: number;
  preferredControl: string[];
  specializations: string[];
  machineTypes: string[];
  phoneNumber: string;
}

interface TalentCardProps {
  candidate: CandidateData;
}

export default function TalentCard({ candidate }: TalentCardProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [showPhone, setShowPhone] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleRevealPhone = async () => {
    setIsLoadingPhone(true);
    setPhoneError(null);
    try {
      const res = await revealCandidatePhoneAction(candidate.id);
      if (res.success && res.phoneNumber) {
        setRevealedPhone(res.phoneNumber);
        setShowPhone(true);
      } else {
        setPhoneError(res.message || (isAr ? "فشل في كشف رقم الهاتف." : "Failed to reveal phone number."));
      }
    } catch {
      setPhoneError(isAr ? "حدث خطأ في الاتصال بالخادم." : "Server connection error.");
    } finally {
      setIsLoadingPhone(false);
    }
  };

  // تنسيق الراتب المعروض
  const formattedSalary = Number(candidate.expectedSalary) > 0 
    ? `${Number(candidate.expectedSalary).toLocaleString(isAr ? "ar-EG" : "en-US")} ${isAr ? "ج.م" : "EGP"}`
    : (isAr ? "قابل للتفاوض" : "Negotiable");

  // تحديد ألوان مؤشر الالتزام
  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 85) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 relative overflow-hidden text-start">
      
      {/* 1. رأس البطاقة: الصناعة، الاسم، والمسمى الوظيفي */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          {/* بادج الصناعة */}
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg font-bold bg-primary/10 text-primary border border-primary/20 max-w-[65%] truncate">
            <Factory className="w-3 h-3 shrink-0" />
            <span className="truncate">{candidate.industry || (isAr ? "صناعة عامة" : "General CNC")}</span>
          </span>

          {/* مؤشر جدية المرشح */}
          <div className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold border shrink-0 ${getReliabilityColor(candidate.reliabilityScore)}`}>
            <Star className="w-3 h-3 fill-current" />
            <span>{candidate.reliabilityScore}% {isAr ? "جاهزية" : "Verified"}</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors cursor-pointer">
            {candidate.name}
          </h3>
          <p className="text-xs text-primary font-semibold mt-0.5">
            {candidate.jobTitle || (candidate.role === "ENGINEER" ? (isAr ? "مهندس تشغيل وبرمجة CNC" : "CNC CAM Engineer") : (isAr ? "فني تشغيل وSetup ماكينات" : "CNC Operator & Setter"))}
          </p>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* 2. تفاصيل المرشح الفنية والمكانية */}
      <div className="space-y-2.5 text-xs text-foreground/75">
        
        {/* الموقع الجغرافي */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
          <span>{candidate.city}، {candidate.governorate}</span>
        </div>

        {/* سنوات الخبرة */}
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
          <span>{isAr ? "الخبرة الميدانية:" : "Experience:"} <strong className="text-foreground">{candidate.experienceYears} {isAr ? "سنوات" : "years"}</strong></span>
        </div>

        {/* الوردية وساعات العمل المفضلة */}
        {candidate.preferredShift && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
            <span>
              {isAr ? "الوردية المفضلة:" : "Preferred Shift:"}{" "}
              <strong className="text-foreground">
                {WORK_SHIFTS.find((s) => s.id === candidate.preferredShift)?.[isAr ? "ar" : "en"] || candidate.preferredShift}
              </strong>
            </span>
          </div>
        )}

        {/* الماكينات (كتابة حرة) */}
        {candidate.machinesFreeText && (
          <div className="flex items-start gap-2 pt-0.5">
            <Wrench className="w-3.5 h-3.5 text-foreground/40 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-foreground/50">{isAr ? "الماكينات المتقنة: " : "Machines: "}</span>
              <span className="font-medium text-foreground/90">{candidate.machinesFreeText}</span>
            </div>
          </div>
        )}

        {/* تخصصات الكنترول */}
        {candidate.preferredControl.length > 0 && (
          <div className="flex items-start gap-2 pt-0.5">
            <Cpu className="w-3.5 h-3.5 text-foreground/40 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {candidate.preferredControl.map((ctrl, idx) => (
                <span key={idx} className="bg-secondary/10 text-foreground/80 px-2 py-0.5 rounded text-[10px] font-semibold border border-border/40">
                  {CONTROL_LABELS[ctrl] || ctrl}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* الراتب المتوقع */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
          <DollarSign className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
          <span>{isAr ? "الراتب التقديري:" : "Expected Salary:"} <span className="font-bold text-foreground">{formattedSalary}</span></span>
        </div>

        {/* رابط CV إذا كان متوفراً */}
        {candidate.cvUrl && (
          <div className="pt-1">
            <a 
              href={candidate.cvUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-[11px] font-semibold hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? "عرض السيرة الذاتية المرفقة (CV)" : "View Attached CV"}</span>
            </a>
          </div>
        )}

      </div>

      {/* 3. الإجراءات: عرض رقم الهاتف / كشف مباشر من الباقة */}
      <div className="pt-3 border-t border-border/60">
        {showPhone && revealedPhone ? (
          <div className="w-full flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-mono text-center animate-fadeIn" dir="ltr">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <a href={`tel:${revealedPhone}`} className="hover:underline font-bold text-sm tracking-widest pl-2">
              {revealedPhone}
            </a>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-lg font-sans font-semibold">
              {isAr ? "مباشر" : "Direct"}
            </span>
          </div>
        ) : (
          <button
            onClick={handleRevealPhone}
            disabled={isLoadingPhone}
            className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isLoadingPhone ? (isAr ? "جاري الكشف عن الرقم..." : "Revealing Phone...") : (isAr ? "إظهار رقم هاتف الكفاءة 📞" : "Reveal Direct Phone 📞")}</span>
          </button>
        )}

        {phoneError && (
          <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs space-y-1 text-start animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5">
              <span>{isAr ? "تنبيه الباقة" : "Subscription Notice"}</span>
            </div>
            <p>{phoneError}</p>
            {phoneError.includes("الترقية") || phoneError.includes("upgrade") ? (
              <a
                href="/billing?reason=upgrade"
                className="inline-block mt-1 text-primary font-bold hover:underline"
              >
                {isAr ? "ترقية الباقة الآن ←" : "Upgrade Plan Now →"}
              </a>
            ) : null}
          </div>
        )}
      </div>

    </div>
  );
}
