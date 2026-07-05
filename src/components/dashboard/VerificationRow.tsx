// src/components/dashboard/VerificationRow.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toggleVerificationAction } from "@/app/actions/admin";
import { CheckCircle2, XCircle, Phone, MapPin, Building2, ShieldAlert, Loader2 } from "lucide-react";

interface VerificationRowProps {
  employer: {
    id: string;
    companyName: string;
    industryZone: string;
    address: string;
    commercialRegId: string | null;
    businessLicenseUrl?: string | null;
    isVerified: boolean;
    user: {
      name: string | null;
      phoneNumber: string | null;
    };
  };
  index: number;
}

export default function VerificationRow({ employer, index }: VerificationRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await toggleVerificationAction(employer.id, !employer.isVerified);
        if (!res.success) {
          setError(res.error || "فشل تحديث حالة التوثيق.");
        }
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء الاتصال بالسيرفر.");
      }
    });
  };

  return (
    <tr className="border-b border-border hover:bg-secondary/5 transition-all text-right">
      
      {/* 1. الرقم */}
      <td className="p-4 text-center text-xs font-mono text-foreground/40">
        {(index + 1).toLocaleString("ar-EG")}
      </td>

      {/* 2. اسم المنشأة وتفاصيلها */}
      <td className="p-4">
        <div className="space-y-1">
          <div className="font-bold text-sm text-foreground/90 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-foreground/40" />
            <span>{employer.companyName}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-foreground/50">
            <MapPin className="w-3.5 h-3.5 text-foreground/30" />
            <span>{employer.industryZone}، {employer.address}</span>
          </div>
        </div>
      </td>

      {/* 3. المسؤول وتفاصيل الاتصال */}
      <td className="p-4">
        <div className="space-y-1">
          <div className="font-semibold text-xs text-foreground/80">{employer.user.name || "صاحب العمل"}</div>
          <div className="flex items-center gap-1 text-xs font-mono text-primary" dir="ltr">
            <Phone className="w-3.5 h-3.5 text-primary/45 shrink-0" />
            <span>{employer.user.phoneNumber}</span>
          </div>
        </div>
      </td>

      {/* 4. السجل التجاري / البطاقة الضريبية */}
      <td className="p-4 text-center font-mono text-xs font-bold text-foreground/60">
        <div className="flex flex-col gap-1 items-center">
          {employer.commercialRegId ? (
            <span>{employer.commercialRegId}</span>
          ) : (
            <span className="text-foreground/30">غير مدخل</span>
          )}
          {employer.businessLicenseUrl && (
            <a 
              href={employer.businessLicenseUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-[10px] flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full"
            >
              عرض الملف المرفق
            </a>
          )}
        </div>
      </td>

      {/* 5. حالة التوثيق الحالية */}
      <td className="p-4 text-center">
        {employer.isVerified ? (
          <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/10 text-green-600 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>موثقة</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-500/10 text-slate-500 border border-slate-500/20 px-2.5 py-0.5 rounded-full font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>غير موثقة</span>
          </span>
        )}
      </td>

      {/* 6. إجراءات التوثيق */}
      <td className="p-4 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 w-32 ${
              employer.isVerified
                ? "bg-slate-500/15 hover:bg-slate-500/25 text-slate-700 dark:text-slate-400"
                : "bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : employer.isVerified ? (
              <span>إلغاء التوثيق</span>
            ) : (
              <span>توثيق الشركة</span>
            )}
          </button>
          
          {error && (
            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5">
              <ShieldAlert className="w-3 h-3" />
              {error}
            </span>
          )}
        </div>
      </td>

    </tr>
  );
}
