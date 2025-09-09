'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Info, 
  Calculator,
  Download,
  ChevronRight,
  Target,
  Shield,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

// Type Definitions
interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  tax: number;
}

interface BracketInfo {
  bracket: TaxBracket;
  positionInBracket: number;
  distanceToNext: number | null;
  marginalRate: number;
  effectiveRate: number;
}

interface ProjectionData {
  year: string;
  yearNumber: number;
  income: number;
  taxableIncome: number;
  tax: number;
  afterTax: number;
  realIncome: number;
  realAfterTax: number;
  marginalRate: number;
  effectiveRate: number;
  bracketName: string;
  purchasingPower: number;
}

interface OptimizationStrategy {
  type: 'warning' | 'success' | 'info' | 'danger';
  title: string;
  description: string;
  potentialSaving?: number;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

// Australian Tax Brackets 2024-25
const TAX_BRACKETS_2024_25: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, tax: 0 },
  { min: 18201, max: 45000, rate: 0.19, tax: 0 },
  { min: 45001, max: 120000, rate: 0.325, tax: 5092 },
  { min: 120001, max: 180000, rate: 0.37, tax: 29467 },
  { min: 180001, max: null, rate: 0.45, tax: 51667 }
];

const BRACKET_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function BracketCreepAnalyzer() {
  // State Management
  const [currentIncome, setCurrentIncome] = useState<number>(85000);
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [annualRaisePercent, setAnnualRaisePercent] = useState<number>(4);
  const [yearsToProject, setYearsToProject] = useState<number>(5);
  const [superContribution, setSuperContribution] = useState<number>(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [investmentIncome, setInvestmentIncome] = useState<number>(0);

  // Calculate tax for a given income
  const calculateTax = useCallback((income: number): number => {
    const bracket = TAX_BRACKETS_2024_25.find(b => 
      income >= b.min && (b.max === null || income <= b.max)
    );
    
    if (!bracket || bracket.rate === 0) return 0;
    
    return bracket.tax + (income - bracket.min + 1) * bracket.rate;
  }, []);

  // Calculate current tax bracket information
  const currentBracketInfo = useMemo((): BracketInfo | null => {
    const taxableIncome = Math.max(0, currentIncome - superContribution);
    const bracket = TAX_BRACKETS_2024_25.find(b => 
      taxableIncome >= b.min && (b.max === null || taxableIncome <= b.max)
    );
    
    if (!bracket) return null;
    
    const positionInBracket = bracket.max 
      ? ((taxableIncome - bracket.min) / (bracket.max - bracket.min)) * 100
      : 50; // If in top bracket, show at 50%
    
    const distanceToNext = bracket.max ? bracket.max - taxableIncome + 1 : null;
    const tax = calculateTax(taxableIncome);
    const effectiveRate = (tax / taxableIncome) * 100;
    
    return {
      bracket,
      positionInBracket: Math.min(100, Math.max(0, positionInBracket)),
      distanceToNext,
      marginalRate: bracket.rate * 100,
      effectiveRate
    };
  }, [currentIncome, superContribution, calculateTax]);

  // Generate future projections
  const projections = useMemo((): ProjectionData[] => {
    const results: ProjectionData[] = [];
    let income = currentIncome;
    let cumulativeInflation = 1;
    
    for (let year = 0; year <= yearsToProject; year++) {
      if (year > 0) {
        income *= (1 + annualRaisePercent / 100);
        cumulativeInflation *= (1 + inflationRate / 100);
      }
      
      const totalIncome = income + (year === 0 ? 0 : bonusAmount) + investmentIncome;
      const taxableIncome = Math.max(0, totalIncome - superContribution);
      const tax = calculateTax(taxableIncome);
      const afterTax = totalIncome - tax - superContribution;
      const realAfterTax = afterTax / cumulativeInflation;
      const purchasingPower = (realAfterTax / (currentIncome - calculateTax(currentIncome))) * 100;
      
      const bracket = TAX_BRACKETS_2024_25.find(b => 
        taxableIncome >= b.min && (b.max === null || taxableIncome <= b.max)
      );
      
      const bracketName = bracket ? `${(bracket.rate * 100).toFixed(0)}% bracket` : 'Unknown';
      
      results.push({
        year: year === 0 ? 'Current' : `Year ${year}`,
        yearNumber: year,
        income: Math.round(totalIncome),
        taxableIncome: Math.round(taxableIncome),
        tax: Math.round(tax),
        afterTax: Math.round(afterTax),
        realIncome: Math.round(totalIncome / cumulativeInflation),
        realAfterTax: Math.round(realAfterTax),
        marginalRate: bracket ? bracket.rate * 100 : 0,
        effectiveRate: taxableIncome > 0 ? (tax / taxableIncome) * 100 : 0,
        bracketName,
        purchasingPower: Math.round(purchasingPower)
      });
    }
    
    return results;
  }, [currentIncome, annualRaisePercent, inflationRate, yearsToProject, superContribution, bonusAmount, investmentIncome, calculateTax]);

  // Generate optimization strategies
  const optimizationStrategies = useMemo((): OptimizationStrategy[] => {
    const strategies: OptimizationStrategy[] = [];
    
    // Check proximity to next bracket
    if (currentBracketInfo?.distanceToNext && currentBracketInfo.distanceToNext < 10000) {
      const potentialSaving = currentBracketInfo.distanceToNext * 
        (getNextBracketRate(currentIncome) - currentBracketInfo.marginalRate) / 100;
      
      strategies.push({
        type: 'warning',
        priority: 'high',
        title: 'Near Tax Bracket Threshold',
        description: `You're only $${currentBracketInfo.distanceToNext.toLocaleString()} away from the ${getNextBracketRate(currentIncome)}% tax bracket.`,
        potentialSaving: Math.round(potentialSaving),
        action: 'Consider salary sacrifice to super or other pre-tax deductions to stay in your current bracket.'
      });
    }
    
    // Check for bracket creep in projections
    const firstBracketJump = projections.findIndex((p, idx) => 
      idx > 0 && p.marginalRate > projections[0].marginalRate
    );
    
    if (firstBracketJump > 0) {
      strategies.push({
        type: 'info',
        priority: 'medium',
        title: 'Future Bracket Progression',
        description: `Your income will push you into a higher tax bracket in Year ${firstBracketJump}.`,
        action: 'Plan ahead with salary packaging, novated leases, or additional super contributions.'
      });
    }
    
    // Check purchasing power
    const finalPurchasingPower = projections[projections.length - 1].purchasingPower;
    if (finalPurchasingPower < 100) {
      strategies.push({
        type: 'danger',
        priority: 'high',
        title: 'Purchasing Power Erosion',
        description: `Your real purchasing power will decrease to ${finalPurchasingPower}% of current levels.`,
        action: 'Negotiate salary increases above inflation rate or seek additional income sources.'
      });
    }
    
    // Super contribution opportunity
    if (superContribution < 27500) { // Concessional cap
      const additionalSuper = Math.min(
        27500 - superContribution,
        currentBracketInfo?.distanceToNext || 10000
      );
      const taxSaving = additionalSuper * (currentBracketInfo?.marginalRate || 0) / 100 * 0.85; // Account for 15% super tax
      
      strategies.push({
        type: 'success',
        priority: 'medium',
        title: 'Super Contribution Opportunity',
        description: `You can contribute up to $${additionalSuper.toLocaleString()} more to super this year.`,
        potentialSaving: Math.round(taxSaving),
        action: 'Maximize concessional super contributions to reduce taxable income.'
      });
    }
    
    return strategies.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [currentBracketInfo, currentIncome, projections, superContribution]);

  // Helper function to get next bracket rate
  const getNextBracketRate = (income: number): number => {
    const currentBracketIndex = TAX_BRACKETS_2024_25.findIndex(b => 
      income >= b.min && (b.max === null || income <= b.max)
    );
    
    if (currentBracketIndex < TAX_BRACKETS_2024_25.length - 1) {
      return TAX_BRACKETS_2024_25[currentBracketIndex + 1].rate * 100;
    }
    
    return TAX_BRACKETS_2024_25[currentBracketIndex].rate * 100;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-yellow-500" />
            Bracket Creep Analyzer
          </CardTitle>
          <CardDescription>
            Understand how salary progression and inflation affect your tax position over time
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Analysis Parameters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="income">Current Annual Income</Label>
              <Input
                id="income"
                type="number"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(Number(e.target.value))}
                className="text-lg font-semibold"
              />
              <span className="text-xs text-gray-500">Your gross annual salary</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="raise">Expected Annual Raise (%)</Label>
              <div className="space-y-2">
                <Slider
                  id="raise"
                  min={0}
                  max={10}
                  step={0.5}
                  value={[annualRaisePercent]}
                  onValueChange={(value) => setAnnualRaisePercent(value[0])}
                />
                <div className="flex justify-between text-sm">
                  <span>{annualRaisePercent}%</span>
                  <span className="text-gray-500">Average: 3-4%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inflation">Inflation Rate (%)</Label>
              <div className="space-y-2">
                <Slider
                  id="inflation"
                  min={0}
                  max={8}
                  step={0.1}
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                />
                <div className="flex justify-between text-sm">
                  <span>{inflationRate}%</span>
                  <span className="text-gray-500">RBA Target: 2-3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="super">Salary Sacrifice to Super</Label>
                <Input
                  id="super"
                  type="number"
                  value={superContribution}
                  onChange={(e) => setSuperContribution(Number(e.target.value))}
                  max={27500}
                />
                <span className="text-xs text-gray-500">Max: $27,500 (concessional cap)</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus">Expected Annual Bonus</Label>
                <Input
                  id="bonus"
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment">Investment Income</Label>
                <Input
                  id="investment"
                  type="number"
                  value={investmentIncome}
                  onChange={(e) => setInvestmentIncome(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="years">Projection Period</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="years"
                  min={1}
                  max={10}
                  step={1}
                  value={[yearsToProject]}
                  onValueChange={(value) => setYearsToProject(value[0])}
                  className="w-32"
                />
                <span className="font-semibold">{yearsToProject} years</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Tax Position */}
      {currentBracketInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Tax Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Marginal Tax Rate</div>
                <div className="text-2xl font-bold text-blue-900">
                  {currentBracketInfo.marginalRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Effective Tax Rate</div>
                <div className="text-2xl font-bold text-green-900">
                  {currentBracketInfo.effectiveRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">After-Tax Income</div>
                <div className="text-2xl font-bold text-purple-900">
                  ${(currentIncome - calculateTax(currentIncome - superContribution)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Position in Current Tax Bracket</span>
                {currentBracketInfo.distanceToNext && (
                  <span className="text-sm text-gray-600">
                    ${currentBracketInfo.distanceToNext.toLocaleString()} to next bracket
                  </span>
                )}
              </div>
              <Progress 
                value={currentBracketInfo.positionInBracket} 
                className="h-6"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>${currentBracketInfo.bracket.min.toLocaleString()}</span>
                <span className="font-bold text-black">
                  You: ${(currentIncome - superContribution).toLocaleString()}
                </span>
                {currentBracketInfo.bracket.max && (
                  <span>${currentBracketInfo.bracket.max.toLocaleString()}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Strategies */}
      {optimizationStrategies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tax Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizationStrategies.map((strategy, idx) => (
              <Alert
                key={idx}
                className={`border-l-4 ${
                  strategy.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  strategy.type === 'danger' ? 'border-l-red-500 bg-red-50' :
                  strategy.type === 'success' ? 'border-l-green-500 bg-green-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 mt-1 ${
                    strategy.type === 'warning' ? 'text-yellow-600' :
                    strategy.type === 'danger' ? 'text-red-600' :
                    strategy.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <AlertTitle className="text-base font-semibold mb-1">
                      {strategy.title}
                      {strategy.priority === 'high' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          High Priority
                        </span>
                      )}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      <p className="mb-2">{strategy.description}</p>
                      {strategy.potentialSaving && (
                        <p className="text-green-700 font-semibold mb-2">
                          Potential Tax Saving: ${strategy.potentialSaving.toLocaleString()}/year
                        </p>
                      )}
                      <p className="font-medium flex items-center gap-1">
                        <ChevronRight className="h-4 w-4" />
                        {strategy.action}
                      </p>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Visualizations */}
      <Tabs defaultValue="income" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">Income Projection</TabsTrigger>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="purchasing">Purchasing Power</TabsTrigger>
        </TabsList>

        {/* Income Projection Chart */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Nominal vs Real Income Over Time</CardTitle>
              <CardDescription>
                How your income grows vs. its real purchasing power after inflation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={projections}>
                  <defs>
                    <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="afterTax"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorNominal)"
                    name="Nominal After-Tax Income"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="realAfterTax"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorReal)"
                    name="Real After-Tax Income (Inflation Adjusted)"
                    strokeWidth={2}
                  />
                  <ReferenceLine 
                    y={currentIncome - calculateTax(currentIncome - superContribution)} 
                    stroke="#EF4444" 
                    strokeDasharray="5 5"
                    label={{ value: "Current After-Tax", position: "right" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Rates Chart */}
        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Tax Rate Progression</CardTitle>
              <CardDescription>
                How your marginal and effective tax rates change over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="marginalRate" 
                    fill="#8B5CF6" 
                    name="Marginal Tax Rate"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="effectiveRate" 
                    fill="#06B6D4" 
                    name="Effective Tax Rate"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Tax Bracket Indicators */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                {TAX_BRACKETS_2024_25.map((bracket, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: BRACKET_COLORS[idx] }}
                    />
                    <span className="text-xs">
                      {bracket.rate * 100}% bracket
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchasing Power Chart */}
        <TabsContent value="purchasing">
          <Card>
            <CardHeader>
              <CardTitle>Purchasing Power Analysis</CardTitle>
              <CardDescription>
                Your real purchasing power relative to today's dollars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Legend />
                  <ReferenceLine 
                    y={100} 
                    stroke="#10B981" 
                    strokeDasharray="5 5"
                    label={{ value: "Current Purchasing Power", position: "right" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchasingPower"
                    stroke="#EF4444"
                    name="Relative Purchasing Power"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Starting Income</div>
                  <div className="text-xl font-bold">
                    ${projections[0]?.income.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Projected Income (Year {yearsToProject})</div>
                  <div className="text-xl font-bold">
                    ${projections[projections.length - 1]?.income.toLocaleString()}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  projections[projections.length - 1]?.purchasingPower >= 100 
                    ? 'bg-green-50' 
                    : 'bg-red-50'
                }`}>
                  <div className="text-sm text-gray-600">Purchasing Power Change</div>
                  <div className={`text-xl font-bold ${
                    projections[projections.length - 1]?.purchasingPower >= 100 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`}>
                    {projections[projections.length - 1]?.purchasingPower >= 100 ? '+' : ''}
                    {(projections[projections.length - 1]?.purchasingPower - 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Projections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detailed Projections</span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Year</th>
                  <th className="text-right p-2">Gross Income</th>
                  <th className="text-right p-2">Tax</th>
                  <th className="text-right p-2">After-Tax</th>
                  <th className="text-right p-2">Real Value</th>
                  <th className="text-right p-2">Tax Rate</th>
                  <th className="text-center p-2">Bracket</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{row.year}</td>
                    <td className="text-right p-2">${row.income.toLocaleString()}</td>
                    <td className="text-right p-2 text-red-600">
                      ${row.tax.toLocaleString()}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      ${row.afterTax.toLocaleString()}
                    </td>
                    <td className="text-right p-2">${row.realAfterTax.toLocaleString()}</td>
                    <td className="text-right p-2">{row.effectiveRate.toFixed(1)}%</td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.marginalRate <= 19 ? 'bg-green-100 text-green-700' :
                        row.marginalRate <= 32.5 ? 'bg-blue-100 text-blue-700' :
                        row.marginalRate <= 37 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.bracketName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
