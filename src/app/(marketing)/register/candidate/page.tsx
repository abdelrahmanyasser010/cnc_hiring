// src/app/(marketing)/register/candidate/page.tsx
// صفحة تسجيل الكوادر (فني / مهندس). هذه الصفحة عبارة عن Server Component
// يقوم بجلب البيانات المساعدة (Lookups) ديناميكياً من قاعدة البيانات أولاً، ثم يمررها للفورم التفاعلي.

import React from "react";
import { CandidateRegisterForm } from "@/components/shared/CandidateRegisterForm";

export const dynamic = "force-dynamic";

export default function CandidateRegisterPage() {
  return (
    <div className="min-h-screen py-16 bg-radial-[circle_at_bottom_left] from-primary/10 via-transparent to-transparent flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl p-6 md:p-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 text-primary rounded-2xl mb-2 font-bold text-sm tracking-wide">
            HIREX CNC
          </div>
          <h1 className="text-2xl md:text-3xl font-black">تسجيل الكوادر الفنية ومشغلي ماكينات CNC</h1>
          <p className="text-xs md:text-sm text-foreground/70 max-w-md mx-auto">
            سجل بياناتك الفنية وخبراتك العملية لتصلك فرص التوظيف والمقابلات من المصانع الهندسية مباشرة وبدون وسطاء.
          </p>
        </div>

        {/* نموذج التسجيل التفاعلي */}
        <CandidateRegisterForm />

      </div>
    </div>
  );
}
