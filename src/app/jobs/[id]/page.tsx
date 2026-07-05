// src/app/jobs/[id]/page.tsx
// صفحة تفاصيل الوظيفة العامة للمتقدمين (Server Component).
// تقوم بجلب تفاصيل الوظيفة وأسئلة التصفية من قاعدة البيانات وتمريرها لمكون العرض التفاعلي.

export const dynamic = "force-dynamic";

import { jobRepo } from "@/infrastructure/container";
import { notFound } from "next/navigation";
import JobDetailView, { JobData } from "@/components/shared/JobDetailView";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let job: JobData | null = null;
  let isMockData = false;

  try {
    const res = await jobRepo.getJobDetails(id);
    if (!res) {
      return notFound();
    }
    // Map database decimal values and types to JobData
    job = {
      id: res.id,
      title: res.title,
      controlRequired: res.controlRequired as "FANUC" | "SIEMENS" | "HEIDENHAIN" | "HAAS" | "MITSUBISHI" | "OTHER",
      location: res.location,
      experienceMin: res.experienceMin,
      experienceMax: res.experienceMax,
      salaryMin: res.salaryMin,
      salaryMax: res.salaryMax,
      hideSalary: res.hideSalary,
      description: res.description ?? "",
      createdAt: res.createdAt,
      employer: {
        companyName: res.employer.companyName,
        industryZone: res.employer.industryZone,
        address: res.employer.address,
        isVerified: res.employer.isVerified,
      },
      screeningQuestions: res.screeningQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    };
  } catch (error) {
    console.warn("Database connection failed, falling back to mock job details.", error);
    isMockData = true;

    // استخدام وظيفة تجريبية في بيئة التطوير المحلية دون قاعدة بيانات نشطة
    job = {
      id: id,
      title: "فني تشغيل مخرطة CNC مبرمج (تجريبي)",
      controlRequired: "FANUC",
      location: "العاشر من رمضان - الشرقية",
      experienceMin: 3,
      experienceMax: 6,
      salaryMin: 9000,
      salaryMax: 12000,
      hideSalary: false,
      description: "نبحث عن فني خراط مخرطة CNC مبرمج محترف للعمل فترتين بمصنعنا بالعاشر من رمضان. المتطلبات: القدرة على قراءة الرسومات الهندسية وتجهيز العدة والتعامل الكامل مع تحكم فانوك (Fanuc)، مع مهارات كتابة وتعديل البرامج على لوحة التحكم مباشرة ومراقبة الجودة.",
      createdAt: "2026-06-26T12:00:00Z",
      employer: {
        companyName: "مصنع النيل لتشغيل المعادن (بيئة تجريبية)",
        industryZone: "العاشر من رمضان",
        address: "قطعة 15، المنطقة الصناعية الثالثة، بجوار السلاب",
        isVerified: true,
      },
      screeningQuestions: [
        {
          id: "q-1",
          question: "أي من أكواد الـ G-code التالية يُسستخدم للتحرك السريع بدون قطع (Rapid Positioning)؟",
          options: ["G00", "G01", "G02", "G03"],
          correctIndex: 0,
        },
        {
          id: "q-2",
          question: "ما هي الحركة الافتراضية لكود G02 في ماكينات الـ CNC؟",
          options: ["حركة خطية", "حركة دائرية مع عقارب الساعة", "حركة دائرية عكس عقارب الساعة", "توقف مؤقت"],
          correctIndex: 1,
        },
        {
          id: "q-3",
          question: "أي رمز مما يلي يُستخدم في ماكينات الـ CNC لتحديد سرعة دوران عمود الدوران (Spindle Speed)؟",
          options: ["S (سرعة الدوران)", "F (سرعة التغذية)", "T (رقم العدة)", "M (الأوامر المساعدة)"],
          correctIndex: 0,
        },
      ],
    };
  }

  if (!job) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/40">
      {isMockData && (
        <div className="bg-amber-500 text-white font-bold text-xs py-2 px-4 text-center">
          ⚠️ تنبيه بيئة التطوير: يعرض هذا الرابط بيانات وظيفة تجريبية لعدم إمكانية الاتصال بقاعدة البيانات حالياً.
        </div>
      )}
      
      {/* استدعاء المكون التفاعلي وتمرير البيانات */}
      <JobDetailView job={job} />
    </div>
  );
}
