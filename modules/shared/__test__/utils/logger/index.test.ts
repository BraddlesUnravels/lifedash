import { describe, it, expect } from 'vitest';
import { LoggerFactory, createBaseLogger, createAppLogger } from '../../../src/utils/logger';
import type {
  Workspace,
  Service,
  EcoSystem_OPs,
  EcoSystemContext,
  RequestContext,
  OperationContext,
  DomainContext,
  RuntimeContext,
  AppContext,
  ServiceLoggerConfig,
  AppLogger,
  FactoryLoggerConfig,
  LoggerKey,
  LoggerCache,
} from '../../../src/utils/logger';

describe('Logger Module Exports', () => {
  describe('Factory Export', () => {
    it('should export LoggerFactory', () => {
      expect(LoggerFactory).toBeDefined();
      expect(typeof LoggerFactory).toBe('object');
      expect(typeof LoggerFactory.create).toBe('function');
      expect(typeof LoggerFactory.singleton).toBe('function');
      expect(typeof LoggerFactory.reset).toBe('function');
    });
  });

  describe('Function Exports', () => {
    it('should export createBaseLogger', () => {
      expect(createBaseLogger).toBeDefined();
      expect(typeof createBaseLogger).toBe('function');
    });

    it('should export createAppLogger', () => {
      expect(createAppLogger).toBeDefined();
      expect(typeof createAppLogger).toBe('function');
    });
  });

  describe('Type Exports', () => {
    it('should allow importing and using basic types', () => {
      // Test basic types by creating variables with them
      const workspace: Workspace = 'apps';
      const service: Service = 'api';
      const operation: EcoSystem_OPs = 'create';

      expect(workspace).toBe('apps');
      expect(service).toBe('api');
      expect(operation).toBe('create');
    });

    it('should allow importing and using context interfaces', () => {
      const ecoSystemContext: EcoSystemContext = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
      };

      const requestContext: RequestContext = {
        requestId: 'req-123',
        sessionId: 'sess-456',
        userId: 'user-789',
        ip: '127.0.0.1',
      };

      const operationContext: OperationContext = {
        performedOp: 'create',
        operation: 'createUser',
      };

      const domainContext: DomainContext = {
        module: 'auth',
        moduleId: 'auth-123',
      };

      expect(ecoSystemContext.workspace).toBe('modules');
      expect(requestContext.requestId).toBe('req-123');
      expect(operationContext.performedOp).toBe('create');
      expect(domainContext.module).toBe('auth');
    });

    it('should allow importing and using complex context types', () => {
      const runtimeContext: RuntimeContext = {
        requestId: 'req-123',
        operation: 'updateUser',
        module: 'user',
        moduleId: 'user-456',
      };

      const appContext: AppContext = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
        requestId: 'req-789',
        sessionId: 'sess-101',
        userId: 'user-202',
        ip: '192.168.1.1',
        module: 'user',
        moduleId: 'user-303',
        customField: 'customValue',
      };

      expect(runtimeContext.requestId).toBe('req-123');
      expect(appContext.workspace).toBe('apps');
      expect(appContext.customField).toBe('customValue');
    });

    it('should allow importing and using config interfaces', () => {
      const serviceConfig: ServiceLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
        level: 'info',
        additionalContext: { version: '1.0.0' },
      };

      const factoryConfig: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
        level: 'debug',
        additionalContext: { test: true },
        singleton: true,
      };

      expect(serviceConfig.workspace).toBe('apps');
      expect(serviceConfig.level).toBe('info');
      expect(factoryConfig.singleton).toBe(true);
      expect(factoryConfig.additionalContext).toEqual({ test: true });
    });

    it('should allow importing and using utility types', () => {
      const loggerKey: LoggerKey = 'apps-api-users';
      const loggerCache: LoggerCache = new Map();

      expect(typeof loggerKey).toBe('string');
      expect(loggerKey).toBe('apps-api-users');
      expect(loggerCache).toBeInstanceOf(Map);
      expect(loggerCache.size).toBe(0);
    });
  });

  describe('Module Integration', () => {
    it('should work together - factory creates loggers that match AppLogger interface', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'integration-test',
      };

      const logger = LoggerFactory.create(config);

      // Test that logger matches AppLogger interface
      expect(typeof logger.ctx).toBe('function');
      expect(typeof logger.op).toBe('function');
      expect(typeof logger.user).toBe('function');
      expect(typeof logger.domain).toBe('function');
      expect(typeof logger.request).toBe('function');
      expect(typeof logger.session).toBe('function');
      expect(typeof logger.ip).toBe('function');

      // Test that it also has standard Pino methods
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should work together - direct API creates compatible loggers', () => {
      const serviceConfig: ServiceLoggerConfig = {
        workspace: 'modules',
        service: 'dbo',
        level: 'info',
      };

      const baseLogger = createBaseLogger(serviceConfig);
      const appLogger = createAppLogger(baseLogger);

      // Should match AppLogger interface
      expect(typeof appLogger.ctx).toBe('function');
      expect(typeof appLogger.op).toBe('function');
      expect(typeof appLogger.user).toBe('function');
      expect(typeof appLogger.domain).toBe('function');
      expect(typeof appLogger.request).toBe('function');
      expect(typeof appLogger.session).toBe('function');
      expect(typeof appLogger.ip).toBe('function');

      // Should also have Pino methods
      expect(typeof appLogger.info).toBe('function');
      expect(typeof appLogger.error).toBe('function');
      expect(typeof appLogger.warn).toBe('function');
      expect(typeof appLogger.debug).toBe('function');
    });

    it('should allow type-safe usage patterns', () => {
      // Test that TypeScript types work correctly by using them
      const createUserLogger = (workspace: Workspace, service: Service): AppLogger => {
        return LoggerFactory.create({ workspace, service });
      };

      const processUserOperation = (
        logger: AppLogger,
        operation: EcoSystem_OPs,
        userId: string,
        context: Partial<AppContext>,
      ): AppLogger => {
        return logger.op(operation).user(userId).ctx(context);
      };

      const userLogger = createUserLogger('apps', 'api');
      const operationLogger = processUserOperation(userLogger, 'create', 'user-123', {
        requestId: 'req-456',
        module: 'auth',
      });

      expect(userLogger).toBeDefined();
      expect(operationLogger).toBeDefined();
      expect(operationLogger).not.toBe(userLogger);
    });
  });

  describe('Comprehensive Export Check', () => {
    it('should export all expected items from index', async () => {
      // Import everything and check it exists
      const loggerModule = await import('../../../src/utils/logger');

      // Functions
      expect(loggerModule.LoggerFactory).toBeDefined();
      expect(loggerModule.createBaseLogger).toBeDefined();
      expect(loggerModule.createAppLogger).toBeDefined();

      // Check that we're not exporting anything unexpected
      const exportedKeys = Object.keys(loggerModule);
      const expectedExports = ['LoggerFactory', 'createBaseLogger', 'createAppLogger'];

      expectedExports.forEach((expectedExport) => {
        expect(exportedKeys).toContain(expectedExport);
      });

      // The module should not export too many things (indicates clean API)
      expect(exportedKeys.length).toBeLessThanOrEqual(5);
    });
  });
});
