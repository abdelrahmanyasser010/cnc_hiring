// src/application/services/NotificationService.ts
// Core Service: Notification dispatch via injected INotificationProvider (ADR-004)
// ✅ CLEAN: No SDK imports — depends only on INotificationProvider port
//
// All callers (Server Actions, matching engine) MUST use this service.
// Direct calls to sendWhatsApp / sendEmail are FORBIDDEN outside Infrastructure.

import type {
  INotificationProvider,
  WhatsAppPayload,
  EmailPayload,
  NotificationResult,
} from "@/application/ports/INotificationProvider";
import type { ILoggerService } from "@/application/ports/ILoggerService";

export class NotificationService {
  constructor(
    private readonly provider: INotificationProvider,
    private readonly logger?: ILoggerService
  ) {}

  async sendWhatsApp(payload: WhatsAppPayload): Promise<NotificationResult> {
    try {
      const result = await this.provider.sendWhatsApp(payload);
      if (result.success) {
        this.logger?.info(`[Notification] WhatsApp sent to ${payload.to}`, { messageId: result.messageId });
      } else {
        this.logger?.warn(`[Notification] WhatsApp failed for ${payload.to}: ${result.error}`);
      }
      return result;
    } catch (error) {
      this.logger?.error("[Notification] Unexpected error sending WhatsApp", error, { to: payload.to });
      return { success: false, error: "Unexpected notification error" };
    }
  }

  async sendEmail(payload: EmailPayload): Promise<NotificationResult> {
    try {
      const result = await this.provider.sendEmail(payload);
      if (result.success) {
        this.logger?.info(`[Notification] Email sent to ${payload.to}`, { subject: payload.subject });
      } else {
        this.logger?.warn(`[Notification] Email failed for ${payload.to}: ${result.error}`);
      }
      return result;
    } catch (error) {
      this.logger?.error("[Notification] Unexpected error sending email", error, { to: payload.to });
      return { success: false, error: "Unexpected notification error" };
    }
  }
}
