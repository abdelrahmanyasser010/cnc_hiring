"use client";

// src/app/(dashboard)/layout.tsx
// الـ Layout الرئيسي للوحة التحكم. ينظم توزيع القائمة الجانبية والهيدر ومحتوى الصفحات.
// هذا المكون تفاعلي (Client Component) لأنه يدير حالة فتح وإغلاق القائمة الجانبية على الهواتف.

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* 1. القائمة الجانبية في حالة الديسكتوب (Desktop Sidebar) */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* 2. القائمة الجانبية في حالة الموبايل (Mobile Sidebar Drawer) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={toggleMobileSidebar}
          />
          
          {/* Sidebar content drawer */}
          <div className="relative flex flex-col w-64 h-full bg-slate-950 text-slate-100 shadow-xl z-50 animate-in slide-in-from-right duration-300">
            {/* Close Button inside Drawer */}
            <div className="absolute top-4 left-4">
              <button 
                onClick={toggleMobileSidebar}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Sidebar content wrapper */}
            <div className="h-full flex-1">
              <Sidebar onItemClick={toggleMobileSidebar} />
            </div>
          </div>
        </div>
      )}

      {/* 3. منطقة العمل الرئيسية (Main Workspace Container) */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        
        {/* الهيدر العلوي */}
        <Header onMenuToggle={toggleMobileSidebar} />

        {/* الصفحات الداخلية للوحة التحكم */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
      
    </div>
  );
}
