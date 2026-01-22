/**
 * TaxEnd - Retiree Hook
 * State management hook for retirement phase dashboard (Ages 65+)
 */

'use client';

import { useState, useCallback } from 'react';
import {
  RetireeProfile,
  RetireeDashboardState,
  RetireeGoal,
  AgePensionEligibility,
  MinimumDrawdownCalculation,
  EstatePlanningItem,
  CentrelinkAssessment,
  AssetsTestResult,
  IncomeTestResult,
  AGE_PENSION_AGE,
  AGE_PENSION_RATES_2024_25,
  ASSETS_TEST_THRESHOLDS_2024_25,
  INCOME_TEST_THRESHOLDS_2024_25,
  DEEMING_RATES_2024_25,
  MINIMUM_DRAWDOWN_RATES_2024_25,
} from '@/src/types/retiree';
import {
  TaxStrategy,
  AISuggestion,
  TaskItem,
  Activity,
} from '@/src/types/established-professional';
import { calculateNetWorth } from '@/src/lib/tax-calculations';

// Sample data generators
function generateSampleStrategies(): TaxStrategy[] {
  return [
    {
      id: '1',
      title: 'Account-Based Pension Optimization',
      description: 'Maximize tax-free pension income while preserving capital for longevity',
      category: 'concessional_contributions',
      potentialSavings: 8000,
      complexity: 'moderate',
      applicableLifeStages: ['retiree'],
    },
    {
      id: '2',
      title: 'Age Pension Maximization',
      description: 'Structure assets to maximize Age Pension entitlements',
      category: 'trust_structures',
      potentialSavings: 12000,
      complexity: 'moderate',
      applicableLifeStages: ['retiree'],
    },
    {
      id: '3',
      title: 'Gifting Strategy',
      description: 'Strategic gifting to reduce assessable assets while staying within Centrelink limits',
      category: 'trust_structures',
      potentialSavings: 5000,
      complexity: 'simple',
      applicableLifeStages: ['retiree'],
    },
    {
      id: '4',
      title: 'Funeral Bond Strategy',
      description: 'Use exempt funeral bonds to reduce assessable assets',
      category: 'trust_structures',
      potentialSavings: 2000,
      complexity: 'simple',
      applicableLifeStages: ['retiree'],
    },
  ];
}

function generateSampleSuggestions(): AISuggestion[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Review Minimum Drawdown',
      description: 'Ensure you withdraw at least the minimum amount to maintain pension status',
      priority: 'high',
      potentialSavings: 0,
      category: 'compliance',
      actionRequired: true,
      dueDate: new Date(now.getFullYear(), 6, 30),
    },
    {
      id: '2',
      title: 'Age Pension Application',
      description: 'You may be eligible for a part Age Pension. Consider applying to Centrelink.',
      priority: 'high',
      potentialSavings: 15000,
      category: 'optimization',
      actionRequired: true,
    },
    {
      id: '3',
      title: 'Update Estate Plan',
      description: 'Review beneficiary nominations and ensure they reflect current wishes',
      priority: 'medium',
      potentialSavings: 0,
      category: 'planning',
      actionRequired: false,
    },
    {
      id: '4',
      title: 'Healthcare Cost Review',
      description: 'Review private health insurance coverage against current needs',
      priority: 'low',
      potentialSavings: 1500,
      category: 'optimization',
      actionRequired: false,
    },
  ];
}

function generateSampleTasks(): TaskItem[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Complete Minimum Pension Drawdown',
      description: 'Withdraw at least the minimum required amount before June 30',
      dueDate: new Date(now.getFullYear(), 5, 30),
      priority: 'high',
      category: 'compliance',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Review Centrelink Assessment',
      description: 'Check if asset or income test thresholds have changed',
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'review',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Update Binding Death Nomination',
      description: 'Ensure super death benefit nominations are current',
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'document',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Aged Care Planning Review',
      description: 'Review aged care options and associated costs',
      dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      priority: 'low',
      category: 'consultation',
      isCompleted: false,
    },
  ];
}

