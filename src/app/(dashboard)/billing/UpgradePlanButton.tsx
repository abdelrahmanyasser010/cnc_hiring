// src/app/(dashboard)/billing/UpgradePlanButton.tsx
// زر ترقية الباقة المتصل بـ Checkout API وبوابة الدفع Paymob

"use client";

import React, { useState } from "react";

interface UpgradePlanButtonProps {
  planId: string;
  amount: number;
  label: string;
  isPrimary?: boolean;
}

export function UpgradePlanButton({ planId, amount, label, isPrimary = false }: UpgradePlanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "فشل بدء جلسة الدفع");
        setLoading(false);
        return;
      }
      // التوجيه التلقائي إلى رابط بوابة Paymob أو صفحة المحاكاة (Sandbox)
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Upgrade error:", err);
      setError("حدث خطأ في الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 ${
          isPrimary
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span>جاري تجهيز بوابة الدفع...</span>
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="text-[11px] text-destructive text-center font-medium">{error}</p>}
    </div>
  );
}
