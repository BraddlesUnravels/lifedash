import { Card, CardBody, Button } from '@heroui/react';
import MainLayout from '../components/layout/main-layout';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Welcome to Life's Next
          </h1>
          <p className="text-xl text-default-600 max-w-2xl mx-auto">
            Reduce friction in financial tracking with automated data ingestion and goal
            visualization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-4">
            <CardBody className="text-center space-y-4">
              <div className="text-3xl">📊</div>
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <p className="text-default-600">
                View your financial overview with interactive charts and KPIs
              </p>
              <Button color="primary" variant="flat" size="sm">
                View Dashboard
              </Button>
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardBody className="text-center space-y-4">
              <div className="text-3xl">🎯</div>
              <h3 className="text-xl font-semibold">Goals</h3>
              <p className="text-default-600">
                Set and track progress toward your financial objectives
              </p>
              <Button color="secondary" variant="flat" size="sm">
                Manage Goals
              </Button>
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardBody className="text-center space-y-4">
              <div className="text-3xl">💰</div>
              <h3 className="text-xl font-semibold">Transactions</h3>
              <p className="text-default-600">Import and categorize your financial transactions</p>
              <Button color="success" variant="flat" size="sm">
                Import Data
              </Button>
            </CardBody>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <CardBody className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Get Started</h2>
            <p className="text-default-600 max-w-xl mx-auto">
              Begin by importing your financial data or setting up your first goal. Our automated
              categorization will help organize your transactions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button color="primary" size="lg">
                Import CSV Data
              </Button>
              <Button color="secondary" variant="bordered" size="lg">
                Create First Goal
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
