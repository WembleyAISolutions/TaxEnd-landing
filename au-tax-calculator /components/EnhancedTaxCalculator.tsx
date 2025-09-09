'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, FileText, TrendingUp, Info, Users, Heart, GraduationCap } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TaxBracket {
  min: number
  max: number
  rate: number
  baseTax: number
}

interface TaxResults {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  incomeTax: number
  medicareLevy: number
  medicareLevySurcharge: number
  hecsRepayment: number
  totalTax: number
  afterTaxIncome: number
  effectiveRate: number
  marginalRate: number
  employerSuper: number
}

export default function EnhancedTaxCalculator() {
  const t = useTranslations('calculator')
  
  // Income inputs
  const [income, setIncome] = useState({
    salary: '',
    investment: '',
    rental: '',
    capitalGains: '',
    foreignIncome: '',
    other: ''
  })

  // Deduction inputs
  const [deductions, setDeductions] = useState({
    workExpenses: '',
    investmentExpenses: '',
    donations: '',
    other: ''
  })

  // Personal information
  const [personalInfo, setPersonalInfo] = useState({
    residencyStatus: 'resident',
    hasPrivateHealth: false,
    hecsDebt: '',
    spouseIncome: '',
    dependents: 0,
    age: 25
  })

  // Superannuation
  const [superannuation, setSuperannuation] = useState({
    personalDeductible: '',
    selfEmployed: false
  })

  // Australian 2024-25 Tax Brackets
  const getTaxBrackets = (residencyStatus: string): TaxBracket[] => {
    switch (residencyStatus) {
      case 'resident':
        return [
          { min: 0, max: 18200, rate: 0, baseTax: 0 },
          { min: 18201, max: 45000, rate: 0.19, baseTax: 0 },
          { min: 45001, max: 120000, rate: 0.325, baseTax: 5092 },
          { min: 120001, max: 180000, rate: 0.37, baseTax: 29467 },
          { min: 180001, max: Infinity, rate: 0.45, baseTax: 51667 }
        ]
      case 'working-holiday':
        return [
          { min: 0, max: 45000, rate: 0.15, baseTax: 0 },
          { min: 45001, max: 120000, rate: 0.325, baseTax: 6750 },
          { min: 120001, max: 180000, rate: 0.37, baseTax: 31125 },
          { min: 180001, max: Infinity, rate: 0.45, baseTax: 53325 }
        ]
      default: // non-resident
        return [
          { min: 0, max: 120000, rate: 0.325, baseTax: 0 },
          { min: 120001, max: 180000, rate: 0.37, baseTax: 39000 },
          { min: 180001, max: Infinity, rate: 0.45, baseTax: 61200 }
        ]
    }
  }

  // Calculate tax in real-time
  const calculateTax = (): TaxResults => {
    // Parse income values
    const totalIncome = Object.values(income).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
    const superDeductions = parseFloat(superannuation.personalDeductible) || 0
    
    const taxableIncome = Math.max(0, totalIncome - totalDeductions - superDeductions)
    
    // Calculate income tax using brackets
    const brackets = getTaxBrackets(personalInfo.residencyStatus)
    let incomeTax = 0
    let marginalRate = 0
    
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1
        if (taxableInBracket > 0) {
          incomeTax = bracket.baseTax + (taxableInBracket * bracket.rate)
          marginalRate = bracket.rate
        }
      }
    }

    // Medicare Levy (2% for residents earning over $23,226)
    let medicareLevy = 0
    if (personalInfo.residencyStatus === 'resident') {
      const medicareThreshold = personalInfo.spouseIncome ? 39167 : 23226
      if (taxableIncome > medicareThreshold) {
        medicareLevy = taxableIncome * 0.02
      }
    }

    // Medicare Levy Surcharge (for high earners without private health insurance)
    let medicareLevySurcharge = 0
    if (personalInfo.residencyStatus === 'resident' && !personalInfo.hasPrivateHealth) {
      const spouseIncome = parseFloat(personalInfo.spouseIncome) || 0
      const familyIncome = taxableIncome + spouseIncome
      
      if (familyIncome > 93000) {
        let surchargeRate = 0.01
        if (familyIncome > 108000) surchargeRate = 0.0125
        if (familyIncome > 144000) surchargeRate = 0.015
        
        medicareLevySurcharge = taxableIncome * surchargeRate
      }
    }

    // HECS-HELP Repayment
    let hecsRepayment = 0
    const hecsDebt = parseFloat(personalInfo.hecsDebt) || 0
    if (hecsDebt > 0 && taxableIncome > 51550) {
      const hecsRates = [
        { min: 51550, max: 59518, rate: 0.01 },
        { min: 59519, max: 63089, rate: 0.02 },
        { min: 63090, max: 66875, rate: 0.025 },
        { min: 66876, max: 70888, rate: 0.03 },
        { min: 70889, max: 75140, rate: 0.035 },
        { min: 75141, max: 79649, rate: 0.04 },
        { min: 79650, max: 84429, rate: 0.045 },
        { min: 84430, max: 89494, rate: 0.05 },
        { min: 89495, max: 94865, rate: 0.055 },
        { min: 94866, max: 100557, rate: 0.06 },
        { min: 100558, max: 106590, rate: 0.065 },
        { min: 106591, max: 112985, rate: 0.07 },
        { min: 112986, max: 119764, rate: 0.075 },
        { min: 119765, max: 126950, rate: 0.08 },
        { min: 126951, max: 134568, rate: 0.085 },
        { min: 134569, max: 142642, rate: 0.09 },
        { min: 142643, max: 151200, rate: 0.095 },
        { min: 151201, max: Infinity, rate: 0.1 }
      ]
      
      for (const rate of hecsRates) {
        if (taxableIncome >= rate.min && taxableIncome <= rate.max) {
          hecsRepayment = Math.min(taxableIncome * rate.rate, hecsDebt)
          break
        }
      }
    }

    // Employer superannuation (11% for 2024-25)
    const salaryIncome = parseFloat(income.salary) || 0
    const employerSuper = personalInfo.residencyStatus === 'resident' && !superannuation.selfEmployed 
      ? salaryIncome * 0.11 
      : 0

    const totalTax = incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment
    const afterTaxIncome = taxableIncome - totalTax
    const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0

    return {
      totalIncome,
      totalDeductions: totalDeductions + superDeductions,
      taxableIncome,
      incomeTax,
      medicareLevy,
      medicareLevySurcharge,
      hecsRepayment,
      totalTax,
      afterTaxIncome,
      effectiveRate,
      marginalRate: marginalRate * 100,
      employerSuper
    }
  }

  const results = calculateTax()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('en-AU')
  }

  const handleIncomeChange = (field: keyof typeof income, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    setIncome(prev => ({ ...prev, [field]: numericValue }))
  }

  const handleDeductionChange = (field: keyof typeof deductions, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    setDeductions(prev => ({ ...prev, [field]: numericValue }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">TaxEnd.AI</h1>
          </div>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
          
          <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <select 
                value={personalInfo.residencyStatus} 
                onChange={(e) => setPersonalInfo(prev => ({...prev, residencyStatus: e.target.value}))}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="resident">Australian Tax Resident</option>
                <option value="non-resident">Non-resident</option>
                <option value="working-holiday">Working Holiday Maker</option>
              </select>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Income Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">{t('income')}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary & Wages
                </label>
                <input
                  type="text"
                  value={formatNumber(income.salary)}
                  onChange={(e) => handleIncomeChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Income
                </label>
                <input
                  type="text"
                  value={formatNumber(income.investment)}
                  onChange={(e) => handleIncomeChange('investment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Income
                </label>
                <input
                  type="text"
                  value={formatNumber(income.rental)}
                  onChange={(e) => handleIncomeChange('rental', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capital Gains
                </label>
                <input
                  type="text"
                  value={formatNumber(income.capitalGains)}
                  onChange={(e) => handleIncomeChange('capitalGains', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              {personalInfo.residencyStatus === 'resident' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foreign Income
                  </label>
                  <input
                    type="text"
                    value={formatNumber(income.foreignIncome)}
                    onChange={(e) => handleIncomeChange('foreignIncome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Income
                </label>
                <input
                  type="text"
                  value={formatNumber(income.other)}
                  onChange={(e) => handleIncomeChange('other', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Deductions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work-related Expenses
                </label>
                <input
                  type="text"
                  value={formatNumber(deductions.workExpenses)}
                  onChange={(e) => handleDeductionChange('workExpenses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Expenses
                </label>
                <input
                  type="text"
                  value={formatNumber(deductions.investmentExpenses)}
                  onChange={(e) => handleDeductionChange('investmentExpenses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charitable Donations
                </label>
                <input
                  type="text"
                  value={formatNumber(deductions.donations)}
                  onChange={(e) => handleDeductionChange('donations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Deductions
                </label>
                <input
                  type="text"
                  value={formatNumber(deductions.other)}
                  onChange={(e) => handleDeductionChange('other', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>

              {personalInfo.residencyStatus === 'resident' && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="privateHealth"
                      checked={personalInfo.hasPrivateHealth}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, hasPrivateHealth: e.target.checked}))}
                      className="mr-2"
                    />
                    <label htmlFor="privateHealth" className="text-sm flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      Private Health Insurance
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      HECS-HELP Debt
                    </label>
                    <input
                      type="text"
                      value={formatNumber(personalInfo.hecsDebt)}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, hecsDebt: e.target.value.replace(/[^0-9.]/g, '')}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spouse Income (optional)
                    </label>
                    <input
                      type="text"
                      value={formatNumber(personalInfo.spouseIncome)}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, spouseIncome: e.target.value.replace(/[^0-9.]/g, '')}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Superannuation Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Superannuation</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Deductible Contributions
                </label>
                <input
                  type="text"
                  value={formatNumber(superannuation.personalDeductible)}
                  onChange={(e) => setSuperannuation(prev => ({...prev, personalDeductible: e.target.value.replace(/[^0-9.]/g, '')}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selfEmployed"
                  checked={superannuation.selfEmployed}
                  onChange={(e) => setSuperannuation(prev => ({...prev, selfEmployed: e.target.checked}))}
                  className="mr-2"
                />
                <label htmlFor="selfEmployed" className="text-sm">
                  Self-employed (no employer super)
                </label>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Employer Super (11%):</strong> {formatCurrency(results.employerSuper)}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Mandatory employer contribution for 2024-25
                </p>
              </div>
            </div>
          </div>

          {/* Tax Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Tax Calculation</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Total Income</span>
                <span className="font-medium">{formatCurrency(results.totalIncome)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Total Deductions</span>
                <span className="font-medium text-orange-600">-{formatCurrency(results.totalDeductions)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b font-semibold">
                <span>Taxable Income</span>
                <span>{formatCurrency(results.taxableIncome)}</span>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Income Tax</span>
                  <span className="text-red-600">{formatCurrency(results.incomeTax)}</span>
                </div>
                
                {results.medicareLevy > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Medicare Levy (2%)</span>
                    <span className="text-red-600">{formatCurrency(results.medicareLevy)}</span>
                  </div>
                )}
                
                {results.medicareLevySurcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Medicare Levy Surcharge</span>
                    <span className="text-red-600">{formatCurrency(results.medicareLevySurcharge)}</span>
                  </div>
                )}
                
                {results.hecsRepayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>HECS-HELP Repayment</span>
                    <span className="text-red-600">{formatCurrency(results.hecsRepayment)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center py-3 border-t font-bold text-lg">
                <span>Total Tax</span>
                <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3 font-bold">
                <span className="text-green-800">Take-home Pay</span>
                <span className="text-green-800">{formatCurrency(results.afterTaxIncome)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Effective Rate</div>
                  <div className="text-sm font-medium">{results.effectiveRate.toFixed(1)}%</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Marginal Rate</div>
                  <div className="text-sm font-medium">{results.marginalRate.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">
                  This calculator provides estimates based on 2024-25 Australian tax rates. 
                  Results are indicative only. Consult a tax professional for accurate advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
