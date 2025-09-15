'use client';

import React, { useState, useEffect } from 'react';
import { AgeGroup, TaxInputData, TaxCalculationResult, ValidationError, COMMON_TAX_GOALS } from '../../types/australian-tax';
import { AustralianTaxCalculator } from '../../lib/tax-calculations/australian-calculator';
import TaxDataInput from '../shared/TaxDataInput';
import TaxSummaryCard from '../shared/TaxSummaryCard';

interface YoungProfessionalDashboardProps {
  className?: string;
}

export default function YoungProfessionalDashboard({ className = '' }: YoungProfessionalDashboardProps) {
  const [taxData, setTaxData] = useState<TaxInputData | null>(null);
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const ageGroup: AgeGroup = 'young';

  // Get relevant goals for young professionals
  const relevantGoals = COMMON_TAX_GOALS.filter(goal => 
    goal.ageGroups.includes(ageGroup)
  );

  const handleDataChange = (data: TaxInputData) => {
    setTaxData(data);
    
    if (isValid) {
      // Debounce calculation
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const result = AustralianTaxCalculator.calculateTax(data, ageGroup);
        setTaxResult(result);
        setIsCalculating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  };

  const handleValidationChange = (valid: boolean, validationErrors: ValidationError[]) => {
    setIsValid(valid);
    setErrors(validationErrors);
    
    if (!valid) {
      setTaxResult(null);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const YoungProfessionalInsights = () => (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Young Professional Tax Strategy</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Key Focus Areas</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Maximize take-home pay</li>
            <li>• Build emergency fund</li>
            <li>• Start superannuation optimization</li>
            <li>• Consider first home savings</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Tax Strategies</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Salary sacrifice to super</li>
            <li>• Claim work-related deductions</li>
            <li>• First Home Super Saver Scheme</li>
            <li>• Income protection insurance</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const TaxGoalsCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tax Goals</h3>
      <div className="space-y-4">
        {relevantGoals.map((goal) => (
          <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{goal.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                    goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {goal.priority} priority
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuickTips = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips for Young Professionals</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">1</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Start Early with Super</h4>
            <p className="text-sm text-gray-600">Even small additional contributions now can make a huge difference at retirement due to compound interest.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">2</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Track Work Expenses</h4>
            <p className="text-sm text-gray-600">Keep receipts for work-related expenses like equipment, training, and travel. They add up quickly!</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">3</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">First Home Savings</h4>
            <p className="text-sm text-gray-600">Use the First Home Super Saver Scheme to save for your deposit with tax benefits.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">4</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Income Protection</h4>
            <p className="text-sm text-gray-600">Consider income protection insurance - premiums are tax deductible and it protects your earning capacity.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Young Professional Tax Dashboard</h2>
        <p className="text-gray-600">Ages 18-30 • Building your financial foundation</p>
      </div>

      <YoungProfessionalInsights />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TaxDataInput
            onDataChange={handleDataChange}
            onValidationChange={handleValidationChange}
          />
          
          <QuickTips />
        </div>

        <div className="space-y-6">
          <TaxSummaryCard 
            result={taxResult} 
            isLoading={isCalculating}
          />
          
          <TaxGoalsCard />
        </div>
      </div>

      {taxResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Young Professional Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-800 mb-1">Superannuation Opportunity</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Math.max(0, taxResult.grossIncome * 0.115 - (taxResult.superannuation || 0)))}
              </div>
              <div className="text-xs text-green-600">Additional super potential</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-1">FHSS Eligibility</div>
              <div className="text-2xl font-bold text-blue-600">
                {taxResult.grossIncome > 40000 ? 'Eligible' : 'Not Yet'}
              </div>
              <div className="text-xs text-blue-600">First Home Super Saver</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-800 mb-1">Tax Efficiency</div>
              <div className="text-2xl font-bold text-purple-600">
                {taxResult.effectiveTaxRate.toFixed(1)}%
              </div>
              <div className="text-xs text-purple-600">Effective tax rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
