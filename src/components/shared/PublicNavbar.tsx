"use client";

// src/components/shared/PublicNavbar.tsx
// شريط التنقل العلوي العام للصفحة الرئيسية (Landing Page). يدعم زر تغيير اللغة وقائمة الموبايل الذكية.

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Cpu, LogIn } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function PublicNavbar() {
  const { lang, toggleLang } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: lang === "ar" ? "شواغر التشغيل" : "CNC Jobs", href: "/#jobs" },
    { label: lang === "ar" ? "دليل المصانع" : "Our Companies", href: "/companies" },
    { label: lang === "ar" ? "لأصحاب المصانع" : "For Employers", href: "/#pricing" },
    { label: lang === "ar" ? "للكوادر والفنيين" : "For Applicants", href: "/#jobs" },
    { label: lang === "ar" ? "المدونة" : "Blog", href: "/blog" },
    { label: lang === "ar" ? "عن المنصة" : "About", href: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 font-black text-lg sm:text-xl text-primary tracking-tight">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>HIREX <span className="text-foreground text-xs sm:text-sm font-bold">CNC</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-foreground/80">
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
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === "ar" ? "تسجيل الدخول / حساب جديد" : "Sign In / Register"}</span>
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
              className="w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === "ar" ? "تسجيل الدخول / حساب جديد" : "Sign In / Register"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
