// src/app/(dashboard)/admin/blog/[id]/edit/page.tsx
// صفحة تعديل المقال الحالي (Server Component).

import { blogRepo } from "@/infrastructure/container";
import { notFound } from "next/navigation";
import BlogForm from "@/components/dashboard/BlogForm";
import { BookOpen, AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: PageProps) {
  // 1. التحقق من صلاحيات المشرف
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "SUPER_ADMIN") {
    return (
      <div className="p-12 text-center space-y-4" dir="rtl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-foreground/90">عذراً، هذه الصفحة مخصصة لمديري النظام فقط.</h2>
      </div>
    );
  }

  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let post: any = null;

  try {
    // 2. البحث عن المقال في قاعدة البيانات
    post = await blogRepo.findFullById(id);
  } catch (error) {
    console.warn("Database connection failed during post fetch for editing:", error);
  }

  // 3. في حال عدم وجود المقال أو استخدام المقالات التجريبية
  if (!post) {
    if (id.startsWith("post-mock-")) {
      post = {
        id,
        title: id === "post-mock-1" 
          ? "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟" 
          : "شرح أكواد البرمجة التحضيرية G-code الأكثر استخداماً لبرمجة المخارط والفرايز",
        excerpt: id === "post-mock-1"
          ? "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل."
          : "شرح شامل ومفصل لأكواد G00, G01, G02, G03 مع أمثلة عملية توضح كيفية استخدامها في تشكيل الأسطح والدوائر على الماكينات.",
        content: id === "post-mock-1"
          ? "# خراطة الفولاذ المقاوم للصدأ\n\nتعد عملية تشغيل الستانلس ستيل من أصعب العمليات بسبب صلابته وتوليده للحرارة. إليك أهم المعايير:\n\n* **سرعة القطع (Cutting Speed):** يجب خفضها بنسبة 20-30% مقارنة بالفولاذ الكربوني العادي.\n* **زاوية جرف العدة (Rake Angle):** يفضل استخدام زاوية موجبة لتقليل قوى الاحتكاك ونقل الحرارة بسرعة.\n\n```gcode\n; مثال لكود تجهيز ماكينة خراطة للقطع في ستانلس ستيل\nG21 G40 G90 G97\nT0101 M06\nG54\nG96 S120 M03 ; سرعة دوران ثابتة 120\nG00 X50.0 Z2.0 M08 ; تفعيل سائل التبريد (هام جداً)\nG01 Z-20.0 F0.15\n```"
          : "# شرح أكواد الـ G-code التحضيرية\n\nتعد أكواد الحركة الأساس للأكواد في برمجة ماكينات المخارط والفرايز الـ CNC:\n\n1. **كود G00:** حركة سريعة لتجهيز العدة بدون تشغيل (Rapid Travel).\n2. **كود G01:** القطع الخطي بتغذية محددة (Linear Interpolation).\n3. **كود G02:** القطع الدائري في اتجاه عقارب الساعة (Circular Interpolation CW).\n4. **كود G03:** القطع الدائري عكس اتجاه عقارب الساعة (Circular Interpolation CCW).",
        coverImage: "",
        published: id === "post-mock-1",
      };
    } else {
      return notFound();
    }
  }

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground/90 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span>تعديل المقال المعرفي</span>
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          قم بتحديث البيانات أو المحتوى أدناه، ثم اضغط حفظ لتطبيق التحديثات فوراً.
        </p>
      </div>

      {/* نموذج التعديل */}
      <BlogForm initialData={post} />

    </div>
  );
}
