"use server";
// src/presentation/actions/blog.actions.ts
// Server Actions: Blog/CMS operations with SEO fields

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { authorizationService, auditService, blogRepo } from "@/infrastructure/container";
import type { Role, UserStatus } from "@/domain/types";

export interface BlogActionResponse {
  success: boolean;
  error?: string;
  id?: string;
}

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0621-\u064A-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function createPostAction(data: {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}): Promise<BlogActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    const isAdmin = authorizationService.role.isAdmin({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام (SUPER_ADMIN)." };
    }

    if (!data.title || !data.content || !data.excerpt) {
      return { success: false, error: "يرجى ملء جميع الحقول المطلوبة (العنوان، الملخص، المحتوى)." };
    }

    let slug = generateSlug(data.title);
    if (!slug) {
      slug = `post-${Math.random().toString(36).substring(2, 7)}`;
    }

    const existingPost = await blogRepo.findUniqueBySlug(slug);
    if (existingPost) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const newPost = await blogRepo.create({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      published: data.published,
      authorId: session.user.id,
      // SEO Fields
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      canonicalUrl: data.canonicalUrl || null,
      ogImage: data.ogImage || data.coverImage || null,
    });

    await auditService.log({
      actorId: session.user.id,
      action: `تم إنشاء مقال جديد بعنوان: "${data.title}"`,
      entityType: "Post",
      entityId: newPost.id,
      newValue: { title: data.title, published: data.published },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");

    return { success: true, id: newPost.id };
  } catch (error) {
    console.error("[createPostAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء إنشاء المقال، يرجى المحاولة لاحقاً.",
    };
  }
}

export async function updatePostAction(
  id: string,
  data: {
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    published: boolean;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  }
): Promise<BlogActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    const isAdmin = authorizationService.role.isAdmin({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام (SUPER_ADMIN)." };
    }

    const existingPost = await blogRepo.findUniqueById(id);
    if (!existingPost) {
      return { success: false, error: "المقال المطلوب تعديله غير موجود." };
    }

    if (!data.title || !data.content || !data.excerpt) {
      return { success: false, error: "يرجى ملء جميع الحقول المطلوبة (العنوان، الملخص، المحتوى)." };
    }

    let slug = existingPost.slug;
    if (existingPost.title !== data.title) {
      slug = generateSlug(data.title);
      const duplicate = await blogRepo.findFirstBySlugNotId(slug, id);
      if (duplicate) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    await blogRepo.update(id, {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      published: data.published,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      canonicalUrl: data.canonicalUrl || null,
      ogImage: data.ogImage || data.coverImage || null,
    });

    await auditService.log({
      actorId: session.user.id,
      action: `تم تعديل المقال: "${data.title}"`,
      entityType: "Post",
      entityId: id,
      oldValue: { title: existingPost.title, published: existingPost.published },
      newValue: { title: data.title, published: data.published },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${existingPost.slug}`);
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("[updatePostAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تحديث المقال، يرجى المحاولة لاحقاً.",
    };
  }
}

export async function deletePostAction(id: string): Promise<BlogActionResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    const isAdmin = authorizationService.role.isAdmin({
      id: session.user.id,
      role: session.user.role as Role,
      status: session.user.status as UserStatus,
    });

    if (!isAdmin) {
      return { success: false, error: "عذراً، هذا الإجراء يتطلب صلاحية مسؤول النظام (SUPER_ADMIN)." };
    }

    const post = await blogRepo.findUniqueById(id);
    if (!post) {
      return { success: false, error: "المقال المطلوب حذفه غير موجود." };
    }

    await blogRepo.delete(id);

    await auditService.log({
      actorId: session.user.id,
      action: `تم حذف المقال: "${post.title}"`,
      entityType: "Post",
      entityId: id,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("[deletePostAction] error:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء حذف المقال، يرجى المحاولة لاحقاً.",
    };
  }
}
