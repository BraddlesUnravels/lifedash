import { Elysia, t } from 'elysia'

const mockTransactions = [
  {
    id: '1',
    accountId: '1',
    date: '2024-01-15',
    amount: -87.50,
    merchant: 'Woolworths',
    category: 'Groceries',
    notes: 'Weekly groceries',
    importedSource: 'manual',
    createdBy: 'human',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '2',
    accountId: '1',
    date: '2024-01-14',
    amount: 3280.00,
    merchant: 'Salary Deposit',
    category: 'Income',
    notes: 'Monthly salary',
    importedSource: 'manual',
    createdBy: 'human',
    createdAt: '2024-01-14T09:00:00.000Z',
    updatedAt: '2024-01-14T09:00:00.000Z'
  },
  {
    id: '3',
    accountId: '1',
    date: '2024-01-13',
    amount: -65.40,
    merchant: 'Shell',
    category: 'Transportation',
    notes: 'Gas fill-up',
    importedSource: 'manual',
    createdBy: 'human',
    createdAt: '2024-01-13T18:15:00.000Z',
    updatedAt: '2024-01-13T18:15:00.000Z'
  },
  {
    id: '4',
    accountId: '3',
    date: '2024-01-12',
    amount: -17.99,
    merchant: 'Netflix',
    category: 'Entertainment',
    notes: 'Monthly subscription',
    importedSource: 'manual',
    createdBy: 'human',
    createdAt: '2024-01-12T12:00:00.000Z',
    updatedAt: '2024-01-12T12:00:00.000Z'
  },
  {
    id: '5',
    accountId: '1',
    date: '2024-01-11',
    amount: -8.50,
    merchant: 'Coffee Club',
    category: 'Dining',
    notes: 'Morning coffee',
    importedSource: 'manual',
    createdBy: 'human',
    createdAt: '2024-01-11T08:30:00.000Z',
    updatedAt: '2024-01-11T08:30:00.000Z'
  }
]

export const transactionRoutes = new Elysia({ prefix: '/transactions' })
  .get('/', async ({ query }) => {
    // TODO: Get user ID from JWT token and filter by user's accounts
    const userId = '1' // Mock user ID

    try {
      let filteredTransactions = [...mockTransactions]

      // Apply filters
      if (query.accountId) {
        filteredTransactions = filteredTransactions.filter(t => t.accountId === query.accountId)
      }
      if (query.category) {
        filteredTransactions = filteredTransactions.filter(t => t.category.toLowerCase() === query.category.toLowerCase())
      }
      if (query.startDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date >= query.startDate)
      }
      if (query.endDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date <= query.endDate)
      }
      if (query.minAmount) {
        filteredTransactions = filteredTransactions.filter(t => t.amount >= query.minAmount)
      }
      if (query.maxAmount) {
        filteredTransactions = filteredTransactions.filter(t => t.amount <= query.maxAmount)
      }
      if (query.search) {
        const searchLower = query.search.toLowerCase()
        filteredTransactions = filteredTransactions.filter(t => 
          t.merchant.toLowerCase().includes(searchLower) ||
          (t.notes && t.notes.toLowerCase().includes(searchLower))
        )
      }

      // Apply pagination
      const limit = Math.min(query.limit || 50, 100) // Max 100 per request
      const offset = query.offset || 0
      const paginatedTransactions = filteredTransactions.slice(offset, offset + limit)

      // Calculate summary stats
      const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
      const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
      const netAmount = totalIncome - totalExpenses

      return {
        transactions: paginatedTransactions,
        pagination: {
          total: filteredTransactions.length,
          limit,
          offset,
          hasMore: (offset + limit) < filteredTransactions.length
        },
        summary: {
          totalIncome,
          totalExpenses,
          netAmount,
          count: filteredTransactions.length
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get transactions error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve transactions',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      accountId: t.Optional(t.String()),
      category: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
      minAmount: t.Optional(t.Number()),
      maxAmount: t.Optional(t.Number()),
      search: t.Optional(t.String()),
      limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      offset: t.Optional(t.Number({ minimum: 0 }))
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Get transactions',
      description: 'Retrieve transactions with filtering, search, and pagination'
    }
  })

  .post('/', async ({ body, set }) => {
    try {
      // TODO: Validate account belongs to user
      const newTransaction = {
        id: (mockTransactions.length + 1).toString(),
        ...body,
        createdBy: 'human',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockTransactions.push(newTransaction)

      set.status = 201
      return {
        message: 'Transaction created successfully',
        transaction: newTransaction,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Create transaction error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to create transaction',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    body: t.Object({
      accountId: t.String(),
      date: t.String(),
      amount: t.Number(),
      merchant: t.String({ minLength: 1, maxLength: 200 }),
      category: t.String({ minLength: 1, maxLength: 100 }),
      notes: t.Optional(t.String({ maxLength: 500 })),
      importedSource: t.Optional(t.String())
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Create transaction',
      description: 'Create a new transaction'
    }
  })

  .post('/import', async ({ body, set }) => {
    try {
      // TODO: Implement CSV parsing and bulk transaction creation
      // - Parse CSV data
      // - Validate all transactions
      // - Auto-categorize using rules
      // - Bulk insert to database
      
      set.status = 501
      return {
        error: 'Not Implemented',
        message: 'CSV import functionality not yet implemented',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Import transactions error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to import transactions',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    body: t.Object({
      accountId: t.String(),
      csvData: t.String(),
      format: t.Optional(t.String()) // For different CSV formats
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Import transactions from CSV',
      description: 'Bulk import transactions from CSV data'
    }
  })

  .get('/:id', async ({ params, set }) => {
    const { id } = params

    try {
      const transaction = mockTransactions.find(t => t.id === id)
      
      if (!transaction) {
        set.status = 404
        return {
          error: 'Transaction Not Found',
          message: `Transaction with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      return {
        transaction,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get transaction error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve transaction',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Get transaction by ID',
      description: 'Retrieve specific transaction information'
    }
  })

  .put('/:id', async ({ params, body, set }) => {
    const { id } = params

    try {
      const transactionIndex = mockTransactions.findIndex(t => t.id === id)
      
      if (transactionIndex === -1) {
        set.status = 404
        return {
          error: 'Transaction Not Found',
          message: `Transaction with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Update transaction
      mockTransactions[transactionIndex] = {
        ...mockTransactions[transactionIndex],
        ...body,
        updatedAt: new Date().toISOString()
      }

      return {
        message: 'Transaction updated successfully',
        transaction: mockTransactions[transactionIndex],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Update transaction error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to update transaction',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      date: t.Optional(t.String()),
      amount: t.Optional(t.Number()),
      merchant: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
      category: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
      notes: t.Optional(t.String({ maxLength: 500 }))
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Update transaction',
      description: 'Update transaction information'
    }
  })

  .delete('/:id', async ({ params, set }) => {
    const { id } = params

    try {
      const transactionIndex = mockTransactions.findIndex(t => t.id === id)
      
      if (transactionIndex === -1) {
        set.status = 404
        return {
          error: 'Transaction Not Found',
          message: `Transaction with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Remove transaction
      mockTransactions.splice(transactionIndex, 1)

      return {
        message: 'Transaction deleted successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Delete transaction error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to delete transaction',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['transactions'],
      summary: 'Delete transaction',
      description: 'Delete transaction'
    }
  })