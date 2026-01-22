/**
 * PensionPlanningSection Component
 * Pension planning calculator and projections
 */

'use client';

import React, { useState } from 'react';
import { SeniorProfessionalProfile, PensionProjection } from '@/src/types/senior-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface PensionPlanningSectionProps {
  profile: SeniorProfessionalProfile;
  projection: PensionProjection | null;
  onClose: () => void;
  onCalculate: (params: {
    startingBalance: number;
    annualDrawdown: number;
    expectedReturn: number;
    years: number;
  }) => PensionProjection;
}

export default function PensionPlanningSection({
  profile,
  projection,
  onClose,
  onCalculate,
}: PensionPlanningSectionProps) {
  const [startingBalance, setStartingBalance] = useState(profile.superBalance.toString());
  const [annualDrawdown, setAnnualDrawdown] = useState((profile.superBalance * 0.05).toString());
  const [expectedReturn, setExpectedReturn] = useState('6');
  const [years, setYears] = useState('20');
  const [result, setResult] = useState<PensionProjection | null>(projection);

  const handleCalculate = () => {
    const calc = onCalculate({
      startingBalance: parseFloat(startingBalance) || 0,
      annualDrawdown: parseFloat(annualDrawdown) || 0,
      expectedReturn: (parseFloat(expectedReturn) || 0) / 100,
      years: parseInt(years) || 20,
    });
    setResult(calc);
  };

  const minimumDrawdown = parseFloat(startingBalance) * 0.04;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pension Planning</h2>
              <p className="text-sm text-gray-600">Project your retirement income stream</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pension Types Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Account-Based Pension</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Flexible drawdown amounts</li>
                <li>• Tax-free earnings (over 60)</li>
                <li>• Capital preserved until drawn</li>
                <li>• Investment control</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">Lifetime Annuity</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Guaranteed income for life</li>
                <li>• No investment risk</li>
                <li>• Favourable Age Pension treatment</li>
                <li>• Less flexibility</li>
              </ul>
            </div>
          </div>

          {/* Minimum Drawdown Rates */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-2">Minimum Drawdown Rates 2024-25</h3>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">Under 65</p>
                <p className="font-bold text-orange-600">4%</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">65-74</p>
                <p className="font-bold text-orange-600">5%</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">75-79</p>
                <p className="font-bold text-orange-600">6%</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <p className="text-gray-600">80-84</p>
                <p className="font-bold text-orange-600">7%</p>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 650000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Drawdown Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={annualDrawdown}
                  onChange={(e) => setAnnualDrawdown(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 40000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum required: {formatCurrency(minimumDrawdown)} (4% of balance)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projection Period (years)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Calculate Pension Projection
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">Pension Projection Results</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Starting Balance</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(result.startingBalance)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Annual Drawdown</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(result.annualDrawdown)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Income Over {result.projectedYears} Years</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.totalIncome)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Balance After {result.projectedYears} Years</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.balanceAtEnd)}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Tax Treatment</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Pension income is TAX-FREE for those aged 60 and over</li>
                  <li>• Investment earnings in pension phase are TAX-FREE</li>
                  <li>• No tax on lump sum withdrawals from super after age 60</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
