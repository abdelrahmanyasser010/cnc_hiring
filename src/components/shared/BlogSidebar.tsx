// src/components/shared/BlogSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, Briefcase, Award, Users } from "lucide-react";

export default function BlogSidebar() {
  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      
      {/* الباقة التعريفية الأولى - للباحثين عن العمل */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-card border border-primary/20 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-6 -translate-y-6 pointer-events-none"></div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-xl text-primary">
            <UserPlus className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-foreground/90">سجل كفني أو مهندس CNC</h4>
        </div>
        
        <p className="text-xs text-foreground/60 leading-relaxed">
          انضم لأكبر شبكة توظيف متخصصة في تشغيل وبرمجة ماكينات المخارط والفرايز الـ CNC في مصر. سجل الآن لتصلك طلبات المقابلات مباشرة!
        </p>

        <div className="flex items-center gap-1 text-[10px] text-foreground/50 font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>الخدمة مجانية بالكامل لجميع الكوادر الفنية</span>
        </div>

        <Link
          href="/register/candidate"
          className="block text-center bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
        >
          إنشاء حساب كادر فني مجاناً
        </Link>
      </div>

      {/* الباقة التعريفية الثانية - لأصحاب المصانع */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 border border-border rounded-xl text-foreground/70">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-foreground/90">هل تحتاج فنيين لمصنعك؟</h4>
        </div>
        
        <p className="text-xs text-foreground/60 leading-relaxed">
          انشر وظيفتك الشاغرة الآن واحصل على تقييمات فنية فورية (التقييم الذكي للـ G-code) وتواصل مع الكفاءات الموثقة القريبة من منطقتك.
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-foreground/50 font-semibold">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>تواصل مع أكثر من +٥,٠٠٠ فني مؤهل</span>
        </div>

        <Link
          href="/register"
          className="block text-center border border-border hover:border-primary/40 bg-secondary/5 text-foreground hover:text-primary py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          سجل كصاحب عمل وانشر وظيفتك
        </Link>
      </div>

      {/* تنبيه سريع عن المنصة */}
      <div className="bg-secondary/5 border border-border rounded-xl p-4 text-[10px] text-foreground/50 leading-relaxed">
        <strong>💡 منصة hireCNC Egypt:</strong> هي النظام الإداري والتوظيفي الأول بمصر المخصص لقطاع تشغيل المعادن والماكينات المبرمجة بالكمبيوتر.
      </div>

    </div>
  );
}
