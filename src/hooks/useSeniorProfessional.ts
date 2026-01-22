/**
 * TaxEnd - Senior Professional Hook
 * State management hook for pre-retirement dashboard (Ages 56-65)
 */

'use client';

import { useState, useCallback } from 'react';
import {
  SeniorProfessionalProfile,
  SeniorProfessionalDashboardState,
  SeniorGoal,
  TTRStrategy,
  CatchUpCalculation,
  CatchUpContribution,
  DownsizerContribution,
  PensionProjection,
  DOWNSIZER_CONTRIBUTION_LIMIT,
  DOWNSIZER_MINIMUM_AGE,
  CARRY_FORWARD_BALANCE_THRESHOLD,
  TTR_MINIMUM_DRAWDOWN_RATE,
  TTR_MAXIMUM_DRAWDOWN_RATE,
} from '@/src/types/senior-professional';
import {
  TaxStrategy,
  AISuggestion,
  TaskItem,
  Activity,
  SUPER_LIMITS_2024_25,
} from '@/src/types/established-professional';
import { calculateIncomeTax, calculateNetWorth } from '@/src/lib/tax-calculations';

// Sample data generators
function generateSampleStrategies(): TaxStrategy[] {
  return [
    {
      id: '1',
      title: 'Transition to Retirement Strategy',
      description: 'Reduce working hours while supplementing income with TTR pension to boost super',
      category: 'concessional_contributions',
      potentialSavings: 12000,
      complexity: 'moderate',
      applicableLifeStages: ['senior_professional'],
    },
    {
      id: '2',
      title: 'Catch-up Super Contributions',
      description: 'Utilize unused concessional caps from previous years to maximize super before retirement',
      category: 'concessional_contributions',
      potentialSavings: 15000,
      complexity: 'simple',
      applicableLifeStages: ['senior_professional'],
    },
    {
      id: '3',
      title: 'Downsizer Contribution',
      description: 'Contribute up to $300,000 per person from home sale proceeds into super',
      category: 'concessional_contributions',
      potentialSavings: 0,
      complexity: 'moderate',
      applicableLifeStages: ['senior_professional', 'retiree'],
    },
    {
      id: '4',
      title: 'Spouse Contribution Splitting',
      description: 'Split super contributions with spouse to equalize balances and maximize tax benefits',
      category: 'super_splitting',
      potentialSavings: 4500,
      complexity: 'simple',
      applicableLifeStages: ['senior_professional'],
    },
  ];
}

function generateSampleSuggestions(): AISuggestion[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Maximize Catch-up Contributions',
      description: 'You have $45,000 in unused concessional caps. Consider using these before they expire.',
      priority: 'high',
      potentialSavings: 15000,
      category: 'optimization',
      actionRequired: true,
      dueDate: new Date(now.getFullYear(), 6, 30),
    },
    {
      id: '2',
      title: 'Consider TTR Strategy',
      description: 'A Transition to Retirement strategy could provide tax savings while maintaining income.',
      priority: 'medium',
      potentialSavings: 8000,
      category: 'planning',
      actionRequired: false,
    },
    {
      id: '3',
      title: 'Review Preservation Age Access',
      description: 'You have reached preservation age. Review your super access options and conditions.',
      priority: 'medium',
      potentialSavings: 0,
      category: 'planning',
      actionRequired: false,
    },
    {
      id: '4',
      title: 'Update Beneficiary Nominations',
      description: 'Ensure your super beneficiary nominations are current and binding if appropriate.',
      priority: 'low',
      potentialSavings: 0,
      category: 'compliance',
      actionRequired: true,
    },
  ];
}

function generateSampleTasks(): TaskItem[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Calculate Catch-up Contribution Capacity',
      description: 'Review unused concessional caps from the past 5 years',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      priority: 'high',
      category: 'calculation',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Review TTR Pension Options',
      description: 'Compare TTR pension products and fees across super funds',
      dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'review',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Assess Downsizer Eligibility',
      description: 'Check if you meet the criteria for downsizer contributions',
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'review',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Consult Financial Advisor',
      description: 'Discuss retirement income strategy and pension options',
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      priority: 'high',
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
      title: 'Preservation Age Reached',
      description: 'You can now access super under TTR conditions',
      type: 'alert',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Catch-up Cap Calculated',
      description: 'Unused concessional cap: $45,000 available',
      type: 'calculation',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Super Statement Uploaded',
      description: 'FY 2023-24 super statement processed',
      type: 'document_upload',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
}

