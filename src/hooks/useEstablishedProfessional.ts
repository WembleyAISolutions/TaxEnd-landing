/**
 * TaxEnd - Established Professional Hook
 * 成熟专业人士仪表板状态管理Hook
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
      title: '最大化优惠性Super供款',
      description: '在$30,000年度限额内最大化税前Super供款，降低应税收入',
      category: 'concessional_contributions',
      potentialSavings: 8250,
      complexity: 'simple',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '2',
      title: '资本利得税收获策略',
      description: '战略性地实现资本损失以抵消资本收益',
      category: 'capital_gains_planning',
      potentialSavings: 5000,
      complexity: 'moderate',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '3',
      title: '家族信托分配',
      description: '通过家族信托优化收入分配，降低整体税负',
      category: 'trust_structures',
      potentialSavings: 15000,
      complexity: 'complex',
      applicableLifeStages: ['established_professional', 'senior_professional'],
    },
    {
      id: '4',
      title: 'Super分割供款',
      description: '将Super供款分割给收入较低的配偶',
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
      title: '最大化Super供款',
      description: '您还有$15,000的优惠性供款额度未使用，建议在财年结束前补足',
      priority: 'high',
      potentialSavings: 4125,
      category: 'optimization',
      actionRequired: true,
      dueDate: new Date(now.getFullYear(), 6, 30), // June 30
    },
    {
      id: '2',
      title: '考虑设立家族信托',
      description: '根据您的收入水平，家族信托可能帮助您优化税务结构',
      priority: 'medium',
      potentialSavings: 12000,
      category: 'planning',
      actionRequired: false,
    },
    {
      id: '3',
      title: '审查CGT事件时机',
      description: '您有部分投资持有已超过12个月，符合50%CGT折扣条件',
      priority: 'medium',
      potentialSavings: 8500,
      category: 'optimization',
      actionRequired: false,
    },
    {
      id: '4',
      title: '配偶Super分割',
      description: '将部分Super供款分割给配偶可获得税务优惠',
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
      title: '审查Super供款策略',
      description: '评估当前财年的优惠性和非优惠性供款计划',
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      priority: 'high',
      category: 'review',
      isCompleted: false,
    },
    {
      id: '2',
      title: '整理投资组合文档',
      description: '准备所有投资的购买记录和股息声明',
      dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'document',
      isCompleted: false,
    },
    {
      id: '3',
      title: '计算CGT义务',
      description: '计算本财年所有资本利得和损失',
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'calculation',
      isCompleted: false,
    },
    {
      id: '4',
      title: '咨询信托设立事宜',
      description: '与税务顾问讨论家族信托的适用性',
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
      title: '完成税务计算',
      description: '2024-25财年收入税计算已完成',
      type: 'calculation',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: '上传投资报告',
      description: '股票投资年度报告已上传',
      type: 'document_upload',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Super供款提醒',
      description: '距离财年结束还有3个月',
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
