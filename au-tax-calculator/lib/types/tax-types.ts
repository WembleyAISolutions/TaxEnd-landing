export interface TaxCalculationInput {
  annualIncome: number;
  isResident: boolean;
  hasPrivateHealthInsurance?: boolean;
  familyStatus?: 'single' | 'family';
  numberOfDependents?: number;
  age?: number;
  isSenior?: boolean;
  superContribution?: number;
  salarySacrifice?: number;
  helpDebt?: number;
  workDeductions?: number;
}

export interface TaxCalculationResult {
  // Income Details
  grossIncome: number;
  taxableIncome: number;
  
  // Tax Components
  baseTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  lowIncomeTaxOffset: number;
  helpRepayment: number;
  
  // Totals
  totalTax: number;
  totalTaxWithSuper: number;
  netIncome: number;
  
  // Rates
  effectiveRate: number;
  marginalRate: number;
  
  // Take-home Pay
  monthlyTakeHome: number;
  fortnightlyTakeHome: number;
  weeklyTakeHome: number;
  dailyTakeHome: number;
  
  // Bracket Info
  taxBracket: number;
  nextBracketThreshold: number;
  distanceToNextBracket: number;
  
  // Super Details
  superannuationContribution: number;
  afterSuperIncome: number;
  superTaxSaving: number;
}

export interface TaxBreakdown {
  component: string;
  amount: number;
  percentage: number;
  description: string;
  category: 'income' | 'deduction' | 'tax' | 'offset' | 'levy';
}

export interface StateInfo {
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  payrollTaxThreshold: number;
  payrollTaxRate: number;
  stampDutyRates: Array<{ min: number; max: number; rate: number }>;
}

export interface TaxOptimization {
  strategy: string;
  potentialSaving: number;
  implementation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: 'immediate' | 'endOfYear' | 'nextYear';
}
