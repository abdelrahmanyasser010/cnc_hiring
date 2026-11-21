"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Lock, MessageSquare, Cpu } from "lucide-react";

export function PublicFooter() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <footer className="mt-auto bg-secondary text-secondary-foreground border-t border-border/10 py-12 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-black text-xl text-primary mb-4">
            <div className="bg-primary text-white p-1.5 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <span>HIREX <span className="text-secondary-foreground text-sm font-bold">CNC</span></span>
          </div>
          <p className="text-xs sm:text-sm text-secondary-foreground/70 leading-relaxed max-w-sm">
            {isAr 
              ? "منظومة التوظيف الهندسي الأولى المخصصة لربط مصانع التشغيل الدقيق بفنيي ومهندسي ومبرمجي ماكينات الـ CNC المعتمدين في مصر."
              : "Egypt's premier engineering staffing platform connecting precision machining shops with certified CNC operators and CAM programmers."
            }
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-sm text-secondary-foreground">{isAr ? "روابط المنظومة" : "Quick Links"}</h4>
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-secondary-foreground/70">
            <Link href="/jobs" className="hover:text-primary transition-colors font-medium">{isAr ? "وظائف CNC المتاحة" : "CNC Jobs"}</Link>
            <Link href="/companies" className="hover:text-primary transition-colors">{isAr ? "دليل المصانع والشركات" : "Factory Directory"}</Link>
            <Link href="/#pricing" className="hover:text-primary transition-colors">{isAr ? "باقات التوظيف للشركات" : "Pricing & Plans"}</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">{isAr ? "المدونة الهندسية" : "Engineering Blog"}</Link>
            <Link href="/login" className="hover:text-primary transition-colors">{isAr ? "بوابة دخول المصانع" : "Employer Login"}</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm text-secondary-foreground">{isAr ? "المعايير والسياسات" : "Integrations & Policies"}</h4>
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-secondary-foreground/70">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? "دفع آمن معتمد عبر فوري وباي موب" : "Secure payments via Fawry & Paymob"}</span>
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? "إشعارات مقابلات مؤتمتة عبر واتساب" : "Automated WhatsApp interview alerts"}</span>
            </span>
            <Link href="/privacy" className="hover:text-primary transition-colors mt-1 block font-medium underline-offset-4 hover:underline">
              {isAr ? "سياسة الخصوصية والسرية الصناعية" : "Privacy Policy & Industrial NDA"}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-border/10 text-center text-xs text-secondary-foreground/50">
        {isAr 
          ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} HIREX CNC مصر. منظومة التوظيف والتشغيل الصناعي المعتمدة.`
          : `All rights reserved © ${new Date().getFullYear()} HIREX CNC Egypt. Certified Precision Machining & Staffing Platform.`
        }
      </div>
    </footer>
  );
}
