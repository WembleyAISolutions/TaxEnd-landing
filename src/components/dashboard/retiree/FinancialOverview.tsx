/**
 * FinancialOverview Component
 * Financial summary for Retiree dashboard
 */

'use client';

import React from 'react';
import { PieChart, Wallet, DollarSign, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/src/lib/tax-calculations';

interface FinancialOverviewProps {
  totalNetWorth: number;
  pensionBalance: number;
  annualIncome: number;
  estatePlanningProgress: number;
}

export default function FinancialOverview({
  totalNetWorth,
  pensionBalance,
  annualIncome,
  estatePlanningProgress,
}: FinancialOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
        <span className="text-sm text-gray-600">FY 2024-25</span>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <PieChart className="w-6 h-6 text-teal-600" />
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
            <p className="text-sm text-gray-600">Pension Balance</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(pensionBalance)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Income</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(annualIncome)}</p>
            <p className="text-xs text-green-600">Tax-Free</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Estate Planning</p>
            <p className="text-xl font-bold text-purple-600">{Math.round(estatePlanningProgress * 100)}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}
