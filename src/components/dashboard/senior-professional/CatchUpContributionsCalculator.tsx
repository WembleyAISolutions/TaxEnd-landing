/**
 * CatchUpContributionsCalculator Component
 * Catch-up concessional contributions calculator
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SeniorProfessionalProfile, CatchUpCalculation, CARRY_FORWARD_BALANCE_THRESHOLD } from '@/src/types/senior-professional';
import { SUPER_LIMITS_2024_25 } from '@/src/types/established-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, PiggyBank, TrendingUp, AlertCircle } from 'lucide-react';

interface CatchUpContributionsCalculatorProps {
  profile: SeniorProfessionalProfile;
  calculation: CatchUpCalculation | null;
  onClose: () => void;
  onCalculate: () => CatchUpCalculation;
}

export default function CatchUpContributionsCalculator({
  profile,
  calculation,
  onClose,
  onCalculate,
}: CatchUpContributionsCalculatorProps) {
  const [result, setResult] = useState<CatchUpCalculation | null>(calculation);

  useEffect(() => {
    // Auto-calculate on load
    const calc = onCalculate();
    setResult(calc);
  }, [onCalculate]);

  const isEligible = profile.superBalance < CARRY_FORWARD_BALANCE_THRESHOLD;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Catch-up Contributions</h2>
              <p className="text-sm text-gray-600">Maximize your super with unused concessional caps</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Eligibility Check */}
          <div className={`p-4 rounded-xl border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isEligible ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-gray-900">
                  {isEligible ? 'Eligible for Catch-up Contributions' : 'Not Eligible for Catch-up Contributions'}
                </p>
                <p className="text-sm text-gray-600">
                  Super balance: {formatCurrency(profile.superBalance)} (must be under {formatCurrency(CARRY_FORWARD_BALANCE_THRESHOLD)})
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2">How Catch-up Contributions Work</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Unused concessional caps from the past 5 years can be carried forward</li>
              <li>• Your total super balance must be under $500,000 on June 30 of the previous year</li>
              <li>• Oldest unused caps are used first (FIFO)</li>
              <li>• Great for those who couldn't maximize contributions in earlier years</li>
              <li>• 2024-25 concessional cap is $30,000 per year</li>
            </ul>
          </div>

          {/* Current Year Cap */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">2024-25 Concessional Cap</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(SUPER_LIMITS_2024_25.concessionalCap)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Your Super Balance</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(profile.superBalance)}
              </p>
            </div>
          </div>

          {/* Results */}
          {result && isEligible && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Your Carry-Forward Amounts</h3>

              {/* Carry Forward Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Financial Year</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Unused Cap</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Expiry</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.carryForwardAmounts.map((cf, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{cf.financialYear}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                          {formatCurrency(cf.unusedCap)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {cf.expiryDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            cf.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {cf.isAvailable ? 'Available' : 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Available Cap</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.totalAvailableCap)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Recommended Contribution</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.recommendedContribution)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Estimated Tax Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.taxSavings)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Super Balance After</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(result.superBalanceAfterContribution)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Remember: Employer SG contributions count towards your cap. Check your super fund statements
                    for actual unused amounts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isEligible && (
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Not Currently Eligible</h3>
                  <p className="text-sm text-gray-600">
                    Your super balance exceeds {formatCurrency(CARRY_FORWARD_BALANCE_THRESHOLD)}.
                    Catch-up contributions are only available when your total super balance was
                    under this threshold on June 30 of the previous year.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    You can still contribute up to the standard {formatCurrency(SUPER_LIMITS_2024_25.concessionalCap)}
                    concessional cap this financial year.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
