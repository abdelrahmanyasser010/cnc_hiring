// src/components/dashboard/ArticleEditor.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

// استيراد تنسيقات محرر الماركداون
import "react-markdown-editor-lite/lib/index.css";

// استيراد المحرر ديناميكياً لتجنب مشاكل الـ SSR (Server-Side Rendering) في Next.js
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center border border-border rounded-xl bg-card">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="mr-2 text-xs font-bold text-foreground/60">جاري تحميل محرر المقالات...</span>
    </div>
  ),
});

interface ArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ArticleEditor({ value, onChange, placeholder }: ArticleEditorProps) {
  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };

  return (
    <div className="w-full text-right" dir="rtl">
      <div className="border border-border rounded-xl overflow-hidden bg-card text-foreground shadow-sm">
        <MdEditor
          value={value}
          style={{ height: "450px" }}
          placeholder={placeholder || "اكتب محتوى المقال هنا بصيغة Markdown..."}
          renderHTML={(text) => (
            <div className="p-4 overflow-y-auto h-full text-right dir-rtl markdown-preview">
              <div className="prose dark:prose-invert max-w-none text-right font-sans leading-relaxed text-sm text-foreground/80">
                <ReactMarkdown>
                  {text}
                </ReactMarkdown>
              </div>
            </div>
          )}
          onChange={handleEditorChange}
          view={{ menu: true, md: true, html: true }}
          config={{
            view: {
              menu: true,
              md: true,
              html: true,
            },
            canView: {
              menu: true,
              md: true,
              html: true,
              both: true,
              fullScreen: true,
            },
          }}
        />
      </div>
      <p className="text-[10px] text-foreground/40 mt-1.5 font-medium">
        💡 نصيحة: يمكنك استخدام وسوم Markdown القياسية (مثل # للعناوين، ** للنص العريض، و ``` لكود البرمجة G-code).
      </p>
    </div>
  );
}
