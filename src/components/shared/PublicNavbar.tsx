"use client";

// src/components/shared/PublicNavbar.tsx
// شريط التنقل العلوي العام للصفحة الرئيسية (Landing Page). يدعم زر تغيير اللغة وقائمة الموبايل الذكية.

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Cpu } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function PublicNavbar() {
  const { lang, toggleLang } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: lang === "ar" ? "عن المنصة" : "About", href: "/#about" },
    { label: lang === "ar" ? "إحصائياتنا" : "Metrics", href: "/#metrics" },
    { label: lang === "ar" ? "الباقات والأسعار" : "Pricing", href: "/#pricing" },
    { label: lang === "ar" ? "دليل الشركات" : "Factories", href: "/companies" },
    { label: lang === "ar" ? "المدونة المعرفية" : "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-primary">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>hireCNC <span className="text-foreground text-xs sm:text-sm font-semibold">{lang === "ar" ? "مصر" : "Egypt"}</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-foreground/80">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop CTAs & Language Switcher */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          <LanguageSwitcher />

          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-2 py-1"
          >
            {lang === "ar" ? "دخول أصحاب العمل" : "Employer Login"}
          </Link>
          <Link 
            href="/register" 
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            {lang === "ar" ? "أعلن عن وظيفة +" : "Post a Job +"}
          </Link>
        </div>

        {/* Mobile Actions: Language Switcher + Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleLang}
            className="p-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center gap-1 border border-primary/20"
            title={lang === "ar" ? "English" : "عربي"}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground"
            aria-label="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 py-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-sm text-foreground/90">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary/5 transition-colors"
            >
              {lang === "ar" ? "دخول أصحاب العمل" : "Employer Login"}
            </Link>
            <Link 
              href="/register" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              {lang === "ar" ? "أعلن عن وظيفة +" : "Post a Job +"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
