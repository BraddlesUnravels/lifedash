import { Elysia, t } from 'elysia'

const mockBudgets = [
  {
    id: '1',
    userId: '1',
    period: '2024-01',
    amountTotal: 3000,
    amountSpent: 2150,
    categories: [
      { name: 'Groceries', budgeted: 600, spent: 485 },
      { name: 'Dining Out', budgeted: 300, spent: 425 },
      { name: 'Transportation', budgeted: 400, spent: 285 },
      { name: 'Entertainment', budgeted: 200, spent: 145 },
      { name: 'Utilities', budgeted: 350, spent: 380 },
      { name: 'Healthcare', budgeted: 250, spent: 125 },
      { name: 'Shopping', budgeted: 400, spent: 305 },
      { name: 'Miscellaneous', budgeted: 500, spent: 0 }
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  }
]

export const budgetRoutes = new Elysia({ prefix: '/budgets' })
  .get('/', async ({ query }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      let filteredBudgets = mockBudgets.filter(budget => budget.userId === userId)

      // Apply filters
      if (query.period) {
        filteredBudgets = filteredBudgets.filter(b => b.period === query.period)
      }
      if (query.year) {
        filteredBudgets = filteredBudgets.filter(b => b.period.startsWith(query.year))
      }

      return {
        budgets: filteredBudgets,
        total: filteredBudgets.length,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get budgets error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve budgets',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      period: t.Optional(t.String()), // Format: YYYY-MM
      year: t.Optional(t.String()) // Format: YYYY
    }),
    detail: {
      tags: ['budgets'],
      summary: 'Get user budgets',
      description: 'Retrieve budgets for the authenticated user'
    }
  })

  .get('/current', async () => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // Get current month budget
      const currentPeriod = new Date().toISOString().substring(0, 7) // YYYY-MM
      const currentBudget = mockBudgets.find(b => b.userId === userId && b.period === currentPeriod) ||
                           mockBudgets.find(b => b.userId === userId) // Fallback to any budget

      if (!currentBudget) {
        return {
          budget: null,
          message: 'No budget found for current period',
          timestamp: new Date().toISOString()
        }
      }

      // Calculate additional metrics
      const remaining = currentBudget.amountTotal - currentBudget.amountSpent
      const percentageUsed = (currentBudget.amountSpent / currentBudget.amountTotal) * 100

      return {
        budget: {
          ...currentBudget,
          remaining,
          percentageUsed: Math.round(percentageUsed * 100) / 100
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get current budget error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve current budget',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    detail: {
      tags: ['budgets'],
      summary: 'Get current budget',
      description: 'Get the current month budget for the user'
    }
  })

  .post('/', async ({ body, set }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // Check if budget already exists for the period
      const existingBudget = mockBudgets.find(b => b.userId === userId && b.period === body.period)
      if (existingBudget) {
        set.status = 409
        return {
          error: 'Budget Conflict',
          message: `Budget already exists for period ${body.period}`,
          timestamp: new Date().toISOString()
        }
      }

      const newBudget = {
        id: (mockBudgets.length + 1).toString(),
        userId,
        ...body,
        amountSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockBudgets.push(newBudget)

      set.status = 201
      return {
        message: 'Budget created successfully',
        budget: newBudget,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Create budget error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to create budget',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    body: t.Object({
      period: t.String(), // Format: YYYY-MM
      amountTotal: t.Number({ minimum: 0 }),
      categories: t.Array(t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        budgeted: t.Number({ minimum: 0 }),
        spent: t.Optional(t.Number({ minimum: 0 }))
      }))
    }),
    detail: {
      tags: ['budgets'],
      summary: 'Create new budget',
      description: 'Create a new monthly budget'
    }
  })

  .get('/:id', async ({ params, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const budget = mockBudgets.find(b => b.id === id && b.userId === userId)
      
      if (!budget) {
        set.status = 404
        return {
          error: 'Budget Not Found',
          message: `Budget with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      return {
        budget,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get budget error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve budget',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['budgets'],
      summary: 'Get budget by ID',
      description: 'Retrieve specific budget information'
    }
  })

  .put('/:id', async ({ params, body, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const budgetIndex = mockBudgets.findIndex(b => b.id === id && b.userId === userId)
      
      if (budgetIndex === -1) {
        set.status = 404
        return {
          error: 'Budget Not Found',
          message: `Budget with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Update budget
      mockBudgets[budgetIndex] = {
        ...mockBudgets[budgetIndex],
        ...body,
        updatedAt: new Date().toISOString()
      }

      return {
        message: 'Budget updated successfully',
        budget: mockBudgets[budgetIndex],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Update budget error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to update budget',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      period: t.Optional(t.String()),
      amountTotal: t.Optional(t.Number({ minimum: 0 })),
      categories: t.Optional(t.Array(t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        budgeted: t.Number({ minimum: 0 }),
        spent: t.Optional(t.Number({ minimum: 0 }))
      })))
    }),
    detail: {
      tags: ['budgets'],
      summary: 'Update budget',
      description: 'Update budget information'
    }
  })

  .delete('/:id', async ({ params, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const budgetIndex = mockBudgets.findIndex(b => b.id === id && b.userId === userId)
      
      if (budgetIndex === -1) {
        set.status = 404
        return {
          error: 'Budget Not Found',
          message: `Budget with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Remove budget
      mockBudgets.splice(budgetIndex, 1)

      return {
        message: 'Budget deleted successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Delete budget error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to delete budget',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['budgets'],
      summary: 'Delete budget',
      description: 'Delete budget'
    }
  })