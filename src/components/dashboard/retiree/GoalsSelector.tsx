/**
 * GoalsSelector Component
 * Retirement goals selector
 */

'use client';

import React from 'react';
import { RetireeGoal } from '@/src/types/retiree';
import { DollarSign, Award, FileText, TrendingDown, Heart, Home } from 'lucide-react';

interface GoalsSelectorProps {
  selectedGoal: RetireeGoal | null;
  onSelectGoal: (goal: RetireeGoal) => void;
  onResetFilter: () => void;
}

const goalConfig: Record<RetireeGoal, { title: string; icon: React.ReactNode; color: string }> = {
  maximize_pension: {
    title: 'Maximize Pension',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'teal',
  },
  age_pension_eligibility: {
    title: 'Age Pension',
    icon: <Award className="w-6 h-6" />,
    color: 'blue',
  },
  estate_planning: {
    title: 'Estate Planning',
    icon: <FileText className="w-6 h-6" />,
    color: 'purple',
  },
  minimize_drawdown: {
    title: 'Preserve Capital',
    icon: <TrendingDown className="w-6 h-6" />,
    color: 'green',
  },
  healthcare_planning: {
    title: 'Healthcare',
    icon: <Heart className="w-6 h-6" />,
    color: 'red',
  },
  aged_care_planning: {
    title: 'Aged Care',
    icon: <Home className="w-6 h-6" />,
    color: 'orange',
  },
};

const colorClasses = {
  teal: {
    bgLight: 'bg-teal-100',
    text: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600',
  },
  blue: {
    bgLight: 'bg-blue-100',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  purple: {
    bgLight: 'bg-purple-100',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
  },
  green: {
    bgLight: 'bg-green-100',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
  },
  red: {
    bgLight: 'bg-red-100',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600',
  },
  orange: {
    bgLight: 'bg-orange-100',
    text: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
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
        <h2 className="text-xl font-bold text-gray-900">Retirement Goals</h2>
        {selectedGoal && (
          <button
            onClick={onResetFilter}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(goalConfig) as RetireeGoal[]).map((goal) => {
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
