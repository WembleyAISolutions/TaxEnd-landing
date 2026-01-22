/**
 * QuickActionsGrid Component
 * Quick actions grid
 */

'use client';

import React from 'react';
import { DollarSign, BarChart3, Building2, FileText } from 'lucide-react';

interface QuickActionsGridProps {
  onOpenSuperCalculator: () => void;
  onOpenCGTCalculator: () => void;
  onOpenTrustInfo: () => void;
}

export default function QuickActionsGrid({
  onOpenSuperCalculator,
  onOpenCGTCalculator,
  onOpenTrustInfo,
}: QuickActionsGridProps) {
  const actions = [
    {
      title: 'Super Optimization',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green',
      onClick: onOpenSuperCalculator,
    },
    {
      title: 'CGT Calculator',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'blue',
      onClick: onOpenCGTCalculator,
    },
    {
      title: 'Trust Planning',
      icon: <Building2 className="w-6 h-6" />,
      color: 'purple',
      onClick: onOpenTrustInfo,
    },
    {
      title: 'Estate Planning',
      icon: <FileText className="w-6 h-6" />,
      color: 'orange',
      onClick: () => {},
    },
  ];

  const colorClasses = {
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              p-6 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105
              ${colorClasses[action.color as keyof typeof colorClasses]}
            `}
          >
            <div className="flex flex-col items-center gap-2">
              {action.icon}
              <span className="font-medium text-sm">{action.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
