'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, DollarSign, Calculator, TrendingUp, Home, Users } from 'lucide-react';

// Australian State Tax Data
const AUSTRALIAN_STATES = {
  NSW: {
    name: 'New South Wales',
    payrollTaxThreshold: 1200000,
    payrollTaxRate: 0.0485,
    stampDutyRates: [
      { min: 0, max: 14000, rate: 0.0125 },
      { min: 14001, max: 32000, rate: 0.015 },
      { min: 32001, max: 85000, rate: 0.0175 },
      { min: 85001, max: 319000, rate: 0.035 },
      { min: 319001, max: 1064000, rate: 0.045 },
      { min: 1064001, max: null, rate: 0.055 }
    ],
    landTaxThreshold: 969000,
    landTaxRate: 0.017,
    firstHomeBuyerGrant: 10000,
    firstHomeBuyerThreshold: 800000
  },
  VIC: {
    name: 'Victoria',
    payrollTaxThreshold: 700000,
    payrollTaxRate: 0.0485,
    stampDutyRates: [
      { min: 0, max: 25000, rate: 0.014 },
      { min: 25001, max: 130000, rate: 0.024 },
      { min: 130001, max: 960000, rate: 0.06 },
      { min: 960001, max: null, rate: 0.055 }
    ],
    landTaxThreshold: 300000,
    landTaxRate: 0.02,
    firstHomeBuyerGrant: 10000,
    firstHomeBuyerThreshold: 750000
  },
  QLD: {
    name: 'Queensland',
    payrollTaxThreshold: 1300000,
    payrollTaxRate: 0.0475,
    stampDutyRates: [
      { min: 0, max: 5000, rate: 0 },
      { min: 5001, max: 75000, rate: 0.015 },
      { min: 75001, max: 540000, rate: 0.035 },
      { min: 540001, max: 1000000, rate: 0.045 },
      { min: 1000001, max: null, rate: 0.0575 }
    ],
    landTaxThreshold: 600000,
    landTaxRate: 0.01,
    firstHomeBuyerGrant: 15000,
    firstHomeBuyerThreshold: 750000
  },
  WA: {
    name: 'Western Australia',
    payrollTaxThreshold: 1000000,
    payrollTaxRate: 0.055,
    stampDutyRates: [
      { min: 0, max: 120000, rate: 0.019 },
      { min: 120001, max: 150000, rate: 0.029 },
      { min: 150001, max: 360000, rate: 0.039 },
      { min: 360001, max: 725000, rate: 0.049 },
      { min: 725001, max: null, rate: 0.051 }
    ],
    landTaxThreshold: 300000,
    landTaxRate: 0.01,
    firstHomeBuyerGrant: 10000,
    firstHomeBuyerThreshold: 750000
  },
  SA: {
    name: 'South Australia',
    payrollTaxThreshold: 1500000,
    payrollTaxRate: 0.0495,
    stampDutyRates: [
      { min: 0, max: 12000, rate: 0.01 },
      { min: 12001, max: 30000, rate: 0.02 },
      { min: 30001, max: 50000, rate: 0.03 },
      { min: 50001, max: 100000, rate: 0.04 },
      { min: 100001, max: 200000, rate: 0.05 },
      { min: 200001, max: null, rate: 0.055 }
    ],
    landTaxThreshold: 391000,
    landTaxRate: 0.005,
    firstHomeBuyerGrant: 15000,
    firstHomeBuyerThreshold: 650000
  },
  TAS: {
    name: 'Tasmania',
    payrollTaxThreshold: 1250000,
    payrollTaxRate: 0.0615,
    stampDutyRates: [
      { min: 0, max: 3000, rate: 0.05 },
      { min: 3001, max: 25000, rate: 0.175 },
      { min: 25001, max: 75000, rate: 0.35 },
      { min: 75001, max: 200000, rate: 0.4 },
      { min: 200001, max: null, rate: 0.45 }
    ],
    landTaxThreshold: 25000,
    landTaxRate: 0.0055,
    firstHomeBuyerGrant: 20000,
    firstHomeBuyerThreshold: 600000
  },
  ACT: {
    name: 'Australian Capital Territory',
    payrollTaxThreshold: 2000000,
    payrollTaxRate: 0.0675,
    stampDutyRates: [
      { min: 0, max: 200000, rate: 0 },
      { min: 200001, max: 300000, rate: 0.07 },
      { min: 300001, max: 500000, rate: 0.082 },
      { min: 500001, max: 750000, rate: 0.0465 },
      { min: 750001, max: 1000000, rate: 0.0565 },
      { min: 1000001, max: null, rate: 0.0665 }
    ],
    landTaxThreshold: 0,
    landTaxRate: 0.0076,
    firstHomeBuyerGrant: 7000,
    firstHomeBuyerThreshold: 500000
  },
  NT: {
    name: 'Northern Territory',
    payrollTaxThreshold: 1500000,
    payrollTaxRate: 0.055,
    stampDutyRates: [
      { min: 0, max: 525000, rate: 0.0665 },
      { min: 525001, max: null, rate: 0.0565 }
    ],
    landTaxThreshold: 25000,
    landTaxRate: 0.005,
    firstHomeBuyerGrant: 26000,
    firstHomeBuyerThreshold: 650000
  }
};

