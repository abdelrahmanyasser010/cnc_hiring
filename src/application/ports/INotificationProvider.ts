// src/application/ports/INotificationProvider.ts
// Port: Notification delivery contract (ADR-004)
// Implementations: Email (Resend), WhatsApp, SMS, InApp

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "SMS" | "IN_APP";

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface WhatsAppPayload {
  to: string; // Egyptian phone: 201XXXXXXXXX
  message: string;
}

export interface SMSPayload {
  to: string;
  message: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface INotificationProvider {
  sendEmail(payload: EmailPayload): Promise<NotificationResult>;
  sendWhatsApp(payload: WhatsAppPayload): Promise<NotificationResult>;
  sendSMS(payload: SMSPayload): Promise<NotificationResult>;
}
