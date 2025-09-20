'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { 
  Home, 
  User, 
  CreditCard, 
  FileText, 
  Receipt,
  Calculator,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Overview', href: '/dashboard' },
  { icon: Calculator, label: 'Tax Calculator', href: '/dashboard/calculator' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: CreditCard, label: 'Subscription', href: '/dashboard/subscription' },
  { icon: FileText, label: 'Tax Returns', href: '/dashboard/tax-returns' },
  { icon: Receipt, label: 'Billing', href: '/dashboard/billing' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand={true}
      />
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaxEnd.AI
            </Link>
            <ChevronRight className="hidden sm:block text-gray-400" size={20} />
            <span className="hidden sm:block text-gray-600">Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden sm:block text-sm text-gray-600">Welcome back, John</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : '-100%',
          }}
          className="fixed lg:static lg:translate-x-0 w-64 bg-white border-r min-h-[calc(100vh-73px)] z-40 lg:z-auto"
        >
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
