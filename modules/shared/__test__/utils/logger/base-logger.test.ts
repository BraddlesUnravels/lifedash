import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaseLogger } from '../../../src/utils/logger/base-logger';
import type { ServiceLoggerConfig } from '../../../src/utils/logger/interfaces';

// Mock pino to avoid actual logging during tests
vi.mock('pino', () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => mockLogger),
    level: 'info',
  };

  const pino = vi.fn(() => mockLogger);
  pino.stdSerializers = {
    err: vi.fn(),
    req: vi.fn(),
    res: vi.fn(),
  };

  return { default: pino };
});

describe('createBaseLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('process', {
      env: { NODE_ENV: 'test', HOSTNAME: 'test-hostname' },
      pid: 12345,
    });
  });

  it('should create logger with minimal config', () => {
    const config: ServiceLoggerConfig = {
      workspace: 'apps',
      service: 'api',
      level: 'info',
    };

    const logger = createBaseLogger(config);
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should create logger with full config', () => {
    const config: ServiceLoggerConfig = {
      workspace: 'modules',
      service: 'shared',
      domain: 'logger',
      level: 'debug',
      additionalContext: {
        version: '1.0.0',
        environment: 'test',
      },
    };

    const logger = createBaseLogger(config);
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should handle different log levels', () => {
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const;

    levels.forEach((level) => {
      const config: ServiceLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        level,
      };

      const logger = createBaseLogger(config);
      expect(logger).toBeDefined();
    });
  });

  it('should handle different workspace types', () => {
    const workspaces = ['apps', 'modules'] as const;

    workspaces.forEach((workspace) => {
      const config: ServiceLoggerConfig = {
        workspace,
        service: 'api',
        level: 'info',
      };

      const logger = createBaseLogger(config);
      expect(logger).toBeDefined();
    });
  });

  it('should handle different service types', () => {
    const services = ['api', 'ui', 'bgw', 'dbo', 'shared'] as const;

    services.forEach((service) => {
      const config: ServiceLoggerConfig = {
        workspace: 'apps',
        service,
        level: 'info',
      };

      const logger = createBaseLogger(config);
      expect(logger).toBeDefined();
    });
  });

  it('should include process information in config', async () => {
    const config: ServiceLoggerConfig = {
      workspace: 'apps',
      service: 'api',
      level: 'info',
    };

    // Mock the pino constructor to capture the config
    const pino = await import('pino');
    const pinoMock = vi.mocked(pino.default);

    createBaseLogger(config);

    expect(pinoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'apps',
        level: 'info',
        base: expect.objectContaining({
          service: 'api',
          workspace: 'apps',
          pid: 12345,
          hostname: 'test-hostname',
        }),
      }),
    );
  });

  it('should use default hostname when HOSTNAME env var is not set', async () => {
    vi.stubGlobal('process', {
      env: { NODE_ENV: 'test' },
      pid: 12345,
    });

    const config: ServiceLoggerConfig = {
      workspace: 'apps',
      service: 'api',
      level: 'info',
    };

    const pino = await import('pino');
    const pinoMock = vi.mocked(pino.default);

    createBaseLogger(config);

    expect(pinoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        base: expect.objectContaining({
          hostname: 'unknown',
        }),
      }),
    );
  });

  it('should merge additional context into base config', async () => {
    const config: ServiceLoggerConfig = {
      workspace: 'apps',
      service: 'api',
      level: 'info',
      additionalContext: {
        version: '2.0.0',
        buildId: 'build-123',
        custom: { nested: 'value' },
      },
    };

    const pino = await import('pino');
    const pinoMock = vi.mocked(pino.default);

    createBaseLogger(config);

    expect(pinoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        base: expect.objectContaining({
          version: '2.0.0',
          buildId: 'build-123',
          custom: { nested: 'value' },
        }),
      }),
    );
  });

  it('should freeze the final configuration', async () => {
    const config: ServiceLoggerConfig = {
      workspace: 'apps',
      service: 'api',
      level: 'info',
    };

    const pino = await import('pino');
    const pinoMock = vi.mocked(pino.default);

    createBaseLogger(config);

    const calledConfig = pinoMock.mock.calls[0][0];
    expect(Object.isFrozen(calledConfig)).toBe(true);
  });
});
