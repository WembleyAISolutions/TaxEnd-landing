'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator,
  User,
  CreditCard,
  RefreshCw
} from 'lucide-react'
import { AnimatedCounter } from './components/AnimatedCounter'
import { StatCardSkeleton, ActivitySkeleton } from './components/SkeletonLoader'
import { DashboardCharts } from './components/DashboardCharts'

const stats = [
  { label: 'Tax Saved', value: '$3,247', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Returns Filed', value: '3', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Refund Expected', value: '$1,832', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Next Deadline', value: 'Oct 31', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
]

const recentActivity = [
  { id: 1, type: 'success', message: '2024 Tax Return submitted successfully', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'New deduction opportunity identified: $450', time: '1 day ago' },
  { id: 3, type: 'warning', message: 'Quarterly BAS statement due in 5 days', time: '2 days ago' },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <ActivitySkeleton />
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your tax status at a glance.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw 
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
          />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <AnimatedCounter 
              value={stat.value}
              className="text-2xl font-bold text-gray-900 block"
            />
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tax Analytics Charts */}
      <DashboardCharts />

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm border"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6 space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div 
              key={activity.id} 
              className="flex items-start space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              {activity.type === 'success' && <CheckCircle className="text-green-500 mt-1" size={20} />}
              {activity.type === 'info' && <AlertCircle className="text-blue-500 mt-1" size={20} />}
              {activity.type === 'warning' && <Clock className="text-yellow-500 mt-1" size={20} />}
              <div className="flex-1">
                <p className="text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {[
          { href: '/dashboard/calculator', icon: Calculator, title: 'Tax Calculator', desc: 'Calculate your tax liability', color: 'bg-blue-600 hover:bg-blue-700' },
          { href: '/dashboard/tax-returns', icon: FileText, title: 'Tax Returns', desc: 'View your filing history', color: 'bg-purple-600 hover:bg-purple-700' },
          { href: '/dashboard/profile', icon: User, title: 'Profile Settings', desc: 'Manage your account', color: 'bg-green-600 hover:bg-green-700' }
        ].map((action, index) => (
          <motion.div
            key={action.href}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          >
            <Link href={action.href} className={`${action.color} text-white p-6 rounded-xl transition-all text-left block shadow-lg`}>
              <action.icon className="mb-3" size={24} />
              <h3 className="font-semibold text-lg">{action.title}</h3>
              <p className="text-white/80 text-sm mt-1">{action.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
