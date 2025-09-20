'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react'

// Mock data for charts
const taxSavingsData = [
  { month: 'Jan', amount: 245, year: 2024 },
  { month: 'Feb', amount: 312, year: 2024 },
  { month: 'Mar', amount: 189, year: 2024 },
  { month: 'Apr', amount: 456, year: 2024 },
  { month: 'May', amount: 378, year: 2024 },
  { month: 'Jun', amount: 523, year: 2024 },
  { month: 'Jul', amount: 445, year: 2024 },
  { month: 'Aug', amount: 389, year: 2024 },
  { month: 'Sep', amount: 567, year: 2024 },
]

const deductionData = [
  { category: 'Work Expenses', amount: 2450, color: '#3B82F6' },
  { category: 'Home Office', amount: 1200, color: '#10B981' },
  { category: 'Professional Development', amount: 800, color: '#F59E0B' },
  { category: 'Travel', amount: 650, color: '#EF4444' },
  { category: 'Equipment', amount: 400, color: '#8B5CF6' },
  { category: 'Other', amount: 300, color: '#6B7280' },
]

const filingHistoryData = [
  { year: '2021', returns: 1, refund: 987 },
  { year: '2022', returns: 1, refund: 1245 },
  { year: '2023', returns: 1, refund: 2145 },
  { year: '2024', returns: 1, refund: 1832 },
]

const refundTimelineData = [
  { date: '2021-07', amount: 987 },
  { date: '2022-08', amount: 1245 },
  { date: '2023-07', amount: 2145 },
  { date: '2024-07', amount: 1832 },
]

const chartTabs = [
  { id: 'savings', label: 'Tax Savings', icon: TrendingUp },
  { id: 'deductions', label: 'Deductions', icon: PieChartIcon },
  { id: 'history', label: 'Filing History', icon: BarChart3 },
  { id: 'timeline', label: 'Refund Timeline', icon: Calendar },
]

export function DashboardCharts() {
  const [activeTab, setActiveTab] = useState('savings')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (activeTab) {
      case 'savings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taxSavingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'deductions':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deductionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="amount"
                label={({ category, percent }: any) => `${category} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {deductionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'history':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filingHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="refund" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name="Refund Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'timeline':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={refundTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Analytics</h2>
        
        {/* Chart Tabs */}
        <div className="flex flex-wrap gap-2">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderChart()}
        </motion.div>

        {/* Chart Description */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {activeTab === 'savings' && 'Track your monthly tax savings throughout the year to identify patterns and opportunities.'}
            {activeTab === 'deductions' && 'Breakdown of your deduction categories to help optimize your tax strategy.'}
            {activeTab === 'history' && 'Historical view of your tax returns and refund amounts over the years.'}
            {activeTab === 'timeline' && 'Timeline showing your refund amounts and trends over multiple years.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
