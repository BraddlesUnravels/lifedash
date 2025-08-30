import { BuildCacheKey, CreateLoggerCache, ValidateConfig, FactoryBuilder } from './helpers';
import type { AppLogger, LoggerCache, FactoryLoggerConfig, LoggerKey } from './interfaces';

// immutable cache of loggers
let loggerCache: LoggerCache = CreateLoggerCache();

export const clearLoggerCache = (): void => {
  loggerCache = CreateLoggerCache();
};

/** Factory to create or retrieve a cached logger instance. */
export const LoggerFactory = Object.freeze({
  create: (config: FactoryLoggerConfig): AppLogger => {
    ValidateConfig(config);
    return FactoryBuilder(config);
  },
  singleton: (config: FactoryLoggerConfig): AppLogger => {
    const key: LoggerKey = BuildCacheKey(config);
    if (!loggerCache.has(key)) {
      const logger = LoggerFactory.create(config);
      loggerCache = new Map(loggerCache).set(key, Object.freeze(logger));
      return logger;
    }
    return loggerCache.get(key)!;
  },
  reset: (): void => clearLoggerCache(),
} as const);
