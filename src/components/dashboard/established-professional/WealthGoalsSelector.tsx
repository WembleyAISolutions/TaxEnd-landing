/**
 * WealthGoalsSelector Component
 * 财富目标选择器
 */

'use client';

import React from 'react';
import { WealthGoal } from '@/src/types/established-professional';
import { Shield, TrendingUp, FileText, MinusCircle, Users, BarChart3 } from 'lucide-react';

interface WealthGoalsSelectorProps {
  selectedGoal: WealthGoal | null;
  onSelectGoal: (goal: WealthGoal) => void;
  onResetFilter: () => void;
}

const goalConfig: Record<WealthGoal, { title: string; icon: React.ReactNode; color: string }> = {
  wealth_preservation: {
    title: '财富保值',
    icon: <Shield className="w-6 h-6" />,
    color: 'blue',
  },
  super_maximization: {
    title: 'Super最大化',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'green',
  },
  estate_planning: {
    title: '遗产规划',
    icon: <FileText className="w-6 h-6" />,
    color: 'purple',
  },
  tax_minimization: {
    title: '税务最小化',
    icon: <MinusCircle className="w-6 h-6" />,
    color: 'orange',
  },
  succession_planning: {
    title: '传承规划',
    icon: <Users className="w-6 h-6" />,
    color: 'pink',
  },
  investment_growth: {
    title: '投资增长',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'teal',
  },
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-300',
    gradient: 'from-green-500 to-green-600',
  },
  purple: {
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-300',
    gradient: 'from-purple-500 to-purple-600',
  },
  orange: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-300',
    gradient: 'from-orange-500 to-orange-600',
  },
  pink: {
    bg: 'bg-pink-500',
    bgLight: 'bg-pink-100',
    text: 'text-pink-600',
    border: 'border-pink-300',
    gradient: 'from-pink-500 to-pink-600',
  },
  teal: {
    bg: 'bg-teal-500',
    bgLight: 'bg-teal-100',
    text: 'text-teal-600',
    border: 'border-teal-300',
    gradient: 'from-teal-500 to-teal-600',
  },
};

export default function WealthGoalsSelector({
  selectedGoal,
  onSelectGoal,
  onResetFilter,
}: WealthGoalsSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">财富目标</h2>
        {selectedGoal && (
          <button
            onClick={onResetFilter}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            清除筛选
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(goalConfig) as WealthGoal[]).map((goal) => {
          const config = goalConfig[goal];
          const colors = colorClasses[config.color as keyof typeof colorClasses];
          const isSelected = selectedGoal === goal;

          return (
            <button
              key={goal}
              onClick={() => {
                if (isSelected) {
                  onResetFilter();
                } else {
                  onSelectGoal(goal);
                }
              }}
              className={`
                relative p-4 rounded-xl transition-all duration-200
                ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105`
                    : `${colors.bgLight} hover:shadow-md hover:scale-105`
                }
              `}
            >
              <div className={`mb-2 ${isSelected ? 'text-white' : colors.text}`}>
                {config.icon}
              </div>
              <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {config.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
