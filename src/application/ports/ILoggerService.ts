// src/application/ports/ILoggerService.ts
// Port: Logging contract (ADR-004, Phase 13)
// Implementations: Console (dev), Structured/Sentry (prod)

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  correlationId?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

export interface ILoggerService {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
}
