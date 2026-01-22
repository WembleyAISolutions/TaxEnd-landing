/**
 * MinimumDrawdownCalculator Component
 * Calculate minimum pension drawdown requirements
 */

'use client';

import React, { useEffect, useState } from 'react';
import { RetireeProfile, MinimumDrawdownCalculation, MINIMUM_DRAWDOWN_RATES_2024_25 } from '@/src/types/retiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, Calculator, TrendingDown, AlertCircle } from 'lucide-react';

interface MinimumDrawdownCalculatorProps {
  profile: RetireeProfile;
  calculation: MinimumDrawdownCalculation | null;
  onClose: () => void;
  onCalculate: () => MinimumDrawdownCalculation;
}

export default function MinimumDrawdownCalculator({
  profile,
  calculation,
  onClose,
  onCalculate,
}: MinimumDrawdownCalculatorProps) {
  const [result, setResult] = useState<MinimumDrawdownCalculation | null>(calculation);

  useEffect(() => {
    const calc = onCalculate();
    setResult(calc);
  }, [onCalculate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Minimum Drawdown Calculator</h2>
              <p className="text-sm text-gray-600">Your required pension withdrawals for this FY</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drawdown Rates Table */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Minimum Drawdown Rates 2024-25</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Age</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Minimum %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className={profile.age < 65 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">Under 65</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">4%</td>
                  </tr>
                  <tr className={profile.age >= 65 && profile.age <= 74 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">65-74</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">5%</td>
                  </tr>
                  <tr className={profile.age >= 75 && profile.age <= 79 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">75-79</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">6%</td>
                  </tr>
                  <tr className={profile.age >= 80 && profile.age <= 84 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">80-84</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">7%</td>
                  </tr>
                  <tr className={profile.age >= 85 && profile.age <= 89 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">85-89</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">9%</td>
                  </tr>
                  <tr className={profile.age >= 90 && profile.age <= 94 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">90-94</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">11%</td>
                  </tr>
                  <tr className={profile.age >= 95 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 text-sm">95+</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">14%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Your Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Your Age</p>
              <p className="text-2xl font-bold text-blue-600">{profile.age} years</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Pension Account Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(profile.accountBasedPensionBalance)}
              </p>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Your Minimum Drawdown</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Minimum Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(result.minimumRate * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Minimum Amount Required</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(result.minimumAmount)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Recommended Drawdown</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.recommendedDrawdown)}
                  </p>
                  <p className="text-xs text-gray-500">20% above minimum</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Projected Balance Next Year</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.projectedBalanceNextYear)}
                  </p>
                  <p className="text-xs text-gray-500">Assuming 6% return</p>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{result.taxImplication}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      All pension payments are tax-free when you're 60 or older. There's no maximum
                      drawdown limit for account-based pensions (only for TTR pensions under 65).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Minimum drawdown is calculated on July 1 balance (or commencement date)</li>
              <li>• Failure to meet minimum can result in loss of tax-free pension status</li>
              <li>• Pro-rata applies if pension commenced part-way through the year</li>
              <li>• Consider Age Pension implications when deciding drawdown amount</li>
              <li>• Higher drawdowns reduce your Age Pension assessable assets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
