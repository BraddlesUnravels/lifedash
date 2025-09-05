import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BuildCacheKey,
  CreateLoggerCache,
  ValidateConfig,
  FactoryBuilder,
} from '../../../src/utils/logger/helpers';
import type { FactoryLoggerConfig } from '../../../src/utils/logger/interfaces';

describe('Logger Helpers', () => {
  describe('BuildCacheKey', () => {
    it('should build cache key with workspace and service', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const key = BuildCacheKey(config);
      expect(key).toBe('apps-api');
    });

    it('should build cache key with workspace, service, and domain', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
      };

      const key = BuildCacheKey(config);
      expect(key).toBe('modules-shared-logger');
    });

    it('should handle different workspace/service combinations', () => {
      const configs = [
        { workspace: 'apps' as const, service: 'ui' as const },
        { workspace: 'apps' as const, service: 'bgw' as const },
        { workspace: 'modules' as const, service: 'dbo' as const },
      ];

      const keys = configs.map(BuildCacheKey);
      expect(keys).toEqual(['apps-ui', 'apps-bgw', 'modules-dbo']);
      expect(new Set(keys).size).toBe(3); // All unique
    });
  });

  describe('CreateLoggerCache', () => {
    it('should create empty cache', () => {
      const cache = CreateLoggerCache();
      expect(cache).toBeInstanceOf(Map);
      expect(cache.size).toBe(0);
    });

    it('should create independent cache instances', () => {
      const cache1 = CreateLoggerCache();
      const cache2 = CreateLoggerCache();

      expect(cache1).not.toBe(cache2);
      expect(cache1.size).toBe(0);
      expect(cache2.size).toBe(0);
    });
  });

  describe('ValidateConfig', () => {
    it('should validate valid config without throwing', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      expect(() => ValidateConfig(config)).not.toThrow();
    });

    it('should throw error when workspace is missing', () => {
      const config = {
        service: 'api',
      } as FactoryLoggerConfig;

      expect(() => ValidateConfig(config)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });

    it('should throw error when service is missing', () => {
      const config = {
        workspace: 'apps',
      } as FactoryLoggerConfig;

      expect(() => ValidateConfig(config)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });

    it('should throw error when both workspace and service are missing', () => {
      const config = {} as FactoryLoggerConfig;

      expect(() => ValidateConfig(config)).toThrow(
        'LoggerFactory: Invalid Config - Both workspace & service must be set',
      );
    });

    it('should validate config with optional fields', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
        level: 'debug',
        additionalContext: { test: true },
        singleton: true,
      };

      expect(() => ValidateConfig(config)).not.toThrow();
    });
  });

  describe('FactoryBuilder', () => {
    it('should be a function', () => {
      expect(typeof FactoryBuilder).toBe('function');
    });

    it('should exist and be callable', () => {
      expect(FactoryBuilder).toBeDefined();
      // Note: Full testing of FactoryBuilder is done in integration tests
      // to avoid complex mocking requirements
    });
  });
});
