// src/app/(dashboard)/admin/referrals/page.tsx
// شاشة إدارة طلبات الترشيح المباشر (Direct Referrals) من إدارة المنصة.
// تتيح للمسؤول مراجعة طلبات المصانع، الفرز حسب الصناعة والماكينات، وتحديث الحالة.

export const dynamic = "force-dynamic";

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { employerRepo } from "@/infrastructure/container";
import ReferralsManagementClient, { ReferralItem } from "./ReferralsManagementClient";

export default async function AdminReferralsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  let requests: ReferralItem[] = [];

  try {
    const rawRequests = await employerRepo.getAllReferralRequests();
    requests = rawRequests.map((r) => ({
      id: r.id,
      employerId: r.employerId,
      industry: r.industry,
      jobTitle: r.jobTitle,
      machinesNeeded: r.machinesNeeded,
      experienceYears: r.experienceYears,
      governorate: r.governorate,
      salaryRange: r.salaryRange,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt,
      employer: {
        id: r.employer.id,
        companyName: r.employer.companyName,
        industryZone: r.employer.industryZone,
        user: {
          phoneNumber: r.employer.user.phoneNumber,
          email: r.employer.user.email,
        },
      },
    }));
  } catch (error) {
    console.warn("Database failed to load referral requests. Falling back to mock referrals.", error);
    // Mock requests for offline / demo environments
    requests = [
      {
        id: "ref-1",
        employerId: "emp-mock-1",
        industry: "الإسطمبات والفرم",
        jobTitle: "فني فريزة CNC مبرمج 5 محاور",
        machinesNeeded: "DMG MORI DMU 50, Heidenhain TNC 640",
        experienceYears: 5,
        governorate: "الشرقية",
        salaryRange: "14000 - 18000 ج.م",
        notes: "نحتاج كفاءة عالية في تصنيع إسطمبات حقن البلاستيك والتشطيب الدقيق بالـ CAM.",
        status: "PENDING",
        createdAt: "2026-11-24T10:00:00.000Z",
        employer: {
          id: "emp-mock-1",
          companyName: "شركة الدلتا للصناعات الهندسية والإسطمبات",
          industryZone: "العاشر من رمضان",
          user: {
            phoneNumber: "01099887766",
            email: "hr@delta-molds.com",
          },
        },
      },
      {
        id: "ref-2",
        employerId: "emp-mock-2",
        industry: "الصناعات والمستلزمات الطبية",
        jobTitle: "مشغل ومبرمج مخارط سويسرية دقيقة (Swiss Turn)",
        machinesNeeded: "Citizen Cincom, Star Micronics, Fanuc",
        experienceYears: 3,
        governorate: "القاهرة",
        salaryRange: "12000 - 16000 ج.م",
        notes: "تصنيع مسامير وشرائح عظام وتجهيزات جراحية مع دقة ميكرونية وتسامحات حرجة.",
        status: "MATCHING",
        createdAt: "2026-11-22T14:30:00.000Z",
        employer: {
          id: "emp-mock-2",
          companyName: "المتحدة للغرسات والمستلزمات الطبية",
          industryZone: "مدينة بدر",
          user: {
            phoneNumber: "01122334455",
            email: "factory@united-medical.com",
          },
        },
      },
      {
        id: "ref-3",
        employerId: "emp-mock-3",
        industry: "صناعة الطيران",
        jobTitle: "مهندس تشغيل وبرمجة تيتانيوم وإنكونيل",
        machinesNeeded: "Mazak Integrex, Mazatrol / Mastercam",
        experienceYears: 6,
        governorate: "حلوان",
        salaryRange: "20000 - 25000 ج.م",
        notes: "تشغيل معادن فائقة الصلابة وفق متطلبات الجودة الصارمة ومسارات قطع متقدمة.",
        status: "NOMINATED",
        createdAt: "2026-11-19T08:30:00.000Z",
        employer: {
          id: "emp-mock-3",
          companyName: "المصرية لمهمات الطيران والصناعات الدقيقة",
          industryZone: "حلوان",
          user: {
            phoneNumber: "01234567890",
            email: "procurement@aero-egypt.com",
          },
        },
      },
      {
        id: "ref-4",
        employerId: "emp-mock-4",
        industry: "صناعة المسبوكات والأجزاء الثقيلة",
        jobTitle: "فني تشغيل مخرطة CNC رأسية VTL قطع ثقيلة",
        machinesNeeded: "Doosan Puma VTL, Fanuc 0i-TF",
        experienceYears: 7,
        governorate: "الجيزة",
        salaryRange: "13500 - 17000 ج.م",
        notes: "خراطة وتجهيز شفة الأنابيب وبلوكات المحركات الزهر والصلب الكربوني.",
        status: "HIRED",
        createdAt: "2026-11-14T11:00:00.000Z",
        employer: {
          id: "emp-mock-4",
          companyName: "مسبك الجيزة للصناعات الثقيلة",
          industryZone: "6 أكتوبر",
          user: {
            phoneNumber: "01011223344",
            email: "production@giza-foundry.com",
          },
        },
      },
      {
        id: "ref-5",
        employerId: "emp-mock-5",
        industry: "صناعة الإسطمبات والفرم",
        jobTitle: "فني ماكينة سلك وتآكل بالشرارة Wire EDM Sodick",
        machinesNeeded: "Sodick AG600L, Charmilles Roboform",
        experienceYears: 4,
        governorate: "الشرقية",
        salaryRange: "10000 - 13500 ج.م",
        notes: "قطع إسطمبات تفريغ دقيقة وتشكيل زوايا حادة متناهية الصغر.",
        status: "PENDING",
        createdAt: "2026-11-23T16:20:00.000Z",
        employer: {
          id: "emp-mock-5",
          companyName: "الأمل للصناعات الهندسية وتصنيع الفرم",
          industryZone: "العاشر من رمضان",
          user: {
            phoneNumber: "01244556677",
            email: "jobs@alamal-dies.com",
          },
        },
      },
      {
        id: "ref-6",
        employerId: "emp-mock-6",
        industry: "صناعات تشغيل وتشكيل الألواح والصاج",
        jobTitle: "مشغل فايبر ليزر وبلازما قص ألواح سميكة",
        machinesNeeded: "Bystronic 10kW Fiber, CNC Plasma",
        experienceYears: 3,
        governorate: "المنوفية",
        salaryRange: "9000 - 12000 ج.م",
        notes: "تجهيز وتوزيع ألواح الصلب (Nesting) وضبط فوّهات الليزر والغازات المساعدة.",
        status: "MATCHING",
        createdAt: "2026-11-21T09:15:00.000Z",
        employer: {
          id: "emp-mock-6",
          companyName: "العربي جروب للهياكل المعدنية والتشغيل",
          industryZone: "قويسنا الصناعية",
          user: {
            phoneNumber: "01088776655",
            email: "hr@elaraby-fab.com",
          },
        },
      },
      {
        id: "ref-7",
        employerId: "emp-mock-7",
        industry: "صناعة الصمامات وتجهيزات خطوط الأنابيب",
        jobTitle: "فني ضبط وتجهيز فريزة 3 محاور VMC أجزاء صمامات",
        machinesNeeded: "Haas VF-4, Haas NGC Control",
        experienceYears: 4,
        governorate: "القاهرة",
        salaryRange: "11000 - 14500 ج.م",
        notes: "تم إغلاق الطلب بعد تعيين الفني المرشح بنجاح وتوقيع العقد.",
        status: "CLOSED",
        createdAt: "2026-11-10T12:00:00.000Z",
        employer: {
          id: "emp-mock-7",
          companyName: "النيل لتجهيزات البترول والصمامات الهندسية",
          industryZone: "مدينة بدر",
          user: {
            phoneNumber: "01155667788",
            email: "ops@nilevalves.com",
          },
        },
      },
      {
        id: "ref-8",
        employerId: "emp-mock-8",
        industry: "صناعة قطع غيار السيارات والمركبات",
        jobTitle: "مشرف عام ورشة تشغيل ميكانيكي وتوزيع أحمال",
        machinesNeeded: "مخارط وفرايز متعددة المحاور",
        experienceYears: 8,
        governorate: "الإسكندرية",
        salaryRange: "16000 - 21000 ج.م",
        notes: "إدارة خطوط إنتاج وتعيير جودة الأبعاد وقياس التفاوتات CMM.",
        status: "NOMINATED",
        createdAt: "2026-11-17T15:45:00.000Z",
        employer: {
          id: "emp-mock-8",
          companyName: "مصنع الإسكندرية للمحاور والتروس الدقيقة",
          industryZone: "برج العرب الجديدة",
          user: {
            phoneNumber: "01033221144",
            email: "factory@alexgears.com",
          },
        },
      },
    ];
  }

  return (
    <ReferralsManagementClient initialRequests={requests} />
  );
}