// New Zealand Tax Data
const NZ_TAX_BRACKETS = [
  { min: 0, max: 14000, rate: 0.105 },
  { min: 14001, max: 48000, rate: 0.175 },
  { min: 48001, max: 70000, rate: 0.30 },
  { min: 70001, max: 180000, rate: 0.33 },
  { min: 180001, max: null, rate: 0.39 }
];

const NZ_ACC_RATES = {
  earner: 0.0139,
  workingsSafer: 0.0067
};

// Australian State Tax Calculator
function AustralianStateCalculator() {
  const [selectedState, setSelectedState] = useState('NSW');
  const [payroll, setPayroll] = useState(1500000);
  const [propertyValue, setPropertyValue] = useState(650000);
  const [landValue, setLandValue] = useState(800000);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculateStateTaxes = () => {
    const state = AUSTRALIAN_STATES[selectedState as keyof typeof AUSTRALIAN_STATES];
    
    // Payroll Tax
    const payrollTax = payroll > state.payrollTaxThreshold 
      ? (payroll - state.payrollTaxThreshold) * state.payrollTaxRate 
      : 0;

    // Stamp Duty
    let stampDuty = 0;
    for (const bracket of state.stampDutyRates) {
      if (propertyValue > bracket.min && (bracket.max === null || propertyValue <= bracket.max)) {
        if (bracket.min === 0) {
          stampDuty = Math.min(propertyValue, bracket.max || propertyValue) * bracket.rate;
        } else {
          const previousBrackets = state.stampDutyRates.filter(b => b.max !== null && b.max < bracket.min);
          const previousDuty = previousBrackets.reduce((sum, b) => sum + (b.max! - b.min) * b.rate, 0);
          stampDuty = previousDuty + (propertyValue - bracket.min) * bracket.rate;
        }
        break;
      }
    }

    // First Home Buyer Concession
    let firstHomeBuyerBenefit = 0;
    if (isFirstHomeBuyer && propertyValue <= state.firstHomeBuyerThreshold) {
      firstHomeBuyerBenefit = state.firstHomeBuyerGrant;
      if (propertyValue <= 600000) {
        stampDuty = Math.max(0, stampDuty - 8750); // Common concession amount
      }
    }

    // Land Tax
    const landTax = landValue > state.landTaxThreshold 
      ? (landValue - state.landTaxThreshold) * state.landTaxRate 
      : 0;

    setResults({
      state: state.name,
      payrollTax: Math.round(payrollTax),
      stampDuty: Math.round(stampDuty),
      landTax: Math.round(landTax),
      firstHomeBuyerBenefit: Math.round(firstHomeBuyerBenefit),
      totalStateTaxes: Math.round(payrollTax + stampDuty + landTax - firstHomeBuyerBenefit)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Australian State Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate state-specific taxes including payroll tax, stamp duty, and land tax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="state">State/Territory</Label>
              <select 
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(AUSTRALIAN_STATES).map(([code, state]) => (
                  <option key={code} value={code}>{state.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payroll">Annual Payroll ($)</Label>
              <Input
                id="payroll"
                type="number"
                value={payroll}
                onChange={(e) => setPayroll(Number(e.target.value))}
                placeholder="Total annual payroll"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Property Value ($)</Label>
              <Input
                id="property"
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                placeholder="Property purchase price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="land">Land Value ($)</Label>
              <Input
                id="land"
                type="number"
                value={landValue}
                onChange={(e) => setLandValue(Number(e.target.value))}
                placeholder="Unimproved land value"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="firstHome"
              checked={isFirstHomeBuyer}
              onChange={(e) => setIsFirstHomeBuyer(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="firstHome">First Home Buyer</Label>
          </div>
          
          <Button onClick={calculateStateTaxes} className="w-full" size="lg">
            Calculate State Taxes
          </Button>
          
          {results && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{results.state} Tax Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Payroll Tax</div>
                  <div className="text-xl font-bold">${results.payrollTax.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Stamp Duty</div>
                  <div className="text-xl font-bold">${results.stampDuty.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Land Tax</div>
                  <div className="text-xl font-bold">${results.landTax.toLocaleString()}</div>
                </div>
                {results.firstHomeBuyerBenefit > 0 && (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">First Home Buyer Grant</div>
                    <div className="text-xl font-bold text-green-600">${results.firstHomeBuyerBenefit.toLocaleString()}</div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg md:col-span-2">
                  <div className="text-sm text-gray-600">Total State Taxes</div>
                  <div className="text-2xl font-bold text-blue-600">${results.totalStateTaxes.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// New Zealand Tax Calculator
function NewZealandTaxCalculator() {
  const [income, setIncome] = useState(75000);
  const [kiwiSaverRate, setKiwiSaverRate] = useState(3);
  const [hasChildren, setHasChildren] = useState(false);
  const [numChildren, setNumChildren] = useState(1);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [results, setResults] = useState<any>(null);

  const calculateNZTax = () => {
    // Income Tax
    let tax = 0;
    let remainingIncome = income;
    
    for (const bracket of NZ_TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = bracket.max === null 
        ? remainingIncome 
        : Math.min(remainingIncome, bracket.max - bracket.min + 1);
      
      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    // ACC Levies
    const accEarner = Math.min(income, 139384) * NZ_ACC_RATES.earner;
    const accWorkingSafer = Math.min(income, 139384) * NZ_ACC_RATES.workingsSafer;
    const totalACC = accEarner + accWorkingSafer;

    // KiwiSaver
    const kiwiSaverContribution = income * (kiwiSaverRate / 100);
    const employerContribution = Math.min(income * 0.03, income * (kiwiSaverRate / 100));

    // Working for Families (simplified)
    let wffCredit = 0;
    if (hasChildren && income + partnerIncome < 100000) {
      const baseCredit = numChildren * 4368; // Family Tax Credit
      const incomeTest = Math.max(0, (income + partnerIncome - 42700) * 0.25);
      wffCredit = Math.max(0, baseCredit - incomeTest);
    }

    // GST (informational)
    const estimatedGST = (income - tax - totalACC - kiwiSaverContribution) * 0.13; // Rough estimate

    setResults({
      grossIncome: income,
      incomeTax: Math.round(tax),
      accLevies: Math.round(totalACC),
      kiwiSaver: Math.round(kiwiSaverContribution),
      employerKiwiSaver: Math.round(employerContribution),
      wffCredit: Math.round(wffCredit),
      estimatedGST: Math.round(estimatedGST),
      netIncome: Math.round(income - tax - totalACC - kiwiSaverContribution + wffCredit),
      effectiveRate: ((tax + totalACC) / income * 100).toFixed(2)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            New Zealand Tax Calculator
          </CardTitle>
          <CardDescription>
            Calculate NZ income tax, ACC levies, KiwiSaver, and Working for Families
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nz-income">Annual Income (NZD)</Label>
              <Input
                id="nz-income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                placeholder="Annual income in NZD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kiwisaver">KiwiSaver Rate (%)</Label>
              <select 
                id="kiwisaver"
                value={kiwiSaverRate}
                onChange={(e) => setKiwiSaverRate(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3%</option>
                <option value={4}>4%</option>
                <option value={6}>6%</option>
                <option value={8}>8%</option>
                <option value={10}>10%</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner-income">Partner Income (NZD)</Label>
              <Input
                id="partner-income"
                type="number"
                value={partnerIncome}
                onChange={(e) => setPartnerIncome(Number(e.target.value))}
                placeholder="Partner's annual income"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="children">Number of Children</Label>
              <Input
                id="children"
                type="number"
                value={numChildren}
                onChange={(e) => setNumChildren(Number(e.target.value))}
                placeholder="Number of dependent children"
                disabled={!hasChildren}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="has-children"
              checked={hasChildren}
              onChange={(e) => setHasChildren(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="has-children">I have dependent children</Label>
          </div>
          
          <Button onClick={calculateNZTax} className="w-full" size="lg">
            Calculate NZ Tax
          </Button>
          
          {results && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">New Zealand Tax Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Gross Income</div>
                  <div className="text-xl font-bold">NZ${results.grossIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Income Tax</div>
                  <div className="text-xl font-bold text-red-600">NZ${results.incomeTax.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">ACC Levies</div>
                  <div className="text-xl font-bold">NZ${results.accLevies.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">KiwiSaver (You)</div>
                  <div className="text-xl font-bold">NZ${results.kiwiSaver.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">KiwiSaver (Employer)</div>
                  <div className="text-xl font-bold text-green-600">NZ${results.employerKiwiSaver.toLocaleString()}</div>
                </div>
                {results.wffCredit > 0 && (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Working for Families</div>
                    <div className="text-xl font-bold text-green-600">NZ${results.wffCredit.toLocaleString()}</div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Estimated GST Paid</div>
                  <div className="text-xl font-bold">NZ${results.estimatedGST.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg md:col-span-2">
                  <div className="text-sm text-gray-600">Net Income</div>
                  <div className="text-2xl font-bold text-green-600">NZ${results.netIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Effective Tax Rate</div>
                  <div className="text-xl font-bold">{results.effectiveRate}%</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Cross-border Comparison Tool
function CrossBorderComparison() {
  const [auIncome, setAuIncome] = useState(100000);
  const [nzIncome, setNzIncome] = useState(100000);
  const [exchangeRate, setExchangeRate] = useState(1.08);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    // For demo purposes, using a static rate
    setExchangeRate(1.08);
  }, []);

  const calculateComparison = () => {
    // Australian Tax (simplified)
    const auTax = calculateAustralianTax(auIncome);
    const auNet = auIncome - auTax;

    // NZ Tax (simplified)
    const nzTax = calculateNZTax(nzIncome);
    const nzNet = nzIncome - nzTax;

    // Convert to common currency (AUD)
    const nzIncomeAUD = nzIncome / exchangeRate;
    const nzTaxAUD = nzTax / exchangeRate;
    const nzNetAUD = nzNet / exchangeRate;

    // Cost of living adjustment (simplified)
    const auCostOfLiving = auNet * 0.75; // Assume 75% goes to living costs
    const nzCostOfLivingAUD = nzNetAUD * 0.78; // NZ slightly higher cost of living

    setResults({
      australia: {
        gross: auIncome,
        tax: auTax,
        net: auNet,
        costOfLiving: auCostOfLiving,
        disposable: auNet - auCostOfLiving
      },
      newZealand: {
        gross: nzIncome,
        grossAUD: nzIncomeAUD,
        tax: nzTax,
        taxAUD: nzTaxAUD,
        net: nzNet,
        netAUD: nzNetAUD,
        costOfLiving: nzCostOfLivingAUD,
        disposable: nzNetAUD - nzCostOfLivingAUD
      },
      exchangeRate,
      recommendation: nzNetAUD > auNet ? 'New Zealand' : 'Australia'
    });
  };

  const calculateAustralianTax = (income: number): number => {
    if (income <= 18200) return 0;
    if (income <= 45000) return (income - 18200) * 0.19;
    if (income <= 120000) return 5092 + (income - 45000) * 0.325;
    if (income <= 180000) return 29467 + (income - 120000) * 0.37;
    return 51667 + (income - 180000) * 0.45;
  };

  const calculateNZTax = (income: number): number => {
    let tax = 0;
    let remaining = income;
    
    for (const bracket of NZ_TAX_BRACKETS) {
      if (remaining <= 0) break;
      const taxableInBracket = bracket.max === null 
        ? remaining 
        : Math.min(remaining, bracket.max - bracket.min + 1);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    
    return tax;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trans-Tasman Tax Comparison
          </CardTitle>
          <CardDescription>
            Compare tax outcomes between Australia and New Zealand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="au-income">Australian Income (AUD)</Label>
              <Input
                id="au-income"
                type="number"
                value={auIncome}
                onChange={(e) => setAuIncome(Number(e.target.value))}
                placeholder="Annual income in AUD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nz-income-comp">NZ Income (NZD)</Label>
              <Input
                id="nz-income-comp"
                type="number"
                value={nzIncome}
                onChange={(e) => setNzIncome(Number(e.target.value))}
                placeholder="Annual income in NZD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange Rate (NZD/AUD)</Label>
              <Input
                id="exchange"
                type="number"
                step="0.01"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                placeholder="Current exchange rate"
              />
            </div>
          </div>
          
          <Button onClick={calculateComparison} className="w-full" size="lg">
            Compare Tax Outcomes
          </Button>
          
          {results && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Australia Results */}
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">🇦🇺 Australia</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gross Income:</span>
                      <span className="font-semibold">A${results.australia.gross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Income Tax:</span>
                      <span className="font-semibold text-red-600">A${results.australia.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Net Income:</span>
                      <span className="font-semibold text-green-600">A${results.australia.net.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost of Living:</span>
                      <span className="font-semibold">A${results.australia.costOfLiving.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disposable Income:</span>
                      <span className="font-semibold text-blue-600">A${results.australia.disposable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* New Zealand Results */}
                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-green-800">🇳🇿 New Zealand</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gross Income:</span>
                      <span className="font-semibold">NZ${results.newZealand.gross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gross Income (AUD):</span>
                      <span className="font-semibold">A${results.newZealand.grossAUD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Income Tax:</span>
                      <span className="font-semibold text-red-600">NZ${results.newZealand.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Net Income:</span>
                      <span className="font-semibold text-green-600">NZ${results.newZealand.net.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Net Income (AUD):</span>
                      <span className="font-semibold text-green-600">A${results.newZealand.netAUD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost of Living (AUD):</span>
                      <span className="font-semibold">A${results.newZealand.costOfLiving.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disposable Income (AUD):</span>
                      <span className="font-semibold text-blue-600">A${results.newZealand.disposable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-yellow-800">Recommendation</h4>
                    <p className="text-sm text-yellow-700">
                      Based on disposable income after cost of living adjustments
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-800">
                      {results.recommendation} is better
                    </div>
                    <div className="text-sm text-yellow-600">
                      Exchange Rate: {results.exchangeRate} NZD/AUD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Migration Tax Impact Analyzer
function MigrationTaxAnalyzer() {
  const [currentCountry, setCurrentCountry] = useState('Australia');
  const [targetCountry, setTargetCountry] = useState('New Zealand');
  const [income, setIncome] = useState(100000);
  const [assets, setAssets] = useState(500000);
  const [superBalance, setSuperBalance] = useState(200000);
  const [results, setResults] = useState<any>(null);

  const calculateMigrationImpact = () => {
    let migrationTax = 0;
    let ongoingTaxDifference = 0;
    let recommendations = [];

    if (currentCountry === 'Australia' && targetCountry === 'New Zealand') {
      // Australia to NZ migration
      migrationTax = 0; // No departure tax for individuals
      
      // Super considerations
      const superTaxImplication = superBalance * 0.05; // Rough estimate for early access penalties
      
      // Ongoing tax difference
      const auTax = calculateAustralianTax(income);
      const nzTax = calculateNZTax(income);
      ongoingTaxDifference = nzTax - auTax;
      
      recommendations = [
        'Consider timing of superannuation access',
        'Review capital gains tax implications',
        'Understand KiwiSaver vs Superannuation differences',
        'Consider double taxation agreement benefits'
      ];
    } else if (currentCountry === 'New Zealand' && targetCountry === 'Australia') {
      // NZ to Australia migration
      migrationTax = 0; // No departure tax
      
      // KiwiSaver considerations
      const kiwiSaverImplication = superBalance * 0.02; // Rough estimate
      
      // Ongoing tax difference
      const nzTax = calculateNZTax(income);
      const auTax = calculateAustralianTax(income);
      ongoingTaxDifference = auTax - nzTax;
      
      recommendations = [
        'Transfer KiwiSaver to Australian Super',
        'Understand Medicare Levy implications',
        'Review property investment tax differences',
        'Consider capital gains tax timing'
      ];
    }

    setResults({
      migrationTax: Math.round(migrationTax),
      ongoingTaxDifference: Math.round(ongoingTaxDifference),
      recommendations,
      netBenefit: Math.round(-migrationTax - (ongoingTaxDifference * 5)), // 5-year projection
      breakEvenYears: ongoingTaxDifference !== 0 ? Math.abs(migrationTax / ongoingTaxDifference) : 0
    });
  };

  const calculateAustralianTax = (income: number): number => {
    if (income <= 18200) return 0;
    if (income <= 45000) return (income - 18200) * 0.19;
    if (income <= 120000) return 5092 + (income - 45000) * 0.325;
    if (income <= 180000) return 29467 + (income - 120000) * 0.37;
    return 51667 + (income - 180000) * 0.45;
  };

  const calculateNZTax = (income: number): number => {
    let tax = 0;
    let remaining = income;
    
    for (const bracket of NZ_TAX_BRACKETS) {
      if (remaining <= 0) break;
      const taxableInBracket = bracket.max === null 
        ? remaining 
        : Math.min(remaining, bracket.max - bracket.min + 1);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    
    return tax;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Migration Tax Impact Analyzer
          </CardTitle>
          <CardDescription>
            Analyze the tax implications of migrating between Australia and New Zealand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="current-country">Current Country</Label>
              <select 
                id="current-country"
                value={currentCountry}
                onChange={(e) => setCurrentCountry(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Australia">Australia</option>
                <option value="New Zealand">New Zealand</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-country">Target Country</Label>
              <select 
                id="target-country"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Australia">Australia</option>
                <option value="New Zealand">New Zealand</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="migration-income">Annual Income</Label>
              <Input
                id="migration-income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                placeholder="Annual income"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assets">Total Assets</Label>
              <Input
                id="assets"
                type="number"
                value={assets}
                onChange={(e) => setAssets(Number(e.target.value))}
                placeholder="Total asset value"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="super">Superannuation/KiwiSaver Balance</Label>
              <Input
                id="super"
                type="number"
                value={superBalance}
                onChange={(e) => setSuperBalance(Number(e.target.value))}
                placeholder="Retirement savings balance"
              />
            </div>
          </div>
          
          <Button onClick={calculateMigrationImpact} className="w-full" size="lg">
            Analyze Migration Impact
          </Button>
          
          {results && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-600">Migration Tax Cost</div>
                  <div className="text-xl font-bold">${results.migrationTax.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-600">Annual Tax Difference</div>
                  <div className={`text-xl font-bold ${results.ongoingTaxDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {results.ongoingTaxDifference > 0 ? '+' : ''}${results.ongoingTaxDifference.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-600">5-Year Net Benefit</div>
                  <div className={`text-xl font-bold ${results.netBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.netBenefit.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-sm text-gray-600">Break-even Period</div>
                  <div className="text-xl font-bold">
                    {results.breakEvenYears > 0 ? `${results.breakEvenYears.toFixed(1)} years` : 'Immediate'}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Key Considerations</h4>
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <span className="text-blue-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Regional Tax Calculator Component
export default function RegionalTaxCalculator() {
  return (
    <section id="regional-calculator" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Regional Tax Calculator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tax planning tools for Australia and New Zealand - 
            compare state variations, cross-border implications, and migration impacts
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <Tabs defaultValue="au-states" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-none">
              <TabsTrigger value="au-states" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                AU States
              </TabsTrigger>
              <TabsTrigger value="nz-tax" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                New Zealand
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="migration" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Migration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="au-states" className="p-6">
              <AustralianStateCalculator />
            </TabsContent>
            
            <TabsContent value="nz-tax" className="p-6">
              <NewZealandTaxCalculator />
            </TabsContent>
            
            <TabsContent value="comparison" className="p-6">
              <CrossBorderComparison />
            </TabsContent>
            
            <TabsContent value="migration" className="p-6">
              <MigrationTaxAnalyzer />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            All calculations are estimates based on current tax rates and regulations. 
            Consult a qualified tax professional for personalized advice.
          </p>
        </div>
      </div>
    </section>
  );
}
