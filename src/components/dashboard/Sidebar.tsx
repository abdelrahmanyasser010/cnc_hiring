"use client";

// src/components/dashboard/Sidebar.tsx
// القائمة الجانبية للوحة التحكم. تدعم تعدد اللغات (عربي / إنجليزي) والـ RTL/LTR بشكل ديناميكي.

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CreditCard, 
  LogOut,
  Cpu,
  CheckCircle,
  FileText,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, lang } = useLanguage();
  const user = session?.user as { name?: string | null; role?: string } | undefined;

  // بناء القائمة ديناميكياً بناءً على القاموس الموحد ومصطلحات الصنعة الحقيقية
  const menuItems = [
    {
      title: user?.role === "SUPER_ADMIN" ? (lang === "ar" ? "إحصائيات المنصة" : "Platform Analytics") : t.nav.dashboard,
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.nav.myJobs,
      path: "/jobs",
      icon: Briefcase,
    },
    {
      title: t.nav.talentDatabase,
      path: "/talent",
      icon: Users,
    },
    ...(user?.role === "SUPER_ADMIN"
      ? [
          {
            title: t.nav.adminVerify,
            path: "/admin/verify",
            icon: CheckCircle,
          },
          {
            title: t.nav.adminPlans,
            path: "/admin/plans",
            icon: ShieldCheck,
          },
          {
            title: lang === "ar" ? "إدارة المدونة" : "Blog Management",
            path: "/admin/blog",
            icon: FileText,
          },
        ]
      : [
          {
            title: t.nav.billingAndPlans,
            path: "/billing",
            icon: CreditCard,
          },
        ])
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col h-full border-e border-slate-800/50">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50">
        <div className="bg-primary text-white p-1.5 rounded-lg">
          <Cpu className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg tracking-wider text-slate-50">
          hireCNC <span className="text-primary text-sm font-semibold">{lang === "ar" ? "مصر" : "Egypt"}</span>
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / Logout */}
      <div className="p-4 border-t border-slate-800/50 font-sans">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-900/50 border border-slate-800/20">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
              {user.name ? user.name.substring(0, 2) : (lang === "ar" ? "أد" : "AD")}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">
                {user.role === "SUPER_ADMIN" ? t.roles.superAdmin : t.roles.employer}
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-start cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>{t.nav.logout}</span>
        </button>
      </div>

    </aside>
  );
}
