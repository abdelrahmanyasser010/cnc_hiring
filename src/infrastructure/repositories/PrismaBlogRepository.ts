// src/infrastructure/repositories/PrismaBlogRepository.ts
// Adapter: Prisma implementation of IBlogRepository

import { db } from "@/lib/db";
import type { IBlogRepository, BlogPostData } from "@/application/ports/IBlogRepository";

export class PrismaBlogRepository implements IBlogRepository {
  async findUniqueBySlug(slug: string): Promise<{ id: string } | null> {
    return db.post.findUnique({
      where: { slug },
      select: { id: true },
    });
  }

  async findUniqueById(id: string): Promise<{ id: string; slug: string; title: string; coverImage: string | null; published: boolean } | null> {
    return db.post.findUnique({
      where: { id },
      select: { id: true, slug: true, title: true, coverImage: true, published: true },
    });
  }

  async findFirstBySlugNotId(slug: string, id: string): Promise<{ id: string } | null> {
    return db.post.findFirst({
      where: { slug, id: { not: id } },
      select: { id: true },
    });
  }

  async create(data: BlogPostData): Promise<{ id: string; title: string; slug: string }> {
    return db.post.create({
      data,
      select: { id: true, title: true, slug: true },
    });
  }

  async update(id: string, data: Partial<BlogPostData>): Promise<{ id: string; title: string; slug: string }> {
    return db.post.update({
      where: { id },
      data,
      select: { id: true, title: true, slug: true },
    });
  }

  async delete(id: string): Promise<void> {
    await db.post.delete({ where: { id } });
  }

  async findAll(): Promise<unknown[]> {
    return db.post.findMany({
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllPublished(): Promise<unknown[]> {
    return db.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findFullBySlug(slug: string): Promise<unknown | null> {
    return db.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
  }

  async findFullById(id: string): Promise<unknown | null> {
    return db.post.findUnique({
      where: { id },
    });
  }
}
