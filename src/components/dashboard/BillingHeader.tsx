"use client";

// src/components/dashboard/BillingHeader.tsx
// رأس قسم باقات الاشتراكات. يدعم تعدد اللغات (عربي / إنجليزي) ديناميكياً.

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function BillingHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-2 max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{t.billing.pageTitle}</h2>
      <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">{t.billing.pageSubtitle}</p>
    </div>
  );
}
