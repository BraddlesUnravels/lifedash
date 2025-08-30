import { PrismaClient } from '../generated/prisma';

// Migration database client with elevated permissions
// Used for: Schema migrations, database maintenance, seed operations
export const migPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MIG_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Connection management
export const connectMig = async (): Promise<void> => {
  try {
    await migPrisma.$connect();
    console.log('✅ Migration database client connected');
  } catch (error) {
    console.error('❌ Migration database connection failed:', error);
    throw error;
  }
};

export const disconnectMig = async (): Promise<void> => {
  await migPrisma.$disconnect();
  console.log('🔌 Migration database client disconnected');
};
