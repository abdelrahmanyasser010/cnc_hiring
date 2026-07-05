"use client";

import React, { useState } from "react";
import { updateCandidateAvailability } from "@/app/actions/candidate";
import { Loader2 } from "lucide-react";

export default function AvailabilityToggle({ initialStatus }: { initialStatus: boolean }) {
  const [isAvailable, setIsAvailable] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAvailability = async () => {
    setIsLoading(true);
    const newStatus = !isAvailable;
    const res = await updateCandidateAvailability(newStatus);
    
    if (res.success) {
      setIsAvailable(newStatus);
    } else {
      alert(res.error || "فشل التحديث");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
      <div>
        <div className="font-bold">{isAvailable ? "متاح للعمل" : "غير متاح حالياً"}</div>
        <div className={`text-xs ${isAvailable ? 'text-green-500' : 'text-red-500'} font-semibold mt-1`}>
          {isAvailable ? "يتم عرض ملفك للمصانع" : "ملفك مخفي عن المصانع"}
        </div>
      </div>
      
      <button 
        onClick={toggleAvailability}
        disabled={isLoading}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <span 
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailable ? '-translate-x-6' : '-translate-x-1'}`} 
        />
        {isLoading && <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white animate-spin mix-blend-difference" />}
      </button>
    </div>
  );
}
