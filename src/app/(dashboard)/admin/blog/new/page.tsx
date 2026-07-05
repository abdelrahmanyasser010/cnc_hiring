// src/app/(dashboard)/admin/blog/new/page.tsx
// صفحة إنشاء مقال جديد (Server Component).

import React from "react";
import BlogForm from "@/components/dashboard/BlogForm";
import { BookOpen } from "lucide-react";

export default function NewPostPage() {
  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground/90 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span>كتابة مقال تقني جديد</span>
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          قم بملء البيانات لتسجيل مقال معرفي جديد، ونشره على منصة المتقدمين لتعزيز محرك البحث الـ SEO.
        </p>
      </div>

      {/* نموذج التحرير */}
      <BlogForm />

    </div>
  );
}
