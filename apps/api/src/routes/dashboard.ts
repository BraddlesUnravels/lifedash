import { Elysia, t } from 'elysia'

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
  .get('/summary', async ({ query }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Aggregate real data from database
      // Mock dashboard summary data
      const summary = {
        netWorth: {
          current: 12450,
          change: 652.30,
          changePercentage: 5.2,
          period: 'month'
        },
        monthlyIncome: {
          current: 3280,
          average: 3150,
          change: 130,
          changePercentage: 4.1
        },
        monthlyExpenses: {
          current: 2150,
          average: 2280,
          change: -130,
          changePercentage: -5.7
        },
        monthlySavings: {
          current: 1130,
          target: 1000,
          change: 260,
          changePercentage: 30.0
        },
        accounts: {
          total: 3,
          totalBalance: 17020.00,
          breakdown: [
            { type: 'checking', balance: 5420.50 },
            { type: 'savings', balance: 12450.75 },
            { type: 'credit', balance: -850.25 }
          ]
        },
        goals: {
          total: 3,
          onTrack: 2,
          behind: 1,
          ahead: 0,
          totalProgress: {
            current: 33800,
            target: 107000,
            percentage: 31.6
          }
        },
        budgets: {
          currentMonth: {
            total: 3000,
            spent: 2150,
            remaining: 850,
            percentageUsed: 71.7
          },
          categoriesOverBudget: 2,
          topSpendingCategory: 'Dining Out'
        },
        recentActivity: {
          transactionsThisWeek: 12,
          lastTransactionDate: '2024-01-15T10:30:00.000Z',
          pendingTransactions: 2
        }
      }

      return {
        summary,
        period: query.period || '30days',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get dashboard summary error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve dashboard summary',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      period: t.Optional(t.Union([
        t.Literal('7days'),
        t.Literal('30days'),
        t.Literal('90days'),
        t.Literal('1year')
      ]))
    }),
    detail: {
      tags: ['dashboard'],
      summary: 'Get dashboard summary',
      description: 'Get aggregated financial data for dashboard display'
    }
  })

  .get('/charts/cashflow', async ({ query }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Generate real cashflow data from transactions
      // Mock cashflow chart data
      const period = query.period || '30days'
      const dataPoints = period === '7days' ? 7 : period === '30days' ? 30 : 90

      const cashflowData = Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (dataPoints - 1 - i))
        
        return {
          date: date.toISOString().split('T')[0],
          income: Math.floor(Math.random() * 200) + 100,
          expenses: Math.floor(Math.random() * 150) + 50,
          net: 0 // Will be calculated
        }
      }).map(point => ({
        ...point,
        net: point.income - point.expenses
      }))

      return {
        data: cashflowData,
        period: query.period || '30days',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get cashflow chart error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve cashflow data',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      period: t.Optional(t.Union([
        t.Literal('7days'),
        t.Literal('30days'),
        t.Literal('90days')
      ]))
    }),
    detail: {
      tags: ['dashboard'],
      summary: 'Get cashflow chart data',
      description: 'Get time series data for cashflow visualization'
    }
  })

  .get('/charts/categories', async ({ query }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Aggregate spending by category from transactions
      // Mock category breakdown data
      const categoryData = [
        { name: 'Groceries', amount: 485, percentage: 22.6, color: '#22c55e' },
        { name: 'Dining Out', amount: 425, percentage: 19.8, color: '#ef4444' },
        { name: 'Utilities', amount: 380, percentage: 17.7, color: '#f59e0b' },
        { name: 'Shopping', amount: 305, percentage: 14.2, color: '#8b5cf6' },
        { name: 'Transportation', amount: 285, percentage: 13.3, color: '#06b6d4' },
        { name: 'Entertainment', amount: 145, percentage: 6.7, color: '#ec4899' },
        { name: 'Healthcare', amount: 125, percentage: 5.8, color: '#10b981' }
      ]

      const totalSpending = categoryData.reduce((sum, cat) => sum + cat.amount, 0)

      return {
        categories: categoryData,
        totalSpending,
        period: query.period || '30days',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get category chart error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve category breakdown',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      period: t.Optional(t.Union([
        t.Literal('7days'),
        t.Literal('30days'),
        t.Literal('90days'),
        t.Literal('1year')
      ]))
    }),
    detail: {
      tags: ['dashboard'],
      summary: 'Get category breakdown chart',
      description: 'Get spending breakdown by category for pie/donut charts'
    }
  })

  .get('/alerts', async () => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Generate real alerts based on user data and rules
      // Mock alerts data
      const alerts = [
        {
          id: '1',
          type: 'budget_warning',
          severity: 'warning',
          title: 'Dining Budget Almost Exceeded',
          message: 'You have spent $425 of your $300 dining budget this month',
          actionUrl: '/budgets',
          createdAt: '2024-01-15T10:00:00.000Z'
        },
        {
          id: '2',
          type: 'goal_milestone',
          severity: 'info',
          title: 'Emergency Fund Milestone',
          message: 'You have reached 85% of your emergency fund goal!',
          actionUrl: '/goals',
          createdAt: '2024-01-14T09:00:00.000Z'
        },
        {
          id: '3',
          type: 'unusual_spending',
          severity: 'info',
          title: 'Unusual Spending Detected',
          message: 'Your entertainment spending is 40% higher than usual this month',
          actionUrl: '/transactions?category=Entertainment',
          createdAt: '2024-01-13T15:30:00.000Z'
        }
      ]

      return {
        alerts,
        total: alerts.length,
        unread: alerts.length, // Mock: all alerts are unread
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get alerts error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve alerts',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    detail: {
      tags: ['dashboard'],
      summary: 'Get user alerts',
      description: 'Get notifications and alerts for the user'
    }
  })