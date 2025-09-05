import pino from 'pino';
import { loggerBaseConfig } from './config';
import type { Logger as PinoLogger, LoggerOptions } from 'pino';
import type { ServiceLoggerConfig } from './interfaces';

export function createBaseLogger(config: ServiceLoggerConfig): PinoLogger {
  const baseConfig: Partial<LoggerOptions> = loggerBaseConfig();

  const finalConfig: LoggerOptions = Object.freeze({
    ...baseConfig,
    name: config.workspace,
    level: config.level,
    base: {
      ...(baseConfig as LoggerOptions).base,
      service: config.service,
      workspace: config.workspace,
      pid: process.pid,
      hostname: process.env.HOSTNAME || 'unknown',
      ...config.additionalContext,
    },
  });

  return pino(finalConfig);
}
