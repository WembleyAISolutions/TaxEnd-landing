'use client';

import React, { useState, useEffect } from 'react';
import { AgeGroup, TaxInputData, TaxCalculationResult, ValidationError, COMMON_TAX_GOALS } from '../../types/australian-tax';
import { AustralianTaxCalculator } from '../../lib/tax-calculations/australian-calculator';
import { useTaxDataPersistence } from '../../hooks/useTaxDataPersistence';
import { ScenarioAnalyzer, ProjectionParameters, WhatIfAnalysis } from '../../lib/tax-calculations/scenario-analyzer';
import TaxDataInput from '../shared/TaxDataInput';
import TaxSummaryCard from '../shared/TaxSummaryCard';
import NumberInput from '../shared/NumberInput';

interface ProfessionalDashboardProps {
  className?: string;
}

interface NegativeGearingData {
  propertyValue: number;
  rentalIncome: number;
  loanAmount: number;
  interestRate: number;
  maintenanceCosts: number;
  managementFees: number;
  insurance: number;
  councilRates: number;
  depreciation: number;
}

interface SalarySacrificeData {
  currentSalary: number;
  proposedSacrifice: number;
  sacrificeType: 'super' | 'car' | 'laptop' | 'other';
}

interface CapitalGainsData {
  purchasePrice: number;
  salePrice: number;
  purchaseDate: Date;
  saleDate: Date;
  improvementCosts: number;
  sellingCosts: number;
}

