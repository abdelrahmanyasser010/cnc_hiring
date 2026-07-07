import { jobRepo } from "@/infrastructure/container";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  Users, 
  Cpu, 
  MoreVertical,
  AlertCircle
} from "lucide-react";

export default async function JobsPage() {
  
  const jobs = await jobRepo.getJobsForDashboard();

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header section with Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة إعلانات الوظائف</h1>
          <p className="text-sm text-foreground/60">أنشئ إعلانات توظيف جديدة لمصنعك وتابع المتقدمين وفلترة مهاراتهم آلياً.</p>
        </div>
        
        <Link 
          href="/jobs/new" 
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة وظيفة جديدة</span>
        </Link>
      </div>

      {/* Info Alert about active plan */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-4 flex items-start gap-3 justify-end dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400">
        <div className="text-right flex-1">
          <h4 className="text-sm font-semibold">باقة الاشتراك الفضية</h4>
          <p className="text-xs mt-1 text-blue-700 dark:text-blue-500">
            أنت مشترك في الباقة الفضية التي تتيح لك نشر وظائف غير محدودة وتصفية ذكية للمتقدمين.
          </p>
        </div>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-foreground/50">
            <div className="text-4xl mb-4">💼</div>
            <p className="text-sm font-semibold mb-2">لا توجد إعلانات وظائف منشورة حالياً</p>
            <p className="text-xs mb-6">اضغط على زر (إضافة وظيفة جديدة) للبدء في توظيف الفنيين لمصنعك.</p>
            <Link 
              href="/jobs/new" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
            >
              <Plus className="w-4 h-4" />
              <span>أنشئ إعلانك الأول الآن</span>
            </Link>
          </div>
        ) : (
          jobs.map((job) => {
            const salaryText = job.hideSalary 
              ? "يحدد في المقابلة" 
              : `${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()} ج.م`;

            const statusColor = job.status === "ACTIVE"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";

            const statusText = job.status === "ACTIVE" ? "نشط" : "مغلق";

            return (
              <div 
                key={job.id} 
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Right: Job details */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/5 border border-border rounded-xl text-primary hidden sm:block">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-base md:text-lg hover:text-primary transition-colors cursor-pointer">
                        {job.title}
                      </h3>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    
                    {/* Meta details with chips */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-foreground/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-foreground/40" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-4 h-4 text-foreground/40" />
                        كنترول: {job.controlRequired}
                      </span>
                      <span className="flex items-center gap-1">
                        💵 الراتب: {salaryText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Left: Stats & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                  {/* Applicants counter */}
                  <div className="flex items-center gap-2 text-right">
                    <div className="text-left md:text-right">
                      <div className="font-bold text-base">{job.applicationsCount} فني</div>
                      <div className="text-[10px] text-foreground/50">تقدموا على الوظيفة</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/jobs/${job.id}/applications`}
                      className="px-4 py-2 border border-border hover:bg-secondary/5 font-semibold rounded-xl text-xs transition-all text-primary hover:border-primary/50 text-center"
                    >
                      المتقدمين
                    </Link>
                    <button className="p-2 border border-border hover:bg-secondary/5 rounded-xl transition-all">
                      <MoreVertical className="w-4 h-4 text-foreground/60" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
