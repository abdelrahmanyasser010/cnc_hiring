// src/app/(dashboard)/admin/blog/page.tsx
// لوحة التحكم الخاصة بإدارة مقالات المدونة (Server Component).
// تعرض جدول المقالات مع إمكانية التعديل، النشر، الحذف، والبحث.

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { blogRepo } from "@/infrastructure/container";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FileText, Plus, BookOpen, AlertCircle, Edit, ExternalLink } from "lucide-react";
import DeletePostButton from "@/components/dashboard/DeletePostButton";

const MOCK_ADMIN_POSTS = [
  {
    id: "post-mock-1",
    title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟",
    slug: "choose-correct-tools-for-stainless-steel-cnc",
    excerpt: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل.",
    published: true,
    coverImage: null,
    createdAt: new Date("2026-06-26T12:00:00Z"),
    author: { name: "أدمن النظام (تجريبي)" },
  },
  {
    id: "post-mock-2",
    title: "شرح أكواد البرمجة التحضيرية G-code الأكثر استخداماً لبرمجة المخارط والفرايز",
    slug: "g-code-programming-complete-tutorial-for-machinists",
    excerpt: "شرح شامل ومفصل لأكواد G00, G01, G02, G03 مع أمثلة عملية توضح كيفية استخدامها في تشكيل الأسطح والدوائر على الماكينات.",
    published: false,
    coverImage: null,
    createdAt: new Date("2026-06-25T12:00:00Z"),
    author: { name: "أدمن النظام (تجريبي)" },
  },
];

export default async function AdminBlogPage() {
  // 1. التحقق من صلاحيات المشرف
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; name?: string } | undefined;
  if (!session || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="p-12 text-center space-y-4" dir="rtl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-foreground/90">عذراً، هذه الصفحة مخصصة لمديري النظام فقط.</h2>
        <p className="text-xs text-foreground/50 max-w-sm mx-auto">
          يرجى تسجيل الدخول بحساب مسؤول (SUPER_ADMIN) للتمكن من إدارة محتوى مدونة المنصة.
        </p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = [];
  let isMockData = false;

  try {
    // 2. جلب المقالات من قاعدة البيانات مرتبة بالأحدث أولاً
    posts = await blogRepo.findAll();
  } catch (error) {
    console.warn("Database failed to load blog posts, using mock CMS database.", error);
    isMockData = true;
    posts = MOCK_ADMIN_POSTS;
  }

  return (
    <div className="space-y-8 text-right font-sans" dir="rtl">
      
      {/* رأس الصفحة وأزرار التحكم */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-semibold">
            <span>لوحة التحكم</span>
            <span>/</span>
            <span>بوابة المحتوى</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground/90 flex items-center gap-2 mt-1">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>إدارة مقالات المدونة المعرفية</span>
          </h1>
        </div>

        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>كتابة مقال جديد</span>
        </Link>
      </div>

      {/* تنبيه بيئة التطوير */}
      {isMockData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
          <span>⚙️ تنبيه بيئة التطوير: تم استخدام مقالات تجريبية لعدم إمكانية الاتصال بقاعدة بيانات PostgreSQL حالياً.</span>
        </div>
      )}

      {/* جدول المقالات */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground/90 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>جميع المقالات المسجلة</span>
          </h3>
          <span className="text-xs bg-secondary/10 px-2.5 py-0.5 rounded-lg text-foreground/60 font-semibold">
            إجمالي: {posts.length.toLocaleString("ar-EG")} مقالات
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-foreground/20" />
            <div className="text-sm font-semibold">لم تقم بكتابة أي مقالات بعد</div>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              ابدأ في نشر المعرفة التقنية لجذب المهندسين والفنيين وأصحاب الأعمال لمنصتك من محركات البحث.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-secondary/5 border-b border-border text-foreground/60 text-xs font-bold">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4 text-right">عنوان المقال</th>
                  <th className="p-4 text-center w-36">الكاتب</th>
                  <th className="p-4 text-center w-32">تاريخ الإنشاء</th>
                  <th className="p-4 text-center w-28">حالة النشر</th>
                  <th className="p-4 text-center w-36">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id} className="border-b border-border hover:bg-secondary/5 transition-all">
                    
                    {/* الترتيب */}
                    <td className="p-4 font-mono text-xs text-foreground/40 text-center">
                      {(index + 1).toLocaleString("ar-EG")}
                    </td>

                    {/* عنوان المقال وملخصه */}
                    <td className="p-4 max-w-xs md:max-w-md">
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-foreground/90">{post.title}</div>
                        <div className="text-xs text-foreground/50 truncate">{post.excerpt}</div>
                      </div>
                    </td>

                    {/* الكاتب */}
                    <td className="p-4 text-center text-xs font-semibold text-foreground/70">
                      {post.author?.name || "مشرف النظام"}
                    </td>

                    {/* تاريخ الإنشاء */}
                    <td className="p-4 text-center text-xs font-medium text-foreground/50">
                      {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* حالة النشر */}
                    <td className="p-4 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold ${
                        post.published 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {post.published ? "منشور" : "مسودة"}
                      </span>
                    </td>

                    {/* الإجراءات */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* تعديل */}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-1.5 border border-border hover:border-primary/40 text-foreground/60 hover:text-primary rounded-lg transition-all cursor-pointer"
                          title="تعديل المقال"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* عرض المقال العام (إذا كان منشوراً أو تجريبياً) */}
                        {post.slug && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 border border-border hover:border-sky-500/40 text-foreground/60 hover:text-sky-500 rounded-lg transition-all cursor-pointer"
                            title="عرض الصفحة العامة"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* حذف */}
                        {!isMockData && <DeletePostButton id={post.id} />}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
