// src/components/shared/ScreeningForm.tsx
"use client";

import React, { useState } from "react";
import { applyToJobAction } from "@/app/actions/application";
import { Phone, AlertCircle, CheckCircle2, Loader2, ArrowRight, BookOpen, Star } from "lucide-react";
import Link from "next/link";

interface ScreeningQuestion {
  id: string;
  question: string;
  options: string[];
}

interface ScreeningFormProps {
  jobId: string;
  questions: ScreeningQuestion[];
  onClose?: () => void;
}

export default function ScreeningForm({ jobId, questions, onClose }: ScreeningFormProps) {
  const [step, setStep] = useState<"phone" | "quiz" | "result">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null | undefined>(null);

  // 1. معالجة خطوة التحقق من رقم الهاتف
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقماً (مثال: 01012345678)");
      return;
    }

    // إذا لم يكن هناك أسئلة تصفية للوظيفة، ننتقل مباشرة للتقديم النهائي تلقائياً
    if (questions.length === 0) {
      handleFinalSubmit([]);
    } else {
      setStep("quiz");
    }
  };

  // 2. معالجة اختيار إجابة من متعدد
  const handleOptionSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIdx;
    setAnswers(newAnswers);

    // الانتقال للسؤال التالي أو تقديم النموذج
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  // 3. تقديم الطلب النهائي وحساب النتيجة
  const handleFinalSubmit = async (finalAnswers = answers) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await applyToJobAction(jobId, finalAnswers);

      if (!res.success) {
        setError(res.error || "حدث خطأ أثناء التقديم، يرجى المحاولة لاحقاً.");
        setIsLoading(false);
      } else {
        setScore(res.score);
        setStep("result");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ غير متوقع أثناء إرسال البيانات.");
      setIsLoading(false);
    }
  };

  // شاشة خطوة 1: التحقق من الهوية الهاتفية
  if (step === "phone") {
    const isNotRegisteredError = error?.includes("غير مسجل كباحث عن عمل");
    
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-foreground">التحقق من رقم الهاتف للتقديم</h3>
          <p className="text-xs text-foreground/50 leading-relaxed">
            الرجاء إدخال رقم هاتفك المحمول المسجل مسبقاً في المنصة لبدء عملية التقديم السريع واجتياز التقييم الفني.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex flex-col gap-3 font-semibold">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            
            {/* في حال لم يكن مسجلاً، نسهل عليه الانتقال لصفحة التسجيل */}
            {isNotRegisteredError && (
              <Link 
                href="/register/candidate" 
                className="mt-2 w-full py-2 bg-red-500 text-white font-bold rounded-lg text-center hover:bg-red-600 transition-colors"
              >
                سجل حساب كادر (فني / مهندس) الآن
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="01xxxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              className="w-full pr-10 pl-3 py-3 border border-border bg-secondary/5 rounded-xl text-sm focus:outline-none focus:border-primary/50 text-left"
              dir="ltr"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-foreground/40">
              <Phone className="w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>جاري معالجة طلبك...</span>
              </>
            ) : (
              <span>{questions.length > 0 ? "ابدأ اختبار التصفية الذكي ⚡" : "تأكيد التقديم السريع"}</span>
            )}
          </button>
        </form>
      </div>
    );
  }

  // شاشة خطوة 2: اختبار التصفية الفنية
  if (step === "quiz") {
    const q = questions[currentQ];
    const progressPercent = Math.round(((currentQ) / questions.length) * 100);

    return (
      <div className="space-y-6 text-right" dir="rtl">
        {/* شريط التقدم */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-foreground/50">
            <span>سؤال {(currentQ + 1).toLocaleString("ar-EG")} من {questions.length.toLocaleString("ar-EG")}</span>
            <span>{progressPercent}% مكتمل</span>
          </div>
          <div className="w-full h-1.5 bg-secondary/15 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* السؤال */}
        <div className="p-5 bg-secondary/5 border border-border rounded-2xl">
          <div className="flex items-start gap-2 text-primary">
            <BookOpen className="w-5 h-5 shrink-0 mt-0.5" />
            <h4 className="font-bold text-sm md:text-base text-foreground/90 leading-relaxed">
              {q.question}
            </h4>
          </div>
        </div>

        {/* خيارات الإجابة */}
        <div className="space-y-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className="w-full p-4 border border-border bg-card rounded-xl hover:border-primary/50 text-right text-xs font-semibold text-foreground/80 hover:bg-secondary/5 active:scale-[0.99] transition-all cursor-pointer flex justify-between items-center"
            >
              <span>{option}</span>
              <span className="w-5 h-5 rounded-full border border-border/80 text-[10px] text-foreground/40 flex items-center justify-center font-mono">
                {String.fromCharCode(65 + idx)}
              </span>
            </button>
          ))}
        </div>

        {/* الرجوع للخلف */}
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="text-xs text-foreground/50 hover:text-foreground font-semibold flex items-center gap-1 mt-2 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>السؤال السابق</span>
          </button>
        )}
      </div>
    );
  }

  // شاشة خطوة 3: عرض نتيجة التقييم والنجاح
  return (
    <div className="text-center space-y-6 py-6 text-right animate-fadeIn" dir="rtl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">تم تقديم طلبك بنجاح!</h3>
        <p className="text-xs text-foreground/60 leading-relaxed max-w-md mx-auto">
          تم استلام ملفك المهني وإجاباتك ومطابقتها ذكياً مع متطلبات المصنع بنجاح.
        </p>
      </div>

      {score !== null && score !== undefined && (
        <div className="max-w-xs mx-auto p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-1">
          <div className="flex justify-center gap-1 text-primary">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-wider">نتيجة تقييم الكود فني</span>
          </div>
          <div className="text-2xl font-black text-primary">
            {score.toLocaleString("ar-EG")}%
          </div>
          <p className="text-[10px] text-foreground/50">
            {score >= 80 ? "أداء ممتاز ومطابق لطلب المهندسين!" : "تم حفظ النتيجة وتمريرها للمشرف التقني."}
          </p>
        </div>
      )}

      <div className="pt-4 max-w-xs mx-auto">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-xl hover:bg-secondary/90 transition-all cursor-pointer"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  );
}
