'use client'

import { 
  Card, CardBody, CardHeader, Button, Input, Select, SelectItem,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Pagination
} from '@heroui/react'
import MainLayout from '../../components/layout/main-layout'

const mockTransactions = [
  {
    id: 1,
    date: '2024-01-15',
    merchant: 'Woolworths',
    amount: -87.50,
    category: 'Groceries',
    account: 'Checking',
    status: 'cleared'
  },
  {
    id: 2,
    date: '2024-01-14',
    merchant: 'Salary Deposit',
    amount: 3280.00,
    category: 'Income',
    account: 'Checking',
    status: 'cleared'
  },
  {
    id: 3,
    date: '2024-01-13',
    merchant: 'Shell',
    amount: -65.40,
    category: 'Fuel',
    account: 'Checking',
    status: 'pending'
  },
  {
    id: 4,
    date: '2024-01-12',
    merchant: 'Netflix',
    amount: -17.99,
    category: 'Entertainment',
    account: 'Credit Card',
    status: 'cleared'
  },
  {
    id: 5,
    date: '2024-01-11',
    merchant: 'Coffee Club',
    amount: -8.50,
    category: 'Dining',
    account: 'Checking',
    status: 'cleared'
  }
]

const categories = ['All', 'Income', 'Groceries', 'Fuel', 'Entertainment', 'Dining', 'Utilities', 'Other']

export default function TransactionsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-default-600 mt-1">Manage and categorize your financial transactions</p>
          </div>
          <div className="flex gap-3">
            <Button color="secondary" variant="bordered">
              Export CSV
            </Button>
            <Button color="primary">
              Import CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search transactions..."
                className="min-w-64"
                startContent={<span className="text-default-600">🔍</span>}
              />
              <Select placeholder="Category" className="min-w-48" selectionMode="single">
                {categories.map((category) => (
                  <SelectItem key={category.toLowerCase()} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
              <Select placeholder="Account" className="min-w-48" selectionMode="single">
                <SelectItem key="checking" value="checking">Checking</SelectItem>
                <SelectItem key="savings" value="savings">Savings</SelectItem>
                <SelectItem key="credit" value="credit">Credit Card</SelectItem>
              </Select>
              <Input
                type="date"
                label="From Date"
                className="min-w-48"
              />
              <Input
                type="date"
                label="To Date"
                className="min-w-48"
              />
            </div>
          </CardBody>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-lg font-bold text-success">+$3,280.00</div>
              <div className="text-sm text-default-600">Total Income</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-lg font-bold text-danger">-$179.39</div>
              <div className="text-sm text-default-600">Total Expenses</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-lg font-bold text-primary">+$3,100.61</div>
              <div className="text-sm text-default-600">Net Income</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-lg font-bold">5</div>
              <div className="text-sm text-default-600">Total Transactions</div>
            </CardBody>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="flat">
                  Bulk Edit
                </Button>
                <Button size="sm" variant="flat">
                  Auto-Categorize
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Transactions table">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>MERCHANT</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>ACCOUNT</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">{transaction.merchant}</TableCell>
                    <TableCell>
                      <span className={transaction.amount > 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        color={transaction.category === 'Income' ? 'success' : 'default'}
                        variant="flat"
                      >
                        {transaction.category}
                      </Chip>
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        color={transaction.status === 'cleared' ? 'success' : 'warning'}
                        variant="dot"
                      >
                        {transaction.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="light">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-center mt-4">
              <Pagination total={10} initialPage={1} />
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}