'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, BarChart3, Info } from 'lucide-react';
import type { TaxCalculationResult, TaxBreakdown } from '../../lib/types/tax-types';
import { formatCurrency, formatPercentage } from '../../lib/utils/formatters';

interface TaxBreakdownProps {
  result: TaxCalculationResult;
}

export default function TaxBreakdownComponent({ result }: TaxBreakdownProps) {
  // Generate breakdown data
  const generateBreakdown = (): TaxBreakdown[] => {
    const breakdown: TaxBreakdown[] = [];
    
    // Income
    breakdown.push({
      component: 'Gross Income',
      amount: result.grossIncome,
      percentage: 100,
      description: 'Your total annual income before any deductions',
      category: 'income'
    });

    if (result.grossIncome !== result.taxableIncome) {
      const deductions = result.grossIncome - result.taxableIncome;
      breakdown.push({
        component: 'Deductions',
        amount: -deductions,
        percentage: (deductions / result.grossIncome) * 100,
        description: 'Work-related deductions and salary sacrifice',
        category: 'deduction'
      });
    }

    breakdown.push({
      component: 'Taxable Income',
      amount: result.taxableIncome,
      percentage: (result.taxableIncome / result.grossIncome) * 100,
      description: 'Income subject to tax after deductions',
      category: 'income'
    });

    // Tax components
    if (result.baseTax > 0) {
      breakdown.push({
        component: 'Income Tax',
        amount: -result.baseTax,
        percentage: (result.baseTax / result.grossIncome) * 100,
        description: 'Federal income tax based on progressive tax brackets',
        category: 'tax'
      });
    }

    if (result.medicareLevy > 0) {
      breakdown.push({
        component: 'Medicare Levy',
        amount: -result.medicareLevy,
        percentage: (result.medicareLevy / result.grossIncome) * 100,
        description: '2% levy to fund Medicare healthcare system',
        category: 'levy'
      });
    }

    if (result.medicareLevySurcharge > 0) {
      breakdown.push({
        component: 'Medicare Levy Surcharge',
        amount: -result.medicareLevySurcharge,
        percentage: (result.medicareLevySurcharge / result.grossIncome) * 100,
        description: 'Additional levy for high earners without private health insurance',
        category: 'levy'
      });
    }

    if (result.lowIncomeTaxOffset > 0) {
      breakdown.push({
        component: 'Low Income Tax Offset',
        amount: result.lowIncomeTaxOffset,
        percentage: (result.lowIncomeTaxOffset / result.grossIncome) * 100,
        description: 'Tax offset for low to middle income earners',
        category: 'offset'
      });
    }

    if (result.helpRepayment > 0) {
      breakdown.push({
        component: 'HELP Repayment',
        amount: -result.helpRepayment,
        percentage: (result.helpRepayment / result.grossIncome) * 100,
        description: 'Higher Education Loan Program repayment',
        category: 'tax'
      });
    }

    if (result.superannuationContribution > 0) {
      breakdown.push({
        component: 'Superannuation',
        amount: -result.superannuationContribution,
        percentage: (result.superannuationContribution / result.grossIncome) * 100,
        description: 'Voluntary superannuation contributions',
        category: 'deduction'
      });
    }

    return breakdown;
  };

  const breakdownData = generateBreakdown();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'income': return 'text-green-600 bg-green-50';
      case 'deduction': return 'text-blue-600 bg-blue-50';
      case 'tax': return 'text-red-600 bg-red-50';
      case 'offset': return 'text-purple-600 bg-purple-50';
      case 'levy': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income': return '💰';
      case 'deduction': return '📉';
      case 'tax': return '🏛️';
      case 'offset': return '💚';
      case 'levy': return '🏥';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Income & Tax Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {breakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="font-medium">{item.component}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(item.amount))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPercentage(item.percentage / 100)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Efficiency Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tax Efficiency Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Tax Rates</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Marginal Rate:</span>
                  <span className="font-bold">{formatPercentage(result.marginalRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Rate:</span>
                  <span className="font-bold">{formatPercentage(result.effectiveRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Take-home Rate:</span>
                  <span className="font-bold text-green-600">
                    {formatPercentage(result.netIncome / result.grossIncome)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Income Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Net Income:</span>
                  <span className="font-bold text-green-600">{formatCurrency(result.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span className="font-bold text-red-600">{formatCurrency(result.totalTax)}</span>
                </div>
                {result.superannuationContribution > 0 && (
                  <div className="flex justify-between">
                    <span>Super Contributions:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(result.superannuationContribution)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Bracket Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tax Bracket Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Current Tax Bracket</h4>
              <p className="text-blue-800">
                You are currently in the {formatPercentage(result.marginalRate)} tax bracket.
                This means your next dollar of income will be taxed at {formatPercentage(result.marginalRate)}.
              </p>
            </div>

            {result.nextBracketThreshold > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Next Tax Bracket</h4>
                <p className="text-yellow-800">
                  You are {formatCurrency(result.distanceToNextBracket)} away from the next tax bracket.
                  Consider this when planning salary increases or bonuses.
                </p>
              </div>
            )}

            {result.superTaxSaving > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Superannuation Tax Benefit</h4>
                <p className="text-green-800">
                  Your superannuation contributions are saving you {formatCurrency(result.superTaxSaving)} in tax.
                  Super contributions are taxed at 15% instead of your marginal rate of {formatPercentage(result.marginalRate)}.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.marginalRate > 0.15 && result.superannuationContribution < 27500 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 mt-1">💡</div>
                <div>
                  <div className="font-medium text-green-900">Maximize Super Contributions</div>
                  <div className="text-green-800 text-sm">
                    Consider increasing your super contributions to save tax. 
                    You can contribute up to ${(27500 - result.superannuationContribution).toLocaleString()} more this year.
                  </div>
                </div>
              </div>
            )}

            {!result.medicareLevySurcharge && result.taxableIncome > 97000 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mt-1">🏥</div>
                <div>
                  <div className="font-medium text-blue-900">Private Health Insurance</div>
                  <div className="text-blue-800 text-sm">
                    Great! You're avoiding the Medicare Levy Surcharge with your private health insurance.
                  </div>
                </div>
              </div>
            )}

            {result.medicareLevySurcharge > 0 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="text-orange-600 mt-1">⚠️</div>
                <div>
                  <div className="font-medium text-orange-900">Consider Private Health Insurance</div>
                  <div className="text-orange-800 text-sm">
                    You're paying {formatCurrency(result.medicareLevySurcharge)} in Medicare Levy Surcharge. 
                    Private health insurance might save you money.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
