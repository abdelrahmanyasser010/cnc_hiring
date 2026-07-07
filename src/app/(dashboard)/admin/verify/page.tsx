// src/app/(dashboard)/admin/verify/page.tsx
// لوحة إدارة توثيق الشركات والمنشآت الصناعية (Server Component).
// مخصصة لمسؤولي النظام (SUPER_ADMIN) لمراجعة السجلات وتفعيل شارات التوثيق.

export const dynamic = "force-dynamic";

import React from "react";
import { employerRepo } from "@/infrastructure/container";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, AlertCircle, FileText } from "lucide-react";
import VerificationRow from "@/components/dashboard/VerificationRow";

interface EmployerWithUser {
  id: string;
  companyName: string;
  industryZone: string;
  address: string;
  commercialRegId: string | null;
  businessLicenseUrl: string | null;
  isVerified: boolean;
  user: {
    name: string | null;
    phoneNumber: string | null;
  };
}

export default async function AdminVerifyPage() {
  // 1. تأكيد الجلسة كـ SUPER_ADMIN إضافي للحماية على مستوى المكون
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let employers: EmployerWithUser[] = [];
  let isMockData = false;

  try {
    // 2. جلب جميع الحسابات المسجلة لأصحاب العمل مع بيانات الاتصال والتوثيق عبر الـ repository
    employers = await employerRepo.findAllEmployersWithUsers() as EmployerWithUser[];
  } catch (error) {
    console.warn("Database failed to load verification requests. Using mock data.", error);
    isMockData = true;

    // بيانات تجريبية لبيئة التطوير المحلية
    employers = [
      {
        id: "emp-mock-1",
        companyName: "مصنع الأمل للهندسة الميكانيكية",
        industryZone: "العاشر من رمضان",
        address: "المنطقة الصناعية الثالثة، خلف السلاب",
        commercialRegId: "CR-992211",
        businessLicenseUrl: "https://placeholder.com/license.pdf",
        isVerified: false,
        user: {
          name: "أحمد مرسي الشرقاوي",
          phoneNumber: "01012345678",
        }
      },
      {
        id: "emp-mock-2",
        companyName: "مسبك الجيزة للحديد والصلب",
        industryZone: "6 أكتوبر",
        address: "المنطقة الصناعية الثانية، بلوك 4",
        commercialRegId: "CR-883344",
        businessLicenseUrl: null,
        isVerified: true,
        user: {
          name: "م. حسام محمود الجيزاوي",
          phoneNumber: "01234567890",
        }
      },
      {
        id: "emp-mock-3",
        companyName: "ورشة النصر لتشكيل المعادن وخراطة الـ CNC",
        industryZone: "العبور",
        address: "المنطقة الصناعية الأولى، بجوار البنك الأهلي",
        commercialRegId: null,
        businessLicenseUrl: null,
        isVerified: false,
        user: {
          name: "شريف جلال البساتيني",
          phoneNumber: "01122334455",
        }
      }
    ];
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-semibold">
            <span>لوحة التحكم</span>
            <span>/</span>
            <span>بوابة الإدارة العليا</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground/90 flex items-center gap-2 mt-1">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span>لوحة إدارة التوثيق والاعتماد</span>
          </h1>
        </div>
      </div>

      {/* تنبيه بيئة التطوير */}
      {isMockData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
          <span>⚙️ تنبيه بيئة التطوير: تم استخدام قائمة شركات تجريبية لعدم إمكانية الاتصال بقاعدة بيانات PostgreSQL حالياً.</span>
        </div>
      )}

      {/* كارت الجدول للمراجعة والتوثيق */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground/90 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>طلبات توثيق حسابات أصحاب العمل</span>
          </h3>
          <span className="text-xs bg-secondary/10 px-2.5 py-0.5 rounded-lg text-foreground/60 font-semibold">
            إجمالي: {employers.length.toLocaleString("ar-EG")} منشأة صناعية
          </span>
        </div>

        {employers.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-foreground/20" />
            <div className="text-sm font-semibold">لا توجد حسابات أصحاب عمل مسجلة بعد</div>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              عند تسجيل منشآت صناعية جديدة للمنصة، ستظهر تفاصيل حساباتهم هنا للمراجعة والتوثيق.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/5 border-b border-border text-foreground/60 text-xs font-bold font-sans">
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4 text-right">المنشأة الصناعية وموقعها</th>
                  <th className="p-4 text-right">مسؤول الاتصال</th>
                  <th className="p-4 text-center w-36">السجل التجاري</th>
                  <th className="p-4 text-center w-32">الحالة الحالية</th>
                  <th className="p-4 text-center w-40">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {employers.map((employer, index) => (
                  <VerificationRow key={employer.id} employer={employer} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
