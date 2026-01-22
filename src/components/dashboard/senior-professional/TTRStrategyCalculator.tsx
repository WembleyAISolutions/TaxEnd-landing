/**
 * TTRStrategyCalculator Component
 * Transition to Retirement calculator modal
 */

'use client';

import React, { useState } from 'react';
import { SeniorProfessionalProfile, TTRStrategy } from '@/src/types/senior-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, RefreshCw, TrendingUp } from 'lucide-react';

interface TTRStrategyCalculatorProps {
  profile: SeniorProfessionalProfile;
  calculation: TTRStrategy | null;
  onClose: () => void;
  onCalculate: (params: {
    salaryReduction: number;
    ttrPensionAmount: number;
  }) => TTRStrategy;
}

export default function TTRStrategyCalculator({
  profile,
  calculation,
  onClose,
  onCalculate,
}: TTRStrategyCalculatorProps) {
  const [salaryReduction, setSalaryReduction] = useState('25000');
  const [ttrPensionAmount, setTtrPensionAmount] = useState('25000');
  const [result, setResult] = useState<TTRStrategy | null>(calculation);

  const handleCalculate = () => {
    const calc = onCalculate({
      salaryReduction: parseFloat(salaryReduction) || 0,
      ttrPensionAmount: parseFloat(ttrPensionAmount) || 0,
    });
    setResult(calc);
  };

  const canAccessTTR = profile.age >= profile.preservationAge;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">TTR Strategy Calculator</h2>
              <p className="text-sm text-gray-600">Calculate your Transition to Retirement benefits</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Eligibility Check */}
          <div className={`p-4 rounded-xl border ${canAccessTTR ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{canAccessTTR ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-gray-900">
                  {canAccessTTR ? 'Eligible for TTR' : 'Not Yet Eligible for TTR'}
                </p>
                <p className="text-sm text-gray-600">
                  Current age: {profile.age} | Preservation age: {profile.preservationAge}
                </p>
              </div>
            </div>
          </div>

          {/* How TTR Works */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">How TTR Works</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Reduce your work hours and salary sacrifice the reduction into super</li>
              <li>• Supplement income with tax-effective TTR pension payments</li>
              <li>• Pay 15% tax on salary sacrifice vs your marginal rate</li>
              <li>• TTR pension earnings taxed at 15% (vs 0% for retirement pension)</li>
              <li>• Maximum 10% drawdown from TTR pension per year</li>
            </ul>
          </div>

          {/* Current Situation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Current Annual Salary</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.annualIncome)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Super Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(profile.superBalance)}</p>
            </div>
          </div>

          {/* Input Form */}
          {canAccessTTR && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Sacrifice Amount (per year)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={salaryReduction}
                    onChange={(e) => setSalaryReduction(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 25000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Amount to salary sacrifice into super</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TTR Pension Withdrawal (per year)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={ttrPensionAmount}
                    onChange={(e) => setTtrPensionAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 25000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min 4% / Max 10% of balance = {formatCurrency(profile.superBalance * 0.04)} - {formatCurrency(profile.superBalance * 0.10)}
                </p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Calculate TTR Strategy
              </button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">TTR Strategy Results</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Salary Sacrifice</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.salaryReduction)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">TTR Pension Income</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.ttrPensionAmount)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Additional Super</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(result.additionalSuperContribution)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Tax Savings</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.taxSavings)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Important Notes</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Total concessional contributions must stay within $30,000 cap</li>
                  <li>• TTR pension is taxed at 15% on earnings (not tax-free)</li>
                  <li>• Strategy works best for those with marginal rate above 30%</li>
                  <li>• Consult a financial advisor before implementing</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
