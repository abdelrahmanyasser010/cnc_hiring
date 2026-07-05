// src/infrastructure/adapters/ConsoleLoggerAdapter.ts
// Adapter: Console logger with structured output (ADR-004, Phase 13)
// Swap for Sentry/OpenTelemetry adapter in production

import type { ILoggerService, LogContext } from "@/application/ports/ILoggerService";

export class ConsoleLoggerAdapter implements ILoggerService {
  private readonly isDev = process.env.NODE_ENV !== "production";

  private format(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const correlationId = context?.correlationId ?? "-";
    const base = `[${timestamp}] [${level.toUpperCase()}] [cid:${correlationId}] ${message}`;
    if (context && Object.keys(context).length > 0) {
      return `${base} ${JSON.stringify(context)}`;
    }
    return base;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.debug(this.format("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.format("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.format("warn", message, context));
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(this.format("error", message, context));
    if (error) {
      console.error(error);
    }
  }
}

export const logger = new ConsoleLoggerAdapter();
