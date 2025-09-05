import { createBaseLogger } from './base-logger';
import { createAppLogger } from './app-logger';
import type { FactoryLoggerConfig, LoggerCache, LoggerKey, AppLogger } from './interfaces';

export const BuildCacheKey = (config: FactoryLoggerConfig): LoggerKey => {
  const parts: string[] = [config.workspace, config.service];
  // Include domain in cache key if provided
  if (config.domain) {
    parts.push(config.domain);
  }
  return parts.join('-') as LoggerKey;
};

export const CreateLoggerCache = (): LoggerCache => new Map();

export const ValidateConfig = (config: FactoryLoggerConfig): void => {
  if (!config.workspace || !config.service)
    throw new Error('LoggerFactory: Invalid Config - Both workspace & service must be set');
};

export const FactoryBuilder = (config: FactoryLoggerConfig): AppLogger => {
  const pinoLogger = createBaseLogger({
    workspace: config.workspace,
    service: config.service,
    domain: config.domain,
    level: config.level || 'info',
    additionalContext: config.additionalContext,
  });
  return createAppLogger(pinoLogger);
};
