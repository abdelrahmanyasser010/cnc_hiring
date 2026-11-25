// src/components/dashboard/VerificationRow.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toggleVerificationAction } from "@/app/actions/admin";
import { CheckCircle2, XCircle, Phone, MapPin, Building2, ShieldAlert, Loader2, Eye, X, MessageSquare } from "lucide-react";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const cleanPhone = (employer.user.phoneNumber || "").replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("0") ? "2" + cleanPhone : cleanPhone.startsWith("2") ? cleanPhone : "20" + cleanPhone;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `مرحباً أستاذ ${employer.user.name || "الفاضل"}، نتواصل معكم من إدارة منصة HIREX CNC بخصوص توثيق واعتماد مصنع "${employer.companyName}".`
  )}`;

  return (
    <>
      <tr className="border-b border-border hover:bg-secondary/5 transition-all text-right">
        
        {/* 1. الرقم */}
        <td className="p-4 text-center text-xs font-mono text-foreground/40">
          {(index + 1).toLocaleString("ar-EG")}
        </td>

        {/* 2. اسم المنشأة وتفاصيلها */}
        <td className="p-4">
          <div className="space-y-1">
            <div className="font-bold text-sm text-foreground/90 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary shrink-0" />
              <span>{employer.companyName}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-foreground/50">
              <MapPin className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
              <span>{employer.industryZone}، {employer.address}</span>
            </div>
          </div>
        </td>

        {/* 3. المسؤول وتفاصيل الاتصال + واتساب */}
        <td className="p-4">
          <div className="space-y-1.5">
            <div className="font-semibold text-xs text-foreground/80">{employer.user.name || "صاحب العمل"}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-mono text-foreground/70" dir="ltr">
                <Phone className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span>{employer.user.phoneNumber}</span>
              </div>
              {employer.user.phoneNumber && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="محادثة مباشرة عبر واتساب"
                  className="px-2 py-0.5 rounded-md bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-[10px] font-bold inline-flex items-center gap-1 border border-[#25D366]/20"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>واتساب</span>
                </a>
              )}
            </div>
          </div>
        </td>

        {/* 4. السجل التجاري / البطاقة الضريبية + معاينة سريعة */}
        <td className="p-4 text-center font-mono text-xs font-bold text-foreground/60">
          <div className="flex flex-col gap-1.5 items-center">
            {employer.commercialRegId ? (
              <span className="bg-secondary/10 px-2 py-0.5 rounded-md text-foreground/80">
                {employer.commercialRegId}
              </span>
            ) : (
              <span className="text-foreground/30 text-[11px]">غير مدخل</span>
            )}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="text-primary hover:underline text-[10px] flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>معاينة المستند</span>
            </button>
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
            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
              <XCircle className="w-3.5 h-3.5" />
              <span>بانتظار الاعتماد</span>
            </span>
          )}
        </td>

        {/* 6. إجراءات التوثيق */}
        <td className="p-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleToggle}
              disabled={isPending}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 w-32 ${
                employer.isVerified
                  ? "bg-slate-500/15 hover:bg-slate-500/25 text-slate-700 dark:text-slate-400"
                  : "bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري المعالجة...</span>
                </>
              ) : employer.isVerified ? (
                <span>إلغاء التوثيق</span>
              ) : (
                <span>اعتماد المنشأة</span>
              )}
            </button>

            {error && (
              <span className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                <ShieldAlert className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </span>
            )}
          </div>
        </td>

      </tr>

      {/* نافذة معاينة المستند المنبثقة (Document Preview Modal) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-right space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  فحص ومراجعة مستندات المنشأة
                </span>
                <h3 className="text-base font-bold text-foreground mt-1">{employer.companyName}</h3>
                <p className="text-xs text-foreground/60">{employer.industryZone} — {employer.address}</p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-secondary/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* تفاصيل السجل */}
            <div className="space-y-3 bg-secondary/5 p-4 rounded-xl border border-border text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-foreground/50">رقم السجل التجاري:</span>
                <span className="font-mono font-bold text-foreground">{employer.commercialRegId || "غير مسجل"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-foreground/50">المسؤول عن المنشأة:</span>
                <span className="font-bold text-foreground">{employer.user.name || "صاحب العمل"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-foreground/50">رقم الهاتف للتواصل:</span>
                <span className="font-mono font-bold text-primary" dir="ltr">{employer.user.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-foreground/50">حالة التوثيق:</span>
                <span className={employer.isVerified ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                  {employer.isVerified ? "معتمد وموثق بالسجل" : "قيد المراجعة والتدقيق"}
                </span>
              </div>
            </div>

            {/* معاينة صورة المستند أو الرابط */}
            <div className="p-4 border border-border/70 rounded-xl bg-background/50 text-center space-y-2">
              <div className="text-xs text-foreground/70 font-semibold">مستند السجل التجاري / رخصة النشاط</div>
              {employer.businessLicenseUrl ? (
                <div className="space-y-2">
                  <div className="w-full h-36 bg-slate-900/10 dark:bg-slate-800/40 rounded-lg flex items-center justify-center border border-dashed border-border text-foreground/40 text-xs">
                    📄 معاينة المستند المرفوع جاهزة للعرض
                  </div>
                  <a
                    href={employer.businessLicenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <span>فتح الملف الأصلي في نافذة كاملة</span>
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="text-xs text-foreground/40 py-6">
                  لم يقم صاحب المصنع برفع ملف PDF حتى الآن. تم إدخال رقم السجل التجاري يدوياً.
                </div>
              )}
            </div>

            {/* أزرار الإجراء السريع */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleToggle();
                  setIsPreviewOpen(false);
                }}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all cursor-pointer text-center"
              >
                {employer.isVerified ? "إلغاء اعتماد المصنع" : "اعتماد وتوثيق هذا المصنع الآن ✓"}
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="py-2.5 px-4 bg-secondary/15 text-foreground text-xs font-semibold rounded-xl hover:bg-secondary/25 transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
