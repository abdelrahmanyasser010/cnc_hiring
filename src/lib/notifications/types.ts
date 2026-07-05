// src/lib/notifications/types.ts
// واجهة مرسلي الإشعارات (TypeScript Interface).
// تم تصميمها بنمط تجريدي (Abstraction) لربط أي مزود خدمة لاحقاً دون تعديل في الكود الأساسي.

export interface NotificationProvider {
  sendWhatsApp(to: string, message: string): Promise<{ success: boolean; id?: string; error?: string }>;
}
