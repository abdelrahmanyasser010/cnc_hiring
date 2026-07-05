"use client";

// src/app/(dashboard)/jobs/new/page.tsx
// واجهة إضافة وظيفة جديدة. تستخدم ميزة Server Actions مع Hook التفاعل useActionState من React 19.
// تم تصميمها بنسق فريد وتفاعلي كامل يعرض الأخطاء المدخلة فورياً.

import React, { useActionState } from "react";
import Link from "next/link";
import { createJobAction } from "../actions";
import { ArrowLeft, Cpu, Save, Loader2 } from "lucide-react";

export default function NewJobPage() {
  // استخدام useActionState لربط الـ Server Action وإدارة حالة التقديم والأخطاء
  const [state, formAction, isPending] = useActionState(createJobAction, null);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">نشر إعلان وظيفة جديد</h1>
          <p className="text-xs text-foreground/50">أدخل تفاصيل ماكينات الـ CNC والخبرة والرواتب المطلوبة لجذب أفضل الفنيين.</p>
        </div>
        
        <Link 
          href="/jobs" 
          className="flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-primary transition-colors border border-border px-3 py-2 rounded-xl bg-card hover:bg-secondary/5"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>رجوع للقائمة</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
        <form action={formAction} className="space-y-6">
          
          {/* Global DB Error Alert */}
          {state?.error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-xs font-semibold">
              ⚠️ {state.error}
            </div>
          )}

          {/* 1. Job Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground/80">المسمى الوظيفي <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              placeholder="مثال: فني تشغيل مخرطة CNC مبرمج" 
              required
              className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
            />
            {state?.errors?.title && (
              <span className="text-[10px] text-red-500 font-semibold">{state.errors.title[0]}</span>
            )}
          </div>

          {/* 2. Control Required & Location (Two columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Control required */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">نوع الكنترول / الماكينة <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  name="controlRequired" 
                  defaultValue="FANUC"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm appearance-none pr-8 text-right"
                >
                  <option value="FANUC">FANUC (فانوك)</option>
                  <option value="SIEMENS">SIEMENS (سيمنز)</option>
                  <option value="HEIDENHAIN">HEIDENHAIN (هايدن هاين)</option>
                  <option value="HAAS">HAAS (هاس)</option>
                  <option value="MAZATROL">MAZATROL (مازاترول)</option>
                  <option value="OTHER">أخرى / ميكانيكي تقليدي</option>
                </select>
                <Cpu className="absolute left-3 top-3 w-4 h-4 text-foreground/30 pointer-events-none" />
              </div>
              {state?.errors?.controlRequired && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.controlRequired[0]}</span>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">موقع المصنع / الورشة <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="location" 
                placeholder="مثال: العاشر من رمضان - المنطقة الصناعية الثالثة" 
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
              />
              {state?.errors?.location && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.location[0]}</span>
              )}
            </div>

          </div>

          {/* 3. Experience Required (Min & Max) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">الحد الأدنى لسنوات الخبرة <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="experienceMin" 
                placeholder="مثال: 2" 
                min="0"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
              />
              {state?.errors?.experienceMin && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.experienceMin[0]}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">الحد الأقصى لسنوات الخبرة <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="experienceMax" 
                placeholder="مثال: 5" 
                min="0"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
              />
              {state?.errors?.experienceMax && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.experienceMax[0]}</span>
              )}
            </div>

          </div>

          {/* 4. Salary range (Min & Max) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">الحد الأدنى للراتب الشهري (بالجنيه) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="salaryMin" 
                placeholder="مثال: 7000" 
                min="0"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
              />
              {state?.errors?.salaryMin && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.salaryMin[0]}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-foreground/80">الحد الأقصى للراتب الشهري (بالجنيه) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="salaryMax" 
                placeholder="مثال: 10000" 
                min="0"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm"
              />
              {state?.errors?.salaryMax && (
                <span className="text-[10px] text-red-500 font-semibold">{state.errors.salaryMax[0]}</span>
              )}
            </div>

          </div>

          {/* 5. Hide salary check & Description */}
          <div className="flex items-center gap-2 justify-start select-none">
            <input 
              type="checkbox" 
              name="hideSalary" 
              id="hideSalary"
              value="true"
              className="w-4 h-4 text-primary border-border bg-background focus:ring-primary rounded"
            />
            <label htmlFor="hideSalary" className="text-xs font-semibold text-foreground/75 cursor-pointer">
              إخفاء الراتب عن الفنيين (يُكتب &quot;يحدد في المقابلة&quot;)
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground/80">الوصف الوظيفي والشروط المطلوبة <span className="text-red-500">*</span></label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="اكتب متطلبات العمل بالتفصيل (ساعات العمل، توفر سكن أو مواصلات، الورديات، الماكينات المحددة)..."
              required
              className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/50 text-sm leading-relaxed"
            />
            {state?.errors?.description && (
              <span className="text-[10px] text-red-500 font-semibold">{state.errors.description[0]}</span>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button 
              type="submit" 
              disabled={isPending}
              className="px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري النشر...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>نشر إعلان الوظيفة</span>
                </>
              )}
            </button>
            
            <Link 
              href="/jobs" 
              className="px-6 py-3 border border-border hover:bg-secondary/5 font-semibold text-sm rounded-xl transition-all"
            >
              إلغاء
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}
