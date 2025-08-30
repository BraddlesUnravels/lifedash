import pino from 'pino';
import { DateTime } from 'luxon';
import type { Logger, LoggerOptions } from 'pino';
import type { ServiceLoggerConfig } from './interfaces';

export function createLogger(config: ServiceLoggerConfig): Logger {
  const isDev = process.env.NODE_ENV !== 'production';
  const level = config.level || (isDev ? 'debug' : 'info');

  const pinoConfig: LoggerOptions = {
    name: config.service,
    level,
    // Base context for all logs
    base: {
      service: config.service,
      module: config.module || 'default',
      pid: process.pid,
      hostname: process.env.HOSTNAME || 'unknown',
      ...config.additionalContext,
    },
    // Development friendly format
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: `[{service}:{module}] {msg}`,
          singleLine: false,
        },
      },
    }),
    timestamp: () => `,"time":"${DateTime.utc().toISO()}"`,
    // Production format
    formatters: isDev
      ? undefined
      : {
          level: (label) => ({ level: label.toUpperCase() }),
        },
    // Standard serializers for errors and requests
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },

    ...(!isDev && {
      redact: ['password', 'email', 'cookie', 'req.headers.authorization', 'req.headers.cookie'],
    }),
  };

  return pino(pinoConfig);
}
