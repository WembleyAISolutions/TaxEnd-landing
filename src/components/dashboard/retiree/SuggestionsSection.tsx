/**
 * SuggestionsSection Component
 * AI suggestions for Retiree dashboard
 */

'use client';

import React from 'react';
import { AISuggestion } from '@/src/types/established-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: AISuggestion[];
}

const priorityConfig = {
  high: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  low: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};

export default function SuggestionsSection({ suggestions }: SuggestionsSectionProps) {
  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => {
        const config = priorityConfig[suggestion.priority];
        const Icon = config.icon;

        return (
          <div
            key={suggestion.id}
            className={`p-4 border rounded-xl ${config.bgColor} ${config.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                {suggestion.potentialSavings > 0 && (
                  <p className="text-sm font-bold text-green-600">
                    Potential Savings: {formatCurrency(suggestion.potentialSavings)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
