/**
 * NetWorthSummary Component
 * 净值摘要卡片
 */

'use client';

import React from 'react';
import { PieChart, DollarSign, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/src/lib/tax-calculations';

interface NetWorthSummaryProps {
  totalNetWorth: number;
  estimatedTax: number;
  potentialSavings: number;
}

export default function NetWorthSummary({
  totalNetWorth,
  estimatedTax,
  potentialSavings,
}: NetWorthSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">财务概览</h2>
        <span className="text-sm text-gray-600">2024-25财年</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">总净值</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNetWorth)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">预估税款</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(estimatedTax)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">潜在节税</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(potentialSavings)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
