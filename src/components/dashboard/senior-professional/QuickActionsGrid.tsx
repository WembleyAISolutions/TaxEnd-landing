/**
 * QuickActionsGrid Component
 * Quick actions for Senior Professional dashboard
 */

'use client';

import React from 'react';
import { RefreshCw, PiggyBank, Home, Calendar, Clock } from 'lucide-react';

interface QuickActionsGridProps {
  onOpenTTRCalculator: () => void;
  onOpenCatchUpCalculator: () => void;
  onOpenDownsizerCalculator: () => void;
  onOpenPensionPlanning: () => void;
  onOpenPreservationInfo: () => void;
}

export default function QuickActionsGrid({
  onOpenTTRCalculator,
  onOpenCatchUpCalculator,
  onOpenDownsizerCalculator,
  onOpenPensionPlanning,
  onOpenPreservationInfo,
}: QuickActionsGridProps) {
  const actions = [
    {
      title: 'TTR Calculator',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'blue',
      onClick: onOpenTTRCalculator,
    },
    {
      title: 'Catch-up Contributions',
      icon: <PiggyBank className="w-6 h-6" />,
      color: 'green',
      onClick: onOpenCatchUpCalculator,
    },
    {
      title: 'Downsizer Calculator',
      icon: <Home className="w-6 h-6" />,
      color: 'purple',
      onClick: onOpenDownsizerCalculator,
    },
    {
      title: 'Pension Planning',
      icon: <Calendar className="w-6 h-6" />,
      color: 'orange',
      onClick: onOpenPensionPlanning,
    },
    {
      title: 'Preservation Age',
      icon: <Clock className="w-6 h-6" />,
      color: 'amber',
      onClick: onOpenPreservationInfo,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
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
