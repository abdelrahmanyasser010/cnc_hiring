"use client";

// src/components/shared/LanguageSwitcher.tsx
// مكون زر تبديل اللغة التفاعلي (عربي / إنجليزي). يمكن استخدامه في أي شريط تنقل عام أو داخلي.

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all text-xs font-bold text-primary border border-primary/20 shadow-sm hover:border-primary/40 cursor-pointer flex-shrink-0"
      title={lang === "ar" ? "Switch to English" : "التحويل للغة العربية"}
      aria-label="تغيير اللغة"
    >
      <Globe className="w-4 h-4" />
      <span>{lang === "ar" ? "🇬🇧 EN" : "🇪🇬 عربي"}</span>
    </button>
  );
}
