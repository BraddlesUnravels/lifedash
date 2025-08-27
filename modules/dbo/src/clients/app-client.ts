import { PrismaClient } from '../generated/prisma';

// Application database client with restricted permissions
// Used for: API operations, user queries, transaction management
export const appPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.APP_DATABASE_URL || process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Connection management
export const connectApp = async (): Promise<void> => {
  try {
    await appPrisma.$connect();
    console.log('✅ App database client connected');
  } catch (error) {
    console.error('❌ App database connection failed:', error);
    throw error;
  }
};

export const disconnectApp = async (): Promise<void> => {
  await appPrisma.$disconnect();
  console.log('🔌 App database client disconnected');
};