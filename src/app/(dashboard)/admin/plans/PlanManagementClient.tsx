"use client";

import React, { useState } from "react";
import { PlanDTO } from "@/application/services/AdminPlanService";
import {
  updateAdminPlanAction,
  createAdminPlanAction,
  toggleAdminPlanStatusAction,
} from "@/presentation/actions/admin.plans.actions";
import { Plus, Edit2, CheckCircle2, XCircle, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

interface Props {
  initialPlans: PlanDTO[];
}

export default function PlanManagementClient({ initialPlans }: Props) {
  const [plans, setPlans] = useState<PlanDTO[]>(initialPlans);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanDTO | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceEGP, setPriceEGP] = useState<number>(1000);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [maxActiveJobs, setMaxActiveJobs] = useState<number>(2);
  const [maxPhoneViews, setMaxPhoneViews] = useState<number>(15);
  const [canViewPhone, setCanViewPhone] = useState(true);
  const [canExportData, setCanExportData] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(10);

  const openCreateModal = () => {
    setEditingPlan(null);
    setName("");
    setDescription("اشتراك شهري للمصانع والشركات الصناعية.");
    setPriceEGP(1500);
    setDurationDays(30);
    setMaxActiveJobs(3);
    setMaxPhoneViews(25);
    setCanViewPhone(true);
    setCanExportData(false);
    setSortOrder(10);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: PlanDTO) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || "");
    setPriceEGP(plan.priceEGP);
    setDurationDays(plan.durationDays);
    setMaxActiveJobs(plan.maxActiveJobs);
    setMaxPhoneViews(plan.maxPhoneViews);
    setCanViewPhone(plan.canViewPhone);
    setCanExportData(plan.canExportData);
    setSortOrder(plan.sortOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("save");
    setError(null);
    setSuccessMsg(null);

    try {
      if (editingPlan) {
        const res = await updateAdminPlanAction(editingPlan.id, {
          name,
          description,
          priceEGP: Number(priceEGP),
          durationDays: Number(durationDays),
          maxActiveJobs: Number(maxActiveJobs),
          maxPhoneViews: Number(maxPhoneViews),
          canViewPhone,
          canExportData,
          sortOrder: Number(sortOrder),
        });

        if (!res.success || !res.plan) {
          setError(res.error || "فشل تحديث الباقة");
        } else {
          setPlans((prev) => prev.map((p) => (p.id === res.plan!.id ? res.plan! : p)));
          setSuccessMsg("✅ تم تحديث باقة الاشتراك وأسعارها بنجاح!");
          setIsModalOpen(false);
        }
      } else {
        const res = await createAdminPlanAction({
          name,
          description,
          priceEGP: Number(priceEGP),
          durationDays: Number(durationDays),
          maxActiveJobs: Number(maxActiveJobs),
          maxPhoneViews: Number(maxPhoneViews),
          canViewPhone,
          canExportData,
          sortOrder: Number(sortOrder),
        });

        if (!res.success || !res.plan) {
          setError(res.error || "فشل إنشاء الباقة الجديدة");
        } else {
          setPlans((prev) => [...prev, res.plan!].sort((a, b) => a.sortOrder - b.sortOrder));
          setSuccessMsg("✅ تم إنشاء الباقة الجديدة بنجاح!");
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("حدث خطأ غير متوقع أثناء الحفظ.");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setLoading(`toggle-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await toggleAdminPlanStatusAction(id);
      if (!res.success) {
        setError(res.error || "فشل تغيير حالة الباقة");
      } else {
        setPlans((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: res.isActive! } : p))
        );
        setSuccessMsg("🔄 تم تغيير حالة نشاط الباقة بنجاح!");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      setError("حدث خطأ أثناء تغيير الحالة.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-6 h-6" />
            <span>لوحة الإدارة الحصرية (SUPER_ADMIN)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">إدارة الباقات والتسعير الديناميكي 💎</h1>
          <p className="text-sm text-slate-400 mt-1">
            التحكم المباشر في أسعار الاشتراكات الشهرية، وحدود نشر الوظائف وكشف أرقام الهواتف للمصانع في مصر.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-900/30 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة باقة جديدة</span>
        </button>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col justify-between p-6 rounded-2xl border transition-all ${
              plan.isActive
                ? "bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/50 shadow-lg shadow-slate-950/40"
                : "bg-slate-950/60 border-slate-800/60 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    plan.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {plan.isActive ? "🟢 باقة نشطة وتظهر للمصانع" : "🔴 معطلة ومخفية مؤقتاً"}
                </span>
                <span className="text-xs text-slate-500 font-mono">الترتيب: #{plan.sortOrder}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                {plan.description || "لا يوجد وصف محدد."}
              </p>

              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-6 space-y-3">
                <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-sm text-slate-400 font-medium">السعر الشهري:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {plan.priceEGP.toLocaleString("ar-EG")} <span className="text-xs font-normal text-slate-400">ج.م</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">حد نشر الوظائف:</span>
                  <span className="font-bold text-white">
                    {plan.maxActiveJobs === -1 ? "∞ غير محدود (VIP)" : `${plan.maxActiveJobs} وظائف نشطة`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">حد كشف أرقام الكفاءات:</span>
                  <span className="font-bold text-white">
                    {plan.maxPhoneViews === -1 ? "∞ غير محدود (VIP)" : `${plan.maxPhoneViews} رقم هاتف`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">مدة الاشتراك:</span>
                  <span className="text-slate-300 font-semibold">{plan.durationDays} يوماً</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => openEditModal(plan)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-sm"
              >
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <span>تعديل السعر والحصص</span>
              </button>

              <button
                onClick={() => handleToggleStatus(plan.id)}
                disabled={loading === `toggle-${plan.id}`}
                title={plan.isActive ? "تعطيل الباقة" : "تنشيط الباقة"}
                className={`p-2.5 rounded-xl border transition ${
                  plan.isActive
                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {loading === `toggle-${plan.id}` ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : plan.isActive ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-white space-y-6 animate-scale-up my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-400" />
                <span>{editingPlan ? `تعديل باقة: ${editingPlan.name}` : "إضافة باقة اشتراك جديدة"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">اسم الباقة (مميز ورسمي):</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الباقة الاحترافية (Pro)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">وصف الباقة المميزات:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: الباقة الأكثر طلباً للمصانع المتوسطة والكبيرة لتوظيف الكفاءات بمرونة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">السعر بالجنيه المصري (EGP):</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={priceEGP}
                    onChange={(e) => setPriceEGP(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-emerald-400 font-bold text-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">مدة الاشتراك (بالأيام):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    حد نشر الوظائف النشطة <span className="text-xs text-slate-400">(-1 = غير محدود)</span>:
                  </label>
                  <input
                    type="number"
                    required
                    min="-1"
                    value={maxActiveJobs}
                    onChange={(e) => setMaxActiveJobs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    حد كشف أرقام الهواتف <span className="text-xs text-slate-400">(-1 = غير محدود)</span>:
                  </label>
                  <input
                    type="number"
                    required
                    min="-1"
                    value={maxPhoneViews}
                    onChange={(e) => setMaxPhoneViews(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">ترتيب الظهور في صفحة الفواتير:</label>
                  <input
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canExportData}
                      onChange={(e) => setCanExportData(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>تفعيل صلاحية تصدير البيانات</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading === "save"}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition shadow-lg shadow-emerald-900/40 disabled:opacity-50"
                >
                  {loading === "save" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>حفظ التعديلات ونشرها فوراً</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
