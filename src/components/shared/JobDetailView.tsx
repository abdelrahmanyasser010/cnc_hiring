// src/components/shared/JobDetailView.tsx
"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Cpu, 
  Calendar, 
  DollarSign, 
  Building2, 
  Briefcase, 
  ArrowRight,
  FileText,
  X,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import ScreeningForm from "./ScreeningForm";
import { CONTROL_LABELS } from "@/lib/constants";

export interface ScreeningQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number;
}

export interface JobData {
  id: string;
  title: string;
  controlRequired: string;
  location: string;
  experienceMin: number;
  experienceMax: number;
  salaryMin: number | string;
  salaryMax: number | string;
  hideSalary: boolean;
  description: string;
  createdAt: string | Date;
  employer: {
    companyName: string;
    industryZone: string;
    address: string;
    isVerified: boolean;
  };
  screeningQuestions: ScreeningQuestion[];
}

interface JobDetailViewProps {
  job: JobData;
}

export default function JobDetailView({ job }: JobDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedSalary = job.hideSalary
    ? "يحدد في المقابلة"
    : `${Number(job.salaryMin).toLocaleString("ar-EG")} - ${Number(job.salaryMax).toLocaleString("ar-EG")} ج.م`;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-6 py-12 text-right">
      
      {/* 1. زر الرجوع ورأس الصفحة */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground/60 hover:text-primary transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </Link>
      </div>

      {/* 2. البطاقة التعريفية العلوية (Header Card) */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-primary via-sky-500 to-primary"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-foreground/60">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-foreground/40" />
                <span>{job.employer.companyName}</span>
                {job.employer.isVerified && (
                  <CheckCircle className="w-3.5 h-3.5 fill-primary text-white shrink-0" />
                )}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-foreground/40" />
                {job.employer.industryZone}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 cursor-pointer text-center whitespace-nowrap"
          >
            التقديم الفوري للوظيفة ⚡
          </button>
        </div>
      </div>

      {/* 3. تفاصيل الوظيفة والشروط (Layout Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* العمود الأيمن الكبير: وصف الوظيفة وبيانات المنشأة (8 أعمدة) */}
        <div className="lg:col-span-8 space-y-6">
          {/* وصف الوظيفة */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-foreground/90 flex items-center gap-2 border-b border-border pb-3">
              <FileText className="w-5 h-5 text-primary" />
              <span>تفاصيل ومتطلبات الوظيفة</span>
            </h3>
            
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* بيانات صاحب العمل */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-foreground/90 flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <span>عن المصنع / جهة التوظيف</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-foreground/75">
              <div className="space-y-1">
                <span className="text-foreground/40 block text-[10px]">اسم المنشأة</span>
                <span className="text-sm font-bold text-foreground">{job.employer.companyName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/40 block text-[10px]">المنطقة الصناعية</span>
                <span className="text-sm font-bold text-foreground">{job.employer.industryZone}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-foreground/40 block text-[10px]">العنوان بالتفصيل</span>
                <span className="text-sm font-bold text-foreground">{job.employer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الأيسر الصغير: معلومات سريعة كارت (4 أعمدة) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h4 className="font-bold text-sm text-foreground/90 border-b border-border pb-2.5">
            ملخص متطلبات التوظيف
          </h4>
          
          <div className="space-y-4 text-xs font-semibold text-foreground/75">
            
            {/* الكنترول المطلوبة */}
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="text-foreground/40 block text-[10px]">الكنترول المطلوب</span>
                <span className="text-sm font-bold text-foreground">
                  {CONTROL_LABELS[job.controlRequired] || job.controlRequired}
                </span>
              </div>
            </div>

            {/* سنوات الخبرة */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="text-foreground/40 block text-[10px]">سنوات الخبرة المطلوبة</span>
                <span className="text-sm font-bold text-foreground">
                  من {job.experienceMin.toLocaleString("ar-EG")} إلى {job.experienceMax.toLocaleString("ar-EG")} سنة
                </span>
              </div>
            </div>

            {/* الراتب المتوقع */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="text-foreground/40 block text-[10px]">الراتب الشهري</span>
                <span className="text-sm font-bold text-foreground">{formattedSalary}</span>
              </div>
            </div>

            {/* طبيعة العمل */}
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-0.5">
                <span className="text-foreground/40 block text-[10px]">نوع الوظيفة</span>
                <span className="text-sm font-bold text-foreground">دوام كامل (موقع العمل)</span>
              </div>
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              تقديم الطلب الفني
            </button>
          </div>
        </div>

      </div>

      {/* 4. نافذة التقييم المنبثقة (Screening Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 z-50 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg bg-secondary/10 border border-border text-foreground/40 hover:text-foreground hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Screening Quiz Form Wrapper */}
            <ScreeningForm 
              jobId={job.id} 
              questions={job.screeningQuestions} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}

    </div>
  );
}
