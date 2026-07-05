// src/lib/matching.ts
// نظام المطابقة الذكية: يفرز الكوادر الفنية المتاحة التي تطابق متطلبات الوظيفة المنشورة حديثاً
// ويُرسل إشعارات واتساب تلقائية لكل فني مطابق.

import { db } from "@/lib/db";
import { notificationService } from "@/infrastructure/container";

// خريطة المناطق الصناعية وأقرب محافظاتها لتحديد الفنيين المناسبين جغرافياً
const ZONE_TO_GOVERNORATES: Record<string, string[]> = {
  "العاشر من رمضان":     ["الشرقية", "القاهرة", "القليوبية"],
  "6 أكتوبر":            ["الجيزة", "القاهرة"],
  "العبور":              ["القليوبية", "القاهرة"],
  "بدر":                 ["القاهرة", "الشرقية"],
  "السادات":             ["المنوفية", "القليوبية"],
  "برج العرب الجديدة":  ["الإسكندرية"],
  "أبو رواش":            ["الجيزة"],
  "قويسنا الصناعية":    ["المنوفية"],
};

// واجهة بيانات الوظيفة المطلوبة لعملية المطابقة
interface JobForMatching {
  id: string;
  title: string;
  location: string;
  controlRequired: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number | { toNumber: () => number };
  salaryMax: number | { toNumber: () => number };
  hideSalary: boolean;
  employer: {
    companyName: string;
  };
}

// دالة مساعدة لتحويل Decimal أو Number للعدد الصحيح
const toNum = (val: number | { toNumber: () => number }): number => {
  if (typeof val === "number") return val;
  return val.toNumber();
};

// الدالة الرئيسية: تنفيذ المطابقة وإرسال الإشعارات
export async function runJobMatching(job: JobForMatching): Promise<void> {
  try {
    console.log(`\n🧠 [Smart Matching] بدء المطابقة للوظيفة: "${job.title}"`);

    // 1. تحديد المحافظات القريبة من موقع الوظيفة
    const targetGovernorates =
      ZONE_TO_GOVERNORATES[job.location] ||
      Object.values(ZONE_TO_GOVERNORATES).flat(); // إذا المنطقة غير مدرجة، نوسع النطاق

    // 2. جلب الفنيين المطابقين من قاعدة البيانات
    const matchingCandidates = await db.candidateProfile.findMany({
      where: {
        isAvailable: true,
        experienceYears: {
          gte: job.experienceMin,
          lte: job.experienceMax + 3,
        },
        governorate: {
          in: targetGovernorates,
        },
        machines: {
          some: {
            machineType: {
              name: { contains: job.controlRequired },
            },
          },
        },
      },
      select: {
        id: true,
        governorate: true,
        experienceYears: true,
        user: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
      take: 50,
    });

    if (matchingCandidates.length === 0) {
      console.log(`ℹ️ [Smart Matching] لم يتم العثور على كوادر مطابقة للوظيفة "${job.title}"`);
      return;
    }

    console.log(`✅ [Smart Matching] تم العثور على ${matchingCandidates.length} كادر مطابق`);

    // 3. تحضير نص الرسالة
    const salaryText = job.hideSalary
      ? "يحدد في المقابلة"
      : `${toNum(job.salaryMin).toLocaleString("ar-EG")} - ${toNum(job.salaryMax).toLocaleString("ar-EG")} ج.م`;

    const jobUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/jobs/${job.id}`;

    // 4. إرسال رسائل واتساب لكل فني مطابق
    const sendPromises = matchingCandidates.map(async (candidate: { id: string; user: { name: string | null; phoneNumber: string | null }; governorate: string; experienceYears: number }) => {
      const phone = candidate.user.phoneNumber;
      const name = candidate.user.name ?? "الفني";
      if (!phone) return;
      const message = `مرحباً ${name} 👋

تم نشر وظيفة جديدة مطابقة لخبرتك!

💼 المسمى: ${job.title}
🏭 المصنع: ${job.employer.companyName}
📍 الموقع: ${job.location}
🎛️ الكنترول: ${job.controlRequired}
💰 الراتب: ${salaryText}

للتقديم الفوري اضغط الرابط:
${jobUrl}

منصة hireCNC Egypt ⚙️
أول منصة متخصصة في توظيف كوادر التشغيل بمصر`;

      try {
        const result = await notificationService.sendWhatsApp({ to: phone, message });
        if (result.success) {
          console.log(`📲 [Matching] تم إرسال الإشعار لـ ${name} (${phone})`);
        }
      } catch (err) {
        console.error(`❌ [Matching] فشل إرسال الإشعار لـ ${name}:`, err);
      }
    });

    await Promise.allSettled(sendPromises);
    console.log(`🎉 [Smart Matching] اكتمل إرسال ${matchingCandidates.length} إشعار للوظيفة "${job.title}"\n`);

  } catch (error) {
    // نسجل الخطأ لكن لا نوقف عملية نشر الوظيفة
    console.error("❌ [Smart Matching] خطأ أثناء تنفيذ المطابقة:", error);
  }
}
