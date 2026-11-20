"use client";

// src/components/dashboard/ReferralRequestSection.tsx
// مكون مخصص للمصانع والشركات: "طلب ترشيحات من إدارة المنصة" (Referral / Headhunting Service)
// مطابق لشرائح البريف (Slide 2 & Slide 5) ومتطلبات العميل:
// 1. الشركة تطلب ترشيح حد بمواصفات معينة (الصناعة، المسمى، الماكينات)
// 2. مراجعة الاحتياج والملفات في قاعدة البيانات
// 3. مطابقة الكفاءات وترشيح استباقي بموافقة المرشح
// 4. تواصل مباشر واستلام الكوادر المناسبة

import React, { useState, useTransition } from "react";
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  Factory, 
  Wrench, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CNC_INDUSTRIES, EGYPTIAN_GOVERNORATES } from "@/lib/constants";
import { createReferralRequestAction } from "@/app/(dashboard)/talent/actions";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ReferralRequestSection() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createReferralRequestAction(formData);
      if (res.success) {
        setSuccessMessage(res.message || (isAr ? "تم إرسال طلب الترشيح بنجاح!" : "Request sent successfully!"));
      } else {
        setErrorMessage(res.message || (isAr ? "فشل إرسال الطلب." : "Failed to send request."));
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-background border border-primary/20 rounded-2xl p-5 sm:p-6 shadow-sm transition-all text-start">
      
      {/* 1. الشريط التعريفي بالخدمة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-foreground">
                {isAr ? "طلب ترشيح كفاءة فنية مخصصة من إدارة المنصة" : "Request Tailored CNC Nomination"}
              </h3>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                {isAr ? "خدمة الترشيح المباشر" : "Direct Match"}
              </span>
            </div>
            <p className="text-xs text-foreground/65 mt-1 leading-relaxed max-w-2xl">
              {isAr 
                ? "تبحث عن فني أو مهندس بمواصفات دقيقة وماكينات معينة؟ اطلب من فريقنا الهندسي البحث في قاعدة البيانات وتصفية المرشحين المناسبين وترشيحهم لك مباشرة بعد موافقتهم."
                : "Looking for specific CNC skills or niche machinery experience? Submit your requirements and our engineering team will match and nominate pre-vetted candidates directly."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <span>{isOpen ? (isAr ? "إغلاق النموذج" : "Close Form") : (isAr ? "تقديم طلب ترشيح الآن +" : "Request Nomination +")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. النموذج القابل للفتح والإغلاق */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border/80 animate-in fade-in duration-300">
          
          {successMessage ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">{isAr ? "تم استلام متطلبات مصنعكم بنجاح!" : "Request Received Successfully!"}</h4>
              <p className="text-xs leading-relaxed max-w-lg mx-auto text-foreground/75">
                {successMessage}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href="https://wa.me/201012345678?text=مرحباً،%20قمت%20بإرسال%20طلب%20ترشيح%20كفاءة%20CNC%20من%20المنصة"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? "متابعة فورية عبر واتساب" : "Instant WhatsApp Follow-up"}</span>
                </a>
                <button
                  type="button"
                  onClick={() => { setSuccessMessage(null); setIsOpen(false); }}
                  className="px-4 py-2 bg-secondary/10 border border-border text-foreground text-xs font-semibold rounded-xl hover:bg-secondary/20"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. الصناعة المطلوبة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "الصناعة (مرتبة أبجدياً)" : "Industry (Alphabetical)"} <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    name="industry"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs appearance-none cursor-pointer"
                  >
                    <option value="">{isAr ? "-- اختر صناعة مصنعك --" : "-- Select Industry --"}</option>
                    {CNC_INDUSTRIES.map((ind) => (
                      <option key={ind.id} value={ind.ar}>
                        {isAr ? ind.ar : ind.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. المسمى الوظيفي المطلوب */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "المسمى الوظيفي المطلوب (كتابة حرة)" : "Target Job Title"} <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder={isAr ? "مثال: مبرمج CAM 5 محاور، سِتَابَر فريزة Haas" : "e.g. 5-Axis CAM Programmer, Lathe Setter"}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>

                {/* 3. الماكينات المطلوبة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "الماكينات ونظام الكنترول" : "Machines & Controls Needed"} <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="machinesNeeded"
                    placeholder={isAr ? "مثال: كنترول Fanuc 0i-TF، فريزة مازاك Mazatrol" : "e.g. Fanuc, Siemens Sinumerik, Haas VF2"}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>

                {/* 4. سنوات الخبرة المطلوبة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80">
                    {isAr ? "الحد الأدنى لسنوات الخبرة" : "Min Experience (Years)"}
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    placeholder="مثال: 3"
                    min="0"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>

                {/* 5. المحافظة المفضلة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "المحافظة أو النطاق الجغرافي" : "Preferred Location"}</span>
                  </label>
                  <select
                    name="governorate"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs appearance-none cursor-pointer"
                  >
                    <option value="">{isAr ? "أي محافظة بمصر" : "Any Location in Egypt"}</option>
                    {EGYPTIAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                {/* 6. الميزانية أو الراتب المتوقع */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "الميزانية أو الراتب المقترح (ج.م)" : "Budget / Salary Range"}</span>
                  </label>
                  <input
                    type="text"
                    name="salaryRange"
                    placeholder={isAr ? "مثال: 12,000 - 15,000 ج.م" : "e.g. 12k - 15k EGP"}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs"
                  />
                </div>

              </div>

              {/* ملاحظات وتفاصيل فنية إضافية */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80">
                  {isAr ? "تفاصيل إضافية عن الوردية أو بيئة العمل بالورشة/المصنع:" : "Additional Technical or Shift Details:"}
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder={isAr ? "اكتب أي تفاصيل إضافية (مثال: العمل وردية ليلية، توفير سكن للمغتربين، تأمينات، بدلات مواصلات...)" : "Enter any additional requirements (e.g. shift, housing, transport allowance)..."}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-foreground/50">
                  🛡️ {isAr ? "الترشيح يتم بعد مراجعة ملف المرشح والتأكد من ملاءمته وأخذ موافقته أولاً." : "Nominations are conducted with candidate consent."}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      <span>{isAr ? "إرسال طلب الترشيح للإدارة" : "Submit Nomination Request"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      )}

    </div>
  );
}
