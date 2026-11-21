import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIREX CNC | المنصة الهندسية المتخصصة لتوظيف فنيي ومهندسي الـ CNC في مصر",
  description: "المنصة الأولى المتخصصة في ربط وتوظيف فنيي ومبرمجي ومهندسي ماكينات الـ CNC بالمصانع والمنشآت الهندسية في مصر. ابحث عن كفاءات معتمدة أو أعلن عن وظائف مصنعك الآن.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {children}
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}

