"use client";

// src/components/shared/PublicNavbar.tsx
// شريط التنقل العلوي العام المحدث لمنصة HIREX CNC:
// - تصميم هندسي عالمي مستوحى من hirecnc.com
// - زر "أعلن عن وظيفة +" رئيسي عالي الوضوح
// - مسارات واضحة ومحددة بدون روابط مكررة أو نصوص مشتتة
// - تمييز المسار النشط بناءً على pathname
// - دعم كامل للموبايل والديسكتوب واللغتين العربية والإنجليزية

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Cpu, LogIn, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function PublicNavbar() {
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();
  const isAr = lang === "ar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { label: isAr ? "وظائف CNC" : "Find Jobs", href: "/jobs" },
    { label: isAr ? "دليل المصانع" : "Companies", href: "/companies" },
    { label: isAr ? "باقات التوظيف" : "Pricing", href: "/#pricing" },
    { label: isAr ? "المدونة" : "Blog", href: "/blog" },
    { label: isAr ? "عن المنصة" : "About", href: "/#about" },
  ];

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md shadow-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-primary tracking-tight">
            <div className="bg-primary text-white p-1.5 rounded-xl flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 font-mono">
              <span className="font-black text-foreground">HIREX</span>
              <span className="text-primary font-bold">CNC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    active
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-foreground/75 hover:text-foreground hover:bg-secondary/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop CTAs & Language Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />

          {/* Secondary CTA: Sign In */}
          <Link 
            href="/login" 
            className="px-3.5 py-2 text-xs font-bold border border-border bg-card hover:bg-secondary/15 text-foreground rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-foreground/70" />
            <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
          </Link>

          {/* Primary High-Contrast CTA: Post a Job (matching hirecnc.com) */}
          <Link 
            href="/jobs/new" 
            className="px-4 py-2 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? "أعلن عن وظيفة +" : "Post a Job +"}</span>
          </Link>
        </div>

        {/* Mobile Actions: Language Switcher + Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleLang}
            className="p-1.5 rounded-lg bg-secondary/10 text-foreground font-bold text-xs flex items-center gap-1 border border-border"
            title={isAr ? "English" : "عربي"}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "EN" : "عربي"}</span>
          </button>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl hover:bg-secondary/10 transition-colors text-foreground"
            aria-label="القائمة الرئيسية"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-background/98 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 text-start">
          <nav className="flex flex-col space-y-1.5 font-semibold text-sm">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    active 
                      ? "text-primary bg-primary/10 font-bold" 
                      : "text-foreground/80 hover:bg-secondary/10"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <Link 
              href="/jobs/new" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? "أعلن عن وظيفة لمصنعك +" : "Post a Job +"}</span>
            </Link>

            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary/10 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isAr ? "تسجيل الدخول / حساب جديد" : "Sign In / Register"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
