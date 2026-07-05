// src/lib/db.ts
// ملف تهيئة عميل قاعدة البيانات (Prisma Client) بنظام الـ Singleton.
// في بيئة التطوير، يعيد Next.js بناء الملفات مع كل تعديل، والـ Singleton يمنع إنشاء اتصالات متكررة بقاعدة البيانات تنهك السيرفر.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
