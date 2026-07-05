// src/infrastructure/adapters/WhatsAppNotificationAdapter.ts
// Adapter: INotificationProvider implementation using Twilio / Ultramsg / Console fallback
// ✅ LEGITIMATE: Only file allowed to import WhatsApp/Email SDKs / HTTP clients
// Extracted and refactored from src/lib/notifications/whatsapp-service.ts

import type {
  INotificationProvider,
  WhatsAppPayload,
  NotificationResult,
} from "@/application/ports/INotificationProvider";

// ─── Internal helper: format Egyptian phone numbers ───────────────────────────
function formatEgyptianPhone(raw: string): string {
  let num = raw.trim().replace(/[\s\-+]/g, "");
  if (num.startsWith("01")) num = `20${num.slice(1)}`;
  if (!num.startsWith("+")) num = `+${num}`;
  return num;
}

// ─── Console Fallback (Development / Missing Credentials) ─────────────────────
async function sendViaConsole(to: string, message: string): Promise<NotificationResult> {
  console.log(`\n⚡ [WhatsApp Simulator] → ${to}`);
  console.log(`💬 ${message.slice(0, 120)}...`);
  return { success: true, messageId: `sim-${Date.now()}` };
}

// ─── Twilio Driver ─────────────────────────────────────────────────────────────
async function sendViaTwilio(to: string, message: string): Promise<NotificationResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

  const formattedTo = formatEgyptianPhone(to);
  let formattedFrom = fromNumber.trim().replace(/[\s\-+]/g, "");
  if (!formattedFrom.startsWith("+")) formattedFrom = `+${formattedFrom}`;

  const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: new URLSearchParams({
        From: `whatsapp:${formattedFrom}`,
        To: `whatsapp:${formattedTo}`,
        Body: message,
      }),
    }
  );

  const data = await response.json();
  if (response.ok && data.sid) {
    return { success: true, messageId: data.sid };
  }
  return { success: false, error: data.message ?? "Twilio error" };
}

// ─── Ultramsg Driver ───────────────────────────────────────────────────────────
async function sendViaUltramsg(to: string, message: string): Promise<NotificationResult> {
  const instanceId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const token = process.env.WHATSAPP_ACCESS_TOKEN!;
  const formattedTo = formatEgyptianPhone(to);

  const response = await fetch(
    `https://api.ultramsg.com/${instanceId}/messages/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, to: formattedTo, body: message }),
    }
  );

  const data = await response.json();
  if (data.sent === "true" || data.success) {
    return { success: true, messageId: data.id };
  }
  return { success: false, error: data.error ?? "Ultramsg error" };
}

// ─── Adapter Implementation ────────────────────────────────────────────────────
export class WhatsAppNotificationAdapter implements INotificationProvider {
  async sendWhatsApp(payload: WhatsAppPayload): Promise<NotificationResult> {
    const { to, message } = payload;

    // Auto-select provider based on available env credentials
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      return sendViaTwilio(to, message);
    }

    if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
      return sendViaUltramsg(to, message);
    }

    return sendViaConsole(to, message);
  }

  async sendEmail(): Promise<NotificationResult> {
    // TODO: Implement via Resend / SMTP in Sprint 3 (Auth Email Verification)
    console.warn("[WhatsAppNotificationAdapter] Email sending not yet implemented.");
    return { success: false, error: "Email adapter not configured" };
  }

  async sendSMS(payload: WhatsAppPayload): Promise<NotificationResult> {
    // SMS falls back to WhatsApp channel for now
    return this.sendWhatsApp(payload);
  }
}
