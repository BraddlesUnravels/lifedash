import { Elysia, t } from 'elysia'

const mockAccounts = [
  {
    id: '1',
    userId: '1',
    name: 'Primary Checking',
    type: 'checking',
    provider: 'Chase Bank',
    currency: 'USD',
    balance: 5420.50,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '2', 
    userId: '1',
    name: 'Savings Account',
    type: 'savings',
    provider: 'Chase Bank',
    currency: 'USD',
    balance: 12450.75,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '3',
    userId: '1', 
    name: 'Credit Card',
    type: 'credit',
    provider: 'American Express',
    currency: 'USD',
    balance: -850.25,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  }
]

export const accountRoutes = new Elysia({ prefix: '/accounts' })
  .get('/', async ({ query }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Implement database query with user filtering
      const userAccounts = mockAccounts.filter(account => account.userId === userId)
      
      return {
        accounts: userAccounts,
        total: userAccounts.length,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get accounts error:', error)
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve accounts',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    query: t.Object({
      type: t.Optional(t.String()),
      provider: t.Optional(t.String())
    }),
    detail: {
      tags: ['accounts'],
      summary: 'Get user accounts',
      description: 'Retrieve all accounts for the authenticated user'
    }
  })

  .post('/', async ({ body, set }) => {
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      // TODO: Implement account creation with database
      const newAccount = {
        id: (mockAccounts.length + 1).toString(),
        userId,
        ...body,
        balance: body.initialBalance || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Mock adding to accounts array
      mockAccounts.push(newAccount)

      set.status = 201
      return {
        message: 'Account created successfully',
        account: newAccount,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Create account error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to create account',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 100 }),
      type: t.Union([
        t.Literal('checking'),
        t.Literal('savings'), 
        t.Literal('credit'),
        t.Literal('investment'),
        t.Literal('loan')
      ]),
      provider: t.String({ minLength: 1, maxLength: 100 }),
      currency: t.String({ minLength: 3, maxLength: 3 }),
      initialBalance: t.Optional(t.Number())
    }),
    detail: {
      tags: ['accounts'],
      summary: 'Create new account',
      description: 'Create a new financial account for the user'
    }
  })

  .get('/:id', async ({ params, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const account = mockAccounts.find(acc => acc.id === id && acc.userId === userId)
      
      if (!account) {
        set.status = 404
        return {
          error: 'Account Not Found',
          message: `Account with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      return {
        account,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Get account error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to retrieve account',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['accounts'],
      summary: 'Get account by ID',
      description: 'Retrieve specific account information'
    }
  })

  .put('/:id', async ({ params, body, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const accountIndex = mockAccounts.findIndex(acc => acc.id === id && acc.userId === userId)
      
      if (accountIndex === -1) {
        set.status = 404
        return {
          error: 'Account Not Found',
          message: `Account with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Update account
      mockAccounts[accountIndex] = {
        ...mockAccounts[accountIndex],
        ...body,
        updatedAt: new Date().toISOString()
      }

      return {
        message: 'Account updated successfully',
        account: mockAccounts[accountIndex],
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Update account error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to update account',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
      type: t.Optional(t.Union([
        t.Literal('checking'),
        t.Literal('savings'),
        t.Literal('credit'),
        t.Literal('investment'),
        t.Literal('loan')
      ])),
      provider: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
      currency: t.Optional(t.String({ minLength: 3, maxLength: 3 }))
    }),
    detail: {
      tags: ['accounts'],
      summary: 'Update account',
      description: 'Update account information'
    }
  })

  .delete('/:id', async ({ params, set }) => {
    const { id } = params
    // TODO: Get user ID from JWT token
    const userId = '1' // Mock user ID

    try {
      const accountIndex = mockAccounts.findIndex(acc => acc.id === id && acc.userId === userId)
      
      if (accountIndex === -1) {
        set.status = 404
        return {
          error: 'Account Not Found',
          message: `Account with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      }

      // Remove account
      mockAccounts.splice(accountIndex, 1)

      return {
        message: 'Account deleted successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Delete account error:', error)
      set.status = 500
      return {
        error: 'Internal Server Error',
        message: 'Unable to delete account',
        timestamp: new Date().toISOString()
      }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['accounts'],
      summary: 'Delete account',
      description: 'Delete account and all associated transactions'
    }
  })