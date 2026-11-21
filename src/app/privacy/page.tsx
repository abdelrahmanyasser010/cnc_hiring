// src/app/privacy/page.tsx
// سياسة الخصوصية وحماية بيانات المصانع والكوادر لمنصة HIREX CNC

import React from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { ShieldCheck, Lock, FileText, ArrowRight } from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية وحماية البيانات الصناعية | HIREX CNC",
  description: "سياسة خصوصية البيانات، معايير كشف بيانات الاتصال، وتأمين السجلات التجارية للمنشآت في منصة HIREX CNC.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-start selection:bg-primary selection:text-white" dir="rtl">
      <PublicNavbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        
        {/* Header */}
        <div className="space-y-3 border-b border-border/80 pb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/60 hover:text-primary transition-colors mb-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الرجوع للصفحة الرئيسية</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>حماية البيانات والسرية الصناعية</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            سياسة الخصوصية وحماية البيانات
          </h1>
          
          <p className="text-xs sm:text-sm text-foreground/60">
            آخر تحديث: نوفمبر 2026 — منصة HIREX CNC (مصر)
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-foreground/80 leading-relaxed text-sm">
          
          <section className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>1. حماية بيانات الكوادر الفنية ومشغلي الماكينات</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              تلتزم HIREX CNC بعدم نشر أرقام الهواتف أو بيانات الاتصال الشخصية للعامة على الإنترنت. بيانات الاتصال تكون مشفرة ومحمية، ولا تُكشف إلا للمصانع والمنشآت الهندسية المعتمدة رسمياً والتي تمتلك اشتراكاً نشطاً في المنصة بعد التحقق من سجلها التجاري.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>2. سرية السجلات التجارية والبطاقات الضريبية للمصانع</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              تُستخدم صور السجلات التجارية والبطاقات الضريبية المرفوعة من قبل أصحاب المصانع لغرض وحيد وهو التحقق الداخلي من هوية المنشأة واعتماد شارتها (Verified Employer). لا يتم مشاركة هذه المستندات مع أي طرف ثالث أو جهة إعلانية.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>3. المدفوعات والمعاملات المالية الإلكترونية</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              تتم كافة عمليات الدفع والاشتراكات عبر بوابات دفع إلكترونية معتمدة من البنك المركزي المصري (مثل Paymob). لا تقوم منصة HIREX CNC بحفظ أو تخزين أي أرقام بطاقات بنكية أو بيانات سرية على خوادمها الخاصة.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>4. حق الفني في تعديل أو حذف حسابه</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              يحق لأي كادر فني أو مهندس مسجل في المنظومة في أي وقت تعديل بياناته، أو تعطيل ظهوره للشركات من خلال زر &quot;حالة الإتاحة للعمل&quot; داخل لوحة التحكم، أو طلب الحذف الكامل لملفه بالتواصل مع الدعم الفني.
            </p>
          </section>

        </div>

      </main>
    </div>
  );
}
