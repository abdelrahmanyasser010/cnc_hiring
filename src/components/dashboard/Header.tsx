"use client";

// src/components/dashboard/Header.tsx
// الهيدر العلوي للوحة التحكم. يحتوي على زر التبديل اللغوي السريع، التنبيهات، والبروفايل.

import React from "react";
import { useSession } from "next-auth/react";
import { 
  Bell, 
  Menu, 
  Search, 
  HelpCircle,
  ChevronDown,
  Globe
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const { t, lang, toggleLang } = useLanguage();
  const user = session?.user as { name?: string | null; role?: string } | undefined;

  const initials = user?.name ? user.name.substring(0, 2) : (lang === "ar" ? "أد" : "AD");
  const displayName = user?.name || t.roles.superAdmin;
  const displayRole = user?.role === "SUPER_ADMIN" ? t.roles.superAdmin : t.roles.employer;

  return (
    <header className="h-16 border-b border-border bg-card text-card-foreground px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      
      {/* Right Section (Search & Mobile Toggle) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Toggle Sidebar Button for Mobile View */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-secondary/5 border border-border px-3 py-1.5 rounded-xl w-48 lg:w-64 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder={t.talent.searchPlaceholder.slice(0, 30) + "..."} 
            className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-start"
          />
        </div>
      </div>

      {/* Left Section (Language Toggle, Actions & Notifications) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Language Switcher Button (AR / EN) */}
        <button 
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-xs font-bold text-primary border border-primary/20 shadow-sm"
          title={lang === "ar" ? "Switch to English" : "التحويل للغة العربية"}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "🇬🇧 EN" : "🇪🇬 عربي"}</span>
        </button>

        {/* Help Icon */}
        <button className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground/60 hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <button className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground/60 relative">
          <Bell className="w-5 h-5" />
          {/* Notification dot indicator */}
          <span className="absolute top-1.5 start-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-card"></span>
        </button>

        <span className="w-[1px] h-6 bg-border hidden sm:block"></span>

        {/* User Profile Info Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group">
          {user && (
            <div className="text-start hidden md:block">
              <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{displayName}</h4>
              <span className="text-[10px] text-foreground/50">{displayRole}</span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
            {initials}
          </div>
          <ChevronDown className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors hidden sm:block" />
        </div>
      </div>

    </header>
  );
}
