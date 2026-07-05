// src/components/dashboard/ApplicantRow.tsx
"use client";

import React, { useState, useTransition } from "react";
import { 
  Phone, 
  MapPin, 
  Star, 
  ChevronDown
} from "lucide-react";
import { updateApplicationStatusAction } from "@/app/actions/application";

interface ApplicantRowProps {
  app: {
    id: string;
    score: number | null;
    status: string;
    createdAt: Date | string;
    machinist: {
      id: string;
      name: string;
      role: "TECHNICIAN" | "ENGINEER";
      governorate: string;
      city: string;
      experienceYears: number;
      expectedSalary: number | string | { toString(): string };
      reliabilityScore: number;
      preferredControl: string[];
      specializations: string[];
      machineTypes: string[];
      phoneNumber: string;
    };
  };
  index: number;
}

export default function ApplicantRow({ app, index }: ApplicantRowProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(app.status);
  const [isPending, startTransition] = useTransition();

  const candidate = app.machinist;
  const formattedSalary = Number(candidate.expectedSalary).toLocaleString("ar-EG") + " ج.م";

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span className="text-foreground/40 font-medium">بدون اختبار</span>;
    if (score >= 80) return <span className="bg-green-500/10 text-green-600 border border-green-500/20 px-2.5 py-1 rounded-lg font-bold text-xs">ممتاز ({score}%)</span>;
    if (score >= 50) return <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold text-xs">متوسط ({score}%)</span>;
    return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-lg font-bold text-xs">ضعيف ({score}%)</span>;
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return "text-green-600 bg-green-500/10";
    if (score >= 85) return "text-amber-600 bg-amber-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "PENDING" | "CONTACTED" | "INTERVIEW" | "ACCEPTED" | "REJECTED" | "NO_SHOW";
    const prevStatus = currentStatus;

    if (newStatus === "INTERVIEW") {
      const proceed = confirm(
        `هل أنت متأكد من دعوة ${candidate.name} للمقابلة؟\nسيقوم النظام تلقائياً بإرسال رسالة واتساب بالموعد (يوم العمل التالي الساعة 10:00 صباحاً) وعنوان المصنع.`
      );
      if (!proceed) {
        return;
      }
    }

    setCurrentStatus(newStatus);

    startTransition(async () => {
      const res = await updateApplicationStatusAction(app.id, newStatus);
      if (!res.success) {
        setCurrentStatus(prevStatus);
        alert(res.error || "حدث خطأ أثناء تحديث حالة المتقدم.");
      }
    });
  };

  return (
    <tr className="border-b border-border hover:bg-secondary/5 transition-all text-right">
      
      {/* 1. الترتيب */}
      <td className="p-4 font-mono text-xs text-foreground/40 text-center">
        {(index + 1).toLocaleString("ar-EG")}
      </td>

      {/* 2. اسم المرشح والمسؤولية */}
      <td className="p-4">
        <div className="space-y-1">
          <div className="font-bold text-sm text-foreground/90">{candidate.name}</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              candidate.role === "ENGINEER" 
                ? "bg-sky-500/10 text-sky-600" 
                : "bg-emerald-500/10 text-emerald-600"
            }`}>
              {candidate.role === "ENGINEER" ? "مهندس" : "فني تشغيل"}
            </span>
            <span className="text-[10px] text-foreground/50">خبرة {candidate.experienceYears.toLocaleString("ar-EG")} سنوات</span>
          </div>
        </div>
      </td>

      {/* 3. نتيجة اختبار التصفية الفنية */}
      <td className="p-4 text-center">
        {getScoreBadge(app.score)}
      </td>

      {/* 4. مؤشر الالتزام والجدية */}
      <td className="p-4 text-center">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${getReliabilityColor(candidate.reliabilityScore)}`}>
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{candidate.reliabilityScore.toLocaleString("ar-EG")}%</span>
        </span>
      </td>

      {/* 5. الموقع والتفاصيل */}
      <td className="p-4 text-xs font-semibold text-foreground/75">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-foreground/30" />
            <span>{candidate.city}، {candidate.governorate}</span>
          </div>
          <div className="text-[10px] text-foreground/50">الراتب المطلوب: {formattedSalary}</div>
        </div>
      </td>

      {/* 6. تاريخ التقديم */}
      <td className="p-4 text-xs font-medium text-foreground/50 text-center">
        {new Date(app.createdAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      {/* 7. حالة الطلب (تعديل مباشر) */}
      <td className="p-4">
        <div className="relative inline-block w-full">
          <select
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={isPending}
            className="w-full pl-8 pr-3 py-1.5 border border-border bg-secondary/5 rounded-lg text-xs font-semibold text-foreground/80 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="PENDING">تم الاستلام</option>
            <option value="CONTACTED">تم الاتصال تلفونياً</option>
            <option value="INTERVIEW">مقابلة فنية</option>
            <option value="ACCEPTED">مقبول للعمل</option>
            <option value="REJECTED">مرفوض</option>
            <option value="NO_SHOW">لم يحضر المقابلة (مهم)</option>
          </select>
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-foreground/40">
            {isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </td>

      {/* 8. رقم الهاتف (كشف فوري) */}
      <td className="p-4 text-center">
        {showPhone ? (
          <a
            href={`tel:${candidate.phoneNumber}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary hover:underline rounded-lg font-mono text-xs font-bold"
            dir="ltr"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{candidate.phoneNumber}</span>
          </a>
        ) : (
          <button
            onClick={() => setShowPhone(true)}
            className="px-3 py-1.5 border border-border hover:bg-secondary/5 hover:border-primary/40 text-xs font-bold rounded-lg text-primary transition-all cursor-pointer"
          >
            اتصال
          </button>
        )}
      </td>

    </tr>
  );
}
