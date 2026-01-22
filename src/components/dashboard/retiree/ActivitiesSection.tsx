/**
 * ActivitiesSection Component
 * Recent activities for Retiree dashboard
 */

'use client';

import React from 'react';
import { Activity } from '@/src/types/established-professional';
import { Calculator, FileUp, FileText, DollarSign, UserCheck, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enAU } from 'date-fns/locale';

interface ActivitiesSectionProps {
  activities: Activity[];
}

const activityIcons = {
  calculation: Calculator,
  document_upload: FileUp,
  tax_filing: FileText,
  payment: DollarSign,
  consultation: UserCheck,
  alert: Bell,
};

const activityColors = {
  calculation: 'bg-blue-100 text-blue-600',
  document_upload: 'bg-green-100 text-green-600',
  tax_filing: 'bg-purple-100 text-purple-600',
  payment: 'bg-orange-100 text-orange-600',
  consultation: 'bg-pink-100 text-pink-600',
  alert: 'bg-red-100 text-red-600',
};

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                <p className="text-xs text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: enAU,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
