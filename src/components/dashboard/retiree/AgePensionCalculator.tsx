/**
 * AgePensionCalculator Component
 * Age Pension eligibility calculator
 */

'use client';

import React, { useEffect, useState } from 'react';
import { RetireeProfile, AgePensionEligibility, AGE_PENSION_AGE, AGE_PENSION_RATES_2024_25 } from '@/src/types/retiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, Award, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface AgePensionCalculatorProps {
  profile: RetireeProfile;
  eligibility: AgePensionEligibility | null;
  onClose: () => void;
  onCalculate: () => AgePensionEligibility;
}

export default function AgePensionCalculator({
  profile,
  eligibility,
  onClose,
  onCalculate,
}: AgePensionCalculatorProps) {
  const [result, setResult] = useState<AgePensionEligibility | null>(eligibility);

  useEffect(() => {
    const calc = onCalculate();
    setResult(calc);
  }, [onCalculate]);

  const maxPension = profile.hasSpouse
    ? AGE_PENSION_RATES_2024_25.couple.maxAnnual
    : AGE_PENSION_RATES_2024_25.single.maxAnnual;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Age Pension Calculator</h2>
              <p className="text-sm text-gray-600">Check your eligibility and estimate payments</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Eligibility Requirements */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">Age Pension Requirements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Be Age Pension age ({AGE_PENSION_AGE} years old)</li>
              <li>• Meet the residence requirements (Australian resident for 10+ years)</li>
              <li>• Meet the income test</li>
              <li>• Meet the assets test</li>
              <li>• Not receiving a comparable foreign pension</li>
            </ul>
          </div>

          {/* Maximum Rates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Maximum Single Rate</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(AGE_PENSION_RATES_2024_25.single.maxAnnual)}/year
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(AGE_PENSION_RATES_2024_25.single.maxFortnightly)} fortnightly
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Maximum Couple Rate (combined)</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(AGE_PENSION_RATES_2024_25.couple.maxAnnual)}/year
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(AGE_PENSION_RATES_2024_25.couple.maxFortnightly)} fortnightly
              </p>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Eligibility Checklist */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Eligibility Checklist</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {result.isEligibleByAge ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm">Age requirement (67+): {profile.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isEligibleByResidency ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm">Residency requirement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isEligibleByAssets ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm">Assets test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isEligibleByIncome ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm">Income test</span>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Assets Test */}
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Assets Test</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Assessable Assets</span>
                      <span className="font-medium">{formatCurrency(result.assetsTestResult.totalAssessableAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Pension Threshold</span>
                      <span className="font-medium">{formatCurrency(result.assetsTestResult.assetsTestThreshold)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Part Pension Cut-off</span>
                      <span className="font-medium">{formatCurrency(result.assetsTestResult.assetsTestUpperLimit)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-600">Pension Under Assets Test</span>
                      <span className="font-bold text-green-600">{formatCurrency(result.assetsTestResult.pensionUnderAssetsTest)}</span>
                    </div>
                  </div>
                </div>

                {/* Income Test */}
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Income Test</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deemed Income (annual)</span>
                      <span className="font-medium">{formatCurrency(result.incomeTestResult.deemedIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Free Area (annual)</span>
                      <span className="font-medium">{formatCurrency(result.incomeTestResult.incomeTestThreshold)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reduction</span>
                      <span className="font-medium text-red-600">-{formatCurrency(result.incomeTestResult.reductionAmount)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-600">Pension Under Income Test</span>
                      <span className="font-bold text-green-600">{formatCurrency(result.incomeTestResult.pensionUnderIncomeTest)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Result */}
              <div className={`p-6 rounded-xl border ${
                result.overallEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    result.overallEligible ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.overallEligible ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {result.overallEligible
                        ? `Eligible for ${result.paymentType === 'full' ? 'Full' : 'Part'} Age Pension`
                        : 'Not Currently Eligible'}
                    </h3>
                    {result.overallEligible && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Estimated Annual Payment</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(result.estimatedAnnualPayment)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ({formatCurrency(result.estimatedFortnightlyPayment)} fortnightly)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Strategies */}
              {result.overallEligible && result.paymentType === 'part' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Strategies to Increase Your Pension</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Spend down financial assets on home improvements (exempt asset)</li>
                    <li>• Consider gifting within limits ($10,000/year, $30,000/5 years)</li>
                    <li>• Prepay funeral expenses with an exempt funeral bond</li>
                    <li>• Review if a lifetime annuity may be beneficial</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
