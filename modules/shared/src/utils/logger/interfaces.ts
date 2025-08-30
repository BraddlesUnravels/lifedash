import type { LevelWithSilent, Logger as PinoLogger } from 'pino';

/**
 * TERMS:
 * * **EcoSystem**: The entire collection of services, applications, and shared components that fall under the root directory.
 * * **EcoSystem Operations**: Common operations that are involved in all parts of the EcoSystem, these are a more inclusive version od CRUD + auth. Otherwise know as ***ECOSYS_OPS***
 * * **Service**: A distinct application or microservice within the EcoSystem, e.g. "api", "ui", "bgw", "dbo", or "shared"
 * * **Domain**: A specific area of functionality or business logic within a service, e.g. "user", "order", "payment", etc.
 * * **Module**: A sub-area or component within a service that encapsulates related functionality, e.g. "auth", "billing", "notifications", etc.
 * * **Workspace**: The broader category or environment that a service belongs to, e.g. "apps" or "modules"
 *
 * LOGGING CONTEXT:
 * 1. **EcoSystemContext**: Fundamental information that applies to all logs, such as the service name and workspace.
 *
 *
 */

export type Workspace = 'apps' | 'modules';
export type Service = 'api' | 'ui' | 'bgw' | 'dbo' | 'shared';
export type EcoSystem_OPs =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'login'
  | 'logout'
  | 'authenticate'
  | 'authorize';

/** Static context - set once during logger creation */
export interface EcoSystemContext {
  workspace: Workspace;
  service: Service;
  domain?: string;
}

/** Dynamic context - changes during execution */
export interface RequestContext {
  requestId?: string;
  sessionId?: string;
  userId?: string;
  ip?: string;
}

export interface OperationContext {
  /** 'create' | 'read' | 'update' | 'delete' | 'list' | 'login' | 'logout' | 'authenticate' | 'authorize' */
  performedOp?: EcoSystem_OPs;
  /** More specific operation name (e.g. "createUser", "process) */
  operation?: string;
}

export interface DomainContext {
  module?: string;
  moduleId?: string | number;
}

export type RuntimeContext = Partial<RequestContext & OperationContext & DomainContext>;

export type AppContext = EcoSystemContext &
  RequestContext &
  DomainContext & {
    [key: string]: unknown;
  };

export interface ServiceLoggerConfig extends EcoSystemContext {
  level: LevelWithSilent;
  additionalContext?: Record<string, unknown>;
}

export interface AppLogger extends PinoLogger {
  /**
   * Returns a new child logger with added/overridden bindings.
   * Do NOT mutate the current logger.
   */
  ctx(context: Partial<AppContext>): AppLogger;

  /** Shorthand for attaching/overriding the 'operation' field */
  op(operation: EcoSystem_OPs, extra?: Record<string, unknown>): AppLogger;

  /** Shorthand for attaching/overriding the 'userId' field */
  user(userId: string, extra?: Record<string, unknown>): AppLogger;

  /** Shorthand for attaching/overriding the 'entity' and 'entityId' fields */
  domain(entity: string, entityId: string | number, extra?: Record<string, unknown>): AppLogger;

  /** Shorthand for attaching/overriding the 'requestId' field */
  request(requestId: string, extra?: Record<string, unknown>): AppLogger;

  /** Shorthand for attaching/overriding the 'sessionId' field */
  session(sessionId: string, extra?: Record<string, unknown>): AppLogger;

  /** Shorthand for attaching/overriding the 'ip' field */
  ip(ip: string, extra?: Record<string, unknown>): AppLogger;
}

/**
 * Unique key for each logger instance.
 * * Key is a combination of workspace & service (module).
 * * **Key Examples:** `apps-api-users` || `modules-dbo-security`
 * */
export type LoggerKey = string;
export type LoggerCache = ReadonlyMap<LoggerKey, AppLogger>;
type ReadonlyRecord = Readonly<Record<string, unknown>>;

export interface FactoryLoggerConfig {
  /** Which workspace this logger belongs to (usually equals `apps' |` modules') */
  readonly workspace: Workspace;
  /** Sub-area/module name */
  readonly service: Service;
  /** Optional log domain within the service */
  readonly domain?: string;
  /** Default log level */
  readonly level?: LevelWithSilent;
  /** Extra context applied to every log */
  readonly additionalContext?: ReadonlyRecord; // Stops callers from mutating the object after passing it in
  /** Optional singleton hint for DI/registry layers */
  readonly singleton?: boolean;
}
