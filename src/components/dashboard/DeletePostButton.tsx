// src/components/dashboard/DeletePostButton.tsx
"use client";

import React, { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/app/actions/blog";

interface DeletePostButtonProps {
  id: string;
}

export default function DeletePostButton({ id }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const proceed = confirm(
      "⚠️ هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟\nسيتم إزالة المقال بالكامل من قاعدة البيانات وتحديث كاش الموقع ولا يمكن التراجع عن هذا الإجراء."
    );
    
    if (proceed) {
      startTransition(async () => {
        const res = await deletePostAction(id);
        if (!res.success) {
          alert(res.error || "حدث خطأ أثناء محاولة حذف المقال.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="حذف المقال"
    >
      {isPending ? (
        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin block"></span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
