'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Calculator, DollarSign, TrendingUp, FileText, AlertCircle, History, Save } from 'lucide-react'
import { toast } from 'sonner'
import { taxEndAPI, TaxCalculationInput, TaxCalculationResult } from '../../../lib/api'

const taxCalculationSchema = z.object({
  income: z.number().min(0, 'Income must be positive').max(10000000, 'Income seems unrealistic'),
  deductions: z.number().min(0, 'Deductions must be positive').max(1000000, 'Deductions seem unrealistic'),
  hasPrivateHealth: z.boolean().optional(),
  isResident: z.boolean().optional(),
})

type TaxCalculationForm = z.infer<typeof taxCalculationSchema>

interface TaxResult {
  taxableIncome: number
  taxOwed: number
  afterTax: number
  effectiveRate: number
  marginalRate: number
  medicareLevy?: number
  medicareSurcharge?: number
  breakdown?: {
    federalTax: number
    stateTax?: number
    medicare: number
    surcharge?: number
  }
}

export default function TaxCalculator() {
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null)
  const [calculationHistory, setCalculationHistory] = useState<TaxResult[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaxCalculationForm>({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      income: 0,
      deductions: 0,
    },
  })

  const calculateTax = async (data: TaxCalculationForm) => {
    setLoading(true)
    
    try {
      // Prepare API input
      const apiInput: TaxCalculationInput = {
        income: data.income,
        deductions: data.deductions || 0,
        hasPrivateHealth: data.hasPrivateHealth || false,
        isResident: data.isResident !== false, // Default to true
        taxYear: new Date().getFullYear(),
      }

      // Call TaxEnd API
      const response = await taxEndAPI.calculateTax(apiInput)
      
      if (response.success && response.data) {
        const apiResult = response.data
        
        // Convert API result to local TaxResult format
        const result: TaxResult = {
          taxableIncome: apiResult.taxableIncome,
          taxOwed: apiResult.totalTax,
          afterTax: apiResult.netIncome,
          effectiveRate: apiResult.effectiveRate,
          marginalRate: apiResult.marginalRate,
          medicareLevy: apiResult.medicareLevy,
          medicareSurcharge: apiResult.medicareSurcharge,
          breakdown: apiResult.breakdown,
        }

        setTaxResult(result)
        setCalculationHistory(prev => [result, ...prev.slice(0, 4)]) // Keep last 5 calculations
        
        // Save tax return to API
        await taxEndAPI.saveTaxReturn(apiInput, apiResult)
        
        toast.success('Tax calculation completed!')
      } else {
        throw new Error(response.message || 'Tax calculation failed')
      }
    } catch (error) {
      console.error('Tax calculation error:', error)
      
      // Fallback to local calculation if API fails
      const { income, deductions } = data
      const taxableIncome = Math.max(0, income - (deductions || 0))
      
      // Simplified Australian tax brackets for 2024-25
      let taxOwed = 0
      let marginalRate = 0
      
      if (taxableIncome > 18200) {
        if (taxableIncome <= 45000) {
          taxOwed = (taxableIncome - 18200) * 0.19
          marginalRate = 19
        } else if (taxableIncome <= 120000) {
          taxOwed = 5092 + (taxableIncome - 45000) * 0.325
          marginalRate = 32.5
        } else if (taxableIncome <= 180000) {
          taxOwed = 29467 + (taxableIncome - 120000) * 0.37
          marginalRate = 37
        } else {
          taxOwed = 51667 + (taxableIncome - 180000) * 0.45
          marginalRate = 45
        }
      }

      const effectiveRate = taxableIncome > 0 ? (taxOwed / taxableIncome) * 100 : 0
      const result: TaxResult = {
        taxableIncome,
        taxOwed,
        afterTax: taxableIncome - taxOwed,
        effectiveRate,
        marginalRate,
      }

      setTaxResult(result)
      setCalculationHistory(prev => [result, ...prev.slice(0, 4)])
      
      toast.warning('Using offline calculation - API unavailable')
    } finally {
      setLoading(false)
    }
  }

  const saveTaxReturn = async () => {
    if (!taxResult) return
    
    try {
      const apiInput: TaxCalculationInput = {
        income: watchedValues.income,
        deductions: watchedValues.deductions || 0,
        hasPrivateHealth: watchedValues.hasPrivateHealth || false,
        isResident: watchedValues.isResident !== false,
        taxYear: new Date().getFullYear(),
      }

      const apiResult: TaxCalculationResult = {
        taxableIncome: taxResult.taxableIncome,
        incomeTax: taxResult.taxOwed - (taxResult.medicareLevy || 0) - (taxResult.medicareSurcharge || 0),
        medicareLevy: taxResult.medicareLevy || 0,
        medicareSurcharge: taxResult.medicareSurcharge || 0,
        totalTax: taxResult.taxOwed,
        netIncome: taxResult.afterTax,
        effectiveRate: taxResult.effectiveRate,
        marginalRate: taxResult.marginalRate,
        breakdown: taxResult.breakdown || {
          federalTax: taxResult.taxOwed,
          medicare: taxResult.medicareLevy || 0,
          surcharge: taxResult.medicareSurcharge || 0,
        },
      }

      const response = await taxEndAPI.saveTaxReturn(apiInput, apiResult)
      
      if (response.success) {
        toast.success('Tax return saved successfully!')
      } else {
        toast.error(response.message || 'Failed to save tax return')
      }
    } catch (error) {
      console.error('Save tax return error:', error)
      toast.error('Failed to save tax return')
    }
  }

  const watchedValues = watch()

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calculator className="text-blue-600" size={32} />
          Tax Calculator
        </h1>
        <p className="text-gray-600 mt-2">Calculate your Australian income tax for 2024-25</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Income Details</h2>
          
          <form onSubmit={handleSubmit(calculateTax)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Gross Income ($)
              </label>
              <input
                type="number"
                {...register('income', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.income ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="e.g., 75000"
              />
              {errors.income && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  {errors.income.message}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Deductions ($)
              </label>
              <input
                type="number"
                {...register('deductions', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.deductions ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="e.g., 5000"
              />
              {errors.deductions && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  {errors.deductions.message}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('hasPrivateHealth')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  I have private health insurance
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('isResident')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  I am an Australian tax resident
                </label>
              </div>
            </div>

            {/* Live Preview */}
            {watchedValues.income > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Taxable Income: ${Math.max(0, (watchedValues.income || 0) - (watchedValues.deductions || 0)).toLocaleString()}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate Tax'}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Calculation Results</h2>
          
          {taxResult ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
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

              {/* Tax Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <p className="text-sm text-orange-600 font-medium">Effective Rate</p>
                  <p className="text-lg font-bold text-orange-700">{taxResult.effectiveRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-purple-600 font-medium">Marginal Rate</p>
                  <p className="text-lg font-bold text-purple-700">{taxResult.marginalRate}%</p>
                </div>
              </div>
              
              {/* Save Tax Return Button */}
              <button
                onClick={saveTaxReturn}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Tax Return
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This calculation uses the TaxEnd-API for accurate tax calculations. 
                  Results include Medicare levy, offsets, and other factors based on 2024-25 Australian tax law.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calculator size={48} className="mx-auto mb-4 opacity-50" />
              <p>Enter your income details and click "Calculate Tax" to see results</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Calculation History */}
      {calculationHistory.length > 0 && (
        <motion.div 
          className="bg-white rounded-xl shadow-sm border p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <History className="text-gray-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Recent Calculations</h3>
          </div>
          <div className="space-y-2">
            {calculationHistory.map((calc, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                <span>Income: ${calc.taxableIncome.toLocaleString()}</span>
                <span>Tax: ${calc.taxOwed.toLocaleString()}</span>
                <span className="text-green-600 font-medium">{calc.effectiveRate.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
