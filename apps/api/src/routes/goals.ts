import { Elysia, t } from 'elysia';

const mockGoals = [
  {
    id: '1',
    userId: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 8500,
    deadline: '2024-06-30',
    type: 'savings',
    priority: 'high',
    status: 'on_track',
    monthlyContribution: 500,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: '2',
    userId: '1',
    name: 'House Down Payment',
    targetAmount: 80000,
    currentAmount: 15000,
    deadline: '2028-01-31',
    type: 'savings',
    priority: 'high',
    status: 'behind',
    monthlyContribution: 1200,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: '3',
    userId: '1',
    name: 'Vacation to Europe',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2024-12-01',
    type: 'short_term',
    priority: 'medium',
    status: 'on_track',
    monthlyContribution: 250,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
];

export const goalRoutes = new Elysia({ prefix: '/goals' })
  .get(
    '/',
    async ({ query }) => {
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        let filteredGoals = mockGoals.filter((goal) => goal.userId === userId);

        // Apply filters
        if (query.type) {
          filteredGoals = filteredGoals.filter((g) => g.type === query.type);
        }
        if (query.status) {
          filteredGoals = filteredGoals.filter((g) => g.status === query.status);
        }
        if (query.priority) {
          filteredGoals = filteredGoals.filter((g) => g.priority === query.priority);
        }

        return {
          goals: filteredGoals,
          total: filteredGoals.length,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Get goals error:', error);
        return {
          error: 'Internal Server Error',
          message: 'Unable to retrieve goals',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      query: t.Object({
        type: t.Optional(
          t.Union([
            t.Literal('savings'),
            t.Literal('debt'),
            t.Literal('investment'),
            t.Literal('short_term'),
          ]),
        ),
        status: t.Optional(
          t.Union([
            t.Literal('on_track'),
            t.Literal('behind'),
            t.Literal('ahead'),
            t.Literal('completed'),
          ]),
        ),
        priority: t.Optional(
          t.Union([
            t.Literal('low'),
            t.Literal('medium'),
            t.Literal('high'),
            t.Literal('critical'),
          ]),
        ),
      }),
      detail: {
        tags: ['goals'],
        summary: 'Get user goals',
        description: 'Retrieve all goals for the authenticated user',
      },
    },
  )

  .post(
    '/',
    async ({ body, set }) => {
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        const newGoal = {
          id: (mockGoals.length + 1).toString(),
          userId,
          name: body.name,
          targetAmount: body.targetAmount,
          currentAmount: body.currentAmount ?? 0,
          deadline: body.deadline,
          type: body.type,
          priority: body.priority,
          monthlyContribution: body.monthlyContribution ?? 0,
          status: 'on_track',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockGoals.push(newGoal);

        set.status = 201;
        return {
          message: 'Goal created successfully',
          goal: newGoal,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Create goal error:', error);
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Unable to create goal',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 200 }),
        targetAmount: t.Number({ minimum: 0 }),
        currentAmount: t.Optional(t.Number({ minimum: 0 })),
        deadline: t.String(),
        type: t.Union([
          t.Literal('savings'),
          t.Literal('debt'),
          t.Literal('investment'),
          t.Literal('short_term'),
        ]),
        priority: t.Union([
          t.Literal('low'),
          t.Literal('medium'),
          t.Literal('high'),
          t.Literal('critical'),
        ]),
        monthlyContribution: t.Optional(t.Number({ minimum: 0 })),
      }),
      detail: {
        tags: ['goals'],
        summary: 'Create new goal',
        description: 'Create a new financial goal',
      },
    },
  )

  .get(
    '/:id',
    async ({ params, set }) => {
      const { id } = params;
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        const goal = mockGoals.find((g) => g.id === id && g.userId === userId);

        if (!goal) {
          set.status = 404;
          return {
            error: 'Goal Not Found',
            message: `Goal with ID ${id} not found`,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          goal,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Get goal error:', error);
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Unable to retrieve goal',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['goals'],
        summary: 'Get goal by ID',
        description: 'Retrieve specific goal information',
      },
    },
  )

  .get(
    '/:id/projection',
    async ({ params, query, set }) => {
      const { id } = params;
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        const goal = mockGoals.find((g) => g.id === id && g.userId === userId);

        if (!goal) {
          set.status = 404;
          return {
            error: 'Goal Not Found',
            message: `Goal with ID ${id} not found`,
            timestamp: new Date().toISOString(),
          };
        }

        // TODO: Implement Monte Carlo projection calculations
        // Mock projection data for now
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        const monthsToDeadline = 6; // Mock calculation
        const suggestedMonthly = remainingAmount / monthsToDeadline;

        const projection = {
          goalId: id,
          currentAmount: goal.currentAmount,
          targetAmount: goal.targetAmount,
          remainingAmount,
          monthsToDeadline,
          suggestedMonthlyContribution: suggestedMonthly,
          projectedCompletionDate: '2024-06-15',
          probability: {
            onTime: 85,
            oneMonthLate: 95,
            threeMonthsLate: 99,
          },
          scenarios: [
            {
              monthlyAmount: goal.monthlyContribution,
              completionDate: '2024-06-30',
              probability: 85,
            },
            { monthlyAmount: suggestedMonthly, completionDate: '2024-06-15', probability: 95 },
            {
              monthlyAmount: goal.monthlyContribution + 100,
              completionDate: '2024-05-30',
              probability: 98,
            },
          ],
        };

        return {
          projection,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Get goal projection error:', error);
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Unable to calculate goal projection',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        monthlyContribution: t.Optional(t.Number()),
        timeframe: t.Optional(t.Number()), // months
      }),
      detail: {
        tags: ['goals'],
        summary: 'Get goal projection',
        description: 'Get Monte Carlo projection for goal completion',
      },
    },
  )

  .put(
    '/:id',
    async ({ params, body, set }) => {
      const { id } = params;
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        const goalIndex = mockGoals.findIndex((g) => g.id === id && g.userId === userId);

        if (goalIndex === -1) {
          set.status = 404;
          return {
            error: 'Goal Not Found',
            message: `Goal with ID ${id} not found`,
            timestamp: new Date().toISOString(),
          };
        }

        // Update goal
        const currentGoal = mockGoals[goalIndex]!;
        mockGoals[goalIndex] = {
          id: currentGoal.id,
          userId: currentGoal.userId,
          name: body.name || currentGoal.name,
          targetAmount:
            body.targetAmount !== undefined ? body.targetAmount : currentGoal.targetAmount,
          currentAmount:
            body.currentAmount !== undefined ? body.currentAmount : currentGoal.currentAmount,
          deadline: body.deadline || currentGoal.deadline,
          type: body.type || currentGoal.type,
          priority: body.priority || currentGoal.priority,
          status: body.status || currentGoal.status,
          monthlyContribution:
            body.monthlyContribution !== undefined
              ? body.monthlyContribution
              : currentGoal.monthlyContribution,
          createdAt: currentGoal.createdAt,
          updatedAt: new Date().toISOString(),
        };

        return {
          message: 'Goal updated successfully',
          goal: mockGoals[goalIndex],
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Update goal error:', error);
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Unable to update goal',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
        targetAmount: t.Optional(t.Number({ minimum: 0 })),
        currentAmount: t.Optional(t.Number({ minimum: 0 })),
        deadline: t.Optional(t.String()),
        type: t.Optional(
          t.Union([
            t.Literal('savings'),
            t.Literal('debt'),
            t.Literal('investment'),
            t.Literal('short_term'),
          ]),
        ),
        priority: t.Optional(
          t.Union([
            t.Literal('low'),
            t.Literal('medium'),
            t.Literal('high'),
            t.Literal('critical'),
          ]),
        ),
        status: t.Optional(
          t.Union([
            t.Literal('on_track'),
            t.Literal('behind'),
            t.Literal('ahead'),
            t.Literal('completed'),
          ]),
        ),
        monthlyContribution: t.Optional(t.Number({ minimum: 0 })),
      }),
      detail: {
        tags: ['goals'],
        summary: 'Update goal',
        description: 'Update goal information',
      },
    },
  )

  .delete(
    '/:id',
    async ({ params, set }) => {
      const { id } = params;
      // TODO: Get user ID from JWT token
      const userId = '1'; // Mock user ID

      try {
        const goalIndex = mockGoals.findIndex((g) => g.id === id && g.userId === userId);

        if (goalIndex === -1) {
          set.status = 404;
          return {
            error: 'Goal Not Found',
            message: `Goal with ID ${id} not found`,
            timestamp: new Date().toISOString(),
          };
        }

        // Remove goal
        mockGoals.splice(goalIndex, 1);

        return {
          message: 'Goal deleted successfully',
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Delete goal error:', error);
        set.status = 500;
        return {
          error: 'Internal Server Error',
          message: 'Unable to delete goal',
          timestamp: new Date().toISOString(),
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['goals'],
        summary: 'Delete goal',
        description: 'Delete goal',
      },
    },
  );
