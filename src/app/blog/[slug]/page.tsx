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
import { PublicNavbar } from "@/components/shared/PublicNavbar";
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

const SEED_ARTICLES_MAP: Record<string, { title: string; excerpt: string; content: string; author: string }> = {
  "choose-correct-tools-for-stainless-steel-cnc": {
    title: "كيف تختار العدة المناسبة لخراطة الفولاذ المقاوم للصدأ (Stainless Steel)؟",
    excerpt: "دليل عملي شامل لمهندسي الإنتاج وفنيي تشغيل الـ CNC لاختيار خامات وسرعات التغذية وزوايا العدة المثالية لتشغيل الستانلس ستيل ومقاومة الحرارة الناتجة.",
    author: "م. أحمد الشافعي (خبير تشغيل)",
    content: `
# خراطة الفولاذ المقاوم للصدأ (Stainless Steel)

يُعتبر الستانلس ستيل (خصوصاً فئة 304 و 316) من الخامات العنيدة والصعبة في التشغيل على ماكينات المخارط والفرايز الـ CNC. يعود ذلك لخاصية التصلد الانفعالي (Work Hardening) أثناء القطع وتوليد كميات حرارة مهولة قد تؤدي لتلف العدة فوراً.

في هذا الدليل، سنشرح كيفية ضبط المعاملات الفنية لضمان تشغيل آمن وجودة أسطح ممتازة.

## 1. زوايا القطع ونوع العدة (Tooling Selection)
يفضل دائماً استخدام لقم كربيدية (Carbide Inserts) مغطاة بطلاء PVD أو CVD مقاوم للحرارة العالية والالتصاق (مثل طلاء TiAlN).
* **زاوية جرف موجبة (Positive Rake Angle):** تقلل من قوى القطع ومقاومة احتكاك الرايش.
* **نصف قطر سن العدة (Nose Radius):** اختر نصف قطر صغير (مثل 0.4 مم أو 0.8 مم كحد أقصى) لتخفيف الضغط الجانبي المسبب للاهتزاز (Chatter).

## 2. كود برمجة وسرعة القطع (Feeds and Speeds)
السر المثالي لتشغيل الستانلس ستيل هو المحافظة على معدل تغذية مستقر وكافٍ لتجاوز المنطقة المتصلبة، مع تقليل سرعة الدوران الإجمالية.

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
  },
  "g-code-programming-complete-tutorial-for-machinists": {
    title: "شرح أكواد البرمجة التحضيرية G-code الأكثر استخداماً لبرمجة المخارط والفرايز",
    excerpt: "تعلم أكواد G00, G01, G02, G03 بالتفصيل مع أمثلة برمجية توضح كيفية كتابتها لتشكيل الدوائر والخطوط المستقيمة مع تفادي الاصطدامات.",
    author: "فني خبير/ محمد علي",
    content: `
# أساسيات لغة البرمجة التحضيرية G-Code للمخارط والفرايز

لغة الـ **G-code** هي اللغة العالمية التي تفهمها ماكينات التحكم الرقمي (CNC) لتحويل الرسومات الهندسية إلى مسارات حركية دقيقة لأدوات القطع.

## أهم 4 أكواد حركية لا غنى عنها لأي فني مشغل:

### 1. الكود G00 (الحركة السريعة في الفراغ - Rapid Traverse)
يُستخدم لتحريك العدة بأقصى سرعة للماكينة من نقطة الصفر إلى نقطة بداية التشغيل دون ملامسة المعدن.
* **تحذير هام:** لا تستخدم G00 أبداً أثناء ملامسة قطعة العمل لتفادي كسر أداة القطع والماكينة!

### 2. الكود G01 (التغذية الخطية - Linear Interpolation)
يُستخدم للقطع في خط مستقيم بالسرعة المحددة بواسطة المعامل \`F\` (Feed rate).

\`\`\`gcode
; قطع خطي من نقطة X0 Y0 إلى X50 Y20 بتغذية 150 مم/دقيقة
G00 X0.0 Y0.0 Z5.0
G01 Z-2.0 F50.0 M08 ; نزول العدة داخل المعدن ببطء
G01 X50.0 Y20.0 F150.0 ; الحركة الخطية للتشكيل
\`\`\`

### 3. الكودان G02 و G03 (القطع الدائري - Circular Interpolation)
* **G02:** دوران في اتجاه عقارب الساعة (Clockwise).
* **G03:** دوران عكس اتجاه عقارب الساعة (Counter-Clockwise).

\`\`\`gcode
; عمل نصف دائرة نصف قطرها 10 مم في اتجاه عقارب الساعة
G02 X30.0 Y10.0 R10.0 F120.0
\`\`\`

## نصيحة احترافية لفنيي الورش:
تأكد دائماً من تفعيل كود إلغاء تعويض نصف قطر العدة \`G40\` في بداية كل برنامج لتجنب ترحيل المقاسات غير المقصود!
    `,
  },
  "five-steps-to-prevent-tool-offsets-errors-on-cnc": {
    title: "5 خطوات لتفادي أخطاء المعايرة (Tool Offsets) وتجنب كسر العدة والماكينة",
    excerpt: "دليل إرشادي للفنيين المبتدئين حول كيفية ضبط قيم تعويض الطول والقطر للعدة (H & D offsets) والتأكد من نقطة الصفر للقطعة بشكل آمن.",
    author: "م. طارق الهواري",
    content: `
# كيفية تجنب حوادث اصطدام ماكينات الـ CNC (Tool Crash Prevention)

تُعد أخطاء إدخال أرقام المعايرة وتعويضات الطول (Tool Length Offsets) السبب رقم 1 لحوادث اصطدام الماكينات في الورش المصرية، وهو ما قد يكلف المصنع آلاف الجنيهات في صيانة الـ Spindle.

## الخطوات الخمس الذهبية للأمان:

1. **التأكد من نظافة حامل العدة (Tool Holder & Collet):**
   أي رايش أو شوائب داخل المخروط (Taper) يؤدي لإمالة العدة واختلاف طولها الحقيقي عن المسجل في الشاشة.
2. **استخدام جهاز المعايرة (Z-Axis Tool Setter أو الورقة):**
   عند ضبط طول العدة يدوياً باستخدام ورقة (سماكة 0.05 مم)، لا تنسَ إضافة أو طرح سماكة الورقة من قيمة الـ Offset النهائية.
3. **مراجعة جدول الأدوات في الشاشة (Tool Table Check):**
   تأكد أن العدة رقم \`T1\` تأخذ تعويض الطول \`H1\` وتعويض القطر \`D1\`. الخطأ الشائع هو كتابة \`T1 M06\` ثم استدعاء \`G43 H2\`.
4. **التشغيل التجريبي في الهواء (Dry Run & Single Block):**
   قبل تشغيل القطعة الأولى، ارفع إحداثي الـ \`Z\` بمقدار 50 مم لأعلى وشغل البرنامج بنمط الخطوة خطوة (\`Single Block\`) مع مراقبة المسار والشاشة.
5. **استخدام زر التغذية البطيئة (Feed Override):**
   اجعل البكرة على 10% أو 25% عند اقتراب العدة من قطعة العمل في أول تجربة ليكون لديك وقت كافٍ للضغط على زر الطوارئ (\`E-Stop\`).
    `,
  },
  "mastercam-vs-solidcam-cnc-software-comparison": {
    title: "مقارنة شاملة بين برامج التصميم والبرمجة CAM: Mastercam مقابل SolidCAM في مصر",
    excerpt: "تحليل نقطي لمميزات وعيوب أشهر برامج الـ CAM المستخدمة في الورش المصرية، وأيهما أفضل لتشغيل قوالب الاسطمبات مقابل الأجزاء الدقيقة.",
    author: "م. سارة محمود (تصميم CAD/CAM)",
    content: `
# Mastercam أم SolidCAM: أيهما تختار لورشتك؟

يحتار الكثير من أصحاب المصانع ومهندسي الإنتاج في اختيار برنامج الكام (CAM Software) الأنسب لطبيعة شغلهم. في السوق المصري، يسيطر عملاقان على هذا المجال: **Mastercam** و **SolidCAM**.

## 1. برنامج Mastercam (عملاق الخراطة والفرايز التقليدي)
* **المميزات:**
  * الأكثر انتشاراً في الورش المصرية، مما يعني سهولة العثور على مبرمجين محترفين.
  * قوي جداً في مسارات التشكيل المعقدة 3D Surface Machining وقوالب الاسطمبات.
  * يمتلك تقنية **Dynamic Motion** التي تطيل عمر العدة وتقلل زمن التشغيل بنسبة تصل لـ 50%.
* **العيوب:** واجهة المستخدم تحتاج لوقت أطول في التعلم مقارنة بالبرامج المدمجة.

## 2. برنامج SolidCAM (قوة التكامل مع SolidWorks)
* **المميزات:**
  * يعمل كإضافة مدمجة بالكامل داخل برنامج SolidWorks الشهير للتصميم.
  * يتميز بتقنية **iMachining** الثورية التي تحسب سرعات القطع تلقائياً بناءً على نوع المعدن والعدة وقوة الماكينة.
  * ممتاز جداً لأجزاء الإنتاج الكمي (Production Parts).
* **العيوب:** يتطلب أجهزة كمبيوتر بمواصفات عالية ورامات قوية للتعامل مع التجميعات الكبيرة.

## الخلاصة وتوصية HIREX CNC:
إذا كان مصنعك متخصصاً في **اسطمبات البلاستيك والصاج**، فإن **Mastercam** هو خيارك الأقوى. أما إذا كنت تصمم وتنتج **أجزاء ميكانيكية وتجميعات معقدة** داخل SolidWorks، فإن **SolidCAM** سيوفر عليك وقتاً خيالياً في البرمجة.
    `,
  },
  "cnc-machinist-salaries-egyptian-industrial-zones-2026": {
    title: "دليل أجور ورواتب فنيي ومهندسي الـ CNC في المناطق الصناعية بمصر لعام 2026",
    excerpt: "دراسة تفصيلية لمتوسط الرواتب في العاشر من رمضان، 6 أكتوبر، والعبور حسب سنوات الخبرة (فني مشغل، مبرمج، مهندس تصميم، ومشرف صيانة).",
    author: "فريق أبحاث HIREX CNC",
    content: `
# متوسط رواتب وأجور عمالة الـ CNC في السوق المصري 2026

مع التوسع الهائل في التصنيع المحلي وزيادة الطلب على التصدير، تشهد أجور الكوادر الفنية الماهرة في مجال الـ CNC ارتفاعاً ملحوظاً. نقدم في هذا التقرير متوسطات الرواتب الشهرية بناءً على بيانات التوظيف الفعلية في منصة **HIREX CNC**.

## جدول الرواتب التقديرية حسب المسمى الوظيفي والخبرة:

| المسمى الوظيفي | خبرة مبتدئ (1-3 سنوات) | خبرة متوسطة (3-6 سنوات) | خبير / مشرف (+7 سنوات) |
| :--- | :--- | :--- | :--- |
| **فني مشغل مخرطة / فريزة (Operator)** | 6,500 - 8,500 ج.م | 9,000 - 12,000 ج.م | 13,000 - 16,000 ج.م |
| **فني ضبط وتشغيل (Setter & Operator)** | 8,500 - 11,000 ج.م | 12,500 - 16,000 ج.م | 17,000 - 22,000 ج.م |
| **مبرمج كام (CAM Programmer - Mastercam/PowerMILL)** | 12,000 - 15,000 ج.م | 16,000 - 22,000 ج.م | 25,000 - 35,000+ ج.م |
| **مهندس صيانة ميكانيكية وهيدروليك CNC** | 10,000 - 13,000 ج.م | 15,000 - 20,000 ج.م | 24,000 - 32,000 ج.م |

## فروق الرواتب حسب المنطقة الصناعية:
* **العاشر من رمضان و 6 أكتوبر:** تتمتع بأعلى متوسطات أجور نظراً لوجود المصانع الكبرى متعددة الجنسيات، مع توفير بدائل انتقالات ووجبات.
* **العبور وبدر:** تقترب من المتوسط العام مع الاعتماد بشكل أكبر على نظام الحوافز والإنتاجية.

*ملاحظة: الرواتب المذكورة لا تشمل حوافز الإنتاج، الأوفر تايم (Overtime)، أو التأمين الطبي والعائلي الذي توفره المصانع الموثقة بالمنصة.*
    `,
  },
  "daily-weekly-preventive-maintenance-for-cnc-machines": {
    title: "الصيانة الوقائية اليومية والأسبوعية لماكينات الـ CNC لتفادي الأعطال وتوقف الإنتاج",
    excerpt: "جدول عملي للمراجعة اليومية (فحص مستويات الزيوت، تنظيف الفلاتر، معايرة ضغط الهيدروليك) للحفاظ على العمر الافتراضي ودقة الماكينة.",
    author: "م. عصام حجازي (صيانة هيدروليك)",
    content: `
# دليل الصيانة الوقائية (Preventive Maintenance) لورش الـ CNC

توقف ماكينة الـ CNC المفاجئ أثناء خط الإنتاج يُعد كابوساً لأي مدير مصنع. الالتزام بجدول صيانة دوري بسيط يقلل من الأعطال الطارئة بنسبة تتجاوز 85% ويحافظ على دقة الميكرومتر للماكينة.

## 1. الفحص اليومي (يقوم به مشغل الماكينة في بداية الوردية):
* **فحص مستوى زيت التزليق (Way Lube Oil):** التأكد من عدم فراغ الخزان لأن جفافه يؤدي لتآكل الفرش (Guide ways) وضرب إنذار طوارئ.
* **مراجعة مستوى وتركيز سائل التبريد (Coolant):** استخدام جهاز الرفراكتومتر (Refractometer) لضمان أن نسبة الزيت للماء بين 8% و 10% لمنع صدأ الفرش وبكتيريا الروائح الكريهة.
* **تنظيف حوض الرايش (Chip Conveyor):** إزالة الرايش المتراكم لتفادي انسداد طلمبة سائل التبريد.
* **فحص ضغط هيدروليك ظرف المخرطة (Chuck Pressure):** التأكد من عداد الضغط لضمان إمساك القطعة بإحكام بأمان.

## 2. الفحص الأسبوعي (يجريه مشرف الورشة أو فني الصيانة):
1. تنظيف فلاتر كبائن الكهرباء والتهوية (Electrical Cabinet Filters) لمنع ارتفاع حرارة كروت الدريفات (Drives).
2. فحص تشحيم ظرف المخرطة (Greasing Chuck Jaws) وفك اللقم وتنظيف مجاريها.
3. التأكد من خلو هواء الكمبروسور من الرطوبة والمياه عبر تفريغ مصايد المياه (Air Moisture Traps).

الاستثمار 15 دقيقة يومياً في الصيانة الوقائية يوفر عليك آلاف الجنيهات في قطع الغيار وأسابيع من تعطل الإنتاج!
    `,
  },
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
    const seedArticle = SEED_ARTICLES_MAP[slug];
    if (seedArticle) {
      return {
        title: `${seedArticle.title} | HIREX CNC Egypt`,
        description: seedArticle.excerpt,
      };
    }
    return {
      title: "مقال غير موجود | HIREX CNC Egypt",
      description: "المقال المطلوب قراءته غير متوفر أو تم حذفه.",
    };
  }

  return {
    title: `${post.title} | HIREX CNC Egypt`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://hirexcnc.eg/blog/${post.slug}`,
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

  // 3. في حال عدم وجود المقال في قاعدة البيانات، استخدام البيانات المرجعية الكاملة للمحاكاة
  if (!post) {
    const seedArticle = SEED_ARTICLES_MAP[slug];
    if (!seedArticle) {
      return notFound();
    }
    post = {
      id: `post-mock-${slug}`,
      title: seedArticle.title,
      slug,
      excerpt: seedArticle.excerpt,
      createdAt: MOCK_DATE,
      updatedAt: MOCK_DATE,
      coverImage: null,
      published: true,
      authorId: "mock-author",
      author: { name: seedArticle.author },
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogImage: null,
      content: seedArticle.content,
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <PublicNavbar />
      <div className="flex-1 bg-slate-50 dark:bg-slate-950/40 py-10 text-right font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* رابط العودة للمقالات */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/60 hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرجوع لجميع المقالات</span>
            </Link>
          </div>

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
  </div>
);
}
