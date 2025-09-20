'use client'

import { useState } from 'react'
import { Calculator, DollarSign, TrendingUp, FileText } from 'lucide-react'

export default function TaxCalculator() {
  const [income, setIncome] = useState('')
  const [deductions, setDeductions] = useState('')
  const [taxResult, setTaxResult] = useState<{
    taxableIncome: number
    taxOwed: number
    afterTax: number
  } | null>(null)

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0
    const totalDeductions = parseFloat(deductions) || 0
    const taxableIncome = Math.max(0, grossIncome - totalDeductions)
    
    // Simplified Australian tax brackets for 2024-25
    let taxOwed = 0
    if (taxableIncome > 18200) {
      if (taxableIncome <= 45000) {
        taxOwed = (taxableIncome - 18200) * 0.19
      } else if (taxableIncome <= 120000) {
        taxOwed = 5092 + (taxableIncome - 45000) * 0.325
      } else if (taxableIncome <= 180000) {
        taxOwed = 29467 + (taxableIncome - 120000) * 0.37
      } else {
        taxOwed = 51667 + (taxableIncome - 180000) * 0.45
      }
    }

    setTaxResult({
      taxableIncome,
      taxOwed,
      afterTax: taxableIncome - taxOwed
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calculator className="text-blue-600" size={32} />
          Tax Calculator
        </h1>
        <p className="text-gray-600 mt-2">Calculate your Australian income tax for 2024-25</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Income Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Gross Income ($)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 75000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Deductions ($)
              </label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000"
              />
            </div>
            
            <button
              onClick={calculateTax}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Calculate Tax
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculation Results</h2>
          
          {taxResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="text-gray-600" size={20} />
                  <span className="font-medium">Taxable Income</span>
                </div>
                <span className="text-lg font-bold">${taxResult.taxableIncome.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-red-600" size={20} />
                  <span className="font-medium">Tax Owed</span>
                </div>
                <span className="text-lg font-bold text-red-600">${taxResult.taxOwed.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <span className="font-medium">After-Tax Income</span>
                </div>
                <span className="text-lg font-bold text-green-600">${taxResult.afterTax.toLocaleString()}</span>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a simplified calculation based on 2024-25 Australian tax brackets. 
                  Actual tax calculations may include Medicare levy, offsets, and other factors.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calculator size={48} className="mx-auto mb-4 opacity-50" />
              <p>Enter your income details and click "Calculate Tax" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
