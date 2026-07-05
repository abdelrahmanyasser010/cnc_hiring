// src/app/api/jobs/route.ts
// مسار API لجلب وإضافة الوظائف.
// في Next.js، الـ API Routes هي Serverless Functions تعمل عند الطلب فقط.

import { NextResponse } from "next/server";
import { jobRepo } from "@/infrastructure/container";

// GET: جلب الوظائف النشطة لعرضها للفنيين في تطبيق الموبايل
export async function GET() {
  try {
    const jobs = await jobRepo.getActiveJobsForApi();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: "فشل في جلب البيانات من الخادم" },
      { status: 500 }
    );
  }
}

// POST: إضافة وظيفة جديدة من لوحة أصحاب المصانع
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      controlRequired, 
      location, 
      experienceMin, 
      experienceMax, 
      salaryMin, 
      salaryMax, 
      description,
      employerId 
    } = body;
    
    // التحقق من الحقول الأساسية
    if (!title || !controlRequired || !location || !employerId) {
      return NextResponse.json(
        { success: false, error: "يرجى ملء جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }
    
    // حفظ الوظيفة في PostgreSQL عبر الـ repository
    const newJob = await jobRepo.createJob({
      title,
      controlRequired,
      location,
      experienceMin: Number(experienceMin),
      experienceMax: Number(experienceMax),
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      hideSalary: false,
      description: description || "",
      employerId,
    });
    
    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: "فشل في حفظ الوظيفة في قاعدة البيانات" },
      { status: 500 }
    );
  }
}
