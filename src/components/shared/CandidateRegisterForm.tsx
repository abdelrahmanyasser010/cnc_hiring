"use client";

// src/components/shared/CandidateRegisterForm.tsx
// نموذج تسجيل الفنيين والمهندسين التفاعلي (Client Component).
// يحتوي على تبديل ديناميكي للحقول وخيارات الماكينات والبرامج المحملة من قاعدة البيانات.

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
  Cpu,
  Laptop
} from "lucide-react";
import Link from "next/link";

interface Lookups {
  machines: string[];
  softwares: string[];
}

export function CandidateRegisterForm({ lookups }: { lookups: Lookups }) {
  const [role, setRole] = useState<"TECHNICIAN" | "ENGINEER">("TECHNICIAN");

  // ربط إجراء السيرفر (Server Action) وإدارة حالات الخطأ والنجاح
  const [state, formAction, isPending] = useActionState(registerCandidateAction, null);

  // عرض شاشة النجاح عند إتمام الحفظ بنجاح
  if (state?.success) {
    return (
      <div className="text-center space-y-6 py-8 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">تم تسجيل بياناتك بنجاح!</h2>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-md mx-auto">
            مرحباً بك في مجتمع **hireCNC Egypt**. سيقوم النظام بمطابقة ملفك الشخصي مع وظائف المصانع تلقائياً، وستصلك مواعيد المقابلات فوراً على الواتساب.
          </p>
        </div>

        <div className="pt-6 flex justify-center gap-4">
          <Link 
            href="/" 
            className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 text-right">
      
      {/* 1. Global Errors */}
      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-xs font-semibold">
          ⚠️ {state.error}
        </div>
      )}

      {/* 2. Role Selector (فني vs مهندس) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-foreground/80">تصنيف الكادر الوظيفي <span className="text-red-500">*</span></label>
        
        {/* Hidden input to pass role value via FormData to Server Action */}
        <input type="hidden" name="role" value={role} />

        <div className="grid grid-cols-2 gap-3 p-1 bg-secondary/10 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setRole("TECHNICIAN")}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
              role === "TECHNICIAN"
                ? "bg-card text-primary shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>فني تشغيل وصيانة CNC</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole("ENGINEER")}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
              role === "ENGINEER"
                ? "bg-card text-primary shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>مهندس برمجيات CNC / تصميم</span>
          </button>
        </div>
      </div>

      {/* 3. Candidate Name */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-foreground/80">الاسم الكامل (ثنائي أو ثلاثي) <span className="text-red-500">*</span></label>
        <div className="relative">
          <input 
            type="text" 
            name="name" 
            placeholder="مثال: أحمد محمود علي" 
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
          />
          <User className="absolute left-3 top-3 w-4 h-4 text-foreground/30 pointer-events-none" />
        </div>
        {state?.errors?.name && (
          <span className="text-[10px] text-red-500 font-semibold">{state.errors.name[0]}</span>
        )}
      </div>

      {/* 4. Phone number */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-foreground/80">رقم الهاتف (الواتساب النشط) <span className="text-red-500">*</span></label>
        <div className="relative">
          <input 
            type="tel" 
            name="phoneNumber" 
            placeholder="مثال: 01012345678" 
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm text-left font-mono"
          />
          <Phone className="absolute left-3 top-3 w-4 h-4 text-foreground/30 pointer-events-none" />
        </div>
        <p className="text-[10px] text-foreground/40 leading-relaxed">يرجى التأكد من أن الهاتف مسجل بالواتساب لاستلام تفاصيل ومواقع المقابلات.</p>
        {state?.errors?.phoneNumber && (
          <span className="text-[10px] text-red-500 font-semibold">{state.errors.phoneNumber[0]}</span>
        )}
      </div>

      {/* 5. Governorate & City (Location columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-foreground/80">المحافظة السكنية <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="text" 
              name="governorate" 
              placeholder="مثال: الشرقية أو القاهرة" 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
            />
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-foreground/30 pointer-events-none" />
          </div>
          {state?.errors?.governorate && (
            <span className="text-[10px] text-red-500 font-semibold">{state.errors.governorate[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-foreground/80">المدينة / المنطقة السكنية <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="city" 
            placeholder="مثال: مدينة العاشر من رمضان" 
            required
            className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
          />
          {state?.errors?.city && (
            <span className="text-[10px] text-red-500 font-semibold">{state.errors.city[0]}</span>
          )}
        </div>

      </div>

      {/* 6. Experience & Expected Salary (Numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-foreground/80">سنوات الخبرة الإجمالية <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="number" 
              name="experienceYears" 
              placeholder="مثال: 3" 
              min="0"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
            />
            <Briefcase className="absolute left-3 top-3 w-4 h-4 text-foreground/30 pointer-events-none" />
          </div>
          {state?.errors?.experienceYears && (
            <span className="text-[10px] text-red-500 font-semibold">{state.errors.experienceYears[0]}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-foreground/80">الراتب الشهري المتوقع (بالجنيه) <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            name="expectedSalary" 
            placeholder="مثال: 8500" 
            min="0"
            required
            className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
          />
          {state?.errors?.expectedSalary && (
            <span className="text-[10px] text-red-500 font-semibold">{state.errors.expectedSalary[0]}</span>
          )}
        </div>

      </div>

      {/* 7. Dynamic Checkbox Groups based on role state */}
      {role === "TECHNICIAN" ? (
        <div className="flex flex-col gap-3 p-4 bg-secondary/5 border border-border rounded-2xl animate-in fade-in duration-300">
          <label className="text-xs font-bold text-foreground/80">أنواع الماكينات التي تجيد العمل عليها (اختر على الأقل واحدة) <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3 text-right">
            {lookups.machines.map((machine, i) => (
              <label key={i} className="flex items-center gap-2 justify-start cursor-pointer select-none text-xs font-medium">
                <input 
                  type="checkbox" 
                  name="machineTypes" 
                  value={machine}
                  className="w-4 h-4 text-primary border-border bg-background rounded focus:ring-primary"
                />
                <span>{machine}</span>
              </label>
            ))}
          </div>
          {state?.errors?.machineTypes && (
            <span className="text-[10px] text-red-500 font-semibold mt-1">{state.errors.machineTypes[0]}</span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4 bg-secondary/5 border border-border rounded-2xl animate-in fade-in duration-300">
          <label className="text-xs font-bold text-foreground/80">البرامج والتخصصات الهندسية التي تتقنها (اختر على الأقل واحدة) <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3 text-right">
            {lookups.softwares.map((software, i) => (
              <label key={i} className="flex items-center gap-2 justify-start cursor-pointer select-none text-xs font-medium">
                <input 
                  type="checkbox" 
                  name="specializations" 
                  value={software}
                  className="w-4 h-4 text-primary border-border bg-background rounded focus:ring-primary"
                />
                <span>{software}</span>
              </label>
            ))}
          </div>
          {state?.errors?.specializations && (
            <span className="text-[10px] text-red-500 font-semibold mt-1">{state.errors.specializations[0]}</span>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 sm:flex-initial px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري تقديم البيانات...</span>
            </>
          ) : (
            <>
              <span>تسجيل البيانات الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </form>
  );
}
