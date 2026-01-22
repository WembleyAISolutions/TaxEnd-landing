/**
 * TaxEnd - Senior Professional Dashboard Types
 * Type definitions for pre-retirement planning (Ages 56-65)
 */

import {
  LifeStage,
  TaxStrategy,
  AISuggestion,
  TaskItem,
  Activity,
  WealthGoal,
} from './established-professional';

// Senior Professional Profile
export interface SeniorProfessionalProfile {
  id: string;
  age: number;
  annualIncome: number;
  superBalance: number;
  investmentPortfolioValue: number;
  propertyValue: number;
  homeValue: number;
  hasSpouse: boolean;
  spouseAge?: number;
  spouseSuperBalance?: number;
  preservationAge: number;
  isWorkingFullTime: boolean;
  primaryGoals: SeniorGoal[];
}

// Senior Professional Goals
export type SeniorGoal =
  | 'retirement_readiness'
  | 'super_maximization'
  | 'ttr_strategy'
  | 'downsizer_contribution'
  | 'pension_planning'
  | 'estate_planning';

// TTR (Transition to Retirement) Types
export interface TTRStrategy {
  id: string;
  currentAge: number;
  preservationAge: number;
  superBalance: number;
  annualSalary: number;
  salaryReduction: number;
  ttrPensionAmount: number;
  additionalSuperContribution: number;
  taxSavings: number;
  netBenefit: number;
}

export interface TTRCalculationInput {
  age: number;
  superBalance: number;
  annualSalary: number;
  desiredWorkHoursReduction: number; // percentage
}

// Catch-up Contributions Types
export interface CatchUpContribution {
  financialYear: string;
  unusedCap: number;
  expiryDate: Date;
  isAvailable: boolean;
}

export interface CatchUpCalculation {
  currentYearCap: number;
  carryForwardAmounts: CatchUpContribution[];
  totalAvailableCap: number;
  recommendedContribution: number;
  taxSavings: number;
  superBalanceAfterContribution: number;
}

// Downsizer Contribution Types
export interface DownsizerContribution {
  personAge: number;
  isEligible: boolean;
  eligibilityReason: string;
  maxContribution: number;
  homeValue: number;
  saleProceeds: number;
  proposedContribution: number;
  superBalanceAfter: number;
}

export interface DownsizerCalculationInput {
  age: number;
  spouseAge?: number;
  homeValue: number;
  expectedSalePrice: number;
  currentSuperBalance: number;
  spouseSuperBalance?: number;
}

// Pension Planning Types
export type PensionType = 'account_based' | 'annuity' | 'ttr_pension';

export interface PensionOption {
  id: string;
  type: PensionType;
  title: string;
  description: string;
  minimumDrawdown: number;
  maximumDrawdown?: number;
  taxTreatment: string;
  flexibility: 'high' | 'medium' | 'low';
  incomeGuarantee: boolean;
}

export interface PensionProjection {
  startingBalance: number;
  annualDrawdown: number;
  projectedYears: number;
  balanceAtEnd: number;
  totalIncome: number;
  taxPaid: number;
}

// Preservation Age Types
export interface PreservationAgeInfo {
  dateOfBirth: Date;
  preservationAge: number;
  preservationDate: Date;
  yearsUntilPreservation: number;
  monthsUntilPreservation: number;
  canAccessSuper: boolean;
  accessConditions: string[];
}

// Super Withdrawal Types
export type WithdrawalCondition =
  | 'preservation_age_retired'
  | 'preservation_age_ttr'
  | 'age_60_ceased_employment'
  | 'age_65'
  | 'terminal_illness'
  | 'severe_financial_hardship';

export interface WithdrawalStrategy {
  id: string;
  condition: WithdrawalCondition;
  title: string;
  description: string;
  taxTreatment: string;
  requirements: string[];
  isAvailable: boolean;
}

// Dashboard State
export interface SeniorProfessionalDashboardState {
  profile: SeniorProfessionalProfile;
  taxStrategies: TaxStrategy[];
  suggestions: AISuggestion[];
  tasks: TaskItem[];
  activities: Activity[];
  ttrCalculation: TTRStrategy | null;
  catchUpCalculation: CatchUpCalculation | null;
  downsizerCalculation: DownsizerContribution | null;
  pensionProjection: PensionProjection | null;
  selectedGoal: SeniorGoal | null;
  isLoading: boolean;
  error: string | null;
}

// Constants for 2024-25
export const PRESERVATION_AGES: Record<string, number> = {
  'before_1960-07-01': 55,
  '1960-07-01_to_1961-06-30': 56,
  '1961-07-01_to_1962-06-30': 57,
  '1962-07-01_to_1963-06-30': 58,
  '1963-07-01_to_1964-06-30': 59,
  'after_1964-06-30': 60,
};

export const DOWNSIZER_CONTRIBUTION_LIMIT = 300000; // per person
export const DOWNSIZER_MINIMUM_AGE = 55;

export const MINIMUM_PENSION_DRAWDOWN_RATES: Record<string, number> = {
  'under_65': 0.04,
  '65_74': 0.05,
  '75_79': 0.06,
  '80_84': 0.07,
  '85_89': 0.09,
  '90_94': 0.11,
  '95_plus': 0.14,
};

export const TTR_MAXIMUM_DRAWDOWN_RATE = 0.10; // 10% maximum for TTR
export const TTR_MINIMUM_DRAWDOWN_RATE = 0.04; // 4% minimum for TTR

// Carry-forward contribution rules
export const CARRY_FORWARD_YEARS = 5;
export const CARRY_FORWARD_BALANCE_THRESHOLD = 500000; // Must have super balance below this
