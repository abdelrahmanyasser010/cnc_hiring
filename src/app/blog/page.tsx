// src/app/blog/page.tsx
// صفحة المدونة العامة للمستخدمين (Server Component).
// تقوم بعرض قائمة المقالات المنشورة ببطاقات تصميمية متقدمة.

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { blogRepo } from "@/infrastructure/container";
import { BookOpen, Calendar, User, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "المدونة المعرفية لفنيي ومهندسي الـ CNC في مصر | hireCNC",
  description: "مقالات، شروحات، ونصائح تقنية وعملية حول تشغيل وبرمجة ماكينات المخارط والفرايز الـ CNC وكيفية صيانة الماكينات وكتابة الـ G-code.",
};

const SEED_POSTS = [
  {
    id: "post-seed-1",
    title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟",
    slug: "choose-correct-tools-for-stainless-steel-cnc",
    excerpt: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل ومقاومة الحرارة الناتجة.",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    createdAt: new Date("2026-06-26T12:00:00Z"),
    author: { name: "م. أحمد الشافعي" },
  },
  {
    id: "post-seed-2",
    title: "شرح أكواد البرمجة التحضيرية G-code الأكثر استخداماً لبرمجة المخارط والفرايز",
    slug: "g-code-programming-complete-tutorial-for-machinists",
    excerpt: "تعلم أكواد G00, G01, G02, G03 بالتفصيل مع أمثلة برمجية توضح كيفية كتابتها لتشكيل الدوائر والخطوط المستقيمة مع تفادي الاصطدامات.",
    coverImage: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=600&auto=format&fit=crop",
    createdAt: new Date("2026-06-24T12:00:00Z"),
    author: { name: "فني خبير/ محمد علي" },
  },
  {
    id: "post-seed-3",
    title: "5 خطوات لتفادي أخطاء المعايرة (Tool Offsets) وتجنب كسر العدة والماكينة",
    slug: "five-steps-to-prevent-tool-offsets-errors-on-cnc",
    excerpt: "دليل إرشادي للفنيين المبتدئين حول كيفية ضبط قيم تعويض الطول والقطر للعدة (H & D offsets) والتأكد من نقطة الصفر للقطعة بشكل آمن.",
    coverImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    createdAt: new Date("2026-06-21T12:00:00Z"),
    author: { name: "أدمن المنصة" },
  },
];

export default async function PublicBlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = [];
  let isMockData = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPosts = await blogRepo.findAllPublished() as any[];
    posts = rawPosts.map((p) => ({
      ...p,
      author: { name: p.author?.name ?? p.author?.email ?? "مستخدم مجهول" },
    }));
  } catch (error) {
    console.warn("Database failed to load public posts, displaying seed posts.", error);
    isMockData = true;
    posts = SEED_POSTS;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/40 py-12 text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* رأس الصفحة مع تنبيه للمطور */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>مدونة المعرفة التقنية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            المدونة التعليمية لصناعة الـ CNC
          </h1>
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
            مقالات وشروحات برمجية وعملية متخصصة لدعم الفنيين والمهندسين وأصحاب المصانع في السوق المصري لرفع كفاءة الإنتاج.
          </p>
          
          {isMockData && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-2 text-xs font-bold inline-block">
              ⚙️ تنبيه: يتم عرض مقالات تجريبية لعدم إمكانية الاتصال بقاعدة البيانات حالياً.
            </div>
          )}
        </div>

        {/* عرض المقالات كشبكة (Grid) */}
        {posts.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 border border-border rounded-2xl bg-card">
            <div className="text-sm font-semibold">لا توجد مقالات منشورة في المدونة حالياً.</div>
            <p className="text-xs max-w-sm mx-auto mt-2 leading-relaxed">
              سيقوم فريق العمل بإضافة المقالات التقنية والشروحات قريباً، يرجى زيارة الصفحة لاحقاً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col h-full group"
              >
                {/* صورة الغلاف أو تدرج لوني افتراضي */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-primary/80 flex items-center justify-center p-6 text-center text-white font-bold text-sm">
                      {post.title}
                    </div>
                  )}
                </div>

                {/* تفاصيل المقال */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  {/* الكاتب والتاريخ */}
                  <div className="flex items-center gap-4 text-[10px] text-foreground/50 font-bold">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary/70" />
                      <span>{post.author?.name || "كاتب تقني"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* العنوان والملخص */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* رابط القراءة */}
                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group-hover:gap-2.5 transition-all cursor-pointer"
                    >
                      <span>اقرأ المقال كاملاً</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
