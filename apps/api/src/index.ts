import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { logger } from '@bogeychan/elysia-logger';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { accountRoutes } from './routes/accounts';
import { transactionRoutes } from './routes/transactions';
import { goalRoutes } from './routes/goals';
import { budgetRoutes } from './routes/budgets';
import { dashboardRoutes } from './routes/dashboard';

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

const app = new Elysia()
  .use(logger())
  .use(
    cors({
      origin: ALLOWED_ORIGINS,
      credentials: true,
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Life's Next API",
          version: '0.0.1',
          description: 'Personal Finance Dashboard API',
        },
        tags: [
          { name: 'auth', description: 'Authentication endpoints' },
          { name: 'users', description: 'User management' },
          { name: 'accounts', description: 'Financial accounts' },
          { name: 'transactions', description: 'Transaction management' },
          { name: 'goals', description: 'Financial goals' },
          { name: 'budgets', description: 'Budget management' },
          { name: 'dashboard', description: 'Dashboard data' },
        ],
      },
    }),
  )

  // Health check
  .get(
    '/health',
    () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    }),
    {
      detail: {
        tags: ['health'],
        summary: 'Health check endpoint',
      },
    },
  )

  // API routes
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(userRoutes)
      .use(accountRoutes)
      .use(transactionRoutes)
      .use(goalRoutes)
      .use(budgetRoutes)
      .use(dashboardRoutes),
  )

  // Global error handler
  .onError(({ code, error, set }) => {
    console.error('API Error:', error);

    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          error: 'Validation Error',
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          error: 'Not Found',
          message: 'Resource not found',
          timestamp: new Date().toISOString(),
        };
      default:
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Something went wrong',
          timestamp: new Date().toISOString(),
        };
    }
  });

console.log(`>� Life's Next API running at http://localhost:${PORT}`);
console.log(`=� Swagger docs available at http://localhost:${PORT}/swagger`);

app.listen(PORT);
