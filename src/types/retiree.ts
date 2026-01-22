/**
 * TaxEnd - Retiree Dashboard Types
 * Type definitions for retirement phase (Ages 65+)
 */

import {
  TaxStrategy,
  AISuggestion,
  TaskItem,
  Activity,
} from './established-professional';

// Retiree Profile
export interface RetireeProfile {
  id: string;
  age: number;
  annualIncome: number;
  superBalance: number;
  accountBasedPensionBalance: number;
  investmentPortfolioValue: number;
  nonSuperInvestments: number;
  cashSavings?: number;
  homeValue: number;
  otherAssets: number;
  hasSpouse: boolean;
  spouseAge?: number;
  spouseSuperBalance?: number;
  isHomeowner: boolean;
  receivingAgePension: boolean;
  primaryGoals: RetireeGoal[];
}

// Retiree Goals
export type RetireeGoal =
  | 'maximize_pension'
  | 'age_pension_eligibility'
  | 'estate_planning'
  | 'minimize_drawdown'
  | 'healthcare_planning'
  | 'aged_care_planning';

// Age Pension Types
export interface AgePensionEligibility {
  isEligibleByAge: boolean;
  isEligibleByResidency: boolean;
  isEligibleByAssets: boolean;
  isEligibleByIncome: boolean;
  overallEligible: boolean;
  estimatedFortnightlyPayment: number;
  estimatedAnnualPayment: number;
  assetsTestResult: AssetsTestResult;
  incomeTestResult: IncomeTestResult;
  paymentType: 'full' | 'part' | 'nil';
}

export interface AssetsTestResult {
  totalAssessableAssets: number;
  assetsTestThreshold: number;
  assetsTestUpperLimit: number;
  isWithinThreshold: boolean;
  reductionAmount: number;
  pensionUnderAssetsTest: number;
}

export interface IncomeTestResult {
  totalAssessableIncome: number;
  incomeTestThreshold: number;
  deemingRate: number;
  deemedIncome: number;
  reductionAmount: number;
  pensionUnderIncomeTest: number;
}

// Minimum Drawdown Types
export interface MinimumDrawdownCalculation {
  age: number;
  accountBalance: number;
  minimumRate: number;
  minimumAmount: number;
  recommendedDrawdown: number;
  taxImplication: string;
  projectedBalanceNextYear: number;
}

export interface DrawdownSchedule {
  year: number;
  age: number;
  startingBalance: number;
  minimumDrawdown: number;
  actualDrawdown: number;
  investmentReturn: number;
  endingBalance: number;
}

// Estate Planning Types
export interface EstatePlanningItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  priority: 'high' | 'medium' | 'low';
  category: EstateCategory;
}

export type EstateCategory =
  | 'will'
  | 'power_of_attorney'
  | 'beneficiary_nomination'
  | 'family_trust'
  | 'testamentary_trust'
  | 'asset_protection';

export interface BeneficiaryNomination {
  superFundName: string;
  nominationType: 'binding' | 'non_binding' | 'reversionary';
  beneficiaries: Beneficiary[];
  lastUpdated: Date;
  expiryDate?: Date;
}

export interface Beneficiary {
  name: string;
  relationship: 'spouse' | 'child' | 'dependant' | 'legal_representative' | 'other';
  percentage: number;
  isDependent: boolean;
}

// Centrelink Types
export interface CentrelinkAssessment {
  assetsTest: CentrelinkAssetsTest;
  incomeTest: CentrelinkIncomeTest;
  resultingPayment: number;
  paymentFrequency: 'fortnightly' | 'annual';
  // Simplified accessor properties
  totalAssessableAssets: number;
  deemedIncome: number;
  assetsOverThreshold: number;
  assetsTestReduction: number;
}

export interface CentrelinkAssetsTest {
  homeowner: boolean;
  single: boolean;
  financialAssets: number;
  otherAssets: number;
  totalAssets: number;
  threshold: number;
  upperLimit: number;
  pensionReduction: number;
}

export interface CentrelinkIncomeTest {
  single: boolean;
  employmentIncome: number;
  investmentIncome: number;
  superPensionIncome: number;
  deemedIncome: number;
  totalAssessableIncome: number;
  threshold: number;
  pensionReduction: number;
}

// Pension Comparison Types
export type PensionProductType = 'account_based_pension' | 'lifetime_annuity' | 'term_annuity';

export interface PensionProduct {
  id: string;
  type: PensionProductType;
  name: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  minimumInvestment: number;
  fees: PensionFees;
}

export interface PensionFees {
  adminFee: number;
  investmentFee: number;
  adviceFee?: number;
  totalFee: number;
}

export interface PensionComparison {
  products: PensionProduct[];
  recommendation: string;
  bestFor: Record<PensionProductType, string>;
}

// Healthcare & Aged Care Types
export interface HealthcareCost {
  category: 'private_health' | 'medications' | 'dental' | 'optical' | 'allied_health';
  annualEstimate: number;
  isCovered: boolean;
  coverageSource: string;
}

export interface AgedCareCost {
  careType: 'home_care' | 'residential_care';
  level: string;
  dailyAccommodation: number;
  dailyCare: number;
  meansTestedFee: number;
  totalDailyCost: number;
  annualCost: number;
}

// Dashboard State
export interface RetireeDashboardState {
  profile: RetireeProfile;
  taxStrategies: TaxStrategy[];
  suggestions: AISuggestion[];
  tasks: TaskItem[];
  activities: Activity[];
  agePensionEligibility: AgePensionEligibility | null;
  minimumDrawdown: MinimumDrawdownCalculation | null;
  estatePlanningItems: EstatePlanningItem[];
  centrelinkAssessment: CentrelinkAssessment | null;
  selectedGoal: RetireeGoal | null;
  isLoading: boolean;
  error: string | null;
}

// Constants for 2024-25
export const AGE_PENSION_AGE = 67;

export const AGE_PENSION_RATES_2024_25 = {
  single: {
    maxFortnightly: 1116.30,
    maxAnnual: 29023.80,
  },
  couple: {
    maxFortnightly: 1682.80, // combined
    maxAnnual: 43752.80,
  },
};

export const ASSETS_TEST_THRESHOLDS_2024_25 = {
  singleHomeowner: {
    fullPension: 301750,
    cutOff: 695500,
  },
  singleNonHomeowner: {
    fullPension: 543750,
    cutOff: 937500,
  },
  coupleHomeowner: {
    fullPension: 451500,
    cutOff: 1045500,
  },
  coupleNonHomeowner: {
    fullPension: 693500,
    cutOff: 1287500,
  },
};

export const INCOME_TEST_THRESHOLDS_2024_25 = {
  single: {
    threshold: 204, // fortnightly
    taperRate: 0.50, // 50 cents per dollar
  },
  couple: {
    threshold: 360, // fortnightly combined
    taperRate: 0.50,
  },
};

export const DEEMING_RATES_2024_25 = {
  singleThreshold: 60400,
  coupleThreshold: 100200,
  lowerRate: 0.0025, // 0.25%
  higherRate: 0.0225, // 2.25%
};

export const MINIMUM_DRAWDOWN_RATES_2024_25 = {
  under65: 0.04,
  age65to74: 0.05,
  age75to79: 0.06,
  age80to84: 0.07,
  age85to89: 0.09,
  age90to94: 0.11,
  age95plus: 0.14,
};