export default function ProfessionalDashboard({ className = '' }: ProfessionalDashboardProps) {
  const [taxData, setTaxData] = useState<TaxInputData | null>(null);
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'negative-gearing' | 'salary-sacrifice' | 'capital-gains' | 'super' | 'scenarios' | 'projections'>('overview');

  // Calculator states
  const [negativeGearingData, setNegativeGearingData] = useState<NegativeGearingData>({
    propertyValue: 800000,
    rentalIncome: 35000,
    loanAmount: 640000,
    interestRate: 6.5,
    maintenanceCosts: 3000,
    managementFees: 2100,
    insurance: 1200,
    councilRates: 2500,
    depreciation: 8000
  });

  const [salarySacrificeData, setSalarySacrificeData] = useState<SalarySacrificeData>({
    currentSalary: 120000,
    proposedSacrifice: 15000,
    sacrificeType: 'super'
  });

  const [capitalGainsData, setCapitalGainsData] = useState<CapitalGainsData>({
    purchasePrice: 500000,
    salePrice: 750000,
    purchaseDate: new Date('2020-01-01'),
    saleDate: new Date('2024-01-01'),
    improvementCosts: 25000,
    sellingCosts: 15000
  });

  const ageGroup: AgeGroup = 'professional';

  // Persistence hook
  const persistence = useTaxDataPersistence();

  // Scenario analysis state
  const [currentAge, setCurrentAge] = useState(35);
  const [projectionParameters, setProjectionParameters] = useState<ProjectionParameters>({
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 30,
    incomeGrowthRate: 3,
    inflationRate: 2.5,
    superContributionStrategy: 'minimum',
    expectedInvestmentReturn: 6,
  });
  const [whatIfAnalysis, setWhatIfAnalysis] = useState<WhatIfAnalysis | null>(null);

  // Get relevant goals for professionals
  const relevantGoals = COMMON_TAX_GOALS.filter(goal => 
    goal.ageGroups.includes(ageGroup)
  );

  const handleDataChange = (data: TaxInputData) => {
    setTaxData(data);
    
    if (isValid) {
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

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Negative Gearing Calculator
  const calculateNegativeGearing = () => {
    const annualInterest = (negativeGearingData.loanAmount * negativeGearingData.interestRate) / 100;
    const totalExpenses = annualInterest + negativeGearingData.maintenanceCosts + 
                         negativeGearingData.managementFees + negativeGearingData.insurance + 
                         negativeGearingData.councilRates + negativeGearingData.depreciation;
    const netRentalResult = negativeGearingData.rentalIncome - totalExpenses;
    const taxSaving = Math.abs(netRentalResult) * 0.325; // Assuming 32.5% marginal rate
    const netCashFlow = netRentalResult + (netRentalResult < 0 ? taxSaving : 0);

    return {
      annualInterest,
      totalExpenses,
      netRentalResult,
      taxSaving: netRentalResult < 0 ? taxSaving : 0,
      netCashFlow,
      isNegativelyGeared: netRentalResult < 0
    };
  };

  // Salary Sacrifice Calculator
  const calculateSalarySacrifice = () => {
    const currentTax = AustralianTaxCalculator.calculateTax({ grossIncome: salarySacrificeData.currentSalary }, ageGroup);
    const newSalary = salarySacrificeData.currentSalary - salarySacrificeData.proposedSacrifice;
    const newTax = AustralianTaxCalculator.calculateTax({ grossIncome: newSalary }, ageGroup);
    
    const taxSaving = (currentTax.payg + currentTax.medicareLevy) - (newTax.payg + newTax.medicareLevy);
    const netCostOfSacrifice = salarySacrificeData.proposedSacrifice - taxSaving;
    const effectiveRate = (netCostOfSacrifice / salarySacrificeData.proposedSacrifice) * 100;

    return {
      taxSaving,
      netCostOfSacrifice,
      effectiveRate,
      newTakeHome: newTax.netIncome
    };
  };

  // Capital Gains Calculator
  const calculateCapitalGains = () => {
    const capitalGain = capitalGainsData.salePrice - capitalGainsData.purchasePrice - 
                       capitalGainsData.improvementCosts - capitalGainsData.sellingCosts;
    
    const holdingPeriod = Math.floor((capitalGainsData.saleDate.getTime() - capitalGainsData.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    const eligibleForDiscount = holdingPeriod >= 1;
    const discountedGain = eligibleForDiscount ? capitalGain * 0.5 : capitalGain;
    const taxOnGain = discountedGain * 0.325; // Assuming 32.5% marginal rate

    return {
      capitalGain,
      holdingPeriod,
      eligibleForDiscount,
      discountedGain,
      taxOnGain,
      netGain: capitalGain - taxOnGain
    };
  };

  const ProfessionalInsights = () => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Professional Tax Strategy</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Peak Earning Focus</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Maximize tax-effective investments</li>
            <li>• Optimize superannuation contributions</li>
            <li>• Strategic debt management</li>
            <li>• Capital gains tax planning</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Advanced Strategies</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• Negative gearing opportunities</li>
            <li>• Salary sacrificing optimization</li>
            <li>• Franked dividend investing</li>
            <li>• Work-related deduction maximization</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'negative-gearing', label: 'Negative Gearing', icon: '🏠' },
          { id: 'salary-sacrifice', label: 'Salary Sacrifice', icon: '💰' },
          { id: 'capital-gains', label: 'Capital Gains', icon: '📈' },
          { id: 'super', label: 'Superannuation', icon: '🏦' },
          { id: 'scenarios', label: 'Scenarios', icon: '🎯' },
          { id: 'projections', label: 'Projections', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const NegativeGearingCalculator = () => {
    const result = calculateNegativeGearing();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Negative Gearing Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Property Details</h4>
            
            <NumberInput
              label="Property Value"
              value={negativeGearingData.propertyValue}
              onChange={(value) => setNegativeGearingData({...negativeGearingData, propertyValue: value})}
              min={0}
              placeholder="Enter property value"
            />
            
            <NumberInput
              label="Annual Rental Income"
              value={negativeGearingData.rentalIncome}
              onChange={(value) => setNegativeGearingData({...negativeGearingData, rentalIncome: value})}
              min={0}
              placeholder="Enter annual rental income"
            />
            
            <NumberInput
              label="Loan Amount"
              value={negativeGearingData.loanAmount}
              onChange={(value) => setNegativeGearingData({...negativeGearingData, loanAmount: value})}
              min={0}
              placeholder="Enter loan amount"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={negativeGearingData.interestRate}
                onChange={(e) => setNegativeGearingData({...negativeGearingData, interestRate: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Annual Expenses</h4>
            
            {[
              { key: 'maintenanceCosts', label: 'Maintenance & Repairs' },
              { key: 'managementFees', label: 'Management Fees' },
              { key: 'insurance', label: 'Insurance' },
              { key: 'councilRates', label: 'Council Rates' },
              { key: 'depreciation', label: 'Depreciation' }
            ].map((expense) => (
              <div key={expense.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{expense.label}</label>
                <input
                  type="number"
                  value={negativeGearingData[expense.key as keyof NegativeGearingData] as number}
                  onChange={(e) => setNegativeGearingData({
                    ...negativeGearingData, 
                    [expense.key]: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${result.isNegativelyGeared ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`text-sm font-medium mb-1 ${result.isNegativelyGeared ? 'text-red-800' : 'text-green-800'}`}>
              Net Rental Result
            </div>
            <div className={`text-2xl font-bold ${result.isNegativelyGeared ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(result.netRentalResult)}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800 mb-1">Tax Saving</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(result.taxSaving)}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-800 mb-1">Net Cash Flow</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(result.netCashFlow)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-800 mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-gray-600">
              {formatCurrency(result.totalExpenses)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SalarySacrificeCalculator = () => {
    const result = calculateSalarySacrifice();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Sacrifice Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <NumberInput
              label="Current Salary"
              value={salarySacrificeData.currentSalary}
              onChange={(value) => setSalarySacrificeData({...salarySacrificeData, currentSalary: value})}
              min={0}
              placeholder="Enter current salary"
            />
            
            <NumberInput
              label="Proposed Sacrifice Amount"
              value={salarySacrificeData.proposedSacrifice}
              onChange={(value) => setSalarySacrificeData({...salarySacrificeData, proposedSacrifice: value})}
              min={0}
              max={salarySacrificeData.currentSalary}
              placeholder="Enter sacrifice amount"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sacrifice Type</label>
              <select
                value={salarySacrificeData.sacrificeType}
                onChange={(e) => setSalarySacrificeData({...salarySacrificeData, sacrificeType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="super">Superannuation</option>
                <option value="car">Novated Lease</option>
                <option value="laptop">Laptop/Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-800 mb-1">Annual Tax Saving</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(result.taxSaving)}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Net Cost of Sacrifice</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(result.netCostOfSacrifice)}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-800 mb-1">Effective Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(result.effectiveRate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CapitalGainsCalculator = () => {
    const result = calculateCapitalGains();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Gains Tax Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <NumberInput
              label="Purchase Price"
              value={capitalGainsData.purchasePrice}
              onChange={(value) => setCapitalGainsData({...capitalGainsData, purchasePrice: value})}
              min={0}
              placeholder="Enter purchase price"
            />
            
            <NumberInput
              label="Sale Price"
              value={capitalGainsData.salePrice}
              onChange={(value) => setCapitalGainsData({...capitalGainsData, salePrice: value})}
              min={0}
              placeholder="Enter sale price"
            />
            
            <NumberInput
              label="Improvement Costs"
              value={capitalGainsData.improvementCosts}
              onChange={(value) => setCapitalGainsData({...capitalGainsData, improvementCosts: value})}
              min={0}
              placeholder="Enter improvement costs"
            />
            
            <NumberInput
              label="Selling Costs"
              value={capitalGainsData.sellingCosts}
              onChange={(value) => setCapitalGainsData({...capitalGainsData, sellingCosts: value})}
              min={0}
              placeholder="Enter selling costs"
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Capital Gain</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(result.capitalGain)}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-800 mb-1">Holding Period</div>
              <div className="text-2xl font-bold text-green-600">
                {result.holdingPeriod} years
              </div>
              <div className="text-xs text-green-600">
                {result.eligibleForDiscount ? '50% CGT discount applies' : 'No CGT discount'}
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm font-medium text-red-800 mb-1">Tax on Gain</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(result.taxOnGain)}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-800 mb-1">Net Gain After Tax</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(result.netGain)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuperannuationStrategies = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Superannuation Strategies</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Concessional Contributions</h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-800 mb-2">Annual Cap: $30,000</div>
            <div className="text-sm text-blue-600">
              • Employer contributions (SG + salary sacrifice)
              <br />
              • Personal deductible contributions
              <br />
              • Tax rate: 15% (vs your marginal rate)
            </div>
          </div>
          
          <h4 className="font-medium text-gray-800">Non-Concessional Contributions</h4>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-800 mb-2">Annual Cap: $120,000</div>
            <div className="text-sm text-green-600">
              • After-tax contributions
              <br />
              • Bring-forward rule: $360,000 over 3 years
              <br />
              • No tax on contributions
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Carry-Forward Contributions</h4>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-800 mb-2">Use Unused Cap Space</div>
            <div className="text-sm text-purple-600">
              • Available for 5 years
              <br />
              • Super balance must be under $500,000
              <br />
              • Maximize tax benefits
            </div>
          </div>
          
          <h4 className="font-medium text-gray-800">Co-contribution</h4>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-orange-800 mb-2">Government Match: Up to $500</div>
            <div className="text-sm text-orange-600">
              • Income threshold: $58,445
              <br />
              • 50c for every $1 contributed
              <br />
              • Maximum personal contribution: $1,000
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkRelatedDeductions = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Work-Related Deduction Maximization</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Vehicle Expenses</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Logbook method (actual costs)</li>
            <li>• Cents per km (max 5,000km)</li>
            <li>• Business use percentage</li>
            <li>• Fuel, insurance, registration</li>
            <li>• Maintenance and repairs</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Home Office</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Fixed rate: $0.67 per hour</li>
            <li>• Actual cost method</li>
            <li>• Electricity, gas, phone</li>
            <li>• Internet and equipment</li>
            <li>• Furniture and depreciation</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Professional Development</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Training courses and seminars</li>
            <li>• Professional memberships</li>
            <li>• Industry publications</li>
            <li>• Conferences and networking</li>
            <li>• Certification and licensing</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Record Keeping Tip</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Keep detailed records of all work-related expenses. The ATO requires evidence for all claims, and good record-keeping can maximize your deductions while ensuring compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TaxGoalsCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Tax Goals</h3>
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

  const ScenariosTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Scenarios</h3>
        
        {persistence.data.scenarios.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No scenarios saved yet</h3>
            <p className="text-sm text-gray-500">Save your tax calculations to compare different strategies</p>
          </div>
        ) : (
          <div className="space-y-4">
            {persistence.data.scenarios.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Income: {formatCurrency(scenario.inputData.grossIncome)}</span>
                      <span>Created: {scenario.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => persistence.addToComparison(scenario.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => persistence.deleteScenario(scenario.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {taxData && taxResult && (
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => {
                const scenario = persistence.saveScenario({
                  name: `Professional Strategy ${new Date().toLocaleDateString()}`,
                  description: `Income: ${formatCurrency(taxData.grossIncome)}, Tax: ${formatCurrency(taxResult.payg + taxResult.medicareLevy)}`,
                  ageGroup,
                  inputData: taxData,
                  calculationResult: taxResult,
                });
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Current Scenario
            </button>
          </div>
        )}
      </div>
      
      {persistence.data.comparisonScenarios.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {persistence.getComparisonScenarios().map((scenario) => (
                  <tr key={scenario.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scenario.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(scenario.inputData.grossIncome)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scenario.calculationResult ? formatCurrency(scenario.calculationResult.payg + scenario.calculationResult.medicareLevy) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scenario.calculationResult ? formatCurrency(scenario.calculationResult.netIncome) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scenario.calculationResult ? formatPercentage(scenario.calculationResult.effectiveTaxRate) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              onClick={persistence.clearComparison}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const ProjectionsTab = () => {
    const runWhatIfAnalysis = () => {
      if (!taxData) return;
      
      const analysis = ScenarioAnalyzer.analyzeWhatIf(
        taxData,
        ageGroup,
        currentAge,
        projectionParameters
      );
      setWhatIfAnalysis(analysis);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projection Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projection Years</label>
                <input
                  type="number"
                  value={projectionParameters.endYear - projectionParameters.startYear}
                  onChange={(e) => setProjectionParameters({
                    ...projectionParameters,
                    endYear: projectionParameters.startYear + Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income Growth Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={projectionParameters.incomeGrowthRate}
                  onChange={(e) => setProjectionParameters({
                    ...projectionParameters,
                    incomeGrowthRate: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Super Strategy</label>
                <select
                  value={projectionParameters.superContributionStrategy}
                  onChange={(e) => setProjectionParameters({
                    ...projectionParameters,
                    superContributionStrategy: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="minimum">Minimum (SG only)</option>
                  <option value="maximum">Maximum ($30,000)</option>
                  <option value="custom">Custom Amount</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={projectionParameters.expectedInvestmentReturn || 6}
                  onChange={(e) => setProjectionParameters({
                    ...projectionParameters,
                    expectedInvestmentReturn: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Investment ($)</label>
                <input
                  type="number"
                  value={projectionParameters.investmentContributions || 0}
                  onChange={(e) => setProjectionParameters({
                    ...projectionParameters,
                    investmentContributions: Number(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={runWhatIfAnalysis}
              disabled={!taxData}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              Run What-If Analysis
            </button>
          </div>
        </div>
        
        {whatIfAnalysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What-If Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-1">Base Scenario</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(whatIfAnalysis.baseScenario.finalNetWorth)}
                </div>
                <div className="text-xs text-blue-600">Final net worth</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800 mb-1">Best Alternative</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.max(...whatIfAnalysis.alternativeScenarios.map(s => s.finalNetWorth)))}
                </div>
                <div className="text-xs text-green-600">Potential improvement</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800 mb-1">Tax Savings</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(whatIfAnalysis.baseScenario.totalTaxPaid - Math.min(...whatIfAnalysis.alternativeScenarios.map(s => s.totalTaxPaid)))}
                </div>
                <div className="text-xs text-purple-600">Potential tax reduction</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Recommendations</h4>
              <ul className="space-y-2">
                {whatIfAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TaxDataInput
                onDataChange={handleDataChange}
                onValidationChange={handleValidationChange}
              />
              <WorkRelatedDeductions />
            </div>
            <div className="space-y-6">
              <TaxSummaryCard 
                result={taxResult} 
                isLoading={isCalculating}
              />
              <TaxGoalsCard />
            </div>
          </div>
        );
      case 'negative-gearing':
        return <NegativeGearingCalculator />;
      case 'salary-sacrifice':
        return <SalarySacrificeCalculator />;
      case 'capital-gains':
        return <CapitalGainsCalculator />;
      case 'super':
        return <SuperannuationStrategies />;
      case 'scenarios':
        return <ScenariosTab />;
      case 'projections':
        return <ProjectionsTab />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Tax Dashboard</h2>
        <p className="text-gray-600">Ages 31-45 • Peak earning years with advanced strategies</p>
      </div>

      <ProfessionalInsights />
      <TabNavigation />
      {renderTabContent()}

      {taxResult && activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Super Opportunity</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(Math.max(0, 30000 - (taxResult.superannuation || 0)))}
              </div>
              <div className="text-xs text-blue-600">Remaining concessional cap</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-800 mb-1">Investment Focus</div>
              <div className="text-2xl font-bold text-green-600">
                {taxResult.marginalTaxRate > 32.5 ? 'High Priority' : 'Consider'}
              </div>
              <div className="text-xs text-green-600">Negative gearing benefit</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-800 mb-1">Marginal Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {formatPercentage(taxResult.marginalTaxRate)}
              </div>
              <div className="text-xs text-purple-600">Tax on next dollar</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm font-medium text-orange-800 mb-1">Deduction Value</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(1000 * (taxResult.marginalTaxRate / 100))}
              </div>
              <div className="text-xs text-orange-600">Tax saving per $1,000 deduction</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
