import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggerFactory, createBaseLogger, createAppLogger } from '../../../src/utils/logger';
import type {
  FactoryLoggerConfig,
  ServiceLoggerConfig,
} from '../../../src/utils/logger/interfaces';

// Mock pino to capture log calls in integration tests
const mockLogCalls: Array<{ level: string; message: string; context: any }> = [];

vi.mock('pino', () => {
  const mockLogger = {
    info: vi.fn((obj: any, msg?: string) => {
      if (typeof obj === 'string') {
        mockLogCalls.push({ level: 'info', message: obj, context: {} });
      } else {
        mockLogCalls.push({ level: 'info', message: msg || '', context: obj || {} });
      }
    }),
    error: vi.fn((obj: any, msg?: string) => {
      if (typeof obj === 'string') {
        mockLogCalls.push({ level: 'error', message: obj, context: {} });
      } else {
        mockLogCalls.push({ level: 'error', message: msg || '', context: obj || {} });
      }
    }),
    warn: vi.fn((obj: any, msg?: string) => {
      if (typeof obj === 'string') {
        mockLogCalls.push({ level: 'warn', message: obj, context: {} });
      } else {
        mockLogCalls.push({ level: 'warn', message: msg || '', context: obj || {} });
      }
    }),
    debug: vi.fn((obj: any, msg?: string) => {
      if (typeof obj === 'string') {
        mockLogCalls.push({ level: 'debug', message: obj, context: {} });
      } else {
        mockLogCalls.push({ level: 'debug', message: msg || '', context: obj || {} });
      }
    }),
    child: vi.fn((context: any) => ({
      ...mockLogger,
      info: vi.fn((obj: any, msg?: string) => {
        if (typeof obj === 'string') {
          mockLogCalls.push({
            level: 'info',
            message: obj,
            context: { ...context },
          });
        } else {
          mockLogCalls.push({
            level: 'info',
            message: msg || '',
            context: { ...context, ...(obj || {}) },
          });
        }
      }),
      error: vi.fn((obj: any, msg?: string) => {
        if (typeof obj === 'string') {
          mockLogCalls.push({
            level: 'error',
            message: obj,
            context: { ...context },
          });
        } else {
          mockLogCalls.push({
            level: 'error',
            message: msg || '',
            context: { ...context, ...(obj || {}) },
          });
        }
      }),
      warn: vi.fn((obj: any, msg?: string) => {
        if (typeof obj === 'string') {
          mockLogCalls.push({
            level: 'warn',
            message: obj,
            context: { ...context },
          });
        } else {
          mockLogCalls.push({
            level: 'warn',
            message: msg || '',
            context: { ...context, ...(obj || {}) },
          });
        }
      }),
      debug: vi.fn((obj: any, msg?: string) => {
        if (typeof obj === 'string') {
          mockLogCalls.push({
            level: 'debug',
            message: obj,
            context: { ...context },
          });
        } else {
          mockLogCalls.push({
            level: 'debug',
            message: msg || '',
            context: { ...context, ...(obj || {}) },
          });
        }
      }),
      child: vi.fn((childContext: any) => mockLogger.child({ ...context, ...childContext })),
    })),
    level: 'info',
    write: vi.fn(),
  };

  const pino = vi.fn(() => mockLogger);
  pino.stdSerializers = {
    err: vi.fn(),
    req: vi.fn(),
    res: vi.fn(),
  };

  return { default: pino };
});

