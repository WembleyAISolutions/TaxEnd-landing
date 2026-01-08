/**
 * TaxEnd - Established Professional Dashboard Types
 * 成熟专业人士仪表板类型定义
 * 
 * 针对46-55岁高收入人群的财富管理和税务优化
 */

// Life Stage Enum
export type LifeStage = 
  | 'young_professional' 
  | 'mid_career' 
  | 'established_professional' 
  | 'senior_professional' 
  | 'retiree';

export interface LifeStageInfo {
  id: LifeStage;
  title: string;
  englishTitle: string;
  ageRange: string;
  description: string;
  color: string;
  icon: string;
}

// Established Professional Profile
export interface EstablishedProfessionalProfile {
  id: string;
  annualIncome: number;
  superBalance: number;
  investmentPortfolioValue: number;
  propertyValue: number;
  hasPrivateHealthInsurance: boolean;
  hasFamilyTrust: boolean;
  numberOfDependents: number;
  primaryGoals: WealthGoal[];
}

// Wealth Goals
export type WealthGoal = 
  | 'wealth_preservation'
  | 'super_maximization'
  | 'estate_planning'
  | 'tax_minimization'
  | 'succession_planning'
  | 'investment_growth';

export interface WealthGoalInfo {
  id: WealthGoal;
  title: string;
  icon: string;
  color: string;
  description: string;
}

// Tax Strategy
export type TaxStrategyCategory = 
  | 'concessional_contributions'
  | 'capital_gains_planning'
  | 'trust_structures'
  | 'negative_gearing'
  | 'dividend_imputation'
  | 'super_splitting';

export type StrategyComplexity = 'simple' | 'moderate' | 'complex';

export interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  category: TaxStrategyCategory;
  potentialSavings: number;
  complexity: StrategyComplexity;
  applicableLifeStages: LifeStage[];
}

// Super Contribution
export interface SuperContributionCalculation {
  currentBalance: number;
  annualIncome: number;
  concessionalContribution: number;
  nonConcessionalContribution: number;
  employerContribution: number;
  taxSaved: number;
  projectedRetirementBalance: number;
}

export interface SuperContributionLimits {
  concessionalCap: number;
  nonConcessionalCap: number;
  totalSuperBalanceCap: number;
}

// CGT Event
export type CGTAssetType = 
  | 'shares'
  | 'property'
  | 'cryptocurrency'
  | 'collectibles'
  | 'businessAssets'
  | 'other';

export interface CGTEvent {
  id: string;
  assetType: CGTAssetType;
  assetName: string;
  acquisitionDate: Date;
  disposalDate: Date;
  costBase: number;
  saleProceeds: number;
  capitalGain: number;
  discountApplied: boolean;
  taxableGain: number;
  estimatedTax: number;
}

// AI Suggestion
export type SuggestionPriority = 'high' | 'medium' | 'low';
export type SuggestionCategory = 'optimization' | 'planning' | 'compliance' | 'alert';

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: SuggestionPriority;
  potentialSavings: number;
  category: SuggestionCategory;
  actionRequired: boolean;
  dueDate?: Date;
}

// Task Item
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'review' | 'document' | 'calculation' | 'consultation' | 'filing';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: TaskPriority;
  category: TaskCategory;
  isCompleted: boolean;
  completedDate?: Date;
}

// Activity
export type ActivityType = 
  | 'calculation'
  | 'document_upload'
  | 'tax_filing'
  | 'payment'
  | 'consultation'
  | 'alert';

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Dashboard State
export interface EstablishedProfessionalDashboardState {
  profile: EstablishedProfessionalProfile;
  taxStrategies: TaxStrategy[];
  suggestions: AISuggestion[];
  tasks: TaskItem[];
  activities: Activity[];
  superCalculation: SuperContributionCalculation | null;
  cgtEvents: CGTEvent[];
  selectedGoal: WealthGoal | null;
  isLoading: boolean;
  error: string | null;
}

// Constants
export const SUPER_LIMITS_2024_25: SuperContributionLimits = {
  concessionalCap: 30000,
  nonConcessionalCap: 120000,
  totalSuperBalanceCap: 1900000,
};

export const SUPERANNUATION_GUARANTEE_RATE = 0.115; // 11.5% for 2024-25

// Tax Brackets 2024-25
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseTax: number;
}

export const TAX_BRACKETS_2024_25: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, baseTax: 0 },
  { min: 18201, max: 45000, rate: 0.16, baseTax: 0 },
  { min: 45001, max: 135000, rate: 0.30, baseTax: 4288 },
  { min: 135001, max: 190000, rate: 0.37, baseTax: 31288 },
  { min: 190001, max: null, rate: 0.45, baseTax: 51638 },
];

export const MEDICARE_LEVY_RATE = 0.02;
