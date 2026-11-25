"use client";

// src/components/shared/CandidateRegisterForm.tsx
// نموذج تسجيل الكوادر الفنية ومشغلي ومهندسي ماكينات CNC في منصة HIREX CNC:
// - تصميم هندسي وصناعي نظيف وواضح
// - تصنيف واقعي بدون مصطلحات AI غريبة
// - إيقونات نظيفة وموضوعة في التسميات لمنع أي تداخل مع النصوص أو الأرقام
// - دعم كامل للغتين مع تجربة سلسة للموبايل وسطح المكتب

import React, { useState, useActionState } from "react";
import { registerCandidateAction } from "@/app/actions/auth";
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Mail,
  Lock,
  Factory,
  Wrench,
  FileText,
  Plus,
  Sparkles,
  DollarSign,
  Clock
} from "lucide-react";
import Link from "next/link";
import { CNC_INDUSTRIES, EGYPTIAN_GOVERNORATES, EGYPTIAN_GOVERNORATES_EN, WORK_SHIFTS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CandidateRegisterForm() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [role, setRole] = useState<"TECHNICIAN" | "ENGINEER">("TECHNICIAN");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [machinesInput, setMachinesInput] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("FLEXIBLE");

  // ربط إجراء السيرفر (Server Action) وإدارة حالات الخطأ والنجاح
  const [state, formAction, isPending] = useActionState(registerCandidateAction, null);

  // مساعد لإضافة ماكينة سريعة بالنقر
  const addQuickMachine = (name: string) => {
    if (!machinesInput.includes(name)) {
      setMachinesInput(prev => prev ? `${prev}، ${name}` : name);
    }
  };

  // عرض شاشة النجاح عند إتمام الحفظ بنجاح
  if (state?.success) {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {isAr ? "تم تسجيل ملفك الفني بنجاح!" : "Technical Profile Registered Successfully!"}
          </h2>
          <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed max-w-md mx-auto">
            {isAr 
              ? "أصبح ملفك متاحاً الآن في قاعدة بيانات HIREX CNC المتخصصة لمطابقته مع طلبات التوظيف المعتمدة من المصانع الشريكة. ستتواصل المنصة معك لإبلاغك بأي فرصة تناسب خبرتك."
              : "Your technical profile is now listed in the HIREX CNC database. Verified factories will reach out directly when a matching role is available."}
          </p>
        </div>

        <div className="pt-6 flex justify-center gap-4">
          <Link 
            href="/" 
            className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
          >
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-2.5 bg-secondary/10 border border-border text-foreground text-xs font-semibold rounded-xl hover:bg-secondary/20 transition-all"
          >
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 text-start">
      
      {/* Dynamic Bilingual Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 text-primary rounded-xl font-mono font-bold text-xs tracking-wider">
          HIREX CNC
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          {isAr ? "تسجيل الكوادر الفنية ومشغلي ماكينات CNC" : "CNC Technician & Machinist Registration"}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/70 max-w-md mx-auto leading-relaxed">
          {isAr 
            ? "سجل بياناتك الفنية وخبراتك العملية لتصلك فرص التوظيف والمقابلات من المصانع الهندسية مباشرة وبدون وسطاء."
            : "Register your technical skills and machinery experience to receive direct interview requests from certified engineering facilities."}
        </p>
      </div>

      {/* 1. Global Errors */}
      {state?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
          ⚠️ {state.error}
        </div>
      )}

      {/* 2. تصنيف الكادر الوظيفي (فني تشغيل وضبط vs مهندس إنتاج وبرمجة) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-primary" />
          <span>{isAr ? "تصنيف الكادر الفني / الهندسي" : "Technical Role Classification"}</span>
          <span className="text-red-500">*</span>
        </label>
        
        <input type="hidden" name="role" value={role} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-secondary/10 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setRole("TECHNICIAN")}
            className={`flex items-start sm:items-center gap-2.5 p-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-start ${
              role === "TECHNICIAN"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            <div className={`p-1.5 rounded-md shrink-0 ${role === "TECHNICIAN" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/50"}`}>
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-foreground">
                {isAr ? "فني تشغيل وضبط ماكينات CNC" : "CNC Setup & Machining Technician"}
              </div>
              <div className="text-[10px] text-foreground/60 font-normal mt-0.5">
                {isAr ? "خراطة، تفريز، روتر، سلك وشرارة" : "Lathe, Milling, Router, Wire EDM"}
              </div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setRole("ENGINEER")}
            className={`flex items-start sm:items-center gap-2.5 p-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-start ${
              role === "ENGINEER"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            <div className={`p-1.5 rounded-md shrink-0 ${role === "ENGINEER" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/50"}`}>
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-foreground">
                {isAr ? "مهندس إنتاج وبرمجة CAM" : "CAM Programming & Production Engineer"}
              </div>
              <div className="text-[10px] text-foreground/60 font-normal mt-0.5">
                {isAr ? "Mastercam, PowerMill, SolidCAM, NX" : "Mastercam, PowerMill, SolidCAM, NX"}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. اختيار الصناعة أولاً (مرتبة أبجدياً) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="industry-select" className="text-xs font-bold text-foreground/85 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "الصناعة الرئيسية التي تعمل بها (مرتبة أبجدياً)" : "Primary Industry"}</span>
            <span className="text-red-500">*</span>
          </span>
          <span className="text-[10px] text-primary/80 font-normal">{isAr ? "تصنيف المنظومة" : "Taxonomy"}</span>
        </label>
        
        <select
          id="industry-select"
          name="industry"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground cursor-pointer shadow-xs"
        >
          <option value="">{isAr ? "-- اختر الصناعة الرئيسية من القائمة الأبجدية --" : "-- Select Primary Industry --"}</option>
          {CNC_INDUSTRIES.map((ind) => (
            <option key={ind.id} value={ind.ar}>
              {isAr ? `${ind.ar} — (${ind.en})` : ind.en}
            </option>
          ))}
        </select>
        {state?.errors?.industry && (
          <span className="text-xs text-red-500 font-semibold">{state.errors.industry[0]}</span>
        )}
      </div>

      {/* 4. المسمى الوظيفي: كتابة حرة */}
      <div className="flex flex-col gap-2">
        <label htmlFor="jobTitle" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span>{isAr ? "المسمى الوظيفي الدقيق" : "Precise Job Title"}</span>
          <span className="text-red-500">*</span>
        </label>
        <input 
          id="jobTitle"
          type="text" 
          name="jobTitle" 
          placeholder={isAr ? "مثال: فني مخرطة CNC سيمنز، أوبريتور فريزة 4 محاور، مبرمج Powermill..." : "e.g. CNC Lathe Setup, 4-Axis Mill Operator, Mastercam Programmer"} 
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
        />
        <p className="text-[11px] text-foreground/50">
          {isAr ? "اكتب مسماك الفعلي الذي تمارسه في المصنع أو الورشة." : "Enter the exact title you perform in the workshop."}
        </p>
        {state?.errors?.jobTitle && (
          <span className="text-xs text-red-500 font-semibold">{state.errors.jobTitle[0]}</span>
        )}
      </div>

      {/* 5. الماكينات: كتابة حرة (يمكن كتابة أكثر من ماكينة) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="machinesFreeText" className="text-xs font-bold text-foreground/85 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "الماكينات وأنظمة الكنترول التي تجيد العمل عليها" : "Machines & Controllers Handled"}</span>
            <span className="text-red-500">*</span>
          </span>
          <span className="text-[10px] text-foreground/50">{isAr ? "يمكن كتابة أكثر من ماكينة" : "Multiple allowed"}</span>
        </label>
        
        <input 
          id="machinesFreeText"
          type="text" 
          name="machinesFreeText" 
          value={machinesInput}
          onChange={(e) => setMachinesInput(e.target.value)}
          placeholder={isAr ? "مثال: مخرطة دوسان Fanuc، فريزة بريدجبورت 3 محاور، ماكينة سلك وشرارة Sodick..." : "e.g. Haas VF-2, DMG MORI lathe, Fanuc wire cut"} 
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
        />

        {/* أمثلة سريعة للنقر لتسهيل الإدخال من الهاتف */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-foreground/50 font-medium">{isAr ? "إضافة سريعة:" : "Quick Add:"}</span>
          {(isAr 
            ? ["مخرطة CNC", "فريزة CNC", "كنترول Fanuc", "كنترول Siemens", "سلك وشرارة EDM", "راوتر ليزر", "Mastercam", "SolidWorks"]
            : ["CNC Lathe", "CNC Milling", "Fanuc CNC", "Siemens CNC", "Wire EDM", "Laser/Plasma", "Mastercam", "SolidWorks"]
          ).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addQuickMachine(tag)}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-foreground/80 border border-border transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 text-primary" />
              <span>{tag}</span>
            </button>
          ))}
        </div>

        {state?.errors?.machinesFreeText && (
          <span className="text-xs text-red-500 font-semibold">{state.errors.machinesFreeText[0]}</span>
        )}
      </div>

      {/* 6. الاسم ورقم الهاتف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="candidate-name" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "الاسم الكامل" : "Full Name"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="candidate-name"
            type="text" 
            name="name" 
            placeholder={isAr ? "مثال: أحمد محمود إبراهيم" : "e.g. Ahmed Mahmoud"} 
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
          />
          {state?.errors?.name && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.name[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "رقم الموبايل (واتساب نشط)" : "Mobile Phone (WhatsApp)"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="phoneNumber"
            type="tel" 
            name="phoneNumber" 
            placeholder="01012345678" 
            required
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 font-mono shadow-xs"
          />
          {state?.errors?.phoneNumber && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.phoneNumber[0]}</span>
          )}
        </div>
      </div>

      {/* 7. المحافظة (أبجدياً) والمدينة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="gov-select" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "المحافظة السكنية (مرتبة أبجدياً)" : "Governorate"}</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            id="gov-select"
            name="governorate"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground cursor-pointer shadow-xs"
          >
            <option value="">{isAr ? "-- اختر المحافظة --" : "-- Select Governorate --"}</option>
            {EGYPTIAN_GOVERNORATES.map((govAr, idx) => {
              const govEn = EGYPTIAN_GOVERNORATES_EN[idx] || govAr;
              return (
                <option key={govAr} value={govAr}>
                  {isAr ? govAr : `${govEn} (${govAr})`}
                </option>
              );
            })}
          </select>
          {state?.errors?.governorate && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.governorate[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "المدينة أو المنطقة الصناعية" : "City or Industrial Zone"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="city"
            type="text" 
            name="city" 
            placeholder={isAr ? "مثال: العاشر من رمضان، قويسنا، العبور..." : "e.g. 10th of Ramadan, Obour"} 
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
          />
          {state?.errors?.city && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.city[0]}</span>
          )}
        </div>
      </div>

      {/* 8. سنوات الخبرة والراتب المتوقع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="experienceYears" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "سنوات الخبرة في تشغيل / برمجة CNC" : "Years of Experience"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="experienceYears"
            type="number" 
            name="experienceYears" 
            placeholder={isAr ? "مثال: 5" : "e.g. 5"} 
            min="0"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
          />
          {state?.errors?.experienceYears && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.experienceYears[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="expectedSalary" className="text-xs font-bold text-foreground/85 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>{isAr ? "الراتب الشهري المتوقع (ج.م)" : "Expected Monthly Salary (EGP)"}</span>
            </span>
            <span className="text-[10px] text-foreground/50">{isAr ? "اختياري" : "Optional"}</span>
          </label>
          <input 
            id="expectedSalary"
            type="number" 
            name="expectedSalary" 
            placeholder={isAr ? "مثال: 9000" : "e.g. 9000"} 
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 shadow-xs"
          />
        </div>
      </div>

      {/* 9. نظام الوردية وساعات العمل المفضلة */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "نظام الورديات وساعات العمل المفضلة" : "Preferred Shift & Working Hours"}</span>
            <span className="text-red-500">*</span>
          </span>
          <span className="text-[10px] text-primary/80 font-normal">{isAr ? "لمطابقة احتياجات المصنع" : "For Shift Matching"}</span>
        </label>

        <input type="hidden" name="preferredShift" value={selectedShift} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {WORK_SHIFTS.map((shift) => {
            const isSelected = selectedShift === shift.id;
            return (
              <button
                key={shift.id}
                type="button"
                onClick={() => setSelectedShift(shift.id)}
                className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40"
                    : "bg-background border-border hover:border-border/80 hover:bg-secondary/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {isAr ? shift.ar : shift.en}
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-foreground/30"}`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[10px] text-foreground/60 leading-normal">
                  {isAr ? shift.descAr : shift.descEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10. ملخص المهارات والسيرة الذاتية (CV اختياري تماماً - مناسب للفني) */}
      <div className="p-5 bg-secondary/10 border border-border rounded-2xl space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground/90 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            <span>{isAr ? "السيرة الذاتية (CV) وملاحظات إضافية" : "CV & Technical Summary"}</span>
          </label>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {isAr ? "اختياري تماماً" : "Fully Optional"}
          </span>
        </div>
        
        <p className="text-xs text-foreground/70 leading-relaxed">
          {isAr 
            ? "رفع السيرة الذاتية اختياري تماماً ومناسب لسرعة التقديم. البيانات الفنية التي أدخلتها بالأعلى (نوع الماكينة ونظام الكنترول وسنوات الخبرة والصناعة) كافية تماماً لمطابقتك مع فرص العمل بالمصانع والورش."
            : "No CV upload required. The industry, machine details, and experience provided above are completely sufficient for verified job matching."}
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="skillsSummary" className="text-xs font-semibold text-foreground/75">
            {isAr ? "مهارات فنية إضافية (أدوات قياس، مهارات تشغيل، إلخ):" : "Additional Skills (Inspection, tools, etc.):"}
          </label>
          <input 
            id="skillsSummary"
            type="text" 
            name="skillsSummary" 
            placeholder={isAr ? "مثال: قراءة الرسومات الهندسية، قياس بالميكروميتر، برمجة G-Code يدوياً..." : "e.g. blueprint reading, micrometer inspection, manual G-code..."}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-xs font-medium text-foreground placeholder:text-foreground/40"
          />
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <label htmlFor="cvUrl" className="text-xs font-semibold text-foreground/75">
            {isAr ? "رابط سيرة ذاتية (Google Drive / LinkedIn / PDF) إن وجد:" : "CV Link (Google Drive / LinkedIn / PDF) if available:"}
          </label>
          <input 
            id="cvUrl"
            type="url" 
            name="cvUrl" 
            placeholder="https://..."
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-xs font-mono text-foreground placeholder:text-foreground/40"
          />
        </div>
      </div>

      {/* 10. البريد الإلكتروني وكلمة المرور للحساب */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="candidate-email" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "البريد الإلكتروني (لتسجيل الدخول لاحقاً)" : "Email Address"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="candidate-email"
            type="email" 
            name="email" 
            placeholder="technician@example.com" 
            required
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 font-mono shadow-xs"
          />
          {state?.errors?.email && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.email[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="candidate-password" className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "كلمة المرور" : "Password"}</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            id="candidate-password"
            type="password" 
            name="password" 
            placeholder="••••••••" 
            required
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/40 font-mono shadow-xs"
          />
          {state?.errors?.password && (
            <span className="text-xs text-red-500 font-semibold">{state.errors.password[0]}</span>
          )}
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isAr ? "جاري تسجيل الملف الفني..." : "Registering..."}</span>
            </>
          ) : (
            <>
              <span>{isAr ? "تسجيل الملف الفني الآن" : "Register Technical Profile"}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </>
          )}
        </button>
      </div>

    </form>
  );
}
