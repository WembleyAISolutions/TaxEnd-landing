'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Calculator } from 'lucide-react';
import InputForm from '../../../components/TaxCalculator/InputForm';
import ResultsDisplay from '../../../components/TaxCalculator/ResultsDisplay';
import { calculateFederalTax } from '../../../lib/tax-engine/federal-calculator';
import { validateTaxInput } from '../../../lib/utils/validators';
import type { TaxCalculationInput, TaxCalculationResult } from '../../../lib/types/tax-types';

export default function CalculatorPage() {
  const [input, setInput] = useState<TaxCalculationInput>({
    annualIncome: 75000,
    isResident: true,
    hasPrivateHealthInsurance: false,
    familyStatus: 'single',
    numberOfDependents: 0,
    age: 30,
    isSenior: false,
    superContribution: 0,
    salarySacrifice: 0,
    helpDebt: 0,
    workDeductions: 0
  });

  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate when input changes (with debounce)
  React.useEffect(() => {
    const handleCalculate = async () => {
      try {
        setIsCalculating(true);
        setError(null);

        // Validate input
        const validatedInput = validateTaxInput(input);
        
        // Calculate tax
        const calculationResult = calculateFederalTax(validatedInput as TaxCalculationInput);
        setResult(calculationResult);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during calculation');
        setResult(null);
      } finally {
        setIsCalculating(false);
      }
    };

    if (input.annualIncome > 0) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [input]);

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      setError(null);

      // Validate input
      const validatedInput = validateTaxInput(input);
      
      // Calculate tax
      const calculationResult = calculateFederalTax(validatedInput as TaxCalculationInput);
      setResult(calculationResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Australian Tax Calculator 2024-25
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your income tax, Medicare levy, superannuation benefits, and take-home pay 
            with our comprehensive Australian tax calculator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Tax Calculator Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InputForm
                  input={input}
                  onChange={setInput}
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                />
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            {error && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Calculation Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !error && (
              <Card>
                <CardHeader>
                  <CardTitle>Tax Calculation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResultsDisplay result={result} />
                </CardContent>
              </Card>
            )}

            {!result && !error && !isCalculating && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-600">
                    Enter your income details on the left to see your tax calculation results.
                  </p>
                </CardContent>
              </Card>
            )}

            {isCalculating && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Calculating...
                  </h3>
                  <p className="text-gray-600">
                    Processing your tax calculation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Important Disclaimer</h3>
            <p className="text-blue-800 text-sm">
              This calculator provides estimates based on 2024-25 Australian tax rates and is for informational purposes only. 
              Tax calculations may vary based on individual circumstances. For personalized tax advice, please consult a qualified tax professional or the Australian Taxation Office (ATO).
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Calculator Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comprehensive Calculations</h3>
              <p className="text-gray-600">
                Includes income tax, Medicare levy, LITO, HELP repayments, and superannuation benefits.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                See your tax calculations update automatically as you change your income details.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2024-25 Tax Year</h3>
              <p className="text-gray-600">
                Uses the latest Australian tax rates and thresholds for the 2024-25 financial year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
