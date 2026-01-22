/**
 * DownsizerCalculator Component
 * Downsizer contribution calculator
 */

'use client';

import React, { useState } from 'react';
import { SeniorProfessionalProfile, DownsizerContribution, DOWNSIZER_CONTRIBUTION_LIMIT, DOWNSIZER_MINIMUM_AGE } from '@/src/types/senior-professional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, Home, TrendingUp, Users } from 'lucide-react';

interface DownsizerCalculatorProps {
  profile: SeniorProfessionalProfile;
  calculation: DownsizerContribution | null;
  onClose: () => void;
  onCalculate: (params: {
    expectedSalePrice: number;
    proposedContribution: number;
    spouseContribution?: number;
  }) => DownsizerContribution;
}

export default function DownsizerCalculator({
  profile,
  calculation,
  onClose,
  onCalculate,
}: DownsizerCalculatorProps) {
  const [expectedSalePrice, setExpectedSalePrice] = useState(profile.homeValue.toString());
  const [proposedContribution, setProposedContribution] = useState('300000');
  const [spouseContribution, setSpouseContribution] = useState(profile.hasSpouse ? '300000' : '0');
  const [result, setResult] = useState<DownsizerContribution | null>(calculation);

  const handleCalculate = () => {
    const calc = onCalculate({
      expectedSalePrice: parseFloat(expectedSalePrice) || 0,
      proposedContribution: parseFloat(proposedContribution) || 0,
      spouseContribution: parseFloat(spouseContribution) || 0,
    });
    setResult(calc);
  };

  const isEligible = profile.age >= DOWNSIZER_MINIMUM_AGE;
  const spouseEligible = profile.hasSpouse && (profile.spouseAge || 0) >= DOWNSIZER_MINIMUM_AGE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Downsizer Contribution Calculator</h2>
              <p className="text-sm text-gray-600">Boost your super from home sale proceeds</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Eligibility Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{isEligible ? '✅' : '❌'}</span>
                <div>
                  <p className="font-semibold text-gray-900">You (Age {profile.age})</p>
                  <p className="text-sm text-gray-600">
                    {isEligible ? 'Eligible' : `Must be ${DOWNSIZER_MINIMUM_AGE}+`}
                  </p>
                </div>
              </div>
            </div>

            {profile.hasSpouse && (
              <div className={`p-4 rounded-xl border ${spouseEligible ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Spouse (Age {profile.spouseAge})</p>
                    <p className="text-sm text-gray-600">
                      {spouseEligible ? 'Eligible' : `Must be ${DOWNSIZER_MINIMUM_AGE}+`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Rules */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-2">Downsizer Contribution Rules</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Must be aged 55 or older at time of contribution</li>
              <li>• Up to ${DOWNSIZER_CONTRIBUTION_LIMIT.toLocaleString()} per person from home sale</li>
              <li>• Home must have been owned for at least 10 years</li>
              <li>• Contribution must be made within 90 days of settlement</li>
              <li>• Does NOT count towards concessional or non-concessional caps</li>
              <li>• Can contribute even if over $1.9M total super balance cap</li>
              <li>• Home must be in Australia and not a caravan, houseboat, or mobile home</li>
            </ul>
          </div>

          {/* Current Home Value */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Home Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.homeValue)}</p>
              </div>
              <Home className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* Input Form */}
          {isEligible && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Sale Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={expectedSalePrice}
                    onChange={(e) => setExpectedSalePrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 1500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Downsizer Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={proposedContribution}
                    onChange={(e) => setProposedContribution(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 300000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum: {formatCurrency(DOWNSIZER_CONTRIBUTION_LIMIT)}</p>
              </div>

              {profile.hasSpouse && spouseEligible && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Downsizer Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={spouseContribution}
                      onChange={(e) => setSpouseContribution(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g. 300000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum: {formatCurrency(DOWNSIZER_CONTRIBUTION_LIMIT)}</p>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Calculate Downsizer Benefits
              </button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Downsizer Contribution Summary</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Sale Proceeds</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(result.saleProceeds)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Contribution</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(result.proposedContribution)}
                  </p>
                </div>

                {profile.hasSpouse && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Couple Contribution</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {formatCurrency(result.proposedContribution + parseFloat(spouseContribution || '0'))}
                    </p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Super After</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.superBalanceAfter)}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">Key Benefits</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Contribution is NOT taxed in super (no 15% contributions tax)</li>
                  <li>• Does not affect Age Pension assets test for 2 years (gifting exemption)</li>
                  <li>• Can be made regardless of work status or total super balance</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
