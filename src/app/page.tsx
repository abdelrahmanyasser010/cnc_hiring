// src/app/page.tsx
// هذا هو الملف الرئيسي للصفحة الرئيسية للموقع (Landing Page).
// تم ربط الصفحة بمكونات العرض الديناميكية (PublicNavbar, LandingHero, LandingContent) لدعم التبديل اللغوي السريع وقائمة الموبايل الذكية.

import React from "react";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { LandingHero } from "@/components/shared/LandingHero";
import { LandingContent } from "@/components/shared/LandingContent";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
      <PublicNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
}
