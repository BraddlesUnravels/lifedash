import { PrismaClient } from '../generated/prisma';
import { logger } from '@app/shared/logger'; // You'll need to create this

export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  logQueries?: boolean;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  latency?: number;
  error?: string;
  timestamp: Date;
}

export class PrismaClientFactory {
  private static instances = new Map<string, PrismaClient>();
  private static readonly DEFAULT_CONFIG: Partial<DatabaseConfig> = {
    maxConnections: 10,
    connectionTimeout: 10000, // 10s
    queryTimeout: 30000, // 30s
    logQueries: process.env.NODE_ENV === 'development',
  };

  /**
   * Get or create a Prisma client instance
   */
  static getClient(config?: DatabaseConfig): PrismaClient {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const key = this.generateCacheKey(finalConfig);

    if (this.instances.has(key)) {
      const existing = this.instances.get(key)!;
      return existing;
    }

    const client = this.createClient(finalConfig);
    this.instances.set(key, client);

    // Set up cleanup handlers
    this.setupCleanupHandlers(client, key);

    return client;
  }

  /**
   * Create a new Prisma client with proper configuration
   */
  private static createClient(config: DatabaseConfig): PrismaClient {
    try {
      const client = new PrismaClient({
        datasources: {
          db: {
            url: config.url,
          },
        },
        log: config.logQueries
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'event', level: 'error' },
              { emit: 'event', level: 'warn' },
            ]
          : ['error'],
        errorFormat: 'minimal',
      });

      // Set up query logging if enabled
      if (config.logQueries) {
        client.$on('query', (e) => {
          logger.debug('Database Query', {
            query: e.query,
            params: e.params,
            duration: e.duration,
            target: e.target,
          });
        });

        client.$on('error', (e) => {
          logger.error('Database Error', { error: e });
        });
      }

      logger.info('Prisma client created successfully', {
        maxConnections: config.maxConnections,
        connectionTimeout: config.connectionTimeout,
      });

      return client;
    } catch (error) {
      logger.error('Failed to create Prisma client', { error });
      throw new DatabaseConnectionError('Failed to initialize database client', error);
    }
  }

  /**
   * Health check for database connection
   */
  static async healthCheck(client?: PrismaClient): Promise<HealthCheckResult> {
    const targetClient = client || this.getClient();
    const startTime = Date.now();

    try {
      // Simple query to test connection
      await targetClient.$queryRaw`SELECT 1`;

      const latency = Date.now() - startTime;
      return {
        isHealthy: true,
        latency,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Database health check failed', { error });
      return {
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Gracefully disconnect a client
   */
  static async disconnect(client?: PrismaClient): Promise<void> {
    if (client) {
      try {
        await client.$disconnect();
        logger.info('Prisma client disconnected successfully');
      } catch (error) {
        logger.error('Error disconnecting Prisma client', { error });
      }
    }
  }

  /**
   * Disconnect all clients (useful for shutdown)
   */
  static async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.instances.values()).map((client) =>
      this.disconnect(client),
    );

    await Promise.allSettled(disconnectPromises);
    this.instances.clear();
    logger.info('All Prisma clients disconnected');
  }

  private static generateCacheKey(config: DatabaseConfig): string {
    return `${config.url}_${config.maxConnections}_${config.connectionTimeout}`;
  }

  private static setupCleanupHandlers(client: PrismaClient, key: string): void {
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, disconnecting database...');
      await this.disconnect(client);
      this.instances.delete(key);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, disconnecting database...');
      await this.disconnect(client);
      this.instances.delete(key);
    });
  }
}

// Custom error classes
export class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export class DatabaseOperationError extends Error {
  constructor(
    message: string,
    public operation: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseOperationError';
  }
}
