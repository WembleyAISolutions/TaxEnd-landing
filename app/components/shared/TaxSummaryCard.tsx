'use client';

import React from 'react';
import { TaxCalculationResult, DashboardMetric } from '../../types/australian-tax';

interface TaxSummaryCardProps {
  result: TaxCalculationResult | null;
  isLoading?: boolean;
  className?: string;
}

export default function TaxSummaryCard({ result, isLoading = false, className = '' }: TaxSummaryCardProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tax calculation yet</h3>
        <p className="mt-1 text-sm text-gray-500">Enter your tax information to see your results</p>
      </div>
    );
  }

  const metrics: DashboardMetric[] = [
    {
      id: 'grossIncome',
      label: 'Gross Income',
      value: result.grossIncome,
      format: 'currency',
      description: 'Total income before tax'
    },
    {
      id: 'taxableIncome',
      label: 'Taxable Income',
      value: result.taxableIncome,
      format: 'currency',
      description: 'Income after deductions'
    },
    {
      id: 'totalDeductions',
      label: 'Total Deductions',
      value: result.totalDeductions,
      format: 'currency',
      trend: result.totalDeductions > 0 ? 'up' : 'neutral',
      description: 'All allowable deductions'
    },
    {
      id: 'payg',
      label: 'Income Tax',
      value: result.payg,
      format: 'currency',
      description: 'Tax on your income'
    },
    {
      id: 'medicareLevy',
      label: 'Medicare Levy',
      value: result.medicareLevy,
      format: 'currency',
      description: '2% levy for Medicare'
    },
    {
      id: 'netIncome',
      label: 'Net Income',
      value: result.netIncome,
      format: 'currency',
      trend: 'up',
      description: 'Take-home income after tax'
    },
    {
      id: 'effectiveTaxRate',
      label: 'Effective Tax Rate',
      value: result.effectiveTaxRate,
      format: 'percentage',
      description: 'Average tax rate on total income'
    },
    {
      id: 'estimatedRefund',
      label: 'Estimated Refund',
      value: result.estimatedRefund,
      format: 'currency',
      trend: result.estimatedRefund > 0 ? 'up' : result.estimatedRefund < 0 ? 'down' : 'neutral',
      description: 'Expected refund or amount owing'
    }
  ];

  const MetricCard = ({ metric }: { metric: DashboardMetric }) => {
    const formatValue = (value: number | string, format: string) => {
      if (typeof value === 'string') return value;
      
      switch (format) {
        case 'currency':
          return formatCurrency(value);
        case 'percentage':
          return formatPercentage(value);
        case 'number':
          return value.toLocaleString();
        default:
          return value.toString();
      }
    };

    const getTrendIcon = (trend?: string) => {
      switch (trend) {
        case 'up':
          return (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          );
        case 'down':
          return (
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          );
        default:
          return null;
      }
    };

    const getValueColor = (id: string, value: number) => {
      if (id === 'estimatedRefund') {
        return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-900';
      }
      if (id === 'netIncome') {
        return 'text-green-600';
      }
      return 'text-gray-900';
    };

    return (
      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">{metric.label}</div>
          {getTrendIcon(metric.trend)}
        </div>
        <div className={`text-2xl font-bold ${getValueColor(metric.id, typeof metric.value === 'number' ? metric.value : 0)}`}>
          {formatValue(metric.value, metric.format)}
        </div>
        {metric.description && (
          <div className="text-xs text-gray-500 mt-1">{metric.description}</div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Tax Calculation Summary</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          FY 2024-25
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {result.recommendations && result.recommendations.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Tax Optimization Recommendations</h4>
          <div className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">{recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t text-xs text-gray-500">
        <p>
          * This is an estimate based on current tax rates and your provided information. 
          Consult a tax professional for personalized advice.
        </p>
      </div>
    </div>
  );
}
