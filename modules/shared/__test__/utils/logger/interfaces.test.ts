import { describe, it, expect } from 'vitest';
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
  FactoryLoggerConfig,
  LoggerKey,
} from '../../../src/utils/logger/interfaces';

describe('Logger Type System', () => {
  describe('Basic Types', () => {
    it('should define valid workspace types', () => {
      const validWorkspaces: Workspace[] = ['apps', 'modules'];
      expect(validWorkspaces).toHaveLength(2);
    });

    it('should define valid service types', () => {
      const validServices: Service[] = ['api', 'ui', 'bgw', 'dbo', 'shared'];
      expect(validServices).toHaveLength(5);
    });

    it('should define valid ecosystem operations', () => {
      const validOps: EcoSystem_OPs[] = [
        'create',
        'read',
        'update',
        'delete',
        'list',
        'login',
        'logout',
        'authenticate',
        'authorize',
      ];
      expect(validOps).toHaveLength(9);
    });
  });

  describe('Context Interfaces', () => {
    it('should create valid EcoSystemContext', () => {
      const context: EcoSystemContext = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
      };

      expect(context.workspace).toBe('apps');
      expect(context.service).toBe('api');
      expect(context.domain).toBe('users');
    });

    it('should create valid RequestContext with optional fields', () => {
      const context: RequestContext = {
        requestId: 'req-123',
        sessionId: 'sess-456',
        userId: 'user-789',
        ip: '127.0.0.1',
      };

      expect(context.requestId).toBe('req-123');
      expect(context.sessionId).toBe('sess-456');
      expect(context.userId).toBe('user-789');
      expect(context.ip).toBe('127.0.0.1');
    });

    it('should create valid OperationContext', () => {
      const context: OperationContext = {
        performedOp: 'create',
        operation: 'createUser',
      };

      expect(context.performedOp).toBe('create');
      expect(context.operation).toBe('createUser');
    });

    it('should create valid DomainContext', () => {
      const context: DomainContext = {
        module: 'auth',
        moduleId: 'auth-123',
      };

      expect(context.module).toBe('auth');
      expect(context.moduleId).toBe('auth-123');
    });

    it('should create valid RuntimeContext as partial combination', () => {
      const context: RuntimeContext = {
        requestId: 'req-123',
        operation: 'createUser',
        module: 'auth',
      };

      expect(context.requestId).toBe('req-123');
      expect(context.operation).toBe('createUser');
      expect(context.module).toBe('auth');
    });
  });

  describe('Configuration Interfaces', () => {
    it('should create valid ServiceLoggerConfig', () => {
      const config: ServiceLoggerConfig = {
        workspace: 'apps',
        service: 'api',
        domain: 'users',
        level: 'info',
        additionalContext: { version: '1.0.0' },
      };

      expect(config.workspace).toBe('apps');
      expect(config.service).toBe('api');
      expect(config.domain).toBe('users');
      expect(config.level).toBe('info');
      expect(config.additionalContext).toEqual({ version: '1.0.0' });
    });

    it('should create valid FactoryLoggerConfig', () => {
      const config: FactoryLoggerConfig = {
        workspace: 'modules',
        service: 'shared',
        domain: 'logger',
        level: 'debug',
        additionalContext: { test: true },
        singleton: true,
      };

      expect(config.workspace).toBe('modules');
      expect(config.service).toBe('shared');
      expect(config.domain).toBe('logger');
      expect(config.level).toBe('debug');
      expect(config.additionalContext).toEqual({ test: true });
      expect(config.singleton).toBe(true);
    });
  });

  describe('Logger Key Type', () => {
    it('should accept string as LoggerKey', () => {
      const key: LoggerKey = 'apps-api-users';
      expect(typeof key).toBe('string');
      expect(key).toBe('apps-api-users');
    });
  });
});
