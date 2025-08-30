import timestamp from '../../timestamp';
import type { LoggerOptions } from 'pino';

export const envOptions: Partial<LoggerOptions> = {
  level: 'info' as const,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  redact: ['password', 'email', 'cookie', 'req.headers.authorization', 'req.headers.cookie'],
  timestamp: () => `, "time":"${timestamp.machine('iso')}"`,
};
