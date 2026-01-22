/**
 * TaxEnd - Established Professional Hook
 * State management hook for established professional dashboard
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  EstablishedProfessionalProfile,
  EstablishedProfessionalDashboardState,
  WealthGoal,
  TaxStrategy,
  AISuggestion,
  TaskItem,
  Activity,
  SuperContributionCalculation,
  CGTEvent,
  TaxStrategyCategory,
} from '@/src/types/established-professional';
import {
  calculateIncomeTax,
  calculateSuperContribution,
  calculateNetWorth,
} from '@/src/lib/tax-calculations';

// Sample data generators
function generateSampleStrategies(): TaxStrategy[] {
  return [
    {
      id: '1',
      title: 'Maximize Concessional Super Contributions',
      description: 'Maximize pre-tax Super contributions within $30,000 annual cap to reduce taxable income',
      category: 'concessional_contributions',
      potentialSavings: 8250,
      complexity: 'simple',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '2',
      title: 'Capital Gains Tax Harvesting Strategy',
      description: 'Strategically realize capital losses to offset capital gains',
      category: 'capital_gains_planning',
      potentialSavings: 5000,
      complexity: 'moderate',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '3',
      title: 'Family Trust Distribution',
      description: 'Optimize income distribution through family trust to reduce overall tax burden',
      category: 'trust_structures',
      potentialSavings: 15000,
      complexity: 'complex',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '4',
      title: 'Super Splitting Contributions',
      description: 'Split Super contributions to lower-income spouse',
      category: 'super_splitting',
      potentialSavings: 3000,
      complexity: 'moderate',
      applicableLifeStages: ['mid_career', 'established_professional'],
    },
  ];
}

function generateSampleSuggestions(): AISuggestion[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Maximize Super Contributions',
      description: 'You still have $15,000 unused concessional contribution cap, recommend topping up before end of FY',
      priority: 'high',
      potentialSavings: 4125,
      category: 'optimization',
      actionRequired: true,
      dueDate: new Date(now.getFullYear(), 6, 30), // June 30
    },
    {
      id: '2',
      title: 'Consider Setting Up Family Trust',
      description: 'Based on your income level, a family trust may help optimize your tax structure',
      priority: 'medium',
      potentialSavings: 12000,
      category: 'planning',
      actionRequired: false,
    },
    {
      id: '3',
      title: 'Review CGT Event Timing',
      description: 'Some of your investments have been held over 12 months, eligible for 50% CGT discount',
      priority: 'medium',
      potentialSavings: 8500,
      category: 'optimization',
      actionRequired: false,
    },
    {
      id: '4',
      title: 'Spouse Super Splitting',
      description: 'Splitting some Super contributions to spouse can provide tax benefits',
      priority: 'low',
      potentialSavings: 2500,
      category: 'planning',
      actionRequired: false,
    },
  ];
}

function generateSampleTasks(): TaskItem[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Review Super Contribution Strategy',
      description: 'Evaluate concessional and non-concessional contribution plans for current FY',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      priority: 'high',
      category: 'review',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Organize Investment Portfolio Documents',
      description: 'Prepare purchase records and dividend statements for all investments',
      dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'document',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Calculate CGT Obligations',
      description: 'Calculate all capital gains and losses for this FY',
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'calculation',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Consult on Trust Setup',
      description: 'Discuss family trust suitability with tax advisor',
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
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
      title: 'Tax Calculation Completed',
      description: 'FY 2024-25 income tax calculation completed',
      type: 'calculation',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Investment Report Uploaded',
      description: 'Annual stock investment report uploaded',
      type: 'document_upload',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Super Contribution Reminder',
      description: '3 months until end of financial year',
      type: 'alert',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  ];
}

export function useEstablishedProfessional() {
  // Initialize state with sample data
  const [state, setState] = useState<EstablishedProfessionalDashboardState>({
    profile: {
      id: '1',
      annualIncome: 200000,
      superBalance: 500000,
      investmentPortfolioValue: 300000,
      propertyValue: 1200000,
      hasPrivateHealthInsurance: true,
      hasFamilyTrust: false,
      numberOfDependents: 2,
      primaryGoals: ['super_maximization', 'tax_minimization'],
    },
    taxStrategies: generateSampleStrategies(),
    suggestions: generateSampleSuggestions(),
    tasks: generateSampleTasks(),
    activities: generateSampleActivities(),
    superCalculation: null,
    cgtEvents: [],
    selectedGoal: null,
    isLoading: false,
    error: null,
  });

  // Computed values
  const totalNetWorth = calculateNetWorth({
    superBalance: state.profile.superBalance,
    investmentPortfolio: state.profile.investmentPortfolioValue,
    propertyValue: state.profile.propertyValue,
  });

  const estimatedAnnualTax = calculateIncomeTax(state.profile.annualIncome);

  const potentialTaxSavings = state.taxStrategies.reduce(
    (sum, strategy) => sum + strategy.potentialSavings,
    0
  );

  const completedTasksCount = state.tasks.filter((task) => task.isCompleted).length;
  const pendingTasksCount = state.tasks.filter((task) => !task.isCompleted).length;

  // Update profile
  const updateProfile = useCallback(
    (updates: Partial<EstablishedProfessionalProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));
    },
    []
  );

  // Select goal and filter strategies
  const selectGoal = useCallback((goal: WealthGoal) => {
    setState((prev) => {
      const allStrategies = generateSampleStrategies();
      let filteredStrategies = allStrategies;

      // Filter strategies based on goal
      switch (goal) {
        case 'super_maximization':
          filteredStrategies = allStrategies.filter(
            (s) => s.category === 'concessional_contributions' || s.category === 'super_splitting'
          );
          break;
        case 'tax_minimization':
          filteredStrategies = allStrategies;
          break;
        case 'wealth_preservation':
        case 'estate_planning':
        case 'succession_planning':
          filteredStrategies = allStrategies.filter((s) => s.category === 'trust_structures');
          break;
        case 'investment_growth':
          filteredStrategies = allStrategies.filter(
            (s) =>
              s.category === 'capital_gains_planning' || s.category === 'dividend_imputation'
          );
          break;
      }

      return {
        ...prev,
        selectedGoal: goal,
        taxStrategies: filteredStrategies,
      };
    });
  }, []);

  // Reset goal filter
  const resetGoalFilter = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedGoal: null,
      taxStrategies: generateSampleStrategies(),
    }));
  }, []);

  // Calculate super contribution
  const calculateSuper = useCallback(
    (params: {
      currentBalance: number;
      annualIncome: number;
      additionalConcessional: number;
      additionalNonConcessional: number;
    }) => {
      const calculation = calculateSuperContribution(params);
      setState((prev) => ({
        ...prev,
        superCalculation: calculation,
      }));
      return calculation;
    },
    []
  );

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

  // Add CGT event
  const addCGTEvent = useCallback((event: CGTEvent) => {
    setState((prev) => ({
      ...prev,
      cgtEvents: [...prev.cgtEvents, event],
    }));
  }, []);

  // Remove CGT event
  const removeCGTEvent = useCallback((eventId: string) => {
    setState((prev) => ({
      ...prev,
      cgtEvents: prev.cgtEvents.filter((e) => e.id !== eventId),
    }));
  }, []);

  // Add activity
  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    setState((prev) => ({
      ...prev,
      activities: [
        {
          ...activity,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
        ...prev.activities,
      ].slice(0, 10), // Keep only last 10 activities
    }));
  }, []);

  return {
    // State
    profile: state.profile,
    taxStrategies: state.taxStrategies,
    suggestions: state.suggestions,
    tasks: state.tasks,
    activities: state.activities,
    superCalculation: state.superCalculation,
    cgtEvents: state.cgtEvents,
    selectedGoal: state.selectedGoal,
    isLoading: state.isLoading,
    error: state.error,

    // Computed values
    totalNetWorth,
    estimatedAnnualTax,
    potentialTaxSavings,
    completedTasksCount,
    pendingTasksCount,

    // Actions
    updateProfile,
    selectGoal,
    resetGoalFilter,
    calculateSuper,
    toggleTaskCompletion,
    addCGTEvent,
    removeCGTEvent,
    addActivity,
  };
}
