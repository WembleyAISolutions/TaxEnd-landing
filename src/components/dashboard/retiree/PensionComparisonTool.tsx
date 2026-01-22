/**
 * PensionComparisonTool Component
 * Compare different pension income strategies
 */

'use client';

import React, { useState } from 'react';
import { RetireeProfile, MINIMUM_DRAWDOWN_RATES_2024_25 } from '@/src/types/retiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, BarChart3, TrendingUp, TrendingDown, Percent, Calendar } from 'lucide-react';

interface DrawdownProjection {
  strategy: string;
  drawdownRate: number;
  annualIncome: number;
  balanceAfter10Years: number;
  totalDrawnOver10Years: number;
  yearlyProjection: { year: number; balance: number; drawdown: number }[];
}

interface PensionComparisonToolProps {
  profile: RetireeProfile;
  onClose: () => void;
}

export default function PensionComparisonTool({
  profile,
  onClose,
}: PensionComparisonToolProps) {
  const [projectionYears, setProjectionYears] = useState(10);
  const [assumedReturn, setAssumedReturn] = useState(6);

  // Get minimum drawdown rate based on age
  const getMinimumRate = (age: number): number => {
    if (age < 65) return MINIMUM_DRAWDOWN_RATES_2024_25.under65;
    if (age <= 74) return MINIMUM_DRAWDOWN_RATES_2024_25.age65to74;
    if (age <= 79) return MINIMUM_DRAWDOWN_RATES_2024_25.age75to79;
    if (age <= 84) return MINIMUM_DRAWDOWN_RATES_2024_25.age80to84;
    if (age <= 89) return MINIMUM_DRAWDOWN_RATES_2024_25.age85to89;
    if (age <= 94) return MINIMUM_DRAWDOWN_RATES_2024_25.age90to94;
    return MINIMUM_DRAWDOWN_RATES_2024_25.age95plus;
  };

  // Calculate projection for a given drawdown rate
  const calculateProjection = (drawdownRate: number): DrawdownProjection => {
    let balance = profile.accountBasedPensionBalance;
    let totalDrawn = 0;
    const yearlyData: { year: number; balance: number; drawdown: number }[] = [];

    for (let year = 1; year <= projectionYears; year++) {
      const currentAge = profile.age + year - 1;
      const minRate = getMinimumRate(currentAge);
      const actualRate = Math.max(drawdownRate / 100, minRate);
      const drawdown = balance * actualRate;
      const growth = (balance - drawdown / 2) * (assumedReturn / 100);

      yearlyData.push({
        year,
        balance,
        drawdown,
      });

      totalDrawn += drawdown;
      balance = Math.max(0, balance - drawdown + growth);
    }

    return {
      strategy: `${drawdownRate}% Drawdown`,
      drawdownRate: drawdownRate / 100,
      annualIncome: yearlyData[0].drawdown,
      balanceAfter10Years: balance,
      totalDrawnOver10Years: totalDrawn,
      yearlyProjection: yearlyData,
    };
  };

  const minimumRate = getMinimumRate(profile.age) * 100;
  const strategies = [
    calculateProjection(minimumRate), // Minimum
    calculateProjection(Math.max(minimumRate, 5)), // Conservative
    calculateProjection(Math.max(minimumRate, 7)), // Moderate
    calculateProjection(Math.max(minimumRate, 10)), // Higher
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pension Comparison Tool</h2>
              <p className="text-sm text-gray-600">Compare drawdown strategies and projections</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Position */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Current Pension Balance</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(profile.accountBasedPensionBalance)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Your Age</p>
              <p className="text-2xl font-bold text-green-600">{profile.age} years</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Minimum Drawdown Rate</p>
              <p className="text-2xl font-bold text-purple-600">{minimumRate.toFixed(0)}%</p>
            </div>
          </div>

          {/* Assumptions */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Projection Assumptions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Projection Period
                </label>
                <select
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value={5}>5 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Assumed Annual Return
                </label>
                <select
                  value={assumedReturn}
                  onChange={(e) => setAssumedReturn(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value={4}>4% (Conservative)</option>
                  <option value={5}>5% (Moderate-Conservative)</option>
                  <option value={6}>6% (Balanced)</option>
                  <option value={7}>7% (Growth)</option>
                  <option value={8}>8% (High Growth)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Strategy Comparison */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Strategy Comparison</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategies.map((strategy, index) => {
                const isRecommended = index === 1; // Conservative strategy
                return (
                  <div
                    key={strategy.strategy}
                    className={`p-4 rounded-xl border ${
                      isRecommended
                        ? 'bg-green-50 border-green-300 ring-2 ring-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {isRecommended && (
                      <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-medium rounded mb-2">
                        Recommended
                      </span>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-3">{strategy.strategy}</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year 1 Income</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(strategy.annualIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Drawn</span>
                        <span className="font-medium">
                          {formatCurrency(strategy.totalDrawnOver10Years)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Balance After {projectionYears}y</span>
                        <span className={`font-bold ${strategy.balanceAfter10Years > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {formatCurrency(strategy.balanceAfter10Years)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {strategy.balanceAfter10Years > profile.accountBasedPensionBalance * 0.5 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Sustainable</span>
                          </>
                        ) : strategy.balanceAfter10Years > 0 ? (
                          <>
                            <TrendingDown className="w-3 h-3 text-amber-600" />
                            <span className="text-amber-600">Moderate depletion</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-600" />
                            <span className="text-red-600">Depleted</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projection Chart (Simplified) */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h3 className="font-semibold text-gray-900 mb-4">Balance Projection Over Time</h3>
            <div className="space-y-2">
              {strategies.map((strategy, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
                const percentRemaining = (strategy.balanceAfter10Years / profile.accountBasedPensionBalance) * 100;
                return (
                  <div key={strategy.strategy} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600 truncate">{strategy.strategy}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className={`${colors[index]} h-4 rounded-full transition-all`}
                        style={{ width: `${Math.max(0, Math.min(100, percentRemaining))}%` }}
                      />
                    </div>
                    <span className="w-20 text-sm text-right font-medium">
                      {percentRemaining > 0 ? `${percentRemaining.toFixed(0)}%` : 'Depleted'}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Percentage of initial balance remaining after {projectionYears} years
            </p>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">Important Considerations</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Projections are estimates only and actual returns will vary</li>
              <li>• Minimum drawdown rates increase with age - plan accordingly</li>
              <li>• Higher drawdowns reduce your Centrelink assessable assets</li>
              <li>• Consider Age Pension interactions when choosing drawdown strategy</li>
              <li>• Pension income is tax-free for those aged 60+</li>
              <li>• Review your strategy annually with changing market conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
