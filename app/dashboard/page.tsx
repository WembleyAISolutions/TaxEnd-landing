'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  CreditCard
} from 'lucide-react'

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your tax status at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6 space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {activity.type === 'success' && <CheckCircle className="text-green-500 mt-1" size={20} />}
              {activity.type === 'info' && <AlertCircle className="text-blue-500 mt-1" size={20} />}
              {activity.type === 'warning' && <Clock className="text-yellow-500 mt-1" size={20} />}
              <div className="flex-1">
                <p className="text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/calculator" className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-left block">
          <Calculator className="mb-3" size={24} />
          <h3 className="font-semibold text-lg">Tax Calculator</h3>
          <p className="text-blue-100 text-sm mt-1">Calculate your tax liability</p>
        </Link>
        <Link href="/dashboard/tax-returns" className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors text-left block">
          <FileText className="mb-3" size={24} />
          <h3 className="font-semibold text-lg">Tax Returns</h3>
          <p className="text-purple-100 text-sm mt-1">View your filing history</p>
        </Link>
        <Link href="/dashboard/profile" className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-left block">
          <User className="mb-3" size={24} />
          <h3 className="font-semibold text-lg">Profile Settings</h3>
          <p className="text-green-100 text-sm mt-1">Manage your account</p>
        </Link>
      </div>
    </div>
  )
}
