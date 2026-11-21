import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CandidateNavbar } from "./CandidateNavbar";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <CandidateNavbar 
        userName={session?.user?.name} 
        userEmail={session?.user?.email} 
      />
      <main>{children}</main>
    </div>
  );
}
