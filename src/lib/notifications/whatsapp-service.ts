// src/lib/notifications/whatsapp-service.ts
// مرسل إشعارات الواتساب (WhatsApp Service Driver).
// يعمل بنظام التجريد (Interface-based) ويدعم عدة مزودين (Twilio / Ultramsg / Console Simulator).

import { NotificationProvider } from "./types";

// 1. مزود خدمة المحاكاة (Console Logger Simulator)
class ConsoleNotificationProvider implements NotificationProvider {
  async sendWhatsApp(to: string, message: string) {
    const timestamp = new Date().toISOString();
    console.log(`\n⚡ [WhatsApp API Simulator] [${timestamp}]`);
    console.log(`📱 إرسال إلى: ${to}`);
    console.log(`💬 نص الرسالة: \n"${message}"`);
    console.log(`✅ حالة الإرسال: تم الإرسال بنجاح (Simulation Mode)\n`);
    
    return { 
      success: true, 
      id: `sim-id-${Math.random().toString(36).substr(2, 9)}` 
    };
  }
}

// 2. مزود الخدمة الحقيقي الأول (Twilio API Driver - عبر بروتوكول HTTP مباشر لسرعة الأداء)
class TwilioNotificationProvider implements NotificationProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
    this.authToken = process.env.TWILIO_AUTH_TOKEN || "";
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || "";
  }

  async sendWhatsApp(to: string, message: string) {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn("⚠️ مفاتيح Twilio غير متوفرة في الملف البيئي .env، يتم التحويل للمحاكي تلقائياً.");
      return new ConsoleNotificationProvider().sendWhatsApp(to, message);
    }

    try {
      // تنسيق رقم الهاتف ليطابق المعايير الدولية (مصر مفتاح البلد 20)
      let formattedTo = to.trim().replace(/[\s-+]/g, "");
      if (formattedTo.startsWith("01")) {
        formattedTo = `20${formattedTo.slice(1)}`;
      }
      if (!formattedTo.startsWith("+")) {
        formattedTo = `+${formattedTo}`;
      }

      // تنسيق رقم المرسل (رقم Twilio المعتمد)
      let formattedFrom = this.fromNumber.trim().replace(/[\s-+]/g, "");
      if (!formattedFrom.startsWith("+")) {
        formattedFrom = `+${formattedFrom}`;
      }

      // تشفير الـ Basic Auth
      const authString = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${authString}`,
          },
          body: new URLSearchParams({
            From: `whatsapp:${formattedFrom}`,
            To: `whatsapp:${formattedTo}`,
            Body: message,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && (data.sid || data.status === "queued" || data.status === "sent")) {
        return { success: true, id: data.sid };
      }

      return { 
        success: false, 
        error: data.message || data.error_message || "فشل إرسال الرسالة عبر بوابة Twilio" 
      };
    } catch (err) {
      console.error("Error sending via Twilio:", err);
      return { success: false, error: (err as Error).message || "خطأ أثناء الاتصال ببوابة Twilio" };
    }
  }
}

// 3. مزود الخدمة الحقيقي الثاني (Ultramsg API Driver)
class UltramsgNotificationProvider implements NotificationProvider {
  private instanceId: string;
  private token: string;

  constructor() {
    this.instanceId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.token = process.env.WHATSAPP_ACCESS_TOKEN || "";
  }

  async sendWhatsApp(to: string, message: string) {
    if (!this.instanceId || !this.token) {
      console.warn("⚠️ مفاتيح Ultramsg غير متوفرة في الملف البيئي .env، يتم التحويل للمحاكي تلقائياً.");
      return new ConsoleNotificationProvider().sendWhatsApp(to, message);
    }

    try {
      let formattedTo = to.trim().replace(/[\s-+]/g, "");
      if (formattedTo.startsWith("01")) {
        formattedTo = `20${formattedTo.slice(1)}`;
      }

      const response = await fetch(
        `https://api.ultramsg.com/${this.instanceId}/messages/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token: this.token,
            to: formattedTo,
            body: message,
          }),
        }
      );

      const data = await response.json();

      if (data.sent === "true" || data.success) {
        return { success: true, id: data.id };
      }

      return { 
        success: false, 
        error: data.error || "فشل إرسال الرسالة عبر بوابة Ultramsg" 
      };
    } catch (err) {
      console.error("Error sending via Ultramsg:", err);
      return { success: false, error: (err as Error).message || "خطأ أثناء الاتصال بالبوابة" };
    }
  }
}

// 4. اختيار مشغل الإرسال الفعال تلقائياً بناءً على المتغيرات البيئية المتوفرة
const getActiveProvider = (): NotificationProvider => {
  // الأولوية لـ Twilio إذا توفرت مفاتيحها
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    return new TwilioNotificationProvider();
  }

  // استخدام Ultramsg كخيار ثاني
  if (
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
    process.env.WHATSAPP_ACCESS_TOKEN
  ) {
    return new UltramsgNotificationProvider();
  }

  // الافتراضي هو المحاكي المحلي
  return new ConsoleNotificationProvider();
};

export const notificationProvider: NotificationProvider = getActiveProvider();

// 5. تصدير دالة إرسال الرسائل الرئيسية
export const sendWhatsApp = async (to: string, message: string) => {
  return notificationProvider.sendWhatsApp(to, message);
};
export default sendWhatsApp;
