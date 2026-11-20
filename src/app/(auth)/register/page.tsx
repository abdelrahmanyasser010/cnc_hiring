// src/app/(auth)/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerEmployerAction } from "@/app/actions/auth";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Lock, 
  User, 
  Mail,
  AlertCircle, 
  ArrowRight, 
  Loader2,
  ChevronDown,
  UploadCloud
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const EGYPTIAN_INDUSTRIAL_ZONES = [
  { ar: "6 أكتوبر", en: "6th of October" },
  { ar: "أبو رواش", en: "Abu Rawash" },
  { ar: "العبور", en: "Obour City" },
  { ar: "العاشر من رمضان", en: "10th of Ramadan" },
  { ar: "المنطقة الحرة بمدينة نصر", en: "Nasr City Free Zone" },
  { ar: "بدر", en: "Badr City" },
  { ar: "برج العرب الجديدة", en: "New Borg El-Arab" },
  { ar: "السادات", en: "Sadat City" },
  { ar: "شق التعبان", en: "Shaq El-Theban" },
  { ar: "قويسنا الصناعية", en: "Quesna Industrial Zone" },
  { ar: "أخرى / خارج المناطق الصناعية", en: "Other / Outside Industrial Zones" }
];

export default function RegisterPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    industryZone: "",
    address: "",
    phoneNumber: "",
    password: "",
  });

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setUploadStatus("");

    // التحقق من صحة المدخلات الأساسية
    if (!formData.name.trim() || formData.name.length < 3) {
      setError(isAr ? "الاسم يجب أن يكون 3 أحرف على الأقل" : "Contact name must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError(isAr ? "يرجى إدخال بريد إلكتروني صحيح ومسجل لديك" : "Please provide a valid company email address");
      setIsLoading(false);
      return;
    }

    if (!formData.companyName.trim() || formData.companyName.length < 3) {
      setError(isAr ? "اسم الشركة / المصنع يجب أن يكون 3 أحرف على الأقل" : "Facility or company name must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.industryZone) {
      setError(isAr ? "يرجى تحديد المنطقة الصناعية لمصنعك" : "Please select your industrial zone");
      setIsLoading(false);
      return;
    }

    if (!formData.address.trim() || formData.address.length < 5) {
      setError(isAr ? "يرجى كتابة العنوان التفصيلي للمصنع (5 أحرف على الأقل)" : "Please provide detailed plant address (at least 5 characters)");
      setIsLoading(false);
      return;
    }

    // التحقق من رقم الهاتف إذا تم إدخاله
    if (formData.phoneNumber) {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError(isAr ? "رقم الهاتف المحمول يجب أن يكون رقم مصري صحيح (مثال: 01012345678)" : "Please enter a valid Egyptian phone number (e.g. 01012345678)");
        setIsLoading(false);
        return;
      }
    }

    if (formData.password.length < 6) {
      setError(isAr ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      let businessLicenseUrl: string | undefined = undefined;

      // رفع مستند السجل التجاري إن وُجد
      if (licenseFile) {
        setUploadStatus(isAr ? "جاري رفع مستند السجل التجاري بأمان..." : "Uploading verification document securely...");
        const uploadData = new FormData();
        uploadData.append("file", licenseFile);
        uploadData.append("type", "license");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.error || (isAr ? "فشل رفع مستند السجل التجاري" : "Failed to upload document"));
        }

        const uploadResult = await uploadRes.json();
        businessLicenseUrl = uploadResult.url;
      }

      setUploadStatus(isAr ? "جاري حفظ بيانات المنشأة..." : "Registering facility profile...");
      const actionForm = new FormData();
      const payload = {
        ...formData,
        businessLicenseUrl,
      };
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          actionForm.append(key, String(val));
        }
      });

      const response = await registerEmployerAction(null, actionForm);

      if (!response.success) {
        setError(response.error || (isAr ? "فشل تسجيل الحساب، يرجى مراجعة البيانات." : "Failed to register account, please verify your details."));
        setIsLoading(false);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : (isAr ? "حدث خطأ غير متوقع أثناء الاتصال بالسيرفر" : "Network error connecting to server");
      setError(errorMessage);
      setIsLoading(false);
      setUploadStatus("");
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center bg-radial-[circle_at_bottom_left] from-primary/10 via-background to-background px-6 py-12">
      {/* Background design elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>

      <div className="w-full max-w-lg text-start">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-2">
            <span className="bg-primary text-white px-2 py-0.5 rounded-lg text-lg">hire</span>
            <span>CNC Egypt</span>
          </Link>
          <p className="text-foreground/60 text-sm">
            {isAr ? "تسجيل حساب جديد للمصانع والمنشآت الصناعية" : "New Account Registration for Manufacturing Plants"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-primary via-sky-500 to-primary"></div>
          
          <h2 className="text-xl font-bold text-foreground mb-6">
            {isAr ? "إنشاء حساب منشأة صناعية" : "Register Industrial Facility Account"}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Personal Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "الاسم الشخصي (المسؤول)" : "Contact Person"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={isAr ? "مثال: م. أحمد محمد" : "e.g. Eng. Ahmed"}
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Input (Primary) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "البريد الإلكتروني الأساسي" : "Company Email"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono`}
                    dir="ltr"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Company Name Input */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "اسم المنشأة / المصنع / الورشة" : "Facility / Plant Name"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder={isAr ? "مثال: مصنع النيل للهندسة" : "e.g. Nile Precision Machining"}
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "كلمة المرور" : "Password"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                    dir="ltr"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Industry Zone Dropdown */}
              <div>
                <label htmlFor="industryZone" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "المنطقة الصناعية" : "Industrial Zone"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <select
                    id="industryZone"
                    name="industryZone"
                    value={formData.industryZone}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer`}
                    disabled={isLoading}
                    required
                  >
                    <option value="" disabled>
                      {isAr ? "اختر المنطقة الصناعية" : "Select Industrial Zone"}
                    </option>
                    {EGYPTIAN_INDUSTRIAL_ZONES.map((zone) => (
                      <option key={zone.ar} value={zone.ar} className="bg-card text-foreground">
                        {isAr ? zone.ar : zone.en}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute inset-y-0 ${isAr ? "left-0 pl-3" : "right-0 pr-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "العنوان بالتفصيل" : "Detailed Address"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder={isAr ? "مثال: قطعة 4، بلوك 12، المنطقة الصناعية" : "e.g. Block 12, Plot 4"}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-4">
              {/* Phone Input (Optional) */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-foreground/80 mb-2">
                  {isAr ? "رقم الهاتف المحمول (اختياري / للتواصل المباشر)" : "Mobile Phone (Optional / Direct WhatsApp)"}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isAr ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none text-foreground/40`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    placeholder="01xxxxxxxxx"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"} py-3 bg-secondary/5 border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono`}
                    dir="ltr"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* File Upload Input */}
            <div>
              <label htmlFor="licenseFile" className="block text-sm font-semibold text-foreground/80 mb-2">
                {isAr ? "السجل التجاري أو البطاقة الضريبية (اختياري / للتوثيق الفوري)" : "Commercial Registry or Tax ID (Optional for fast verification)"}
              </label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-secondary/5 transition-colors">
                <input
                  type="file"
                  id="licenseFile"
                  accept=".pdf,image/*"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center gap-2 text-foreground/60">
                  <UploadCloud className="w-8 h-8 text-primary" />
                  <span className="text-sm">
                    {licenseFile ? licenseFile.name : (isAr ? "اضغط هنا لاختيار ملف (صورة أو PDF)" : "Click to attach document (Image or PDF)")}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="text-sm text-foreground/60 flex items-center gap-2 mt-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 cursor-pointer"
              />
              <label htmlFor="terms" className="cursor-pointer text-xs">
                {isAr ? (
                  <>أوافق على <span className="text-primary hover:underline font-semibold">شروط الاستخدام</span> وسياسة الخصوصية للمنصة.</>
                ) : (
                  <>I agree to the <span className="text-primary hover:underline font-semibold">Terms of Use</span> and Privacy Policy.</>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploadStatus || (isAr ? "جاري تسجيل الحساب الجديد..." : "Registering new account...")}</span>
                </>
              ) : (
                <span>{isAr ? "إنشاء حساب المنشأة" : "Register Facility Account"}</span>
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
                {isAr ? "أو التسجيل السريع" : "Or Quick Registration"}
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
            <span>{isAr ? "التسجيل بحساب Google (Gmail)" : "Register with Google (Gmail)"}</span>
          </button>

          {/* Divider 2 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-foreground/40 font-medium">
                {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}
              </span>
            </div>
          </div>

          {/* Link to login */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>{isAr ? "تسجيل الدخول لحسابك" : "Sign In to Your Account"}</span>
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
  );
}
