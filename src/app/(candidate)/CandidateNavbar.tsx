// src/app/(candidate)/CandidateNavbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, User, LogOut, Menu, X, Briefcase, Building2, BookOpen, LayoutDashboard } from "lucide-react";
import { candidateLogoutAction } from "@/app/actions/candidate";

interface CandidateNavbarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function CandidateNavbar({ userName, userEmail }: CandidateNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return "AY";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const navLinks = [
    { label: "لوحة التحكم", href: "/candidate/dashboard", icon: LayoutDashboard },
    { label: "ملفي الفني", href: "/candidate/profile", icon: User },
    { label: "شواغر التشغيل", href: "/#jobs", icon: Briefcase },
    { label: "دليل المصانع", href: "/companies", icon: Building2 },
    { label: "المدونة المعرفية", href: "/blog", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Nav */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-2 font-black text-lg sm:text-xl text-primary tracking-tight">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>HIREX <span className="text-foreground text-xs sm:text-sm font-bold">CNC</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-foreground/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 transition-colors ${
                    isActive ? "text-primary font-bold border-b-2 border-primary" : "hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Avatar & Dropdown */}
        <div className="hidden sm:flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-secondary/10 transition-colors focus:outline-none"
              aria-label="قائمة المستخدم"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-xs flex items-center justify-center shadow-sm ring-2 ring-primary/20">
                {getInitials(userName)}
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-foreground leading-tight">{userName || "كادر فني"}</div>
                <div className="text-[10px] text-foreground/50">{userEmail || "فني معتمد"}</div>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute end-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-border/60">
                  <p className="text-xs font-bold text-foreground truncate">{userName || "كادر فني"}</p>
                  <p className="text-[10px] text-foreground/50 truncate">{userEmail || ""}</p>
                </div>
                <Link
                  href="/candidate/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>لوحة التحكم</span>
                </Link>
                <Link
                  href="/candidate/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>ملفي الفني</span>
                </Link>
                <form action={candidateLogoutAction} className="pt-1 border-t border-border/60">
                  <button
                    type="submit"
                    className="w-full text-right flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 py-4 space-y-3 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-xs flex items-center justify-center">
              {getInitials(userName)}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{userName || "كادر فني"}</div>
              <div className="text-[10px] text-foreground/50">{userEmail || ""}</div>
            </div>
          </div>
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-secondary/10 text-foreground/80 hover:text-primary transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-border/60">
            <form action={candidateLogoutAction}>
              <button
                type="submit"
                className="w-full text-center py-2 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
