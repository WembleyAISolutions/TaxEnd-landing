/**
 * TaxStrategiesSection Component
 * Tax strategies section
 */

'use client';

import React from 'react';
import { TaxStrategy, WealthGoal } from '@/src/types/established-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { ChevronRight } from 'lucide-react';

interface TaxStrategiesSectionProps {
  strategies: TaxStrategy[];
  selectedGoal: WealthGoal | null;
  onResetFilter: () => void;
}

const complexityColors = {
  simple: 'bg-green-100 text-green-700',
  moderate: 'bg-orange-100 text-orange-700',
  complex: 'bg-red-100 text-red-700',
};

const complexityLabels = {
  simple: 'Simple',
  moderate: 'Moderate',
  complex: 'Complex',
};

export default function TaxStrategiesSection({
  strategies,
  selectedGoal,
  onResetFilter,
}: TaxStrategiesSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recommended Tax Strategies</h2>
        {selectedGoal && (
          <button
            onClick={onResetFilter}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  complexityColors[strategy.complexity]
                }`}
              >
                {complexityLabels[strategy.complexity]}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Potential Savings</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(strategy.potentialSavings)}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
