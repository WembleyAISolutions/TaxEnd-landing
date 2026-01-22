/**
 * FinancialOverview Component
 * Financial summary for Senior Professional dashboard
 */

'use client';

import React from 'react';
import { PieChart, DollarSign, TrendingDown, Clock, Wallet } from 'lucide-react';
import { formatCurrency } from '@/src/lib/tax-calculations';

interface FinancialOverviewProps {
  totalNetWorth: number;
  superBalance: number;
  estimatedTax: number;
  potentialSavings: number;
  yearsToRetirement: number;
}

export default function FinancialOverview({
  totalNetWorth,
  superBalance,
  estimatedTax,
  potentialSavings,
  yearsToRetirement,
}: FinancialOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
        <span className="text-sm text-gray-600">FY 2024-25</span>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <PieChart className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Net Worth</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalNetWorth)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Super Balance</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(superBalance)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Tax</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(estimatedTax)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Potential Savings</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(potentialSavings)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Years to 65</p>
            <p className="text-xl font-bold text-purple-600">{yearsToRetirement} years</p>
          </div>
        </div>
      </div>
    </div>
  );
}
