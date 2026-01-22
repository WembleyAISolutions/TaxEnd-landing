/**
 * QuickActionsGrid Component
 * Quick actions for Retiree dashboard
 */

'use client';

import React from 'react';
import { Award, Calculator, FileText, ClipboardList, GitCompare } from 'lucide-react';

interface QuickActionsGridProps {
  onOpenAgePensionCalculator: () => void;
  onOpenMinimumDrawdown: () => void;
  onOpenEstatePlanning: () => void;
  onOpenCentrelinkTest: () => void;
  onOpenPensionComparison: () => void;
}

export default function QuickActionsGrid({
  onOpenAgePensionCalculator,
  onOpenMinimumDrawdown,
  onOpenEstatePlanning,
  onOpenCentrelinkTest,
  onOpenPensionComparison,
}: QuickActionsGridProps) {
  const actions = [
    {
      title: 'Age Pension',
      icon: <Award className="w-6 h-6" />,
      color: 'blue',
      onClick: onOpenAgePensionCalculator,
    },
    {
      title: 'Min Drawdown',
      icon: <Calculator className="w-6 h-6" />,
      color: 'green',
      onClick: onOpenMinimumDrawdown,
    },
    {
      title: 'Estate Planning',
      icon: <FileText className="w-6 h-6" />,
      color: 'purple',
      onClick: onOpenEstatePlanning,
    },
    {
      title: 'Centrelink Test',
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'orange',
      onClick: onOpenCentrelinkTest,
    },
    {
      title: 'Compare Pensions',
      icon: <GitCompare className="w-6 h-6" />,
      color: 'teal',
      onClick: onOpenPensionComparison,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              p-4 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105
              ${colorClasses[action.color as keyof typeof colorClasses]}
            `}
          >
            <div className="flex flex-col items-center gap-2">
              {action.icon}
              <span className="font-medium text-sm text-center">{action.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
