// src/app/(marketing)/register/candidate/page.tsx
// صفحة تسجيل الكوادر (فني / مهندس). هذه الصفحة عبارة عن Server Component
// يقوم بجلب البيانات المساعدة (Lookups) ديناميكياً من قاعدة البيانات أولاً، ثم يمررها للفورم التفاعلي.

import React from "react";
import { getRegistrationLookups } from "@/app/actions/register";
import { CandidateRegisterForm } from "@/components/shared/CandidateRegisterForm";

export const dynamic = "force-dynamic";

export default async function CandidateRegisterPage() {
  // جلب الماكينات والبرامج المعتمدة ديناميكياً (Lookups)
  const lookups = await getRegistrationLookups();

  return (
    <div className="min-h-screen py-16 bg-radial-[circle_at_bottom_left] from-primary/10 via-transparent to-transparent flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl p-6 md:p-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 text-primary rounded-2xl mb-2 font-bold text-xl">
            ⚙️ hireCNC Egypt
          </div>
          <h1 className="text-2xl md:text-3xl font-black">سجل كباحث عن عمل (كادر فني / هندسي)</h1>
          <p className="text-sm text-foreground/50">سجل بياناتك وخبراتك لتصل إعلاناتك لأكبر أصحاب ورش ومصانع التشغيل في مصر.</p>
        </div>

        {/* نموذج التسجيل التفاعلي */}
        <CandidateRegisterForm lookups={lookups} />

      </div>
    </div>
  );
}
