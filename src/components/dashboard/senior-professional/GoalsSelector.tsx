/**
 * GoalsSelector Component
 * Pre-retirement goals selector for Senior Professionals
 */

'use client';

import React from 'react';
import { SeniorGoal } from '@/src/types/senior-professional';
import { Target, TrendingUp, RefreshCw, Home, Calendar, FileText } from 'lucide-react';

interface GoalsSelectorProps {
  selectedGoal: SeniorGoal | null;
  onSelectGoal: (goal: SeniorGoal) => void;
  onResetFilter: () => void;
}

const goalConfig: Record<SeniorGoal, { title: string; icon: React.ReactNode; color: string }> = {
  retirement_readiness: {
    title: 'Retirement Readiness',
    icon: <Target className="w-6 h-6" />,
    color: 'amber',
  },
  super_maximization: {
    title: 'Super Maximization',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'green',
  },
  ttr_strategy: {
    title: 'TTR Strategy',
    icon: <RefreshCw className="w-6 h-6" />,
    color: 'blue',
  },
  downsizer_contribution: {
    title: 'Downsizer Contribution',
    icon: <Home className="w-6 h-6" />,
    color: 'purple',
  },
  pension_planning: {
    title: 'Pension Planning',
    icon: <Calendar className="w-6 h-6" />,
    color: 'orange',
  },
  estate_planning: {
    title: 'Estate Planning',
    icon: <FileText className="w-6 h-6" />,
    color: 'pink',
  },
};

const colorClasses = {
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-300',
    gradient: 'from-amber-500 to-amber-600',
  },
  green: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-300',
    gradient: 'from-green-500 to-green-600',
  },
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300',
    gradient: 'from-blue-500 to-blue-600',
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
};

export default function GoalsSelector({
  selectedGoal,
  onSelectGoal,
  onResetFilter,
}: GoalsSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Pre-Retirement Goals</h2>
        {selectedGoal && (
          <button
            onClick={onResetFilter}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(goalConfig) as SeniorGoal[]).map((goal) => {
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
