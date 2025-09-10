'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, TrendingDown, TrendingUp, Calendar, PiggyBank } from 'lucide-react';
import type { TaxCalculationResult } from '../../lib/types/tax-types';
import { formatCurrency, formatPercentage, formatPayPeriod } from '../../lib/utils/formatters';

interface ResultsDisplayProps {
  result: TaxCalculationResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gross Income</p>
                <p className="text-2xl font-bold">{formatCurrency(result.grossIncome)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tax</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(result.totalTax)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.netIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Effective Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(result.effectiveRate)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Taxable Income</span>
              <span className="font-bold">{formatCurrency(result.taxableIncome)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span>Base Income Tax</span>
              <span className="text-red-600">{formatCurrency(result.baseTax)}</span>
            </div>
            
            {result.medicareLevy > 0 && (
              <div className="flex justify-between items-center py-2">
                <span>Medicare Levy (2%)</span>
                <span className="text-red-600">{formatCurrency(result.medicareLevy)}</span>
              </div>
            )}
            
            {result.medicareLevySurcharge > 0 && (
              <div className="flex justify-between items-center py-2">
                <span>Medicare Levy Surcharge</span>
                <span className="text-red-600">{formatCurrency(result.medicareLevySurcharge)}</span>
              </div>
            )}
            
            {result.lowIncomeTaxOffset > 0 && (
              <div className="flex justify-between items-center py-2">
                <span>Low Income Tax Offset</span>
                <span className="text-green-600">-{formatCurrency(result.lowIncomeTaxOffset)}</span>
              </div>
            )}
            
            {result.helpRepayment > 0 && (
              <div className="flex justify-between items-center py-2">
                <span>HELP/HECS Repayment</span>
                <span className="text-red-600">{formatCurrency(result.helpRepayment)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-t font-bold">
              <span>Total Tax</span>
              <span className="text-red-600">{formatCurrency(result.totalTax)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Take-home Pay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Take-home Pay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Weekly</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(result.weeklyTakeHome)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Fortnightly</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(result.fortnightlyTakeHome)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Monthly</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(result.monthlyTakeHome)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Daily</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(result.dailyTakeHome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Rates & Bracket Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Marginal Tax Rate</span>
                <span className="font-bold text-lg">{formatPercentage(result.marginalRate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Effective Tax Rate</span>
                <span className="font-bold text-lg">{formatPercentage(result.effectiveRate)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p>Your marginal rate is the tax rate on your next dollar of income.</p>
                <p>Your effective rate is your total tax as a percentage of total income.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {result.superannuationContribution > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Superannuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Contributions</span>
                  <span className="font-bold">{formatCurrency(result.superannuationContribution)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax Saving</span>
                  <span className="font-bold text-green-600">{formatCurrency(result.superTaxSaving)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>After-Super Income</span>
                  <span className="font-bold">{formatCurrency(result.afterSuperIncome)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Next Tax Bracket Info */}
      {result.nextBracketThreshold > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Next Tax Bracket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>You are {formatCurrency(result.distanceToNextBracket)} away from the next tax bracket.</p>
              <p className="text-sm text-gray-600">
                Your next {formatCurrency(result.distanceToNextBracket)} of income will be taxed at {formatPercentage(result.marginalRate)}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
