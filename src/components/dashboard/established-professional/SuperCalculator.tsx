/**
 * SuperCalculator Component
 * Super contribution calculator modal
 */

'use client';

import React, { useState } from 'react';
import { EstablishedProfessionalProfile, SuperContributionCalculation } from '@/src/types/established-professional';
import { SUPER_LIMITS_2024_25 } from '@/src/types/established-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, DollarSign, TrendingUp } from 'lucide-react';

interface SuperCalculatorProps {
  profile: EstablishedProfessionalProfile;
  calculation: SuperContributionCalculation | null;
  onClose: () => void;
  onCalculate: (params: {
    currentBalance: number;
    annualIncome: number;
    additionalConcessional: number;
    additionalNonConcessional: number;
  }) => SuperContributionCalculation;
}

export default function SuperCalculator({
  profile,
  calculation,
  onClose,
  onCalculate,
}: SuperCalculatorProps) {
  const [currentBalance, setCurrentBalance] = useState(profile.superBalance.toString());
  const [annualIncome, setAnnualIncome] = useState(profile.annualIncome.toString());
  const [additionalConcessional, setAdditionalConcessional] = useState('15000');
  const [additionalNonConcessional, setAdditionalNonConcessional] = useState('0');
  const [result, setResult] = useState<SuperContributionCalculation | null>(calculation);

  const handleCalculate = () => {
    const calc = onCalculate({
      currentBalance: parseFloat(currentBalance) || 0,
      annualIncome: parseFloat(annualIncome) || 0,
      additionalConcessional: parseFloat(additionalConcessional) || 0,
      additionalNonConcessional: parseFloat(additionalNonConcessional) || 0,
    });
    setResult(calc);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Super Contribution Calculator</h2>
              <p className="text-sm text-gray-600">Optimize your Super contribution strategy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 2024-25 Limits Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Concessional Contribution Cap</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(SUPER_LIMITS_2024_25.concessionalCap)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pre-tax contribution limit</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Non-Concessional Contribution Cap</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(SUPER_LIMITS_2024_25.nonConcessionalCap)}
              </p>
              <p className="text-xs text-gray-500 mt-1">After-tax contribution limit</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Super Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 500000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 200000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Concessional Contribution
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={additionalConcessional}
                  onChange={(e) => setAdditionalConcessional(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Non-Concessional Contribution
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={additionalNonConcessional}
                  onChange={(e) => setAdditionalNonConcessional(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. 0"
                />
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Calculate Optimal Strategy
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Calculation Results</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Employer Contribution (11.5%)</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.employerContribution)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Concessional Contribution</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.concessionalContribution)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Non-Concessional Contribution</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(result.nonConcessionalContribution)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Tax Savings</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.taxSaved)}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Projected Balance in 10 Years (7% annual return)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.projectedRetirementBalance)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Tips</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Concessional contributions are more tax-effective</li>
                  <li>• Be careful not to exceed annual caps</li>
                  <li>• Consider topping up contributions before the end of financial year</li>
                  <li>• Consult a financial advisor for personalized advice</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
