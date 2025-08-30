import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loggerBaseConfig } from '../../../src/utils/logger/config';

// Mock the environment config modules
vi.mock('../../../src/utils/logger/config/env.dev', () => ({
  envOptions: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '[{service}:{module}] {msg}',
        singleLine: false,
      },
    },
    timestamp: () => ', "time":"test-dev-time"',
  },
}));

vi.mock('../../../src/utils/logger/config/env.prod', () => ({
  envOptions: {
    level: 'info',
    formatters: {
      level: (label: string) => ({ level: label.toUpperCase() }),
    },
    redact: ['password', 'email', 'cookie', 'req.headers.authorization', 'req.headers.cookie'],
    timestamp: () => ', "time":"test-prod-time"',
  },
}));

vi.mock('../../../src/utils/logger/config/serializers', () => ({
  standardSerializers: {
    err: vi.fn(),
    error: vi.fn(),
    req: vi.fn(),
    res: vi.fn(),
  },
}));

describe('Logger Config', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('loggerBaseConfig', () => {
    it('should return development config when NODE_ENV is development', async () => {
      process.env.NODE_ENV = 'development';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('debug');
      expect(config.transport).toBeDefined();
      expect(config.transport.target).toBe('pino-pretty');
      expect(config.serializers).toBeDefined();

      // Check that serializers are included
      const { standardSerializers } = await import('../../../src/utils/logger/config/serializers');
      expect(config.serializers).toBe(standardSerializers);
    });

    it('should return development config when NODE_ENV is staging', async () => {
      process.env.NODE_ENV = 'staging';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('debug');
      expect(config.transport).toBeDefined();
      expect(config.serializers).toBeDefined();

      const { standardSerializers } = await import('../../../src/utils/logger/config/serializers');
      expect(config.serializers).toBe(standardSerializers);
    });

    it('should return production config when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('info');
      expect(config.formatters).toBeDefined();
      expect(config.redact).toBeDefined();
      expect(config.serializers).toBeDefined();

      // Check redaction fields
      expect(config.redact).toContain('password');
      expect(config.redact).toContain('email');
      expect(config.redact).toContain('cookie');

      const { standardSerializers } = await import('../../../src/utils/logger/config/serializers');
      expect(config.serializers).toBe(standardSerializers);
    });

    it('should return production config when NODE_ENV is not set', async () => {
      delete process.env.NODE_ENV;

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('info');
      expect(config.formatters).toBeDefined();
      expect(config.redact).toBeDefined();
      expect(config.serializers).toBeDefined();

      const { standardSerializers } = await import('../../../src/utils/logger/config/serializers');
      expect(config.serializers).toBe(standardSerializers);
    });

    it('should return production config for unknown NODE_ENV values', async () => {
      process.env.NODE_ENV = 'unknown';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('info');
      expect(config.formatters).toBeDefined();
      expect(config.redact).toBeDefined();
      expect(config.serializers).toBeDefined();

      const { standardSerializers } = await import('../../../src/utils/logger/config/serializers');
      expect(config.serializers).toBe(standardSerializers);
    });

    it('should return production config for test environment', async () => {
      process.env.NODE_ENV = 'test';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('info');
      expect(config.serializers).toBeDefined();
    });

    it('should always include serializers regardless of environment', async () => {
      const environments = ['development', 'staging', 'production', 'test', 'unknown'];

      for (const env of environments) {
        process.env.NODE_ENV = env;
        const config = loggerBaseConfig();

        expect(config.serializers).toBeDefined();
        expect(typeof config.serializers).toBe('object');

        const { standardSerializers } = await import(
          '../../../src/utils/logger/config/serializers'
        );
        expect(config.serializers).toBe(standardSerializers);
      }
    });

    it('should handle empty NODE_ENV', async () => {
      process.env.NODE_ENV = '';

      const config = loggerBaseConfig();

      expect(config).toBeDefined();
      expect(config.level).toBe('info'); // Should default to production
      expect(config.serializers).toBeDefined();
    });

    it('should preserve original environment options structure', () => {
      process.env.NODE_ENV = 'development';

      const config = loggerBaseConfig();

      // Development config should have transport
      expect(config.transport).toBeDefined();
      expect(config.transport.target).toBe('pino-pretty');
      expect(config.transport.options).toBeDefined();
      expect(config.transport.options.colorize).toBe(true);

      process.env.NODE_ENV = 'production';

      const prodConfig = loggerBaseConfig();

      // Production config should have formatters and redact
      expect(prodConfig.formatters).toBeDefined();
      expect(prodConfig.redact).toBeDefined();
      expect(prodConfig.redact).toBeInstanceOf(Array);
    });

    it('should not modify the original environment options', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'development';
      const config1 = loggerBaseConfig();

      process.env.NODE_ENV = 'production';
      const config2 = loggerBaseConfig();

      // Ensure configs are different
      expect(config1.level).toBe('debug');
      expect(config2.level).toBe('info');

      // Restore original
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('environment-specific features', () => {
    it('should include pretty printing for development', () => {
      process.env.NODE_ENV = 'development';

      const config = loggerBaseConfig();

      expect(config.transport).toBeDefined();
      expect(config.transport.target).toBe('pino-pretty');
      expect(config.transport.options).toBeDefined();
      expect(config.transport.options.colorize).toBe(true);
    });

    it('should include security features for production', () => {
      process.env.NODE_ENV = 'production';

      const config = loggerBaseConfig();

      expect(config.redact).toBeDefined();
      expect(config.redact).toContain('password');
      expect(config.redact).toContain('email');
      expect(config.redact).toContain('cookie');
      expect(config.redact).toContain('req.headers.authorization');
      expect(config.redact).toContain('req.headers.cookie');
    });

    it('should have different log levels between environments', () => {
      process.env.NODE_ENV = 'development';
      const devConfig = loggerBaseConfig();

      process.env.NODE_ENV = 'production';
      const prodConfig = loggerBaseConfig();

      expect(devConfig.level).toBe('debug');
      expect(prodConfig.level).toBe('info');
    });
  });
});
