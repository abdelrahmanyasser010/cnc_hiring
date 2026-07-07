// src/app/(auth)/login/page.tsx
"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
      setSuccess("تم إنشاء حسابك بنجاح! يرجى إدخال بياناتك لتسجيل الدخول.");
    }
  }

  if (authError !== prevAuthError) {
    setPrevAuthError(authError);
    if (authError) {
      if (authError === "CredentialsSignin") {
        setError("رقم الهاتف أو كلمة المرور غير صحيحة.");
      } else {
        setError("حدث خطأ أثناء محاولة تسجيل الدخول، يرجى المحاولة مرة أخرى.");
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // التحقق من البريد الإلكتروني أو رقم الهاتف المصري
    const isEmail = phoneNumber.includes("@");
    if (!isEmail) {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678) أو بريد إلكتروني صحيح");
        setIsLoading(false);
        return;
      }
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن لا تقل عن 6 أحرف");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: phoneNumber,
        phoneNumber,
        password,
        redirect: false,
      });

      if (result?.error) {
        // إذا قام authorize برمي خطأ مخصص، يظهر هنا
        if (result.error.includes("غير صحيحة")) {
          setError("رقم الهاتف أو كلمة المرور غير صحيحة");
        } else {
          setError(result.error || "فشل تسجيل الدخول، يرجى التأكد من البيانات");
        }
        setIsLoading(false);
      } else {
        // نجاح تسجيل الدخول - التوجه للوحة التحكم
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالسيرفر");
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-radial-[circle_at_top_right] from-primary/10 via-background to-background px-6 py-12">
      {/* Background design elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-2">
            <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-lg">hire</span>
            <span>CNC Egypt</span>
          </Link>
          <p className="text-foreground/60 text-sm">بوابة الدخول الآمن لأصحاب المصانع والشركات</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-primary via-sky-500 to-primary"></div>
          
          <h2 className="text-xl font-bold text-foreground mb-6 text-right">تسجيل الدخول</h2>

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
                البريد الإلكتروني الأساسي <span className="text-xs text-foreground/40">(أو رقم الهاتف)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="phone"
                  type="text"
                  placeholder="name@company.com (أو 010xxxxxxxx)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-left font-mono"
                  dir="ltr"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground/80">
                  كلمة المرور
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-left"
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
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>دخول لوحة التحكم</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-foreground/50 font-medium">أو سجل الدخول بضغطة واحدة</span>
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
            <span>الدخول السريع بحساب Google (Gmail)</span>
          </button>

          {/* Divider 2 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-foreground/40 font-medium">ليس لديك حساب؟</span>
            </div>
          </div>

          {/* Link to signup */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>سجل منشأتك الصناعية الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors">
            الرجوع إلى الصفحة الرئيسية للمنصة
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-radial-[circle_at_top_right] from-primary/10 via-background to-background text-foreground/50 text-sm">
        جاري التحميل...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
