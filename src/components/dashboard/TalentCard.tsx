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
  Award
} from "lucide-react";
import { CONTROL_LABELS } from "@/lib/constants";
import { revealCandidatePhoneAction } from "@/app/(dashboard)/talent/actions";
interface CandidateData {
  id: string;
  name: string;
  role: "TECHNICIAN" | "ENGINEER";
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
        setPhoneError(res.message || "فشل في جلب رقم الهاتف.");
      }
    } catch {
      setPhoneError("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setIsLoadingPhone(false);
    }
  };

  // تنسيق الراتب المعروض
  const formattedSalary = Number(candidate.expectedSalary).toLocaleString("ar-EG") + " ج.م";

  // تحديد ألوان وتنسيق مؤشر الالتزام
  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-green-600 bg-green-500/10 border-green-500/20";
    if (score >= 85) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div dir="rtl" className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between gap-6 relative overflow-hidden">
      
      {/* 1. رأس البطاقة: الاسم، الدور ومؤشر الالتزام */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          {/* بادج نوع الكادر */}
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
            candidate.role === "ENGINEER"
              ? "bg-sky-500/10 text-sky-600 border border-sky-500/20"
              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
          }`}>
            {candidate.role === "ENGINEER" ? "مهندس إنتاج/تصميم" : "فني تشغيل CNC"}
          </span>

          {/* مؤشر جدية الفني */}
          <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold border ${getReliabilityColor(candidate.reliabilityScore)}`}>
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{candidate.reliabilityScore}% جدية</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-foreground/90 hover:text-primary transition-colors cursor-pointer">
            {candidate.name}
          </h3>
          <p className="text-xs text-primary font-semibold mt-1">
            {candidate.role === "ENGINEER" 
              ? `مهندس خبرة (${candidate.experienceYears} سنوات)` 
              : `فني تشغيل ماكينات (${candidate.experienceYears} سنوات)`
            }
          </p>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* 2. تفاصيل الفني الجغرافية والمهنية */}
      <div className="space-y-3 text-xs text-foreground/75">
        {/* الموقع الجغرافي */}
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-foreground/40 shrink-0" />
          <span>المنطقة: {candidate.city}، {candidate.governorate}</span>
        </div>

        {/* سنوات الخبرة */}
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-foreground/40 shrink-0" />
          <span>سنوات الخبرة: {candidate.experienceYears} {candidate.experienceYears >= 3 && candidate.experienceYears <= 10 ? "سنوات" : "سنة"}</span>
        </div>

        {/* الراتب المتوقع */}
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-4 h-4 text-foreground/40 shrink-0" />
          <span>الراتب المتوقع: <span className="font-bold text-foreground">{formattedSalary}</span> شهرياً</span>
        </div>

        {/* ماكينات الفني (للفنيين) أو تخصصات البرامج (للمهندسين) */}
        {candidate.role === "TECHNICIAN" && candidate.machineTypes.length > 0 && (
          <div className="flex items-start gap-2.5 pt-1">
            <Award className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              <span className="text-foreground/50 ml-1">الماكينات:</span>
              {candidate.machineTypes.map((mach, idx) => (
                <span key={idx} className="bg-secondary/5 px-2 py-0.5 rounded text-[10px] border border-border/50 text-foreground/80 font-medium">
                  {mach}
                </span>
              ))}
            </div>
          </div>
        )}

        {candidate.role === "ENGINEER" && candidate.specializations.length > 0 && (
          <div className="flex items-start gap-2.5 pt-1">
            <Award className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              <span className="text-foreground/50 ml-1">البرامج:</span>
              {candidate.specializations.map((spec, idx) => (
                <span key={idx} className="bg-secondary/5 px-2 py-0.5 rounded text-[10px] border border-border/50 text-foreground/80 font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* أنظمة التحكم والكنترول المفضلة (مهمة للمصانع) */}
        {candidate.preferredControl.length > 0 && (
          <div className="flex items-start gap-2.5 pt-2">
            <Cpu className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {candidate.preferredControl.map((ctrl, idx) => (
                <span key={idx} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                  {CONTROL_LABELS[ctrl] || ctrl}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. الإجراءات: عرض رقم الهاتف / تواصل */}
      <div className="pt-3 border-t border-border/60">
        {showPhone && revealedPhone ? (
          <div className="w-full flex items-center justify-between p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-mono text-center animate-fadeIn" dir="ltr">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <a href={`tel:${revealedPhone}`} className="hover:underline font-bold text-base tracking-widest pl-2">
              {revealedPhone}
            </a>
            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-lg font-sans font-semibold">مباشر</span>
          </div>
        ) : (
          <button
            onClick={handleRevealPhone}
            disabled={isLoadingPhone}
            className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="w-4 h-4" />
            <span>{isLoadingPhone ? "جاري الكشف عن الرقم..." : "عرض رقم هاتف الكفاءة"}</span>
          </button>
        )}

        {phoneError && (
          <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs space-y-1 text-right animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5">
              <span>تنبيه الباقة</span>
            </div>
            <p>{phoneError}</p>
            {phoneError.includes("الترقية") && (
              <a
                href="/billing?reason=upgrade"
                className="inline-block mt-1 text-primary font-bold hover:underline"
              >
                ترقية الباقة الآن ←
              </a>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
