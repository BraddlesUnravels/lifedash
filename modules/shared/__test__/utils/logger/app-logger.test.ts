import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAppLogger } from '../../../src/utils/logger/app-logger';
import type { Logger as PinoLogger } from 'pino';

describe('createAppLogger', () => {
  let mockPinoLogger: PinoLogger;

  beforeEach(() => {
    mockPinoLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
      child: vi.fn(),
      level: 'info',
      // Add other required PinoLogger properties as mocks
    } as unknown as PinoLogger;
  });

  it('should create AppLogger with all required methods', () => {
    const appLogger = createAppLogger(mockPinoLogger);

    expect(appLogger).toBeDefined();
    expect(typeof appLogger.ctx).toBe('function');
    expect(typeof appLogger.op).toBe('function');
    expect(typeof appLogger.user).toBe('function');
    expect(typeof appLogger.domain).toBe('function');
    expect(typeof appLogger.request).toBe('function');
    expect(typeof appLogger.session).toBe('function');
    expect(typeof appLogger.ip).toBe('function');

    // Should also have all Pino logger methods
    expect(typeof appLogger.info).toBe('function');
    expect(typeof appLogger.error).toBe('function');
    expect(typeof appLogger.warn).toBe('function');
    expect(typeof appLogger.debug).toBe('function');
  });

  describe('ctx method', () => {
    it('should create child logger with context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const contextLogger = appLogger.ctx({ userId: 'user-123', requestId: 'req-456' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        userId: 'user-123',
        requestId: 'req-456',
      });
      expect(contextLogger).toBeDefined();
      expect(contextLogger).not.toBe(appLogger);
    });

    it('should handle empty context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const contextLogger = appLogger.ctx({});

      expect(mockPinoLogger.child).toHaveBeenCalledWith({});
      expect(contextLogger).toBeDefined();
    });

    it('should handle complex nested context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const contextLogger = appLogger.ctx({
        workspace: 'apps',
        service: 'api',
        requestId: 'req-123',
        customData: { nested: { value: 'test' } },
      });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        workspace: 'apps',
        service: 'api',
        requestId: 'req-123',
        customData: { nested: { value: 'test' } },
      });
      expect(contextLogger).toBeDefined();
    });
  });

  describe('op method', () => {
    it('should create child logger with operation', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const opLogger = appLogger.op('create');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ operation: 'create' });
      expect(opLogger).toBeDefined();
    });

    it('should create child logger with operation and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const opLogger = appLogger.op('update', { entityId: 'entity-123', version: 2 });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        operation: 'update',
        entityId: 'entity-123',
        version: 2,
      });
      expect(opLogger).toBeDefined();
    });

    it('should handle all ecosystem operations', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const operations = [
        'create',
        'read',
        'update',
        'delete',
        'list',
        'login',
        'logout',
        'authenticate',
        'authorize',
      ] as const;

      operations.forEach((operation, index) => {
        appLogger.op(operation);
        expect(mockPinoLogger.child).toHaveBeenNthCalledWith(index + 1, { operation });
      });
    });
  });

  describe('user method', () => {
    it('should create child logger with userId', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const userLogger = appLogger.user('user-123');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(userLogger).toBeDefined();
    });

    it('should create child logger with userId and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const userLogger = appLogger.user('user-456', { role: 'admin', sessionId: 'sess-789' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        userId: 'user-456',
        role: 'admin',
        sessionId: 'sess-789',
      });
      expect(userLogger).toBeDefined();
    });
  });

  describe('domain method', () => {
    it('should create child logger with module and moduleId', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const domainLogger = appLogger.domain('auth', 'auth-123');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        module: 'auth',
        moduleId: 'auth-123',
      });
      expect(domainLogger).toBeDefined();
    });

    it('should handle numeric moduleId', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const domainLogger = appLogger.domain('user', 12345);

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        module: 'user',
        moduleId: 12345,
      });
      expect(domainLogger).toBeDefined();
    });

    it('should create child logger with module, moduleId and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const domainLogger = appLogger.domain('payment', 'pay-789', { amount: 100, currency: 'USD' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        module: 'payment',
        moduleId: 'pay-789',
        amount: 100,
        currency: 'USD',
      });
      expect(domainLogger).toBeDefined();
    });
  });

  describe('request method', () => {
    it('should create child logger with requestId', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const requestLogger = appLogger.request('req-123');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ requestId: 'req-123' });
      expect(requestLogger).toBeDefined();
    });

    it('should create child logger with requestId and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const requestLogger = appLogger.request('req-456', { method: 'POST', path: '/api/users' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        requestId: 'req-456',
        method: 'POST',
        path: '/api/users',
      });
      expect(requestLogger).toBeDefined();
    });
  });

  describe('session method', () => {
    it('should create child logger with sessionId', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const sessionLogger = appLogger.session('sess-123');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ sessionId: 'sess-123' });
      expect(sessionLogger).toBeDefined();
    });

    it('should create child logger with sessionId and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const sessionLogger = appLogger.session('sess-456', {
        userId: 'user-789',
        startTime: '2023-01-01',
      });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        sessionId: 'sess-456',
        userId: 'user-789',
        startTime: '2023-01-01',
      });
      expect(sessionLogger).toBeDefined();
    });
  });

  describe('ip method', () => {
    it('should create child logger with ip', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const ipLogger = appLogger.ip('192.168.1.1');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ ip: '192.168.1.1' });
      expect(ipLogger).toBeDefined();
    });

    it('should create child logger with ip and extra context', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const ipLogger = appLogger.ip('10.0.0.1', { userAgent: 'Mozilla/5.0', country: 'US' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({
        ip: '10.0.0.1',
        userAgent: 'Mozilla/5.0',
        country: 'US',
      });
      expect(ipLogger).toBeDefined();
    });
  });

  describe('method chaining', () => {
    it('should allow chaining multiple context methods', () => {
      const childLogger1 = { ...mockPinoLogger, child: vi.fn() };
      const childLogger2 = { ...mockPinoLogger, child: vi.fn() };
      const childLogger3 = { ...mockPinoLogger };

      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger1);
      vi.mocked(childLogger1.child).mockReturnValue(childLogger2);
      vi.mocked(childLogger2.child).mockReturnValue(childLogger3);

      const appLogger = createAppLogger(mockPinoLogger);
      const chainedLogger = appLogger.user('user-123').request('req-456').op('create');

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(childLogger1.child).toHaveBeenCalledWith({ requestId: 'req-456' });
      expect(childLogger2.child).toHaveBeenCalledWith({ operation: 'create' });
      expect(chainedLogger).toBeDefined();
    });
  });

  describe('immutability', () => {
    it('should not mutate the original logger', () => {
      const childLogger = { ...mockPinoLogger };
      vi.mocked(mockPinoLogger.child).mockReturnValue(childLogger);

      const appLogger = createAppLogger(mockPinoLogger);
      const contextLogger = appLogger.ctx({ userId: 'user-123' });

      expect(appLogger).not.toBe(contextLogger);
      expect(appLogger.info).toBe(mockPinoLogger.info);
    });

    it('should create new instances for each context method call', () => {
      const childLogger1 = { ...mockPinoLogger };
      const childLogger2 = { ...mockPinoLogger };

      vi.mocked(mockPinoLogger.child)
        .mockReturnValueOnce(childLogger1)
        .mockReturnValueOnce(childLogger2);

      const appLogger = createAppLogger(mockPinoLogger);
      const userLogger = appLogger.user('user-123');
      const requestLogger = appLogger.request('req-456');

      expect(userLogger).not.toBe(requestLogger);
      expect(userLogger).not.toBe(appLogger);
      expect(requestLogger).not.toBe(appLogger);
    });
  });
});
