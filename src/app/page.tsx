// src/app/page.tsx
// هذا هو الملف الرئيسي للصفحة الرئيسية للموقع (Landing Page).
// تم ربط الصفحة بمكونات العرض الديناميكية (PublicNavbar, LandingHero, SocialProofSection, FeaturedJobsSection, LandingContent).

import React from "react";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { LandingHero } from "@/components/shared/LandingHero";
import { FeaturedJobsSection } from "@/components/shared/FeaturedJobsSection";
import { LandingContent } from "@/components/shared/LandingContent";
import SocialProofSection from "@/components/shared/SocialProofSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white">
      <PublicNavbar />
      <LandingHero />
      <SocialProofSection />
      <FeaturedJobsSection />
      <LandingContent />
    </div>
  );
}
