"use client";

// src/lib/i18n/LanguageContext.tsx
// React Context for bilingual auto-detection and RTL/LTR dynamic layout switching

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { dictionaries, type Dictionary, type Locale } from "@/lib/dictionary";

interface LanguageContextType {
  t: Dictionary;
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggleLang: () => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hirecnc_locale") as Locale | null;
      if (saved === "ar" || saved === "en") return saved;
      const browserLang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || "";
      return browserLang.toLowerCase().startsWith("en") ? "en" : "ar";
    }
    return "ar";
  });

  // Apply language and direction to DOM
  const applyLocaleToDom = useCallback((newLang: Locale) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("hirecnc_locale", newLang);
      document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  useEffect(() => {
    applyLocaleToDom(lang);
  }, [applyLocaleToDom, lang]);

  const setLang = useCallback((newLang: Locale) => {
    setLangState(newLang);
    applyLocaleToDom(newLang);
  }, [applyLocaleToDom]);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const nextLang = prev === "ar" ? "en" : "ar";
      applyLocaleToDom(nextLang);
      return nextLang;
    });
  }, [applyLocaleToDom]);

  const t = dictionaries[lang];
  const isRtl = lang === "ar";

  // Prevent flash of incorrect direction before hydration if possible
  return (
    <LanguageContext.Provider value={{ t, lang, setLang, toggleLang, isRtl }}>
      <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "font-sans text-right" : "font-sans text-left"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      t: dictionaries.ar,
      lang: "ar",
      setLang: () => {},
      toggleLang: () => {},
      isRtl: true,
    };
  }
  return context;
}
