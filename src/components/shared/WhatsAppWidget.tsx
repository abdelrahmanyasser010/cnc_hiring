"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function WhatsAppWidget() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [isOpen, setIsOpen] = useState(true);

  // Preset message for quick WhatsApp consultation
  const phone = "201012345678"; // Representative contact number
  const message = isAr
    ? "مرحباً، أود الاستفسار عن خدمات التوظيف وكفاءات الـ CNC لمنشأتي الصناعية عبر منصة HIREX CNC."
    : "Hello, I would like to inquire about CNC technical recruitment and engineering staffing via HIREX CNC.";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div 
      className="fixed bottom-6 start-6 z-50 flex items-end gap-3 print:hidden select-none pointer-events-auto"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Tooltip / Speech Bubble */}
      {isOpen && (
        <div className="hidden sm:flex items-center gap-2.5 bg-card border border-emerald-500/30 text-foreground px-4 py-2.5 rounded-2xl shadow-xl shadow-black/10 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div className="flex flex-col text-start">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {isAr ? "المستشار الصناعي المباشر" : "Machining Staffing Advisor"}
            </span>
            <span className="text-xs font-semibold text-foreground/80 leading-snug">
              {isAr ? "تحتاج مساعدة فورية أو استقطاب كادر لمصنعك؟" : "Need instant staffing support for your shop?"}
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-foreground/40 hover:text-foreground p-1 transition-colors rounded-lg"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
      >
        {/* Pulse Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:hidden" />
        
        {/* WhatsApp Icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="30" 
          height="30" 
          fill="currentColor" 
          className="relative drop-shadow-sm"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.523 3.662 1.432 5.178L2.05 22l4.981-1.308A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.634 0-3.15-.49-4.422-1.332l-.317-.209-2.96.777.79-2.885-.228-.363A8.207 8.207 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25z" />
        </svg>
      </a>
    </div>
  );
}
