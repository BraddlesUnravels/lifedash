import timestamp from '../../timestamp';
import type { LoggerOptions } from 'pino';

export const envOptions: Partial<LoggerOptions> = {
  level: 'debug' as const,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: `[{name}:{module}] {msg}`,
      singleLine: false,
    },
  },
  timestamp: () => `, "time":"${timestamp.present(new Date(), 'timeOnly')}"`,
};
