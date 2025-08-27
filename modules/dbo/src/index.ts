// Multiple Prisma clients for different database users
export * from './clients';

// Re-export Prisma types for convenience
export type { 
  User, 
  UserCredential, 
  UserSecurity,
  UserEmail,
  UserPhone,
  UserAddress,
  UserSession,
  Institution,
  AccountProduct,
  Account,
  BankAccount,
  CreditCard,
  DebitCard,
  Transaction,
  Category,
  CreditCardStatement,
  CreditCardOffer,
  Goal,
  Budget,
  BudgetCategory,
  RecurringTransaction,
  CategoryRule,
  // Enums
  AccountType,
  AccountStatus,
  CardType,
  TransactionType,
  GoalType,
  GoalStatus,
  BudgetPeriod,
  BudgetStatus,
  RecurringFrequency
} from './generated/prisma';