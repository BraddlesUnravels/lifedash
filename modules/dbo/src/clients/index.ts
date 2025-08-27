// Prisma client exports for different database users
export { appPrisma, connectApp, disconnectApp } from './app-client';
export { bgwPrisma, connectBgw, disconnectBgw } from './bgw-client';
export { migPrisma, connectMig, disconnectMig } from './mig-client';

// Connection management utilities
export const connectAllClients = async (): Promise<void> => {
  const { connectApp } = await import('./app-client');
  const { connectBgw } = await import('./bgw-client');
  const { connectMig } = await import('./mig-client');

  await Promise.all([
    connectApp(),
    connectBgw(),
    connectMig()
  ]);
};

export const disconnectAllClients = async (): Promise<void> => {
  const { disconnectApp } = await import('./app-client');
  const { disconnectBgw } = await import('./bgw-client');
  const { disconnectMig } = await import('./mig-client');

  await Promise.all([
    disconnectApp(),
    disconnectBgw(),
    disconnectMig()
  ]);
};

// Graceful shutdown handler
export const setupGracefulShutdown = (): void => {
  const shutdown = async (signal: string) => {
    console.log(`🛑 Received ${signal}. Closing database connections...`);
    await disconnectAllClients();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};