// app/types/australian-tax.ts
export type AgeGroup = 'young' | 'professional' | 'established' | 'senior' | 'retiree';

export interface AustralianTaxData {
  grossIncome: number;
  taxableIncome: number;
  payg: number;
  medicareLevy: number;
  superannuation: number;
  frankedDividends: number;
  capitalGains: number;
  estimatedRefund: number;
}

export interface UserProfile {
  ageGroup: AgeGroup;
  name?: string;
  primaryGoals: string[];
  taxComplexity: 'simple' | 'moderate' | 'complex';
}

// Extended interfaces for dashboard functionality
export interface TaxInputData {
  grossIncome: number;
  payg?: number;
  superannuation?: number;
  frankedDividends?: number;
  capitalGains?: number;
  workRelatedDeductions?: number;
  otherDeductions?: number;
  medicareExemption?: boolean;
}

export interface AgeGroupConfig {
  id: AgeGroup;
  label: string;
  ageRange: string;
  description: string;
  primaryFocus: string[];
  commonGoals: string[];
  taxStrategies: string[];
  color: string;
}

export interface TaxCalculationResult extends AustralianTaxData {
  totalDeductions: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  recommendations: string[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  format: 'currency' | 'percentage' | 'number' | 'text';
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface TaxGoal {
  id: string;
  title: string;
  description: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed';
  ageGroups: AgeGroup[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  data: TaxInputData;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Age group configurations
export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  young: {
    id: 'young',
    label: 'Young Professional',
    ageRange: '18-30',
    description: 'Starting your career and building financial foundations',
    primaryFocus: ['Income optimization', 'Super contributions', 'First home savings'],
    commonGoals: ['Maximize take-home pay', 'Build emergency fund', 'Save for first home'],
    taxStrategies: ['Salary sacrifice', 'Work-related deductions', 'FHSS contributions'],
    color: 'bg-green-500'
  },
  professional: {
    id: 'professional',
    label: 'Mid-Career Professional',
    ageRange: '31-45',
    description: 'Peak earning years with growing responsibilities',
    primaryFocus: ['Tax minimization', 'Investment planning', 'Family considerations'],
    commonGoals: ['Reduce tax liability', 'Grow investments', 'Plan for family expenses'],
    taxStrategies: ['Negative gearing', 'Franked dividends', 'Super co-contributions'],
    color: 'bg-blue-500'
  },
  established: {
    id: 'established',
    label: 'Established Professional',
    ageRange: '46-55',
    description: 'High earners focused on wealth accumulation',
    primaryFocus: ['Wealth preservation', 'Super maximization', 'Estate planning'],
    commonGoals: ['Maximize super', 'Minimize tax on investments', 'Plan succession'],
    taxStrategies: ['Concessional contributions', 'Capital gains planning', 'Trust structures'],
    color: 'bg-purple-500'
  },
  senior: {
    id: 'senior',
    label: 'Senior Professional',
    ageRange: '56-65',
    description: 'Pre-retirement planning and transition strategies',
    primaryFocus: ['Retirement preparation', 'Transition to retirement', 'Pension planning'],
    commonGoals: ['Optimize super withdrawal', 'Plan pension phase', 'Reduce work hours'],
    taxStrategies: ['TTR strategies', 'Catch-up contributions', 'Pension planning'],
    color: 'bg-orange-500'
  },
  retiree: {
    id: 'retiree',
    label: 'Retiree',
    ageRange: '65+',
    description: 'Retirement phase with focus on income and estate',
    primaryFocus: ['Pension optimization', 'Estate planning', 'Healthcare costs'],
    commonGoals: ['Maximize pension', 'Minimize aged care costs', 'Estate optimization'],
    taxStrategies: ['Pension phase super', 'Age pension optimization', 'Estate structures'],
    color: 'bg-red-500'
  }
};

// Common tax goals by age group
export const COMMON_TAX_GOALS: TaxGoal[] = [
  {
    id: 'maximize-super',
    title: 'Maximize Superannuation',
    description: 'Optimize super contributions for tax benefits',
    priority: 'high',
    status: 'not-started',
    ageGroups: ['professional', 'established', 'senior']
  },
  {
    id: 'first-home-savings',
    title: 'First Home Super Saver Scheme',
    description: 'Use super for first home deposit',
    priority: 'high',
    status: 'not-started',
    ageGroups: ['young', 'professional']
  },
  {
    id: 'investment-optimization',
    title: 'Investment Tax Optimization',
    description: 'Structure investments for tax efficiency',
    priority: 'medium',
    status: 'not-started',
    ageGroups: ['professional', 'established']
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Tax Planning',
    description: 'Optimize tax in retirement phase',
    priority: 'high',
    status: 'not-started',
    ageGroups: ['senior', 'retiree']
  }
];
