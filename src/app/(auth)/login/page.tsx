// src/app/(auth)/login/page.tsx
"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, CheckCircle, ArrowRight, Loader2, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registered = searchParams.get("registered");
  const authError = searchParams.get("error");

  const [prevRegistered, setPrevRegistered] = useState<string | null>(null);
  const [prevAuthError, setPrevAuthError] = useState<string | null>(null);

  if (registered !== prevRegistered) {
    setPrevRegistered(registered);
    if (registered === "true") {
      setSuccess(isAr 
        ? "تم إنشاء حسابك بنجاح! يرجى إدخال بياناتك لتسجيل الدخول." 
        : "Account created successfully! Please enter your credentials to log in.");
    }
  }

  if (authError !== prevAuthError) {
    setPrevAuthError(authError);
    if (authError) {
      if (authError === "CredentialsSignin") {
        setError(isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "Invalid email/phone or password.");
      } else {
        setError(isAr ? "حدث خطأ أثناء محاولة تسجيل الدخول، يرجى المحاولة مرة أخرى." : "An error occurred during login. Please try again.");
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const isEmail = phoneNumber.includes("@");
    if (!isEmail) {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError(isAr 
          ? "يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678) أو بريد إلكتروني صالح" 
          : "Please enter a valid Egyptian phone number (e.g. 01012345678) or valid email address");
        setIsLoading(false);
        return;
      }
    }

    if (!password || password.length < 6) {
      setError(isAr ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phoneNumber,
        password: password,
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
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center bg-radial-[circle_at_top_right] from-primary/10 via-background to-background px-6 py-12 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Social Proof Sidebar (Visible on LG) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between h-full py-6 pr-4 space-y-8 text-start">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-black text-3xl text-primary">
              <span className="bg-primary text-white px-2.5 py-0.5 rounded-xl text-xl shadow-md shadow-primary/20">hire</span>
              <span>CNC Egypt</span>
            </Link>
            <h1 className="text-2xl font-black text-foreground leading-tight">
              {isAr ? "بوابة الدخول الموحدة للمنظومة الصناعية والتشغيل في مصر" : "Unified Access Portal for CNC & Precision Machining in Egypt"}
            </h1>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {isAr 
                ? "منصة متخصصة تربط بين المنشآت الهندسية والمصانع الإنتاجية ونخبة الكوادر الفنية المعتمدة في تشغيل وبرمجة ماكينات الـ CNC."
                : "A dedicated institutional platform connecting manufacturing plants and engineering facilities with verified CNC machinists and CAM programmers."}
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="bg-card/80 border border-border/80 rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed italic">
              {isAr 
                ? "“المنصة قدمت حلاً هندسياً دقيقاً في فرز وتوفير مبرمجي ومشغلي ماكينات الـ CNC. الفحص الفني المسبق للكوادر يضمن جاهزية فورية لخطوط الإنتاج.”"
                : "“The platform delivered an exceptionally accurate solution for vetting and providing CNC machinists and CAM engineers. Pre-verified credentials ensure immediate production readiness.”"}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-border/50">
              <div className="w-10 h-10 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                T
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {isAr ? "م. طارق عبد الرؤوف" : "Eng. Tarek Abdel-Raouf"}
                </h4>
                <p className="text-[11px] text-primary font-medium">
                  {isAr ? "مدير عام الإنتاج والتشغيل — مصنع الأمل للصناعات الهندسية" : "General Production Director — Al Amal Engineering Industries"}
                </p>
              </div>
            </div>
          </div>

          {/* Security & Trust Badges */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "تحقق فني وعملي من خبرات الكوادر المسجلة" : "Practical skill verification for registered talent"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isAr ? "منشآت ومصانع موثقة بالسجل التجاري" : "Commercially verified industrial facilities"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>{isAr ? "حماية كاملة للبيانات ومعايير دفع إلكتروني آمنة" : "Secure data protection & encrypted payment gateways"}</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto text-start">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-2">
              <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-lg">hire</span>
              <span>CNC Egypt</span>
            </Link>
            <p className="text-foreground/60 text-sm text-center">
              {isAr ? "بوابة الدخول للمنشآت والمصانع" : "Portal Access for Industrial Facilities"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-primary via-sky-500 to-primary"></div>
            
            <h2 className="text-xl font-bold text-foreground mb-6">
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl flex items-start gap-3 text-sm animate-fadeIn">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email/Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "البريد الإلكتروني أو رقم الهاتف" : "Email Address or Phone Number"}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    type="text"
                    placeholder={isAr ? "name@company.com (أو 010xxxxxxxx)" : "name@company.com (or 010xxxxxxxx)"}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full ${isAr ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono`}
                    dir="ltr"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${isAr ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                    dir="ltr"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isAr ? "جاري تسجيل الدخول..." : "Signing in..."}</span>
                  </>
                ) : (
                  <span>{isAr ? "دخول لوحة التحكم" : "Enter Dashboard"}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-foreground/50 font-medium">
                  {isAr ? "أو تسجيل الدخول السريع" : "Or Quick Sign In"}
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl border border-border bg-card hover:bg-secondary/10 transition-all font-semibold flex items-center justify-center gap-3 shadow-sm cursor-pointer disabled:opacity-50 text-sm mb-4"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.1 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.8z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.2L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
              </svg>
              <span>{isAr ? "الدخول بحساب Google (Gmail)" : "Continue with Google (Gmail)"}</span>
            </button>

            {/* Divider 2 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-foreground/40 font-medium">
                  {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}
                </span>
              </div>
            </div>

            {/* Link to signup */}
            <div className="text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span>{isAr ? "سجل منشأتك الصناعية الآن" : "Register Your Industrial Plant Now"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors">
              {isAr ? "الرجوع إلى الصفحة الرئيسية للمنصة" : "Back to Platform Home"}
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
      <div className="min-h-screen flex items-center justify-center bg-radial-[circle_at_top_right] from-primary/10 via-background to-background text-foreground/50 text-sm">
        Loading...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
