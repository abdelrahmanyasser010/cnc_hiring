"use client";

// src/app/blog/BlogClientView.tsx
// واجهة المدونة التفاعلية للمستخدمين مع دعم الفلترة حسب الفئة والبحث المباشر ودعم ثنائي اللغة بالكامل (مستوحى من hirecnc.com).

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowLeft, ArrowRight, Search, Clock, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  createdAt: string | Date;
  category?: string;
  author: {
    name: string;
  };
}

interface BlogClientViewProps {
  initialPosts: BlogPostItem[];
}

export function BlogClientView({ initialPosts }: BlogClientViewProps) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const CATEGORIES = [
    { id: "ALL", ar: "جميع المقالات", en: "All Articles" },
    { id: "CASE_STUDIES", ar: "دراسات حالة المصانع", en: "Shop Case Studies" },
    { id: "MACHINING", ar: "تشغيل وبرمجة CNC", en: "CNC Machining & CAM" },
    { id: "JOB_MARKET", ar: "سوق العمل والرواتب", en: "Job Market & Wages" },
    { id: "MAINTENANCE", ar: "الصيانة ومعايير الجودة", en: "Maintenance & Quality" },
  ];

  // Helper to categorize seed/db posts based on slug/title
  const getPostCategory = (post: BlogPostItem) => {
    const text = (post.title + " " + post.slug).toLowerCase();
    if (text.includes("salaries") || text.includes("أجور") || text.includes("رواتب")) return "JOB_MARKET";
    if (text.includes("maintenance") || text.includes("صيانة") || text.includes("معايرة")) return "MAINTENANCE";
    if (text.includes("case") || text.includes("مقارنة") || text.includes("دراسة")) return "CASE_STUDIES";
    return "MACHINING";
  };

  const filteredPosts = initialPosts.filter((post) => {
    const postCategory = getPostCategory(post);
    const matchesCategory = selectedCategory === "ALL" || postCategory === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = initialPosts[0];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950/40 py-12 font-sans text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? "مدونة تشغيل وبرمجة الـ CNC في مصر" : "Field Intelligence & Articles for CNC Machining"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            {isAr ? "أبحاث التشغيل ودراسات حالة المصانع" : "Shop Floor Insights & Machine Studies"}
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            {isAr 
              ? "مقالات تقنية، دراسات رواتب ميدانية في المناطق الصناعية، وشروحات هندسية لرفع كفاءة ماكينات الـ CNC وتقليل زمن دورة التشغيل (Cycle Time)."
              : "Technical articles, industrial wage reports across Egyptian manufacturing hubs, and engineering guides to optimize CNC cycle times."}
          </p>
        </div>

        {/* Search & Categories Bar (Inspired by hirecnc.com/blog) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-border/80 py-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary/10 hover:bg-secondary/20 text-foreground/75"
                }`}
              >
                {isAr ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث في المقالات والتقارير..." : "Search articles & studies..."}
              className="w-full bg-card border border-border rounded-xl ps-9 pe-4 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Featured Spotlight Card (If showing all and search is empty) */}
        {selectedCategory === "ALL" && !searchQuery.trim() && featuredPost && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
            <div className="grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 p-6 sm:p-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isAr ? "دراسة ميدانية مميزة" : "Featured Field Report"}</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
                  <bdi>{featuredPost.title}</bdi>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-5 text-xs text-slate-400 pt-2 font-mono">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-400" />
                    <span>{featuredPost.author.name}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? "6 دقائق قراءة" : "6 min read"}</span>
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/30"
                  >
                    <span>{isAr ? "قراءة التقرير بالكامل" : "Read Full Report"}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 h-64 md:h-full min-h-[260px] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPost.coverImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-16 text-center text-foreground/40 border border-border rounded-2xl bg-card space-y-2">
            <div className="text-sm font-semibold">
              {isAr ? "لم نجد مقالات تطابق معايير البحث." : "No articles found matching your criteria."}
            </div>
            <p className="text-xs text-foreground/50">
              {isAr ? "يرجى تجربة كلمات بحث أخرى أو اختيار تصنيف مختلف." : "Try adjusting your search terms or selecting another category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-full group"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-primary/80 flex items-center justify-center p-6 text-center text-white font-bold text-sm">
                      {post.title}
                    </div>
                  )}
                  <div className="absolute top-3 end-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-sky-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {getPostCategory(post) === "JOB_MARKET" && (isAr ? "سوق العمل" : "Job Market")}
                    {getPostCategory(post) === "MAINTENANCE" && (isAr ? "صيانة وجودة" : "Maintenance")}
                    {getPostCategory(post) === "CASE_STUDIES" && (isAr ? "دراسة حالة" : "Case Study")}
                    {getPostCategory(post) === "MACHINING" && (isAr ? "برمجة وتشغيل" : "Machining")}
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  
                  {/* Author and Date */}
                  <div className="flex items-center gap-4 text-[11px] text-foreground/50 font-medium font-mono">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary/70" />
                      <span className="truncate max-w-[140px]">{post.author?.name || (isAr ? "خبير تشغيل" : "Machining Specialist")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <bdi>{post.title}</bdi>
                    </h3>
                    <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read Article CTA Link */}
                  <div className="pt-2 border-t border-border/50">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group-hover:gap-2.5 transition-all cursor-pointer"
                    >
                      <span>{isAr ? "اقرأ المقال كاملاً" : "Read Full Article"}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </Link>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
