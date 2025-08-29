'use client'

import { 
  Card, CardBody, CardHeader, Button, Progress, 
  Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Input, Select, SelectItem
} from '@heroui/react'
import MainLayout from '../../components/layout/main-layout'

const currentBudget = {
  period: 'January 2024',
  totalBudget: 3000,
  totalSpent: 2150,
  categories: [
    { name: 'Groceries', budgeted: 600, spent: 485, color: 'success' },
    { name: 'Dining Out', budgeted: 300, spent: 425, color: 'danger' },
    { name: 'Transportation', budgeted: 400, spent: 285, color: 'success' },
    { name: 'Entertainment', budgeted: 200, spent: 145, color: 'primary' },
    { name: 'Utilities', budgeted: 350, spent: 380, color: 'warning' },
    { name: 'Healthcare', budgeted: 250, spent: 125, color: 'success' },
    { name: 'Shopping', budgeted: 400, spent: 305, color: 'primary' },
    { name: 'Miscellaneous', budgeted: 500, spent: 0, color: 'default' }
  ]
}

const budgetHistory = [
  { period: 'December 2023', totalBudget: 3000, totalSpent: 2850, variance: -150 },
  { period: 'November 2023', totalBudget: 3000, totalSpent: 2650, variance: 350 },
  { period: 'October 2023', totalBudget: 2800, totalSpent: 2900, variance: -100 }
]

export default function BudgetsPage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  const getBudgetColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100
    if (percentage > 100) return 'danger'
    if (percentage > 90) return 'warning' 
    if (percentage > 70) return 'primary'
    return 'success'
  }

  const remaining = currentBudget.totalBudget - currentBudget.totalSpent

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Budgets</h1>
            <p className="text-default-600 mt-1">Track and manage your spending with envelope budgeting</p>
          </div>
          <div className="flex gap-3">
            <Button variant="bordered">Copy Last Month</Button>
            <Button color="primary" onPress={onOpen}>Create Budget</Button>
          </div>
        </div>

        {/* Current Budget Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">{currentBudget.period} Budget</h2>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  <span className="text-success">${remaining}</span>
                  <span className="text-default-600"> / ${currentBudget.totalBudget}</span>
                </div>
                <div className="text-sm text-default-600">Remaining</div>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Overall Budget Progress</span>
                <span>${currentBudget.totalSpent} / ${currentBudget.totalBudget}</span>
              </div>
              <Progress 
                value={(currentBudget.totalSpent / currentBudget.totalBudget) * 100} 
                color={getBudgetColor(currentBudget.totalSpent, currentBudget.totalBudget)}
                className="max-w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-success-50">
                <CardBody className="text-center">
                  <div className="text-2xl font-bold text-success">${currentBudget.totalBudget}</div>
                  <div className="text-sm">Total Budget</div>
                </CardBody>
              </Card>
              <Card className="bg-primary-50">
                <CardBody className="text-center">
                  <div className="text-2xl font-bold text-primary">${currentBudget.totalSpent}</div>
                  <div className="text-sm">Total Spent</div>
                </CardBody>
              </Card>
              <Card className={remaining >= 0 ? 'bg-success-50' : 'bg-danger-50'}>
                <CardBody className="text-center">
                  <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${Math.abs(remaining)}
                  </div>
                  <div className="text-sm">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>

        <Tabs aria-label="Budget tabs">
          <Tab key="current" title="Current Budget">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentBudget.categories.map((category, index) => (
                  <Card key={index}>
                    <CardBody>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Button size="sm" variant="light">Edit</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent</span>
                          <span className="text-default-600">
                            ${category.spent} / ${category.budgeted}
                          </span>
                        </div>
                        <Progress 
                          value={(category.spent / category.budgeted) * 100} 
                          color={getBudgetColor(category.spent, category.budgeted)}
                          className="max-w-full"
                        />
                        <div className="flex justify-between text-xs text-default-600">
                          <span>
                            {category.spent > category.budgeted ? 'Over' : 'Remaining'}: 
                            ${Math.abs(category.budgeted - category.spent)}
                          </span>
                          <span>
                            {((category.spent / category.budgeted) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
          
          <Tab key="history" title="Budget History">
            <div className="space-y-4">
              {budgetHistory.map((budget, index) => (
                <Card key={index}>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{budget.period}</h3>
                        <div className="text-sm text-default-600">
                          Spent: ${budget.totalSpent} of ${budget.totalBudget}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          budget.variance >= 0 ? 'text-success' : 'text-danger'
                        }`}>
                          {budget.variance >= 0 ? '+' : ''}${budget.variance}
                        </div>
                        <div className="text-sm text-default-600">
                          {budget.variance >= 0 ? 'Under' : 'Over'} Budget
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(budget.totalSpent / budget.totalBudget) * 100} 
                      color={budget.variance >= 0 ? 'success' : 'danger'}
                      className="mt-3"
                    />
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
          
          <Tab key="insights" title="Insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Budget Insights</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="p-4 bg-warning-50 rounded-lg">
                    <div className="font-medium text-warning-700">⚠️ Dining Out Over Budget</div>
                    <div className="text-sm text-warning-600 mt-1">
                      You've spent $425 out of $300 budgeted. Consider cooking at home more often.
                    </div>
                  </div>
                  
                  <div className="p-4 bg-success-50 rounded-lg">
                    <div className="font-medium text-success-700">✅ Transportation Savings</div>
                    <div className="text-sm text-success-600 mt-1">
                      You're $115 under budget for transportation. Great job!
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <div className="font-medium text-primary-700">💡 Budget Recommendation</div>
                    <div className="text-sm text-primary-600 mt-1">
                      Based on your spending patterns, consider increasing your dining budget to $350 and reducing miscellaneous by $50.
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Spending Trends</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-64 flex items-center justify-center bg-default-100 rounded-lg">
                    <div className="text-center text-default-600">
                      <div className="text-4xl mb-2">📈</div>
                      <div className="font-medium">Category Spending Trends</div>
                      <div className="text-sm mt-1">Monthly comparison and patterns</div>
                      <div className="text-xs mt-2">(Coming Soon)</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        {/* Create Budget Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Create New Budget</ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Select label="Budget Period" placeholder="Select period" selectionMode="single">
                        <SelectItem key="feb2024" value="feb2024">February 2024</SelectItem>
                        <SelectItem key="mar2024" value="mar2024">March 2024</SelectItem>
                        <SelectItem key="apr2024" value="apr2024">April 2024</SelectItem>
                      </Select>
                      <Input
                        type="number"
                        label="Total Budget"
                        placeholder="3000"
                        startContent="$"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Category Budgets</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Groceries" startContent="$" placeholder="600" />
                        <Input label="Dining Out" startContent="$" placeholder="300" />
                        <Input label="Transportation" startContent="$" placeholder="400" />
                        <Input label="Entertainment" startContent="$" placeholder="200" />
                        <Input label="Utilities" startContent="$" placeholder="350" />
                        <Input label="Healthcare" startContent="$" placeholder="250" />
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Create Budget
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  )
}