export function useSeniorProfessional() {
  const [state, setState] = useState<SeniorProfessionalDashboardState>({
    profile: {
      id: '1',
      age: 58,
      annualIncome: 180000,
      superBalance: 650000,
      investmentPortfolioValue: 250000,
      propertyValue: 200000,
      homeValue: 1500000,
      hasSpouse: true,
      spouseAge: 56,
      spouseSuperBalance: 420000,
      preservationAge: 57,
      isWorkingFullTime: true,
      primaryGoals: ['retirement_readiness', 'super_maximization'],
    },
    taxStrategies: generateSampleStrategies(),
    suggestions: generateSampleSuggestions(),
    tasks: generateSampleTasks(),
    activities: generateSampleActivities(),
    ttrCalculation: null,
    catchUpCalculation: null,
    downsizerCalculation: null,
    pensionProjection: null,
    selectedGoal: null,
    isLoading: false,
    error: null,
  });

  // Computed values
  const totalNetWorth = calculateNetWorth({
    superBalance: state.profile.superBalance + (state.profile.spouseSuperBalance || 0),
    investmentPortfolio: state.profile.investmentPortfolioValue,
    propertyValue: state.profile.propertyValue + state.profile.homeValue,
  });

  const estimatedAnnualTax = calculateIncomeTax(state.profile.annualIncome);

  const potentialTaxSavings = state.taxStrategies.reduce(
    (sum, strategy) => sum + strategy.potentialSavings,
    0
  );

  const completedTasksCount = state.tasks.filter((task) => task.isCompleted).length;
  const yearsToRetirement = 65 - state.profile.age;

  // Calculate TTR Strategy
  const calculateTTR = useCallback(
    (params: {
      salaryReduction: number;
      ttrPensionAmount: number;
    }): TTRStrategy => {
      const { salaryReduction, ttrPensionAmount } = params;
      const { superBalance, annualIncome, age, preservationAge } = state.profile;

      const reducedSalary = annualIncome - salaryReduction;
      const additionalSuper = salaryReduction; // Salary sacrifice
      const taxOnOriginalSalary = calculateIncomeTax(annualIncome);
      const taxOnReducedSalary = calculateIncomeTax(reducedSalary + ttrPensionAmount * 0.6); // 60% taxable under 60
      const superTax = additionalSuper * 0.15;
      const taxSavings = taxOnOriginalSalary - taxOnReducedSalary - superTax;

      const calculation: TTRStrategy = {
        id: Date.now().toString(),
        currentAge: age,
        preservationAge,
        superBalance,
        annualSalary: annualIncome,
        salaryReduction,
        ttrPensionAmount,
        additionalSuperContribution: additionalSuper,
        taxSavings: Math.max(0, taxSavings),
        netBenefit: Math.max(0, taxSavings),
      };

      setState((prev) => ({ ...prev, ttrCalculation: calculation }));
      return calculation;
    },
    [state.profile]
  );

  // Calculate Catch-up Contributions
  const calculateCatchUp = useCallback((): CatchUpCalculation => {
    const { superBalance } = state.profile;
    const currentYear = new Date().getFullYear();

    // Check eligibility (super balance must be under $500,000)
    const isEligible = superBalance < CARRY_FORWARD_BALANCE_THRESHOLD;

    // Sample unused caps from previous years
    const carryForwardAmounts: CatchUpContribution[] = [
      {
        financialYear: `${currentYear - 4}-${currentYear - 3}`,
        unusedCap: isEligible ? 5000 : 0,
        expiryDate: new Date(currentYear, 6, 30),
        isAvailable: isEligible,
      },
      {
        financialYear: `${currentYear - 3}-${currentYear - 2}`,
        unusedCap: isEligible ? 10000 : 0,
        expiryDate: new Date(currentYear + 1, 6, 30),
        isAvailable: isEligible,
      },
      {
        financialYear: `${currentYear - 2}-${currentYear - 1}`,
        unusedCap: isEligible ? 15000 : 0,
        expiryDate: new Date(currentYear + 2, 6, 30),
        isAvailable: isEligible,
      },
      {
        financialYear: `${currentYear - 1}-${currentYear}`,
        unusedCap: isEligible ? 15000 : 0,
        expiryDate: new Date(currentYear + 3, 6, 30),
        isAvailable: isEligible,
      },
    ];

    const totalAvailableCap = SUPER_LIMITS_2024_25.concessionalCap +
      carryForwardAmounts.reduce((sum, cf) => sum + cf.unusedCap, 0);

    const recommendedContribution = Math.min(totalAvailableCap, 75000);
    const marginalRate = 0.37; // Assuming 37% marginal rate
    const taxSavings = recommendedContribution * (marginalRate - 0.15);

    const calculation: CatchUpCalculation = {
      currentYearCap: SUPER_LIMITS_2024_25.concessionalCap,
      carryForwardAmounts,
      totalAvailableCap,
      recommendedContribution,
      taxSavings,
      superBalanceAfterContribution: superBalance + recommendedContribution,
    };

    setState((prev) => ({ ...prev, catchUpCalculation: calculation }));
    return calculation;
  }, [state.profile]);

  // Calculate Downsizer Contribution
  const calculateDownsizer = useCallback(
    (params: {
      expectedSalePrice: number;
      proposedContribution: number;
      spouseContribution?: number;
    }): DownsizerContribution => {
      const { age, superBalance, homeValue } = state.profile;
      const { expectedSalePrice, proposedContribution } = params;

      const isEligible = age >= DOWNSIZER_MINIMUM_AGE;
      const maxContribution = Math.min(
        DOWNSIZER_CONTRIBUTION_LIMIT,
        expectedSalePrice
      );
      const actualContribution = Math.min(proposedContribution, maxContribution);

      const calculation: DownsizerContribution = {
        personAge: age,
        isEligible,
        eligibilityReason: isEligible
          ? 'You meet the age requirement for downsizer contributions'
          : `You must be at least ${DOWNSIZER_MINIMUM_AGE} to make downsizer contributions`,
        maxContribution,
        homeValue,
        saleProceeds: expectedSalePrice,
        proposedContribution: actualContribution,
        superBalanceAfter: superBalance + actualContribution,
      };

      setState((prev) => ({ ...prev, downsizerCalculation: calculation }));
      return calculation;
    },
    [state.profile]
  );

  // Calculate Pension Projection
  const calculatePensionProjection = useCallback(
    (params: {
      startingBalance: number;
      annualDrawdown: number;
      expectedReturn: number;
      years: number;
    }): PensionProjection => {
      const { startingBalance, annualDrawdown, expectedReturn, years } = params;

      let balance = startingBalance;
      let totalIncome = 0;

      for (let i = 0; i < years; i++) {
        const drawdown = Math.min(annualDrawdown, balance);
        totalIncome += drawdown;
        balance = (balance - drawdown) * (1 + expectedReturn);
      }

      const projection: PensionProjection = {
        startingBalance,
        annualDrawdown,
        projectedYears: years,
        balanceAtEnd: Math.max(0, balance),
        totalIncome,
        taxPaid: 0, // Tax-free for over 60
      };

      setState((prev) => ({ ...prev, pensionProjection: projection }));
      return projection;
    },
    []
  );

  // Select goal
  const selectGoal = useCallback((goal: SeniorGoal) => {
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

  // Update profile
  const updateProfile = useCallback(
    (updates: Partial<SeniorProfessionalProfile>) => {
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
    ttrCalculation: state.ttrCalculation,
    catchUpCalculation: state.catchUpCalculation,
    downsizerCalculation: state.downsizerCalculation,
    pensionProjection: state.pensionProjection,
    selectedGoal: state.selectedGoal,
    isLoading: state.isLoading,
    error: state.error,

    // Computed values
    totalNetWorth,
    estimatedAnnualTax,
    potentialTaxSavings,
    completedTasksCount,
    yearsToRetirement,

    // Actions
    calculateTTR,
    calculateCatchUp,
    calculateDownsizer,
    calculatePensionProjection,
    selectGoal,
    resetGoalFilter,
    toggleTaskCompletion,
    updateProfile,
  };
}
