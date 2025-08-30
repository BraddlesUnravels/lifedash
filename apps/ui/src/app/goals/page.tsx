'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';
import MainLayout from '../../components/layout/main-layout';

const mockGoals = [
  {
    id: 1,
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 8500,
    deadline: '2024-06-30',
    type: 'Savings',
    priority: 'High',
    status: 'On Track',
    monthlyContribution: 500,
  },
  {
    id: 2,
    name: 'House Down Payment',
    targetAmount: 80000,
    currentAmount: 15000,
    deadline: '2028-01-31',
    type: 'Savings',
    priority: 'High',
    status: 'Behind',
    monthlyContribution: 1200,
  },
  {
    id: 3,
    name: 'Vacation to Europe',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2024-12-01',
    type: 'Short-term',
    priority: 'Medium',
    status: 'On Track',
    monthlyContribution: 250,
  },
  {
    id: 4,
    name: 'Pay Off Credit Card',
    targetAmount: 12000,
    currentAmount: 7500,
    deadline: '2024-08-31',
    type: 'Debt',
    priority: 'High',
    status: 'Ahead',
    monthlyContribution: 800,
  },
];

const goalTypes = ['Savings', 'Debt', 'Investment', 'Short-term'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function GoalsPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 30) return 'warning';
    return 'danger';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Financial Goals</h1>
            <p className="text-default-600 mt-1">Track progress toward your financial objectives</p>
          </div>
          <Button color="primary" onPress={onOpen}>
            Create New Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-default-600">Active Goals</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-success">$33,800</div>
              <div className="text-sm text-default-600">Total Progress</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-warning">$107,000</div>
              <div className="text-sm text-default-600">Total Target</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-secondary">32%</div>
              <div className="text-sm text-default-600">Overall Progress</div>
            </CardBody>
          </Card>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockGoals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
                        {goal.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          goal.priority === 'High'
                            ? 'bg-danger-100 text-danger'
                            : goal.priority === 'Medium'
                              ? 'bg-warning-100 text-warning'
                              : 'bg-default-100'
                        }`}
                      >
                        {goal.priority} Priority
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="light">
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-default-600">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    color={getProgressColor(goal.currentAmount, goal.targetAmount)}
                    className="max-w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-default-600">Deadline</div>
                    <div className="font-medium">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-600">Status</div>
                    <div
                      className={`font-medium ${
                        goal.status === 'On Track'
                          ? 'text-success'
                          : goal.status === 'Ahead'
                            ? 'text-primary'
                            : 'text-danger'
                      }`}
                    >
                      {goal.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-default-600">Monthly</div>
                    <div className="font-medium">${goal.monthlyContribution}</div>
                  </div>
                  <div>
                    <div className="text-default-600">Remaining</div>
                    <div className="font-medium">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" color="primary" variant="flat">
                    Add Contribution
                  </Button>
                  <Button size="sm" variant="flat">
                    View Projection
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* What-If Analysis Placeholder */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Goal Projection & What-If Analysis</h3>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-default-100 rounded-lg">
              <div className="text-center text-default-600">
                <div className="text-4xl mb-2">📊</div>
                <div className="font-medium">Monte Carlo Projection</div>
                <div className="text-sm mt-1">Interactive goal timeline and scenario analysis</div>
                <div className="text-xs mt-2">(Coming Soon)</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Create Goal Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Create New Goal</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Goal Name"
                      placeholder="e.g. Emergency Fund"
                      className="col-span-full"
                    />
                    <Input
                      type="number"
                      label="Target Amount"
                      placeholder="10000"
                      startContent="$"
                    />
                    <Input type="date" label="Target Date" />
                    <Select label="Goal Type" placeholder="Select type" selectionMode="single">
                      {goalTypes.map((type) => (
                        <SelectItem key={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </Select>
                    <Select label="Priority" placeholder="Select priority" selectionMode="single">
                      {priorities.map((priority) => (
                        <SelectItem key={priority.toLowerCase()}>{priority}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      label="Monthly Contribution"
                      placeholder="500"
                      startContent="$"
                    />
                    <Input type="number" label="Current Amount" placeholder="0" startContent="$" />
                    <Textarea
                      label="Description"
                      placeholder="Describe your goal and why it's important..."
                      className="col-span-full"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Create Goal
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
}
