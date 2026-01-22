/**
 * CentrelinkAssetsTest Component
 * Centrelink assets and income test calculator
 */

'use client';

import React, { useEffect, useState } from 'react';
import { RetireeProfile, CentrelinkAssessment, ASSETS_TEST_THRESHOLDS_2024_25, DEEMING_RATES_2024_25 } from '@/src/types/retiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, Building2, TrendingDown, DollarSign, Home, PiggyBank, Car } from 'lucide-react';

interface CentrelinkAssetsTestProps {
  profile: RetireeProfile;
  assessment: CentrelinkAssessment | null;
  onClose: () => void;
  onCalculate: () => CentrelinkAssessment;
}

export default function CentrelinkAssetsTest({
  profile,
  assessment,
  onClose,
  onCalculate,
}: CentrelinkAssetsTestProps) {
  const [result, setResult] = useState<CentrelinkAssessment | null>(assessment);

  useEffect(() => {
    const calc = onCalculate();
    setResult(calc);
  }, [onCalculate]);

  const isHomeowner = profile.homeValue > 0;
  const thresholds = profile.hasSpouse
    ? isHomeowner
      ? ASSETS_TEST_THRESHOLDS_2024_25.couple_homeowner
      : ASSETS_TEST_THRESHOLDS_2024_25.couple_non_homeowner
    : isHomeowner
    ? ASSETS_TEST_THRESHOLDS_2024_25.single_homeowner
    : ASSETS_TEST_THRESHOLDS_2024_25.single_non_homeowner;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Centrelink Assessment</h2>
              <p className="text-sm text-gray-600">Assets and income test for Age Pension</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Your Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Your Status</p>
              <p className="text-xl font-bold text-blue-600">
                {profile.hasSpouse ? 'Couple' : 'Single'}, {isHomeowner ? 'Homeowner' : 'Non-Homeowner'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Age</p>
              <p className="text-xl font-bold text-green-600">{profile.age} years</p>
            </div>
          </div>

          {/* Asset Breakdown */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Your Assets</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <PiggyBank className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Account-Based Pension</span>
                </div>
                <span className="font-medium">{formatCurrency(profile.accountBasedPensionBalance)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Non-Super Investments</span>
                </div>
                <span className="font-medium">{formatCurrency(profile.nonSuperInvestments)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Cash Savings</span>
                </div>
                <span className="font-medium">{formatCurrency(profile.cashSavings || 0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">Other Assets</span>
                </div>
                <span className="font-medium">{formatCurrency(profile.otherAssets || 0)}</span>
              </div>
              {isHomeowner && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Home (Exempt Asset)</span>
                  </div>
                  <span className="font-medium text-green-600">Exempt</span>
                </div>
              )}
            </div>
          </div>

          {/* Assets Test Thresholds */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Assets Test Thresholds 2024-25</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Full Pension</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Cut-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className={!profile.hasSpouse && isHomeowner ? 'bg-teal-50' : ''}>
                    <td className="px-4 py-3 text-sm">Single, Homeowner</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.singleHomeowner.fullPension)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.singleHomeowner.cutOff)}</td>
                  </tr>
                  <tr className={!profile.hasSpouse && !isHomeowner ? 'bg-teal-50' : ''}>
                    <td className="px-4 py-3 text-sm">Single, Non-Homeowner</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.singleNonHomeowner.fullPension)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.singleNonHomeowner.cutOff)}</td>
                  </tr>
                  <tr className={profile.hasSpouse && isHomeowner ? 'bg-teal-50' : ''}>
                    <td className="px-4 py-3 text-sm">Couple, Homeowner</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.coupleHomeowner.fullPension)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.coupleHomeowner.cutOff)}</td>
                  </tr>
                  <tr className={profile.hasSpouse && !isHomeowner ? 'bg-teal-50' : ''}>
                    <td className="px-4 py-3 text-sm">Couple, Non-Homeowner</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.coupleNonHomeowner.fullPension)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(ASSETS_TEST_THRESHOLDS_2024_25.coupleNonHomeowner.cutOff)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deeming Rates */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Deeming Rates 2024-25</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Lower Rate (first {formatCurrency(profile.hasSpouse ? DEEMING_RATES_2024_25.coupleThreshold : DEEMING_RATES_2024_25.singleThreshold)})</p>
                <p className="font-bold text-blue-600">{(DEEMING_RATES_2024_25.lowerRate * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Higher Rate (remainder)</p>
                <p className="font-bold text-blue-600">{(DEEMING_RATES_2024_25.higherRate * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <h3 className="text-lg font-bold text-gray-900">Your Assessment</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Assessable Assets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(result.totalAssessableAssets)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Deemed Income (Annual)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.deemedIncome)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Assets Over Threshold</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(result.assetsOverThreshold)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Assets Test Reduction</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{formatCurrency(result.assetsTestReduction)}
                  </p>
                  <p className="text-xs text-gray-500">$3.00 per $1,000 over threshold</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Room Under Assets Cut-off</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.max(0, thresholds.cutOff - result.totalAssessableAssets))}
                </p>
                <p className="text-xs text-gray-500">
                  Assets can increase by this amount before pension is cut off
                </p>
              </div>
            </div>
          )}

          {/* Strategies */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">Strategies to Improve Your Position</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Spend assessable assets on home improvements (exempt)</li>
              <li>• Prepay expenses like rates, insurance, or utilities</li>
              <li>• Consider a funeral bond (exempt up to threshold)</li>
              <li>• Review gifting rules ($10,000/year, $30,000 over 5 years)</li>
              <li>• Special Disability Trust contributions if applicable</li>
              <li>• Granny flat arrangement may provide exemption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