function generateSampleActivities(): Activity[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Pension Payment Received',
      description: 'Monthly pension payment of $4,500 processed',
      type: 'payment',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Age Pension Review Completed',
      description: 'Centrelink assessment updated',
      type: 'calculation',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Estate Plan Updated',
      description: 'Binding death nomination renewed',
      type: 'document_upload',
      timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  ];
}

function generateSampleEstatePlanning(): EstatePlanningItem[] {
  return [
    {
      id: '1',
      title: 'Will',
      description: 'Current will reflecting asset distribution wishes',
      status: 'completed',
      priority: 'high',
      category: 'will',
    },
    {
      id: '2',
      title: 'Enduring Power of Attorney',
      description: 'Financial and medical power of attorney documents',
      status: 'completed',
      priority: 'high',
      category: 'power_of_attorney',
    },
    {
      id: '3',
      title: 'Super Beneficiary Nomination',
      description: 'Binding death benefit nomination for super',
      status: 'in_progress',
      priority: 'high',
      category: 'beneficiary_nomination',
    },
    {
      id: '4',
      title: 'Testamentary Trust Planning',
      description: 'Consider testamentary trust for tax-effective wealth transfer',
      status: 'not_started',
      priority: 'medium',
      category: 'testamentary_trust',
    },
  ];
}

