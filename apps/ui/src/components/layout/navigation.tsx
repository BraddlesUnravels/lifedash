'use client'

import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button,
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@heroui/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Goals', href: '/goals' },
  { name: 'Budgets', href: '/budgets' },
]

export default function Navigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="flex items-center justify-between w-full h-16 px-4 border-b border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Brand */}
      <div className="flex items-center">
        <Link href="/" className="font-bold text-xl text-primary">
          Life's Next
        </Link>
      </div>

      {/* Center Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-primary/5'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <Switch
          size="sm"
          color="primary"
          isSelected={theme === 'dark'}
          onValueChange={(selected) => setTheme(selected ? 'dark' : 'light')}
          thumbIcon={({ isSelected }) =>
            isSelected ? (
              <span className="text-xs">🌙</span>
            ) : (
              <span className="text-xs">☀️</span>
            )
          }
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              size="sm"
              src="https://i.pravatar.cc/150?u=user"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Welcome back!</p>
              <p className="font-semibold text-primary">user@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" href="/settings">
              Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  )
}