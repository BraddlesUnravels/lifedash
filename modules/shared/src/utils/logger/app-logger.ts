import type { Logger as PinoLogger } from 'pino';
import type { AppLogger, AppContext, EcoSystem_OPs } from './interfaces';

/**
 * Decorates a Pino logger with domain-specific helper methods.
 * All methods return new child loggers - never mutate the original.
 */
export function createAppLogger(base: PinoLogger): AppLogger {
  const withCtx = (ctx: Partial<AppContext>): AppLogger => createAppLogger(base.child(ctx));

  const withOp = (operation: EcoSystem_OPs, extra?: Record<string, unknown>): AppLogger =>
    withCtx(extra ? { operation, ...extra } : { operation });

  const forUser = (userId: string, extra?: Record<string, unknown>): AppLogger =>
    withCtx(extra ? { userId, ...extra } : { userId });

  const forDom = (
    module: string,
    moduleId: string | number,
    extra?: Record<string, unknown>,
  ): AppLogger =>
    withCtx({
      module,
      moduleId,
      ...(extra || {}),
    });

  const forRequest = (requestId: string, extra?: Record<string, unknown>): AppLogger =>
    withCtx(extra ? { requestId, ...extra } : { requestId });

  const forSession = (sessionId: string, extra?: Record<string, unknown>): AppLogger =>
    withCtx(extra ? { sessionId, ...extra } : { sessionId });

  const forIp = (ip: string, extra?: Record<string, unknown>): AppLogger =>
    withCtx(extra ? { ip, ...extra } : { ip });

  // Create a new object that properly implements AppLogger
  const appLogger: AppLogger = {
    ...base,
    ctx: withCtx,
    op: withOp,
    user: forUser,
    domain: forDom,
    request: forRequest,
    session: forSession,
    ip: forIp,
  } as AppLogger;

  return appLogger;
}
