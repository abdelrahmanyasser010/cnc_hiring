import React from "react";
import { redirect } from "next/navigation";
import { candidateRepo } from "@/infrastructure/container";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { candidateLogoutAction } from "@/app/actions/candidate";
import { LogOut, User, MapPin, Briefcase, Phone } from "lucide-react";
import AvailabilityToggle from "./AvailabilityToggle";

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const candidate = await candidateRepo.findProfileByUserId(session.user.id);

  if (!candidate) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">الملف الشخصي</h1>
        <form action={candidateLogoutAction}>
          <button type="submit" className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
              <User className="w-5 h-5 text-primary" />
              البيانات الأساسية
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-foreground/50 mb-1">الاسم</div>
                  <div className="font-bold">{candidate.user.name}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/50 mb-1">رقم الهاتف</div>
                  <div className="font-bold dir-ltr text-right flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> {candidate.user.phoneNumber ?? "غير متوفر"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground/50 mb-1">الموقع</div>
                  <div className="font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> {candidate.governorate} - {candidate.city}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground/50 mb-1">الخبرة</div>
                  <div className="font-bold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> {candidate.experienceYears} سنوات
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">حالة الإتاحة للعمل</h2>
            <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
              تحديدك كـ &quot;متاح للعمل&quot; يسمح لأصحاب المصانع برؤية ملفك وإرسال طلبات المقابلة إليك. عطل هذا الخيار إذا كنت تعمل حالياً ولا تبحث عن وظيفة.
            </p>
            
            <AvailabilityToggle initialStatus={candidate.isAvailable} />
          </div>
        </div>
      </div>
    </div>
  );
}
