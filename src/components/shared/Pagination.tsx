// src/components/shared/Pagination.tsx
"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // لا نعرض شريط التصفح إذا كان هناك صفحة واحدة فقط أو أقل
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // إنشاء مصفوفة أرقام الصفحات لعرضها
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // أقصى عدد أزرار أرقام يظهر في نفس الوقت
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div dir="rtl" className="flex items-center justify-center gap-2 mt-8 py-4">
      {/* زر الصفحة السابقة */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-border bg-card rounded-xl text-foreground/60 hover:text-foreground hover:bg-secondary/5 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:pointer-events-none cursor-pointer"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* أرقام الصفحات */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-10 h-10 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              currentPage === pageNum
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border bg-card text-foreground/75 hover:bg-secondary/5"
            }`}
          >
            {pageNum.toLocaleString("ar-EG")}
          </button>
        ))}
      </div>

      {/* زر الصفحة التالية */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-border bg-card rounded-xl text-foreground/60 hover:text-foreground hover:bg-secondary/5 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:pointer-events-none cursor-pointer"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