describe('Logger Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogCalls.length = 0;
    LoggerFactory.reset();

    vi.stubGlobal('process', {
      env: { NODE_ENV: 'test', HOSTNAME: 'test-host' },
      pid: 12345,
    });
  });

  afterEach(() => {
    LoggerFactory.reset();
  });

  describe('End-to-End Logger Creation and Usage', () => {
    it('should create and use logger through factory', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
      };

      const logger = LoggerFactory.create(config);

      // Basic logging
      logger.info('User created successfully');
      logger.error({ error: 'validation failed' }, 'User creation failed');

      expect(mockLogCalls).toHaveLength(2);
      expect(mockLogCalls[0].level).toBe('info');
      expect(mockLogCalls[0].message).toBe('User created successfully');
      expect(mockLogCalls[1].level).toBe('error');
      expect(mockLogCalls[1].message).toBe('User creation failed');
      expect(mockLogCalls[1].context.error).toBe('validation failed');
    });

    it('should work with context chaining', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
      };

      const logger = LoggerFactory.create(config);

      const contextLogger = logger.user('user-123').request('req-456').op('create');

      contextLogger.info('Processing user creation');

      expect(mockLogCalls).toHaveLength(1);
      expect(mockLogCalls[0].level).toBe('info');
      expect(mockLogCalls[0].message).toBe('Processing user creation');
      expect(mockLogCalls[0].context.userId).toBe('user-123');
      expect(mockLogCalls[0].context.requestId).toBe('req-456');
      expect(mockLogCalls[0].context.operation).toBe('create');
    });

    it('should maintain singleton behavior', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
      };

      const logger1 = LoggerFactory.singleton(config);
      const logger2 = LoggerFactory.singleton(config);

      expect(logger1).toBe(logger2);

      logger1.info('First message');
      logger2.info('Second message');

      expect(mockLogCalls).toHaveLength(2);
      expect(mockLogCalls[0].message).toBe('First message');
      expect(mockLogCalls[1].message).toBe('Second message');
    });
  });

  describe('Complex Logging Scenarios', () => {
    it('should handle deeply nested context', () => {
      const logger = LoggerFactory.create({
        workspace: 'apps',
        service: 'api',
        domain: 'payment',
      });

      const paymentLogger = logger
        .user('user-789')
        .request('req-pay-123')
        .session('sess-456')
        .domain('payment', 'pay-789', {
          amount: 100,
          currency: 'USD',
          method: 'credit_card',
        })
        .ip('192.168.1.100');

      paymentLogger.info(
        {
          transactionId: 'txn-123',
          status: 'completed',
        },
        'Payment processed successfully',
      );

      expect(mockLogCalls).toHaveLength(1);
      const logCall = mockLogCalls[0];

      expect(logCall.level).toBe('info');
      expect(logCall.message).toBe('Payment processed successfully');
      expect(logCall.context.userId).toBe('user-789');
      expect(logCall.context.requestId).toBe('req-pay-123');
      expect(logCall.context.sessionId).toBe('sess-456');
      expect(logCall.context.module).toBe('payment');
      expect(logCall.context.moduleId).toBe('pay-789');
      expect(logCall.context.amount).toBe(100);
      expect(logCall.context.currency).toBe('USD');
      expect(logCall.context.method).toBe('credit_card');
      expect(logCall.context.ip).toBe('192.168.1.100');
      expect(logCall.context.transactionId).toBe('txn-123');
      expect(logCall.context.status).toBe('completed');
    });

    it('should handle error logging with stack traces', () => {
      const logger = LoggerFactory.create({
        workspace: 'apps',
        service: 'api',
        domain: 'auth',
      });

      const error = new Error('Authentication failed');
      const authLogger = logger.user('user-invalid').op('authenticate').request('req-auth-fail');

      authLogger.error(
        {
          err: error,
          attemptCount: 3,
          ipAddress: '10.0.0.1',
        },
        'User authentication failed after multiple attempts',
      );

      expect(mockLogCalls).toHaveLength(1);
      const logCall = mockLogCalls[0];

      expect(logCall.level).toBe('error');
      expect(logCall.message).toBe('User authentication failed after multiple attempts');
      expect(logCall.context.userId).toBe('user-invalid');
      expect(logCall.context.operation).toBe('authenticate');
      expect(logCall.context.requestId).toBe('req-auth-fail');
      expect(logCall.context.err).toBe(error);
      expect(logCall.context.attemptCount).toBe(3);
      expect(logCall.context.ipAddress).toBe('10.0.0.1');
    });

    it('should handle multiple logger instances for different services', () => {
      const apiLogger = LoggerFactory.singleton({
        workspace: 'apps',
        service: 'api',
        domain: 'users',
      });

      const uiLogger = LoggerFactory.singleton({
        workspace: 'apps',
        service: 'ui',
        domain: 'dashboard',
      });

      const bgwLogger = LoggerFactory.singleton({
        workspace: 'apps',
        service: 'bgw',
        domain: 'notifications',
      });

      apiLogger.info('API processing request');
      uiLogger.info('UI rendering component');
      bgwLogger.info('Background job started');

      expect(mockLogCalls).toHaveLength(3);
      expect(mockLogCalls[0].message).toBe('API processing request');
      expect(mockLogCalls[1].message).toBe('UI rendering component');
      expect(mockLogCalls[2].message).toBe('Background job started');

      // Verify they are different instances
      expect(apiLogger).not.toBe(uiLogger);
      expect(uiLogger).not.toBe(bgwLogger);
      expect(apiLogger).not.toBe(bgwLogger);
    });
  });

  describe('Direct API Usage', () => {
    it('should work with createBaseLogger directly', () => {
      const config: ServiceLoggerConfig = {
        workspace: 'modules',
        service: 'dbo',
        level: 'debug',
        additionalContext: { database: 'main' },
      };

      const baseLogger = createBaseLogger(config);
      baseLogger.debug('Database connection established');

      expect(mockLogCalls).toHaveLength(1);
      expect(mockLogCalls[0].level).toBe('debug');
      expect(mockLogCalls[0].message).toBe('Database connection established');
    });

    it('should work with createAppLogger directly', () => {
      const config: ServiceLoggerConfig = {
        workspace: 'apps',
        service: 'bgw',
        level: 'info',
      };

      const baseLogger = createBaseLogger(config);
      const appLogger = createAppLogger(baseLogger);

      const jobLogger = appLogger
        .op('create')
        .domain('job', 'job-123', { type: 'email', priority: 'high' });

      jobLogger.info('Background job queued');

      expect(mockLogCalls).toHaveLength(1);
      const logCall = mockLogCalls[0];

      expect(logCall.level).toBe('info');
      expect(logCall.message).toBe('Background job queued');
      expect(logCall.context.operation).toBe('create');
      expect(logCall.context.module).toBe('job');
      expect(logCall.context.moduleId).toBe('job-123');
      expect(logCall.context.type).toBe('email');
      expect(logCall.context.priority).toBe('high');
    });
  });

  describe('Performance and Caching', () => {
    it('should efficiently cache singleton instances', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'performance-test',
      };

      // Create multiple loggers with same config
      const loggers = Array.from({ length: 10 }, () => LoggerFactory.singleton(config));

      // All should be the same instance
      loggers.forEach((logger) => {
        expect(logger).toBe(loggers[0]);
      });

      // Test that they all work
      loggers.forEach((logger, index) => {
        logger.info(`Message ${index}`);
      });

      expect(mockLogCalls).toHaveLength(10);
    });

    it('should handle cache reset properly', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'cache-test',
      };

      const logger1 = LoggerFactory.singleton(config);
      logger1.info('First message');

      LoggerFactory.reset();

      const logger2 = LoggerFactory.singleton(config);
      logger2.info('Second message');

      expect(logger1).not.toBe(logger2);
      expect(mockLogCalls).toHaveLength(2);
      expect(mockLogCalls[0].message).toBe('First message');
      expect(mockLogCalls[1].message).toBe('Second message');
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should support typical HTTP request logging pattern', () => {
      const logger = LoggerFactory.singleton({
        workspace: 'apps',
        service: 'api',
        domain: 'http',
      });

      // Simulate HTTP request handling
      const requestId = 'req-http-123';
      const userId = 'user-456';
      const sessionId = 'sess-789';

      const requestLogger = logger.request(requestId).user(userId).session(sessionId);

      // Log request start
      requestLogger.info(
        {
          method: 'POST',
          path: '/api/users',
          ip: '192.168.1.1',
        },
        'HTTP request started',
      );

      // Log during processing
      requestLogger
        .op('create')
        .domain('user', 'new-user', { email: 'test@example.com' })
        .info('Creating new user');

      // Log completion
      requestLogger.info(
        {
          statusCode: 201,
          responseTime: 45,
        },
        'HTTP request completed',
      );

      expect(mockLogCalls).toHaveLength(3);

      // Check all logs have consistent request context
      mockLogCalls.forEach((call) => {
        expect(call.context.requestId).toBe(requestId);
        expect(call.context.userId).toBe(userId);
        expect(call.context.sessionId).toBe(sessionId);
      });

      // Check specific log details
      expect(mockLogCalls[0].message).toBe('HTTP request started');
      expect(mockLogCalls[0].context.method).toBe('POST');
      expect(mockLogCalls[0].context.path).toBe('/api/users');

      expect(mockLogCalls[1].message).toBe('Creating new user');
      expect(mockLogCalls[1].context.operation).toBe('create');
      expect(mockLogCalls[1].context.module).toBe('user');

      expect(mockLogCalls[2].message).toBe('HTTP request completed');
      expect(mockLogCalls[2].context.statusCode).toBe(201);
      expect(mockLogCalls[2].context.responseTime).toBe(45);
    });

    it('should support background job processing pattern', () => {
      const logger = LoggerFactory.singleton({
        workspace: 'apps',
        service: 'bgw',
        domain: 'jobs',
      });

      const jobId = 'job-email-123';
      const userId = 'user-789';

      const jobLogger = logger
        .domain('job', jobId, {
          type: 'email',
          priority: 'normal',
          retryCount: 0,
        })
        .user(userId);

      // Job lifecycle logging
      jobLogger.info('Job started');

      jobLogger.op('read').info({ recordsProcessed: 150 }, 'Processing email recipients');

      jobLogger.op('create').info({ emailsSent: 150, failed: 0 }, 'Email batch sent successfully');

      jobLogger.info(
        {
          duration: 2340,
          status: 'completed',
        },
        'Job completed',
      );

      expect(mockLogCalls).toHaveLength(4);

      // Check all logs have consistent job context
      mockLogCalls.forEach((call) => {
        expect(call.context.module).toBe('job');
        expect(call.context.moduleId).toBe(jobId);
        expect(call.context.userId).toBe(userId);
        expect(call.context.type).toBe('email');
        expect(call.context.priority).toBe('normal');
      });
    });
  });
});
