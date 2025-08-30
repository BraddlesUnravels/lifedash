import { PrismaClient } from '../generated/prisma';

// Background worker database client with specific permissions
// Used for: Data ingestion, categorization, batch processing, analytics
export const bgwPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.BGW_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Connection management
export const connectBgw = async (): Promise<void> => {
  try {
    await bgwPrisma.$connect();
    console.log('✅ BGW database client connected');
  } catch (error) {
    console.error('❌ BGW database connection failed:', error);
    throw error;
  }
};

export const disconnectBgw = async (): Promise<void> => {
  await bgwPrisma.$disconnect();
  console.log('🔌 BGW database client disconnected');
};
