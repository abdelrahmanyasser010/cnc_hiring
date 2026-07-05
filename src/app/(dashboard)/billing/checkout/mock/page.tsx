// src/app/(dashboard)/billing/checkout/mock/page.tsx
// صفحة محاكاة بوابة الدفع Paymob التفاعلية (Sandbox / Mock Mode)

"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function MockCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "chk_mock_123456";
  const amount = searchParams.get("amount") || "2500";
  const currency = searchParams.get("currency") || "EGP";
  const description = searchParams.get("description") || "ترقية اشتراك منصة hireCNC - الباقة الاحترافية";
  const planId = searchParams.get("planId") || "pro";

  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "fawry">("card");
  const [cardNumber, setCardNumber] = useState("4000 0000 0000 0002");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [walletPhone, setWalletPhone] = useState("01012345678");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSimulatePayment = async (success: boolean) => {
    setIsLoading(true);
    setStatusMessage(success ? "جاري معالجة الدفع الآمن عبر Paymob..." : "جاري محاكاة فشل العملية...");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (success) {
      const webhookUrl = `/api/webhooks/paymob?id=mock_txn_${Date.now()}&order_id=${encodeURIComponent(
        orderId
      )}&success=true&amount_cents=${Number(amount) * 100}&currency=${currency}&planId=${encodeURIComponent(
        planId
      )}&isMock=true&signature=mock_signature`;
      router.push(webhookUrl);
    } else {
      router.push(`/billing?status=failed&reason=${encodeURIComponent("تم إلغاء أو رفض عملية الدفع من قبل البنك")}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 dir-rtl" dir="rtl">
      {/* رأس المحاكاة */}
      <div className="max-w-xl w-full mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-500/30 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          بوضع المحاكاة الذكي (Paymob Sandbox Mode)
        </div>
        <h1 className="text-2xl font-bold text-white">بوابة الدفع الآمنة (Paymob Simulator)</h1>
        <p className="text-slate-400 text-sm mt-1">
          يمكنك اختبار دورة الدفع، تفعيل الباقات الحية، وإصدار الفواتير دون الحاجة لمفاتيح بنكية حقيقية الآن.
        </p>
      </div>

      <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* ملخص الطلب */}
        <div className="bg-slate-800 p-6 border-b border-slate-700/80 flex justify-between items-center">
          <div>
            <span className="text-xs text-slate-400 font-mono block">رقم الطلب: {orderId}</span>
            <h2 className="text-lg font-bold text-white mt-0.5">{description}</h2>
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-400 block">المبلغ المطلوب</span>
            <span className="text-2xl font-extrabold text-emerald-400">
              {Number(amount).toLocaleString("ar-EG")} <span className="text-sm">{currency}</span>
            </span>
          </div>
        </div>

        {/* اختيار طريقة الدفع */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">اختر وسيلة الدفع التجريبية:</label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "card"
                  ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                  : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <span className="text-xl">💳</span>
              <span>بطاقة بنكية / ميزة</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("wallet")}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "wallet"
                  ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                  : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <span className="text-xl">📱</span>
              <span>محفظة إلكترونية</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("fawry")}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === "fawry"
                  ? "bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm"
                  : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <span className="text-xl">🏪</span>
              <span>كود فوري (Fawry)</span>
            </button>
          </div>

          {/* نماذج الدفع التجريبية */}
          {paymentMethod === "card" && (
            <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">رقم البطاقة (Test Card Number)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">تاريخ الانتهاء (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">رمز الأمان (CVV)</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "wallet" && (
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
              <label className="block text-xs text-slate-400 mb-1 font-medium">رقم الهاتف المرتبط بالمحفظة (فودافون / أورانج / اتصالات / إنستا باي)</label>
              <input
                type="text"
                value={walletPhone}
                onChange={(e) => setWalletPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-2">في الوضع التجريبي، سيتم محاكاة وصول إشعار تأكيد الدفع للمحفظة فوراً.</p>
            </div>
          )}

          {paymentMethod === "fawry" && (
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 text-center">
              <span className="text-xs text-slate-400 block mb-1">كود الدفع الفوري التجريبي:</span>
              <span className="text-3xl font-mono font-bold text-amber-400 tracking-wider">928 410 335</span>
              <p className="text-xs text-slate-400 mt-2">يمكنك الضغط على زر الدفع الناجح بالأسفل لمحاكاة قيام العميل بالدفع في ماكينة فوري.</p>
            </div>
          )}

          {statusMessage && (
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm text-center font-medium animate-pulse">
              {statusMessage}
            </div>
          )}

          {/* أزرار الإجراءات التجريبية */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSimulatePayment(true)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>✅</span>
              <span>تأكيد ومحاكاة الدفع الناجح (Simulate Payment Success)</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSimulatePayment(false)}
              className="w-full bg-slate-700/80 hover:bg-rose-600/30 hover:border-rose-500/50 hover:text-rose-300 border border-slate-600 text-slate-300 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>❌</span>
              <span>محاكاة فشل أو رفض العملية (Simulate Failure)</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/billing"
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              إلغاء والعودة لصفحة الفواتير والاشتراكات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">جاري تحميل بوابة المحاكاة...</div>}>
      <MockCheckoutContent />
    </Suspense>
  );
}
