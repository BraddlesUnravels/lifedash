import { Card, CardBody, CardHeader, Progress, Button } from '@heroui/react'
import MainLayout from '../../components/layout/main-layout'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-default-600 mt-1">Your financial overview at a glance</p>
          </div>
          <Button color="primary">Refresh Data</Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-success">$12,450</div>
              <div className="text-sm text-default-600">Net Worth</div>
              <div className="text-xs text-success">+5.2% this month</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-primary">$3,280</div>
              <div className="text-sm text-default-600">Monthly Income</div>
              <div className="text-xs text-primary">+2.1% vs last month</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-warning">$2,150</div>
              <div className="text-sm text-default-600">Monthly Expenses</div>
              <div className="text-xs text-warning">-1.5% vs last month</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-secondary">$1,130</div>
              <div className="text-sm text-default-600">Monthly Savings</div>
              <div className="text-xs text-success">+8.3% vs last month</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Goal Progress</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Emergency Fund</span>
                  <span className="text-sm text-default-600">$8,500 / $10,000</span>
                </div>
                <Progress value={85} color="success" className="max-w-md" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">House Down Payment</span>
                  <span className="text-sm text-default-600">$15,000 / $80,000</span>
                </div>
                <Progress value={18.75} color="primary" className="max-w-md" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Vacation Fund</span>
                  <span className="text-sm text-default-600">$2,800 / $5,000</span>
                </div>
                <Progress value={56} color="secondary" className="max-w-md" />
              </div>
            </CardBody>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Woolworths</div>
                    <div className="text-sm text-default-600">Groceries • Today</div>
                  </div>
                  <div className="text-warning font-semibold">-$87.50</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Salary Deposit</div>
                    <div className="text-sm text-default-600">Income • 2 days ago</div>
                  </div>
                  <div className="text-success font-semibold">+$3,280.00</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Shell</div>
                    <div className="text-sm text-default-600">Fuel • 3 days ago</div>
                  </div>
                  <div className="text-warning font-semibold">-$65.40</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Netflix</div>
                    <div className="text-sm text-default-600">Entertainment • 5 days ago</div>
                  </div>
                  <div className="text-warning font-semibold">-$17.99</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Placeholder for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Cash Flow Trend</h3>
            </CardHeader>
            <CardBody>
              <div className="h-64 flex items-center justify-center bg-default-100 rounded-lg">
                <div className="text-center text-default-600">
                  <div className="text-4xl mb-2">📈</div>
                  <div>Cash Flow Chart</div>
                  <div className="text-sm">(Coming Soon)</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Spending Categories</h3>
            </CardHeader>
            <CardBody>
              <div className="h-64 flex items-center justify-center bg-default-100 rounded-lg">
                <div className="text-center text-default-600">
                  <div className="text-4xl mb-2">🍰</div>
                  <div>Category Breakdown</div>
                  <div className="text-sm">(Coming Soon)</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}