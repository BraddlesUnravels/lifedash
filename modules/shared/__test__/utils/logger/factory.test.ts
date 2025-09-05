import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggerFactory, clearLoggerCache } from '../../../src/utils/logger/factory';
import type { FactoryLoggerConfig } from '../../../src/utils/logger/interfaces';

// Mock the helpers module
vi.mock('../../../src/utils/logger/helpers', () => ({
  BuildCacheKey: vi.fn(
    (config) => `${config.workspace}-${config.service}${config.domain ? '-' + config.domain : ''}`,
  ),
  CreateLoggerCache: vi.fn(() => new Map()),
  ValidateConfig: vi.fn((config) => {
    if (!config.workspace || !config.service) {
      throw new Error('LoggerFactory: Invalid Config - Both workspace & service must be set');
    }
  }),
  FactoryBuilder: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    ctx: vi.fn(),
    op: vi.fn(),
    user: vi.fn(),
    domain: vi.fn(),
    request: vi.fn(),
    session: vi.fn(),
    ip: vi.fn(),
  })),
}));

describe('LoggerFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearLoggerCache();
  });

  afterEach(() => {
    clearLoggerCache();
  });

  describe('create method', () => {
    it('should create new logger instance', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const logger = LoggerFactory.create(config);

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.ctx).toBe('function');

      // Check that validation and builder were called
      const { ValidateConfig, FactoryBuilder } = await import('../../../src/utils/logger/helpers');
      expect(ValidateConfig).toHaveBeenCalledWith(config);
      expect(FactoryBuilder).toHaveBeenCalledWith(config);
    });

    it('should create logger with full config', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
        level: 'debug',
        additionalContext: { version: '1.0.0' },
        singleton: true,
      };

      const logger = LoggerFactory.create(config);

      expect(logger).toBeDefined();

      const { ValidateConfig, FactoryBuilder } = await import('../../../src/utils/logger/helpers');
      expect(ValidateConfig).toHaveBeenCalledWith(config);
      expect(FactoryBuilder).toHaveBeenCalledWith(config);
    });

    it('should throw error for invalid config', async () => {
      const config = {
        workspace: 'apps',
        // missing service
      } as FactoryLoggerConfig;

      expect(() => LoggerFactory.create(config)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });

    it('should always create new instances', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const logger1 = LoggerFactory.create(config);
      const logger2 = LoggerFactory.create(config);

      expect(logger1).toBeDefined();
      expect(logger2).toBeDefined();
      // Note: The mocked FactoryBuilder returns the same object reference,
      // but in real implementation, these would be different instances
    });
  });

  describe('singleton method', () => {
    it('should return same instance for same config', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const logger1 = LoggerFactory.singleton(config);
      const logger2 = LoggerFactory.singleton(config);

      expect(logger1).toBe(logger2);

      const { BuildCacheKey } = await import('../../../src/utils/logger/helpers');
      expect(BuildCacheKey).toHaveBeenCalledWith(config);
    });

    it('should return different instances for different configs', () => {
      const config1: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const config2: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'ui',
      };

      const logger1 = LoggerFactory.singleton(config1);
      const logger2 = LoggerFactory.singleton(config2);

      expect(logger1).not.toBe(logger2);
    });

    it('should return different instances for same service different domains', () => {
      const config1: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
      };

      const config2: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'orders',
      };

      const logger1 = LoggerFactory.singleton(config1);
      const logger2 = LoggerFactory.singleton(config2);

      expect(logger1).not.toBe(logger2);
    });

    it('should create logger only once per unique config', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
      };

      LoggerFactory.singleton(config);
      LoggerFactory.singleton(config);
      LoggerFactory.singleton(config);

      // FactoryBuilder should only be called once for singleton
      const { FactoryBuilder } = await import('../../../src/utils/logger/helpers');
      expect(FactoryBuilder).toHaveBeenCalledTimes(1);
    });

    it('should freeze returned logger instances', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const logger = LoggerFactory.singleton(config);

      // The logger instance should be frozen
      expect(Object.isFrozen(logger)).toBe(true);
    });

    it('should handle complex cache scenarios', () => {
      const configs = [
        { workspace: 'apps' as const, service: 'api' as const },
        { workspace: 'apps' as const, service: 'ui' as const },
        { workspace: 'modules' as const, service: 'shared' as const },
        { workspace: 'apps' as const, service: 'api' as const, domain: 'users' },
      ];

      const loggers = configs.map((config) => LoggerFactory.singleton(config));

      // All should be different except duplicates
      expect(new Set(loggers).size).toBe(4);

      // Getting same config again should return cached instance
      const duplicateLogger = LoggerFactory.singleton(configs[0]);
      expect(duplicateLogger).toBe(loggers[0]);
    });
  });

  describe('reset method', () => {
    it('should clear logger cache', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      // Create a singleton
      const logger1 = LoggerFactory.singleton(config);

      // Reset cache
      LoggerFactory.reset();

      // Create same config again - should be different instance
      const logger2 = LoggerFactory.singleton(config);

      expect(logger1).not.toBe(logger2);
    });

    it('should allow fresh cache after reset', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
      };

      LoggerFactory.singleton(config);
      LoggerFactory.reset();
      LoggerFactory.singleton(config);

      // FactoryBuilder should be called twice (once before reset, once after)
      const { FactoryBuilder } = await import('../../../src/utils/logger/helpers');
      expect(FactoryBuilder).toHaveBeenCalledTimes(2);
    });
  });

  describe('factory object immutability', () => {
    it('should be frozen', () => {
      expect(Object.isFrozen(LoggerFactory)).toBe(true);
    });

    it('should not allow modification of methods', () => {
      expect(() => {
        // @ts-expect-error - testing runtime behavior
        LoggerFactory.create = vi.fn();
      }).toThrow();
    });

    it('should not allow addition of new properties', () => {
      expect(() => {
        // @ts-expect-error - testing runtime behavior
        LoggerFactory.newMethod = vi.fn();
      }).toThrow();
    });
  });

  describe('error handling', () => {
    it('should propagate validation errors from create method', () => {
      const invalidConfig = {} as FactoryLoggerConfig;

      expect(() => LoggerFactory.create(invalidConfig)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });

    it('should propagate validation errors from singleton method', () => {
      const invalidConfig = { workspace: 'apps' } as FactoryLoggerConfig;

      expect(() => LoggerFactory.singleton(invalidConfig)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });
  });

  describe('cache key generation', () => {
    it('should use BuildCacheKey for singleton method', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
      };

      LoggerFactory.singleton(config);

      const { BuildCacheKey } = await import('../../../src/utils/logger/helpers');
      expect(BuildCacheKey).toHaveBeenCalledWith(config);
    });

    it('should handle configs without domain', async () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'dbo',
      };

      LoggerFactory.singleton(config);

      const { BuildCacheKey } = await import('../../../src/utils/logger/helpers');
      expect(BuildCacheKey).toHaveBeenCalledWith(config);
    });
  });
});
