// src/app/(marketing)/register/candidate/page.tsx
// صفحة تسجيل الكوادر (فني / مهندس) مع شريط تنقل كامل ودعم ثنائي اللغة.

import React from "react";
import { CandidateRegisterForm } from "@/components/shared/CandidateRegisterForm";
import { PublicNavbar } from "@/components/shared/PublicNavbar";

export const dynamic = "force-dynamic";

export default function CandidateRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <PublicNavbar />
      <div className="flex-1 py-8 sm:py-16 pb-24 sm:pb-16 bg-radial-[circle_at_bottom_left] from-primary/10 via-transparent to-transparent flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
          <CandidateRegisterForm />
        </div>
      </div>
    </div>
  );
}
