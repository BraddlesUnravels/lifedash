'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Tabs,
  Tab,
  Divider,
  Avatar,
} from '@heroui/react';
import MainLayout from '../../components/layout/main-layout';

const currencies = [
  { key: 'USD', label: 'USD - US Dollar' },
  { key: 'EUR', label: 'EUR - Euro' },
  { key: 'GBP', label: 'GBP - British Pound' },
  { key: 'AUD', label: 'AUD - Australian Dollar' },
  { key: 'CAD', label: 'CAD - Canadian Dollar' },
];

const timeZones = [
  { key: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { key: 'America/New_York', label: 'EST - Eastern Standard Time' },
  { key: 'America/Los_Angeles', label: 'PST - Pacific Standard Time' },
  { key: 'Europe/London', label: 'GMT - Greenwich Mean Time' },
  { key: 'Australia/Sydney', label: 'AEST - Australian Eastern Time' },
];

const categories = [
  'Groceries',
  'Dining Out',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Income',
  'Investment',
];

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-default-600 mt-1">Manage your account and application preferences</p>
        </div>

        <Tabs aria-label="Settings tabs" className="w-full">
          <Tab key="profile" title="Profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar src="https://i.pravatar.cc/150?u=user" className="w-20 h-20" />
                    <div>
                      <Button size="sm" color="primary" variant="flat">
                        Change Photo
                      </Button>
                      <div className="text-xs text-default-600 mt-1">JPG, GIF or PNG. 1MB max.</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" defaultValue="John" />
                    <Input label="Last Name" placeholder="Doe" defaultValue="Doe" />
                    <Input
                      type="email"
                      label="Email"
                      placeholder="john@example.com"
                      defaultValue="user@example.com"
                      className="col-span-full"
                    />
                    <Input type="tel" label="Phone Number" placeholder="+1 (555) 000-0000" />
                    <Select
                      label="Time Zone"
                      placeholder="Select timezone"
                      defaultSelectedKeys={['UTC']}
                      selectionMode="single"
                    >
                      {timeZones.map((tz) => (
                        <SelectItem key={tz.key}>{tz.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button color="primary">Save Changes</Button>
                    <Button variant="bordered">Cancel</Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Security</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      type="password"
                      label="Current Password"
                      placeholder="Enter current password"
                    />
                    <Input type="password" label="New Password" placeholder="Enter new password" />
                    <Input
                      type="password"
                      label="Confirm New Password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-default-600">Add an extra layer of security</div>
                    </div>
                    <Switch defaultSelected={false} />
                  </div>

                  <Button color="primary">Update Password</Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="preferences" title="Preferences">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Currency & Formatting</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Primary Currency"
                      placeholder="Select currency"
                      defaultSelectedKeys={['USD']}
                      selectionMode="single"
                    >
                      {currencies.map((currency) => (
                        <SelectItem key={currency.key}>{currency.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Date Format"
                      placeholder="Select format"
                      defaultSelectedKeys={['MM/DD/YYYY']}
                      selectionMode="single"
                    >
                      <SelectItem key="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem key="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem key="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Show Cents</div>
                        <div className="text-sm text-default-600">
                          Display currency with decimal places
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Compact Numbers</div>
                        <div className="text-sm text-default-600">
                          Show large numbers as 1.2K, 1.5M, etc.
                        </div>
                      </div>
                      <Switch defaultSelected={false} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Dashboard Preferences</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Auto-refresh Data</div>
                        <div className="text-sm text-default-600">
                          Automatically update financial data
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Show Goal Progress</div>
                        <div className="text-sm text-default-600">
                          Display goal progress on dashboard
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Compact View</div>
                        <div className="text-sm text-default-600">
                          Show more information in less space
                        </div>
                      </div>
                      <Switch defaultSelected={false} />
                    </div>
                  </div>

                  <Select
                    label="Default Dashboard Period"
                    placeholder="Select period"
                    defaultSelectedKeys={['30days']}
                  >
                    <SelectItem key="7days">Last 7 days</SelectItem>
                    <SelectItem key="30days">Last 30 days</SelectItem>
                    <SelectItem key="90days">Last 90 days</SelectItem>
                    <SelectItem key="1year">Last year</SelectItem>
                  </Select>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="categories" title="Categories">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-lg font-semibold">Transaction Categories</h3>
                    <Button color="primary" size="sm">
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border border-divider rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                          <span>{category}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="light">
                            Edit
                          </Button>
                          <Button size="sm" variant="light" color="danger">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Auto-Categorization Rules</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Supermarket Rule</div>
                          <div className="text-sm text-default-600">
                            Woolworths, Coles → Groceries
                          </div>
                        </div>
                        <Button size="sm" variant="light">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Gas Station Rule</div>
                          <div className="text-sm text-default-600">
                            Shell, BP, Mobil → Transportation
                          </div>
                        </div>
                        <Button size="sm" variant="light">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 border border-divider rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Streaming Services</div>
                          <div className="text-sm text-default-600">
                            Netflix, Spotify → Entertainment
                          </div>
                        </div>
                        <Button size="sm" variant="light">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button color="primary" variant="flat">
                    Add New Rule
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="notifications" title="Notifications">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Budget Alerts</div>
                        <div className="text-sm text-default-600">
                          When approaching budget limits
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Goal Milestones</div>
                        <div className="text-sm text-default-600">
                          When reaching goal milestones
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Weekly Summary</div>
                        <div className="text-sm text-default-600">
                          Weekly spending and income summary
                        </div>
                      </div>
                      <Switch defaultSelected={false} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Large Transactions</div>
                        <div className="text-sm text-default-600">
                          Alert for transactions over $500
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-4">
                    <h4 className="font-medium">Delivery Methods</h4>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">In-App Notifications</div>
                        <div className="text-sm text-default-600">
                          Show notifications within the app
                        </div>
                      </div>
                      <Switch defaultSelected={true} />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-default-600">
                          Send notifications to your email
                        </div>
                      </div>
                      <Switch defaultSelected={false} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="data" title="Data & Privacy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Data Management</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Export Data</div>
                        <div className="text-sm text-default-600">
                          Download all your financial data
                        </div>
                      </div>
                      <Button variant="bordered">Export CSV</Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Data Backup</div>
                        <div className="text-sm text-default-600">Create a backup of your data</div>
                      </div>
                      <Button variant="bordered">Create Backup</Button>
                    </div>
                  </div>

                  <Divider />

                  <div className="space-y-4">
                    <h4 className="font-medium text-danger">Danger Zone</h4>

                    <div className="p-4 border border-danger-200 rounded-lg bg-danger-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-danger">Delete Account</div>
                          <div className="text-sm text-danger-600">
                            Permanently delete your account and all data. This cannot be undone.
                          </div>
                        </div>
                        <Button color="danger" variant="bordered">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </MainLayout>
  );
}
