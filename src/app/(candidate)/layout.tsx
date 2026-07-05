import React from "react";
import Link from "next/link";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header بسيط للكادر */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-primary flex items-center gap-2">
            ⚙️ hireCNC
            <span className="text-sm font-normal text-foreground/50 hidden sm:inline-block">بوابة الكوادر</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
