import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Home, 
  User, 
  CreditCard, 
  FileText, 
  Receipt,
  Calculator,
  LogOut,
  ChevronRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard - TaxEnd.AI',
  description: 'Manage your tax returns and account',
}

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaxEnd.AI
            </Link>
            <ChevronRight className="text-gray-400" size={20} />
            <span className="text-gray-600">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, John</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
