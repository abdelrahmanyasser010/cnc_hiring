// src/application/ports/IBlogRepository.ts
// Port: Blog/Post data access contract

export interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  authorId: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
}

export interface IBlogRepository {
  findUniqueBySlug(slug: string): Promise<{ id: string } | null>;
  findUniqueById(id: string): Promise<{ id: string; slug: string; title: string; coverImage: string | null; published: boolean } | null>;
  findFirstBySlugNotId(slug: string, id: string): Promise<{ id: string } | null>;
  create(data: BlogPostData): Promise<{ id: string; title: string; slug: string }>;
  update(id: string, data: Partial<BlogPostData>): Promise<{ id: string; title: string; slug: string }>;
  delete(id: string): Promise<void>;
  findAll(): Promise<unknown[]>;
  findAllPublished(): Promise<unknown[]>;
  findFullBySlug(slug: string): Promise<unknown | null>;
  findFullById(id: string): Promise<unknown | null>;
}
