"use client";

// src/components/dashboard/TalentHeader.tsx
// رأس صفحة الكوادر الفنية. مكون عميل لدعم تغيير النصوص حسب اللغة المختارة (عربي / إنجليزي).

import React from "react";
import { Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TalentHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1 text-start">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground/90 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span>{t.talent.pageTitle}</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed max-w-3xl">
          {t.talent.pageSubtitle}
        </p>
      </div>
    </div>
  );
}
