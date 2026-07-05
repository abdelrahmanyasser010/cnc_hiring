// src/components/dashboard/BlogForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPostAction, updatePostAction } from "@/app/actions/blog";
import ArticleEditor from "./ArticleEditor";
import { Save, ArrowLeft, Image as ImageIcon, FileText, Check } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
  };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("يرجى التأكد من ملء جميع الحقول المطلوبة (العنوان، الملخص، المحتوى).");
      return;
    }

    startTransition(async () => {
      const data = {
        title,
        excerpt,
        content,
        coverImage: coverImage || undefined,
        published,
      };

      const res = isEdit 
        ? await updatePostAction(initialData.id, data) 
        : await createPostAction(data);

      if (res.success) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        setError(res.error || "حدث خطأ غير متوقع أثناء حفظ المقال.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      
      {/* عرض الأخطاء إن وجدت */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* حقول الإدخال الأساسية */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        
        {/* العنوان */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            <span>عنوان المقال <span className="text-red-500">*</span></span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: دليلك العملي لبرمجة ماكينات المخارط بنظام فانوك"
            className="w-full px-4 py-2 border border-border bg-secondary/5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50"
            disabled={isPending}
            required
          />
        </div>

        {/* ملخص المقال (Excerpt) */}
        <div className="space-y-1.5">
          <label htmlFor="excerpt" className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            <span>ملخص المقال (وصف لـ SEO) <span className="text-red-500">*</span></span>
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="اكتب نبذة مختصرة تلخص محتوى المقال لجذب القارئ في نتائج بحث جوجل وشبكات التواصل..."
            className="w-full h-20 px-4 py-2.5 border border-border bg-secondary/5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 resize-none"
            disabled={isPending}
            required
          />
        </div>

        {/* رابط صورة الغلاف */}
        <div className="space-y-1.5">
          <label htmlFor="coverImage" className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>رابط صورة الغلاف (اختياري)</span>
          </label>
          <input
            id="coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="مثال: https://images.unsplash.com/photo-..."
            className="w-full px-4 py-2 border border-border bg-secondary/5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 text-left"
            disabled={isPending}
            dir="ltr"
          />
        </div>

        {/* حالة النشر (Checkbox) */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only"
                id="published"
                disabled={isPending}
              />
              <div className={`w-5 h-5 border rounded-md transition-colors flex items-center justify-center ${
                published 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-border bg-secondary/5 text-transparent"
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
            </div>
            <span className="text-xs font-bold text-foreground/80">نشر المقال فوراً (تعطيل الحفظ كمسودة)</span>
          </label>
        </div>

      </div>

      {/* محرر المقال الرئيسي (Markdown Editor) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80">محتوى المقال (Markdown) <span className="text-red-500">*</span></label>
        <ArticleEditor value={content} onChange={setContent} />
      </div>

      {/* أزرار الحفظ والرجوع */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-xl text-xs font-bold text-foreground/70 hover:bg-secondary/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>إلغاء والرجوع</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? "حفظ التعديلات" : "نشر وحفظ المقال"}</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