export function useRetiree() {
  const [state, setState] = useState<RetireeDashboardState>({
    profile: {
      id: '1',
      age: 68,
      annualIncome: 54000,
      superBalance: 180000,
      accountBasedPensionBalance: 620000,
      investmentPortfolioValue: 150000,
      homeValue: 1200000,
      otherAssets: 50000,
      hasSpouse: true,
      spouseAge: 66,
      spouseSuperBalance: 380000,
      isHomeowner: true,
      receivingAgePension: false,
      primaryGoals: ['maximize_pension', 'estate_planning'],
    },
    taxStrategies: generateSampleStrategies(),
    suggestions: generateSampleSuggestions(),
    tasks: generateSampleTasks(),
    activities: generateSampleActivities(),
    agePensionEligibility: null,
    minimumDrawdown: null,
    estatePlanningItems: generateSampleEstatePlanning(),
    centrelinkAssessment: null,
    selectedGoal: null,
    isLoading: false,
    error: null,
  });

  // Computed values
  const totalNetWorth = calculateNetWorth({
    superBalance: state.profile.accountBasedPensionBalance + (state.profile.spouseSuperBalance || 0),
    investmentPortfolio: state.profile.investmentPortfolioValue,
    propertyValue: state.profile.homeValue + state.profile.otherAssets,
  });

  const completedTasksCount = state.tasks.filter((task) => task.isCompleted).length;
  const estatePlanningProgress = state.estatePlanningItems.filter(
    (item) => item.status === 'completed'
  ).length / state.estatePlanningItems.length;

  // Calculate Age Pension Eligibility
  const calculateAgePension = useCallback((): AgePensionEligibility => {
    const {
      age,
      accountBasedPensionBalance,
      investmentPortfolioValue,
      otherAssets,
      hasSpouse,
      isHomeowner,
    } = state.profile;

    const isEligibleByAge = age >= AGE_PENSION_AGE;
    const isEligibleByResidency = true; // Assuming Australian resident

    // Assets Test
    const totalAssessableAssets =
      accountBasedPensionBalance + investmentPortfolioValue + otherAssets;

    const assetsThresholds = hasSpouse
      ? isHomeowner
        ? ASSETS_TEST_THRESHOLDS_2024_25.couple_homeowner
        : ASSETS_TEST_THRESHOLDS_2024_25.couple_non_homeowner
      : isHomeowner
      ? ASSETS_TEST_THRESHOLDS_2024_25.single_homeowner
      : ASSETS_TEST_THRESHOLDS_2024_25.single_non_homeowner;

    const isWithinAssetsThreshold = totalAssessableAssets <= assetsThresholds.fullPension;
    const assetsReduction = Math.max(
      0,
      (totalAssessableAssets - assetsThresholds.fullPension) * 0.003 * 26
    ); // $3 per $1000 fortnightly

    const maxPension = hasSpouse
      ? AGE_PENSION_RATES_2024_25.couple.maxAnnual
      : AGE_PENSION_RATES_2024_25.single.maxAnnual;

    const pensionUnderAssetsTest = Math.max(0, maxPension - assetsReduction);

    const assetsTestResult: AssetsTestResult = {
      totalAssessableAssets,
      assetsTestThreshold: assetsThresholds.fullPension,
      assetsTestUpperLimit: assetsThresholds.partPension,
      isWithinThreshold: isWithinAssetsThreshold,
      reductionAmount: assetsReduction,
      pensionUnderAssetsTest,
    };

    // Income Test (with deeming)
    const deemingThreshold = hasSpouse
      ? DEEMING_RATES_2024_25.couple.threshold
      : DEEMING_RATES_2024_25.single.threshold;

    const financialAssets = accountBasedPensionBalance + investmentPortfolioValue;
    const deemedIncomeLower = Math.min(financialAssets, deemingThreshold) * DEEMING_RATES_2024_25.single.lowerRate;
    const deemedIncomeUpper = Math.max(0, financialAssets - deemingThreshold) * DEEMING_RATES_2024_25.single.upperRate;
    const totalDeemedIncome = (deemedIncomeLower + deemedIncomeUpper) * 26; // Annual

    const incomeThreshold = hasSpouse
      ? INCOME_TEST_THRESHOLDS_2024_25.couple.threshold * 26
      : INCOME_TEST_THRESHOLDS_2024_25.single.threshold * 26;

    const incomeReduction = Math.max(0, (totalDeemedIncome - incomeThreshold) * 0.5);
    const pensionUnderIncomeTest = Math.max(0, maxPension - incomeReduction);

    const incomeTestResult: IncomeTestResult = {
      totalAssessableIncome: totalDeemedIncome,
      incomeTestThreshold: incomeThreshold,
      deemingRate: DEEMING_RATES_2024_25.single.upperRate,
      deemedIncome: totalDeemedIncome,
      reductionAmount: incomeReduction,
      pensionUnderIncomeTest,
    };

    // Final calculation (lower of the two tests)
    const estimatedAnnualPayment = Math.min(pensionUnderAssetsTest, pensionUnderIncomeTest);
    const paymentType = estimatedAnnualPayment >= maxPension * 0.99
      ? 'full'
      : estimatedAnnualPayment > 0
      ? 'part'
      : 'nil';

    const eligibility: AgePensionEligibility = {
      isEligibleByAge,
      isEligibleByResidency,
      isEligibleByAssets: totalAssessableAssets < assetsThresholds.partPension,
      isEligibleByIncome: pensionUnderIncomeTest > 0,
      overallEligible: isEligibleByAge && estimatedAnnualPayment > 0,
      estimatedFortnightlyPayment: estimatedAnnualPayment / 26,
      estimatedAnnualPayment,
      assetsTestResult,
      incomeTestResult,
      paymentType,
    };

    setState((prev) => ({ ...prev, agePensionEligibility: eligibility }));
    return eligibility;
  }, [state.profile]);

  // Calculate Minimum Drawdown
  const calculateMinimumDrawdown = useCallback((): MinimumDrawdownCalculation => {
    const { age, accountBasedPensionBalance } = state.profile;

    let rate: number;
    if (age < 65) rate = MINIMUM_DRAWDOWN_RATES_2024_25['under_65'];
    else if (age <= 74) rate = MINIMUM_DRAWDOWN_RATES_2024_25['65_74'];
    else if (age <= 79) rate = MINIMUM_DRAWDOWN_RATES_2024_25['75_79'];
    else if (age <= 84) rate = MINIMUM_DRAWDOWN_RATES_2024_25['80_84'];
    else if (age <= 89) rate = MINIMUM_DRAWDOWN_RATES_2024_25['85_89'];
    else if (age <= 94) rate = MINIMUM_DRAWDOWN_RATES_2024_25['90_94'];
    else rate = MINIMUM_DRAWDOWN_RATES_2024_25['95_plus'];

    const minimumAmount = accountBasedPensionBalance * rate;
    const recommendedDrawdown = minimumAmount * 1.2; // 20% above minimum
    const expectedReturn = 0.06; // 6% assumed return
    const projectedBalance = (accountBasedPensionBalance - recommendedDrawdown) * (1 + expectedReturn);

    const calculation: MinimumDrawdownCalculation = {
      age,
      accountBalance: accountBasedPensionBalance,
      minimumRate: rate,
      minimumAmount,
      recommendedDrawdown,
      taxImplication: 'Tax-free for those aged 60 and over',
      projectedBalanceNextYear: projectedBalance,
    };

    setState((prev) => ({ ...prev, minimumDrawdown: calculation }));
    return calculation;
  }, [state.profile]);

  // Calculate Centrelink Assessment
  const calculateCentrelink = useCallback((): CentrelinkAssessment => {
    const agePension = calculateAgePension();

    const assessment: CentrelinkAssessment = {
      assetsTest: {
        homeowner: state.profile.isHomeowner,
        single: !state.profile.hasSpouse,
        financialAssets: state.profile.accountBasedPensionBalance + state.profile.investmentPortfolioValue,
        otherAssets: state.profile.otherAssets,
        totalAssets: agePension.assetsTestResult.totalAssessableAssets,
        threshold: agePension.assetsTestResult.assetsTestThreshold,
        upperLimit: agePension.assetsTestResult.assetsTestUpperLimit,
        pensionReduction: agePension.assetsTestResult.reductionAmount,
      },
      incomeTest: {
        single: !state.profile.hasSpouse,
        employmentIncome: 0,
        investmentIncome: 0,
        superPensionIncome: state.profile.annualIncome,
        deemedIncome: agePension.incomeTestResult.deemedIncome,
        totalAssessableIncome: agePension.incomeTestResult.totalAssessableIncome,
        threshold: agePension.incomeTestResult.incomeTestThreshold,
        pensionReduction: agePension.incomeTestResult.reductionAmount,
      },
      resultingPayment: agePension.estimatedAnnualPayment,
      paymentFrequency: 'annual',
    };

    setState((prev) => ({ ...prev, centrelinkAssessment: assessment }));
    return assessment;
  }, [state.profile, calculateAgePension]);

  // Select goal
  const selectGoal = useCallback((goal: RetireeGoal) => {
    setState((prev) => ({
      ...prev,
      selectedGoal: goal,
    }));
  }, []);

  // Reset goal filter
  const resetGoalFilter = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedGoal: null,
    }));
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              completedDate: !task.isCompleted ? new Date() : undefined,
            }
          : task
      ),
    }));
  }, []);

  // Update estate planning item
  const updateEstatePlanningItem = useCallback(
    (itemId: string, status: EstatePlanningItem['status']) => {
      setState((prev) => ({
        ...prev,
        estatePlanningItems: prev.estatePlanningItems.map((item) =>
          item.id === itemId ? { ...item, status } : item
        ),
      }));
    },
    []
  );

  // Update profile
  const updateProfile = useCallback(
    (updates: Partial<RetireeProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));
    },
    []
  );

  return {
    // State
    profile: state.profile,
    taxStrategies: state.taxStrategies,
    suggestions: state.suggestions,
    tasks: state.tasks,
    activities: state.activities,
    agePensionEligibility: state.agePensionEligibility,
    minimumDrawdown: state.minimumDrawdown,
    estatePlanningItems: state.estatePlanningItems,
    centrelinkAssessment: state.centrelinkAssessment,
    selectedGoal: state.selectedGoal,
    isLoading: state.isLoading,
    error: state.error,

    // Computed values
    totalNetWorth,
    completedTasksCount,
    estatePlanningProgress,

    // Actions
    calculateAgePension,
    calculateMinimumDrawdown,
    calculateCentrelink,
    selectGoal,
    resetGoalFilter,
    toggleTaskCompletion,
    updateEstatePlanningItem,
    updateProfile,
  };
}
