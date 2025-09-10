'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Home, Zap, Globe } from 'lucide-react';
import BracketCreepAnalyzer from './BracketCreepAnalyzer';
import RegionalTaxCalculator from './RegionalTaxCalculator';

// Simple Income Tax Calculator Component
function IncomeTaxCalculator() {
  const [income, setIncome] = useState<number>(75000);
  const [residencyStatus, setResidencyStatus] = useState<string>('resident');
  const [results, setResults] = useState<any>(null);

  // Australian Tax Brackets 2024-25
  const TAX_BRACKETS = [
    { min: 0, max: 18200, rate: 0, tax: 0 },
    { min: 18201, max: 45000, rate: 0.19, tax: 0 },
    { min: 45001, max: 120000, rate: 0.325, tax: 5092 },
    { min: 120001, max: 180000, rate: 0.37, tax: 29467 },
    { min: 180001, max: null, rate: 0.45, tax: 51667 }
  ];

  const calculateTax = () => {
    if (income <= 0) return;

    const bracket = TAX_BRACKETS.find(b => 
      income >= b.min && (b.max === null || income <= b.max)
    );

    if (!bracket) return;

    const tax = bracket.rate === 0 ? 0 : bracket.tax + (income - bracket.min + 1) * bracket.rate;
    const afterTax = income - tax;
    const effectiveRate = (tax / income) * 100;
    const marginalRate = bracket.rate * 100;

    setResults({
      grossIncome: income,
      tax: Math.round(tax),
      afterTax: Math.round(afterTax),
      effectiveRate: effectiveRate.toFixed(2),
      marginalRate: marginalRate.toFixed(1),
      bracket: `${marginalRate.toFixed(0)}% bracket`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Income Tax Calculator 2024-25
          </CardTitle>
          <CardDescription>
            Calculate your Australian income tax obligations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                placeholder="Enter your annual income"
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residency">Residency Status</Label>
              <select 
                id="residency"
                value={residencyStatus}
                onChange={(e) => setResidencyStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="resident">Australian Resident</option>
                <option value="non-resident">Non-resident</option>
                <option value="working-holiday">Working Holiday Maker</option>
              </select>
            </div>
          </div>
          
          <Button onClick={calculateTax} className="w-full" size="lg">
            Calculate Tax
          </Button>
          
          {results && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Tax Calculation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Gross Income</div>
                  <div className="text-xl font-bold">${results.grossIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Income Tax</div>
                  <div className="text-xl font-bold text-red-600">${results.tax.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">After-Tax Income</div>
                  <div className="text-xl font-bold text-green-600">${results.afterTax.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Effective Tax Rate</div>
                  <div className="text-xl font-bold">{results.effectiveRate}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Marginal Tax Rate</div>
                  <div className="text-xl font-bold">{results.marginalRate}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Tax Bracket</div>
                  <div className="text-xl font-bold">{results.bracket}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Capital Gains Tax Calculator Component
function CapitalGainsCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [salePrice, setSalePrice] = useState<number>(650000);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(18);
  const [costs, setCosts] = useState<number>(15000);
  const [results, setResults] = useState<any>(null);

  const calculateCGT = () => {
    const capitalGain = salePrice - purchasePrice - costs;
    const isEligibleForDiscount = holdingPeriod >= 12;
    const discountedGain = isEligibleForDiscount ? capitalGain * 0.5 : capitalGain;
    
    setResults({
      capitalGain: Math.round(capitalGain),
      discountedGain: Math.round(discountedGain),
      discount: isEligibleForDiscount,
      holdingPeriod
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Capital Gains Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate your capital gains tax liability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="purchase">Purchase Price</Label>
              <Input
                id="purchase"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                placeholder="Purchase price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sale">Sale Price</Label>
              <Input
                id="sale"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                placeholder="Sale price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holding">Holding Period (months)</Label>
              <Input
                id="holding"
                type="number"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                placeholder="Months held"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="costs">Associated Costs</Label>
              <Input
                id="costs"
                type="number"
                value={costs}
                onChange={(e) => setCosts(Number(e.target.value))}
                placeholder="Legal, agent fees etc."
              />
            </div>
          </div>
          
          <Button onClick={calculateCGT} className="w-full" size="lg">
            Calculate Capital Gains
          </Button>
          
          {results && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Capital Gains Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Capital Gain</div>
                  <div className="text-xl font-bold">${results.capitalGain.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Taxable Gain</div>
                  <div className="text-xl font-bold text-blue-600">${results.discountedGain.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">CGT Discount</div>
                  <div className="text-xl font-bold">
                    {results.discount ? '50% Applied' : 'Not Eligible'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Holding Period</div>
                  <div className="text-xl font-bold">{results.holdingPeriod} months</div>
                </div>
              </div>
              {results.discount && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                  ✓ Eligible for 50% CGT discount (held for 12+ months)
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Negative Gearing Calculator Component
function NegativeGearingCalculator() {
  const [rentalIncome, setRentalIncome] = useState<number>(25000);
  const [expenses, setExpenses] = useState<number>(35000);
  const [taxableIncome, setTaxableIncome] = useState<number>(80000);
  const [results, setResults] = useState<any>(null);

  const calculateNegativeGearing = () => {
    const rentalLoss = Math.max(0, expenses - rentalIncome);
    const reducedTaxableIncome = Math.max(0, taxableIncome - rentalLoss);
    
    // Simplified tax calculation
    const originalTax = calculateSimpleTax(taxableIncome);
    const newTax = calculateSimpleTax(reducedTaxableIncome);
    const taxSaving = originalTax - newTax;
    
    setResults({
      rentalLoss: Math.round(rentalLoss),
      taxSaving: Math.round(taxSaving),
      reducedIncome: Math.round(reducedTaxableIncome),
      netCost: Math.round(rentalLoss - taxSaving)
    });
  };

  const calculateSimpleTax = (income: number): number => {
    if (income <= 18200) return 0;
    if (income <= 45000) return (income - 18200) * 0.19;
    if (income <= 120000) return 5092 + (income - 45000) * 0.325;
    if (income <= 180000) return 29467 + (income - 120000) * 0.37;
    return 51667 + (income - 180000) * 0.45;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Negative Gearing Calculator
          </CardTitle>
          <CardDescription>
            Calculate the tax benefits of negative gearing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rental">Annual Rental Income</Label>
              <Input
                id="rental"
                type="number"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(Number(e.target.value))}
                placeholder="Rental income"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenses">Annual Expenses</Label>
              <Input
                id="expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                placeholder="Interest, rates, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxable">Your Taxable Income</Label>
              <Input
                id="taxable"
                type="number"
                value={taxableIncome}
                onChange={(e) => setTaxableIncome(Number(e.target.value))}
                placeholder="Your salary"
              />
            </div>
          </div>
          
          <Button onClick={calculateNegativeGearing} className="w-full" size="lg">
            Calculate Negative Gearing Benefits
          </Button>
          
          {results && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Negative Gearing Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Rental Loss</div>
                  <div className="text-xl font-bold text-red-600">${results.rentalLoss.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Tax Saving</div>
                  <div className="text-xl font-bold text-green-600">${results.taxSaving.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Net Annual Cost</div>
                  <div className="text-xl font-bold">${results.netCost.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Reduced Taxable Income</div>
                  <div className="text-xl font-bold">${results.reducedIncome.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
                💡 Your out-of-pocket cost is ${results.netCost.toLocaleString()} per year after tax benefits
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Enhanced Tax Calculator Component
export default function EnhancedTaxCalculator() {
  return (
    <section id="calculator" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Tax Calculator Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced tax planning tools including our revolutionary Bracket Creep Analyzer - 
            understand how your tax position evolves over time and optimize your financial strategy
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <Tabs defaultValue="bracket" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-none">
              <TabsTrigger value="bracket" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Bracket Creep
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Income Tax
              </TabsTrigger>
              <TabsTrigger value="cgt" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Capital Gains
              </TabsTrigger>
              <TabsTrigger value="negative" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Negative Gearing
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Regional Tax
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bracket" className="p-0">
              <BracketCreepAnalyzer />
            </TabsContent>
            
            <TabsContent value="income" className="p-6">
              <IncomeTaxCalculator />
            </TabsContent>
            
            <TabsContent value="cgt" className="p-6">
              <CapitalGainsCalculator />
            </TabsContent>
            
            <TabsContent value="negative" className="p-6">
              <NegativeGearingCalculator />
            </TabsContent>
            
            <TabsContent value="regional" className="p-0">
              <RegionalTaxCalculator />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            All calculations are estimates based on 2024-25 tax rates. 
            Consult a tax professional for personalized advice.
          </p>
        </div>
      </div>
    </section>
  );
}
