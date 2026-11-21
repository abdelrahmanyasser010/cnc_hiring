// src/app/blog/page.tsx
// صفحة المدونة العامة للمستخدمين (Server Component).
// تقوم بجلب المقالات المنشورة وتمريرها لمكون العرض التفاعلي ثنائي اللغة (BlogClientView).

export const dynamic = "force-dynamic";

import React from "react";
import { blogRepo } from "@/infrastructure/container";
import { BlogClientView, BlogPostItem } from "./BlogClientView";
import { PublicNavbar } from "@/components/shared/PublicNavbar";
import { PublicFooter } from "@/components/shared/PublicFooter";

export const metadata = {
  title: "مدونة تشغيل وبرمجة الـ CNC في مصر | HIREX CNC",
  description: "مقالات، شروحات، ونصائح تقنية وعملية حول تشغيل وبرمجة ماكينات المخارط والفرايز الـ CNC وكيفية صيانة الماكينات وكتابة الـ G-code.",
};

const SEED_POSTS: BlogPostItem[] = [
  {
    id: "post-seed-1",
    title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟",
    slug: "choose-correct-tools-for-stainless-steel-cnc",
    excerpt: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل ومقاومة الحرارة الناتجة.",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-26T12:00:00Z"),
    author: { name: "م. أحمد الشافعي (خبير تشغيل)" },
  },
  {
    id: "post-seed-2",
    title: "شرح أكواد البرمجة التحضيرية G-code الأكثر استخداماً لبرمجة المخارط والفرايز",
    slug: "g-code-programming-complete-tutorial-for-machinists",
    excerpt: "تعلم أكواد G00, G01, G02, G03 بالتفصيل مع أمثلة برمجية توضح كيفية كتابتها لتشكيل الدوائر والخطوط المستقيمة مع تفادي الاصطدامات.",
    coverImage: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-24T12:00:00Z"),
    author: { name: "فني خبير/ محمد علي" },
  },
  {
    id: "post-seed-3",
    title: "5 خطوات لتفادي أخطاء المعايرة (Tool Offsets) وتجنب كسر العدة والماكينة",
    slug: "five-steps-to-prevent-tool-offsets-errors-on-cnc",
    excerpt: "دليل إرشادي للفنيين المبتدئين حول كيفية ضبط قيم تعويض الطول والقطر للعدة (H & D offsets) والتأكد من نقطة الصفر للقطعة بشكل آمن.",
    coverImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-21T12:00:00Z"),
    author: { name: "م. طارق الهواري" },
  },
  {
    id: "post-seed-4",
    title: "مقارنة شاملة بين برامج التصميم والبرمجة CAM: Mastercam مقابل SolidCAM في مصر",
    slug: "mastercam-vs-solidcam-cnc-software-comparison",
    excerpt: "تحليل نقطي لمميزات وعيوب أشهر برامج الـ CAM المستخدمة في الورش المصرية، وأيهما أفضل لتشغيل قوالب الاسطمبات مقابل الأجزاء الدقيقة.",
    coverImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-18T12:00:00Z"),
    author: { name: "م. سارة محمود (تصميم CAD/CAM)" },
  },
  {
    id: "post-seed-5",
    title: "دليل أجور ورواتب فنيي ومهندسي الـ CNC في المناطق الصناعية بمصر لعام 2026",
    slug: "cnc-machinist-salaries-egyptian-industrial-zones-2026",
    excerpt: "دراسة تفصيلية لمتوسط الرواتب في العاشر من رمضان، 6 أكتوبر، والعبور حسب سنوات الخبرة (فني مشغل، مبرمج، مهندس تصميم، ومشرف صيانة).",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-15T12:00:00Z"),
    author: { name: "فريق أبحاث hireCNC" },
  },
  {
    id: "post-seed-6",
    title: "الصيانة الوقائية اليومية والأسبوعية لماكينات الـ CNC لتفادي الأعطال وتوقف الإنتاج",
    slug: "daily-weekly-preventive-maintenance-for-cnc-machines",
    excerpt: "جدول عملي للمراجعة اليومية (فحص مستويات الزيوت، تنظيف الفلاتر، معايرة ضغط الهيدروليك) للحفاظ على العمر الافتراضي ودقة الماكينة.",
    coverImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop",
    createdAt: new Date("2026-06-10T12:00:00Z"),
    author: { name: "م. عصام حجازي (صيانة هيدروليك)" },
  },
];

export default async function PublicBlogPage() {
  let posts: BlogPostItem[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPosts = await blogRepo.findAllPublished() as any[];
    const dbPosts: BlogPostItem[] = rawPosts ? rawPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      createdAt: p.createdAt,
      author: { name: p.author?.name ?? p.author?.email ?? "مستخدم مجهول" },
    })) : [];

    const combined = [...dbPosts];
    SEED_POSTS.forEach(seed => {
      if (!combined.some(p => p.slug === seed.slug)) {
        combined.push(seed);
      }
    });
    posts = combined;
  } catch (error) {
    console.warn("Database failed to load public posts, displaying seed posts.", error);
    posts = SEED_POSTS;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1">
        <BlogClientView initialPosts={posts} />
      </main>
      <PublicFooter />
    </div>
  );
}
