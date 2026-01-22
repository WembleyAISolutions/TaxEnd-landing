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
  single_homeowner: {
    fullPension: 301750,
    partPension: 695500,
  },
  single_non_homeowner: {
    fullPension: 543750,
    partPension: 937500,
  },
  couple_homeowner: {
    fullPension: 451500,
    partPension: 1045500,
  },
  couple_non_homeowner: {
    fullPension: 693500,
    partPension: 1287500,
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
  single: {
    threshold: 60400,
    lowerRate: 0.0025, // 0.25%
    upperRate: 0.0225, // 2.25%
  },
  couple: {
    threshold: 100200,
    lowerRate: 0.0025,
    upperRate: 0.0225,
  },
};

export const MINIMUM_DRAWDOWN_RATES_2024_25: Record<string, number> = {
  'under_65': 0.04,
  '65_74': 0.05,
  '75_79': 0.06,
  '80_84': 0.07,
  '85_89': 0.09,
  '90_94': 0.11,
  '95_plus': 0.14,
};
