// src/app/blog/[slug]/page.tsx
// صفحة عرض تفاصيل المقال العامة للمستخدمين (Server Component).
// تدعم رندرة الماركداون مع تلوين الأكواد وتوليد وسوم الـ SEO ديناميكياً.

export const dynamic = "force-dynamic";

import React from "react";
import { blogRepo } from "@/infrastructure/container";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import BlogSidebar from "@/components/shared/BlogSidebar";
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";

// استيراد ستايلات تلوين الأكواد البرمجية (مثل أكواد الـ G-code)
import "highlight.js/styles/github-dark.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const MOCK_DATE = new Date("2026-06-26T12:00:00Z");

type BlogPostPayload = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  published?: boolean;
  authorId?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  author?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

// 1. محرك توليد الـ SEO والـ Open Graph ديناميكياً من قاعدة البيانات
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let post: BlogPostPayload | null = null;

  try {
    post = await blogRepo.findFullBySlug(slug) as BlogPostPayload | null;
  } catch {
    // تجنب الفشل في توليد الميتا داتا في غياب قاعدة البيانات
  }

  if (!post) {
    // مقال تجريبي في بيئة التطوير المحلية
    if (slug === "choose-correct-tools-for-stainless-steel-cnc") {
      return {
        title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟ | hireCNC",
        description: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل.",
      };
    }
    return {
      title: "مقال غير موجود | hireCNC Egypt",
      description: "المقال المطلوب قراءته غير متوفر أو تم حذفه.",
    };
  }

  return {
    title: `${post.title} | hireCNC Egypt`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://hirecnc.eg/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let post: BlogPostPayload | null = null;
  let isMockData = false;

  try {
    // 2. جلب المقال من قاعدة البيانات
    const dbPost = await blogRepo.findFullBySlug(slug) as BlogPostPayload | null;
    if (dbPost) {
      post = {
        ...dbPost,
        author: { name: dbPost.author?.name ?? dbPost.author?.email ?? "مستخدم مجهول" },
      };
    }
  } catch (error) {
    console.warn("Database failed to fetch blog post details, using seed data.", error);
  }

  // 3. في حال عدم وجود المقال، استخدام البيانات التجريبية للمحاكاة
  if (!post) {
    if (slug !== "choose-correct-tools-for-stainless-steel-cnc") {
      return notFound();
    }
    isMockData = true;
    post = {
      id: "post-mock-1",
      title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟",
      slug,
      excerpt: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل.",
      createdAt: MOCK_DATE,
      updatedAt: MOCK_DATE,
      coverImage: null,
      published: true,
      authorId: "mock-author",
      author: { name: "م. أحمد الشافعي (بيئة تجريبية)" },
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogImage: null,
      content: `
# خراطة الفولاذ المقاوم للصدأ (Stainless Steel)

يُعتبر الستانلس ستيل (خصوصاً فئة 304 و 316) من الخامات العنيدة والصعبة في التشغيل على ماكينات المخارط والفرايز الـ CNC. يعود ذلك لخاصية التصلد الانفعالي (Work Hardening) أثناء القطع وتوليد كميات حرارة مهولة قد تؤدي لتلف العدة فوراً.

في هذا الدليل، سنشرح كيفية ضبط المعاملات الفنية لضمان تشغيل آمن وجودة أسطح ممتازة.

## 1. زوايا القطع ونوع العدة (Tooling Selection)
يفضل دائماً استخدام لقم كربيدية (Carbide Inserts) مغطاة بطلاء PVD أو CVD مقاوم للحرارة العالية والالتصاق (مثل طلاء TiAlN).
* **زاوية جرف موجبة (Positive Rake Angle):** تقلل من قوى القطع ومقاومة احتكاك الرايش.
* **نصف قطر سن العدة (Nose Radius):** اختر نصف قطر صغير (مثل 0.4 مم أو 0.8 مم كحد أقصى) لتخفيف الضغط الجانبي المسبب للاهتزاز (Chatter).

## 2. كود برمجة وسرعة القطع (Feeds and Speeds)
السر المالي لتشغيل الستانلس ستيل هو المحافظة على معدل تغذية مستقر وكافٍ لتجاوز المنطقة المتصلبة، مع تقليل سرعة الدوران الإجمالية.

\`\`\`gcode
; مثال لكود برمجة مخرطة CNC لتشغيل الستانلس ستيل بشكل مستقر
G21 G40 G90 G95 ; استخدام نظام الملليمتر والتقدم بالدورة
T0202 M06 ; اختيار قلم الخراطة الخارجية التشطيب
G54
G96 S110 M03 ; تفعيل سرعة سطح ثابتة (S=110 م/دقيقة)
G00 X60.0 Z3.0 M08 ; تقدم سريع مع تفعيل سائل التبريد بضغط عالٍ
G01 Z-35.0 F0.18 ; تقدم تغذية 0.18 مم/دورة للتشغيل
G01 X65.0 F0.25 ; انسحاب قطري
G00 X150.0 Z100.0 M09 ; رجوع لنقطة الأمان وإغلاق سائل التبريد
M30 ; نهاية البرنامج
\`\`\`

## 3. أهمية سائل التبريد (Coolant Power)
لا يمكن قط تشغيل الستانلس ستيل جافاً! سائل التبريد القابل للذوبان بتركيز زيت مرتفع (8-10%) يُعد ضرورة قصوى لتقليل التآكل الحراري وتسهيل خروج الرايش.

بالتوفيق للجميع في ورش ومصانع مصر!
        `,
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/40 py-12 text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رابط العودة للمقالات */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع لجميع المقالات المعرفية</span>
          </Link>
        </div>

        {/* تنبيه بيئة المحاكاة */}
        {isMockData && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
            <span>⚙️ تنبيه بيئة التطوير: هذا المقال معروض من بيانات البذور التجريبية لعدم إمكانية الاتصال بقاعدة البيانات.</span>
          </div>
        )}

        {/* تقسيم الشاشة: المقال والعمود الجانبي */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* محتوى المقال (Left Column / col-span-8) */}
          <main className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* رأس المقال */}
            <div className="space-y-4 border-b border-border pb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-0.5 rounded-lg text-xs font-bold">
                <BookOpen className="w-4 h-4" />
                <span>إرشاد تقني وعملي</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                {post.title}
              </h1>

              {/* الكاتب والتاريخ */}
              <div className="flex items-center gap-4 text-xs text-foreground/50 font-bold">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-primary/70" />
                  <span>الكاتب: {post.author?.name || "مشرف النظام"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary/70" />
                  <span>
                    نُشر في:{" "}
                    {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* رندرة الماركداون الفعلي */}
            <div className="prose dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-sans text-sm md:text-base text-right space-y-4">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {post.content}
              </ReactMarkdown>
            </div>

          </main>

          {/* العمود الجانبي التسويقي (Right Column / col-span-4) */}
          <aside className="lg:col-span-4">
            <BlogSidebar />
          </aside>

        </div>

      </div>
    </div>
  );
}
