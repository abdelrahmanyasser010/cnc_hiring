"use client";

// src/components/dashboard/Header.tsx
// الهيدر العلوي للوحة التحكم. يحتوي على زر القائمة المنسدلة على الموبايل، التنبيهات، والبروفايل.

import React from "react";
import { useSession } from "next-auth/react";
import { 
  Bell, 
  Menu, 
  Search, 
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { AR_DICTIONARY } from "@/lib/dictionary/ar";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user as { name?: string | null; role?: string } | undefined;

  const initials = user?.name ? user.name.substring(0, 2) : "أد";
  const displayName = user?.name || AR_DICTIONARY.roles.superAdmin;
  const displayRole = user?.role === "SUPER_ADMIN" ? AR_DICTIONARY.roles.superAdmin : AR_DICTIONARY.roles.employer;

  return (
    <header className="h-16 border-b border-border bg-card text-card-foreground px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      
      {/* Right Section (Search & Mobile Toggle) */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button for Mobile View */}
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-secondary/5 border border-border px-3 py-1.5 rounded-xl w-64 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="ابحث عن مخرطة، فريزة، فني..." 
            className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-right"
          />
        </div>
      </div>

      {/* Left Section (Actions & Notifications) */}
      <div className="flex items-center gap-4">
        {/* Help Icon */}
        <button className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground/60 hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <button className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground/60 relative">
          <Bell className="w-5 h-5" />
          {/* Notification dot indicator */}
          <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-card"></span>
        </button>

        <span className="w-[1px] h-6 bg-border"></span>

        {/* User Profile Info Dropdown */}
        <div className="flex items-center gap-3 cursor-pointer select-none group">
          {user && (
            <div className="text-left hidden md:block">
              <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{displayName}</h4>
              <span className="text-[10px] text-foreground/50">{displayRole}</span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            {initials}
          </div>
          <ChevronDown className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
        </div>
      </div>

    </header>
  );
}
