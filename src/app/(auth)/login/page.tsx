// src/app/(auth)/login/page.tsx
// صفحة تسجيل الدخول الموحدة لمنصة HIREX CNC بتصميم Split Screen صناعي معبر وخالٍ من التوهج.

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Cpu, Mail, Lock, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function LoginContent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        phoneNumber,
        password,
        redirect: false,
      });

      if (!res) {
        setError(isAr ? "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً" : "Unexpected error, please try again later.");
        setIsLoading(false);
        return;
      }

      if (res.error) {
        setError(isAr ? "بيانات الدخول غير صحيحة، يرجى التحقق من المدخلات" : "Invalid login credentials. Please check your input.");
        setIsLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "CANDIDATE") {
        router.push("/candidate/dashboard");
      } else if (role === "SUPER_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError(isAr ? "حدث خطأ غير متوقع أثناء الاتصال بالسيرفر" : "Network error connecting to authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-start">
      
      {/* 1. Real Industrial CNC Machining Photo (Right side on Arabic RTL) */}
      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden bg-slate-950 order-1">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
        
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Top Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-black text-2xl text-white">
            <div className="bg-primary text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <span>HIREX <span className="text-sky-400 font-bold">CNC</span></span>
          </Link>

          {/* Minimalist Bottom Info */}
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 text-sky-400 text-xs font-bold px-3 py-1 rounded-full">
              <span>{isAr ? "بوابة الدخول الموحدة للتشغيل والإنتاج" : "Unified Machining Access Portal"}</span>
            </div>
            <p className="text-xs text-slate-300">
              {isAr 
                ? "دخول موحد لأصحاب المصانع ومديري التشغيل والكوادر الفنية المعتمدة."
                : "Single sign-on for plant managers, machine shop owners, and certified CNC machinists."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Login Form (Left side on Arabic RTL - Clean & Crisp) */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 order-2">
        <div className="w-full max-w-md space-y-7">
          
          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl text-primary lg:hidden mb-4">
              <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <span>HIREX <span className="text-foreground text-sm font-bold">CNC</span></span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60">
              {isAr ? "أدخل بيانات حسابك المسجل للوصول إلى لوحة التحكم" : "Enter your registered credentials to access your dashboard"}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>{isAr ? "البريد الإلكتروني أو رقم الهاتف" : "Email Address or Phone Number"}</span>
              </label>
              <input
                id="phone"
                type="text"
                placeholder={isAr ? "أدخل البريد أو رقم الهاتف المسجل" : "name@company.com or 010xxxxxxxx"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/5 border border-border rounded-xl text-foreground text-sm font-medium placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-colors"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>{isAr ? "كلمة المرور" : "Password"}</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/5 border border-border rounded-xl text-foreground text-sm font-medium placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background transition-colors font-mono"
                dir="ltr"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? "جاري التحقق من الحساب..." : "Signing in..."}</span>
                </>
              ) : (
                <span>{isAr ? "دخول الحساب" : "Enter Dashboard"}</span>
              )}
            </button>
          </form>

          {/* Quick Sign In Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-foreground/50 font-medium">
                {isAr ? "أو المتابعة السريعة" : "Or quick sign in"}
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary/10 transition-colors font-semibold flex items-center justify-center gap-3 text-xs sm:text-sm text-foreground"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.1 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.2L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
            </svg>
            <span>{isAr ? "الدخول بحساب Google" : "Continue with Google"}</span>
          </button>

          {/* Clean Candidate Registration Link */}
          <div className="pt-4 border-t border-border/60 text-center space-y-1.5">
            <p className="text-xs text-foreground/60">
              {isAr ? "فني أو مهندس تشغيل وتبحث عن عمل؟" : "Machinist or CAM programmer looking for work?"}
            </p>
            <Link 
              href="/register/candidate" 
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{isAr ? "سجل ملفك الفني والماكينات الآن مجاناً" : "Register your technical profile for free"}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          {/* Back to Home Link */}
          <div className="text-center pt-1">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-primary transition-colors"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? "الرجوع إلى الصفحة الرئيسية" : "Back to Home"}</span>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground/50 text-sm">
        جاري التحميل...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
