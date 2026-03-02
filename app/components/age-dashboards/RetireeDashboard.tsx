'use client';

import React, { useState, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

type RetireeGoal =
  | 'maximize_pension'
  | 'age_pension_eligibility'
  | 'estate_planning'
  | 'minimize_drawdown'
  | 'healthcare_planning'
  | 'aged_care_planning';

type Priority = 'high' | 'medium' | 'low';
type Complexity = 'simple' | 'moderate' | 'complex';

interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  category: string;
  potentialSavings: number;
  complexity: Complexity;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  potentialSavings: number;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: Priority;
  isCompleted: boolean;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'calculation' | 'document_upload' | 'tax_filing' | 'payment' | 'consultation' | 'alert';
  timestamp: Date;
}

// ============================================================================
// Sample Data
// ============================================================================

const sampleStrategies: TaxStrategy[] = [
  {
    id: '1',
    title: 'Account-Based Pension Optimization',
    description: 'Maximize tax-free pension income while preserving capital for longevity',
    category: 'pension',
    potentialSavings: 8000,
    complexity: 'moderate',
  },
  {
    id: '2',
    title: 'Age Pension Maximization',
    description: 'Structure assets to maximize Age Pension entitlements',
    category: 'age_pension',
    potentialSavings: 12000,
    complexity: 'moderate',
  },
  {
    id: '3',
    title: 'Gifting Strategy',
    description: 'Strategic gifting to reduce assessable assets while staying within Centrelink limits',
    category: 'estate',
    potentialSavings: 5000,
    complexity: 'simple',
  },
  {
    id: '4',
    title: 'Funeral Bond Strategy',
    description: 'Use exempt funeral bonds to reduce assessable assets',
    category: 'estate',
    potentialSavings: 2000,
    complexity: 'simple',
  },
];

const sampleSuggestions: AISuggestion[] = [
  {
    id: '1',
    title: 'Review Minimum Drawdown',
    description: 'Ensure you withdraw at least the minimum amount to maintain pension status',
    priority: 'high',
    potentialSavings: 0,
  },
  {
    id: '2',
    title: 'Age Pension Application',
    description: 'You may be eligible for a part Age Pension. Consider applying to Centrelink.',
    priority: 'high',
    potentialSavings: 15000,
  },
  {
    id: '3',
    title: 'Update Estate Plan',
    description: 'Review beneficiary nominations and ensure they reflect current wishes',
    priority: 'medium',
    potentialSavings: 0,
  },
];

const sampleTasks: TaskItem[] = [
  {
    id: '1',
    title: 'Complete Minimum Pension Drawdown',
    description: 'Withdraw at least the minimum required amount before June 30',
    dueDate: new Date(new Date().getFullYear(), 5, 30),
    priority: 'high',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Review Centrelink Assessment',
    description: 'Check if asset or income test thresholds have changed',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Update Binding Death Nomination',
    description: 'Ensure super death benefit nominations are current',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Aged Care Planning Review',
    description: 'Review aged care options and associated costs',
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    priority: 'low',
    isCompleted: false,
  },
];

const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'Pension Payment Received',
    description: 'Monthly pension payment of $4,500 processed',
    type: 'payment',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Age Pension Review Completed',
    description: 'Centrelink assessment updated',
    type: 'calculation',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Estate Plan Updated',
    description: 'Binding death nomination renewed',
    type: 'document_upload',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// ============================================================================
// Main Component
// ============================================================================

export default function RetireeDashboard() {
  // State
  const [selectedGoal, setSelectedGoal] = useState<RetireeGoal | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>(sampleTasks);
  const [strategies] = useState<TaxStrategy[]>(sampleStrategies);
  const [suggestions] = useState<AISuggestion[]>(sampleSuggestions);
  const [activities] = useState<Activity[]>(sampleActivities);

  // Profile data (hardcoded for demo)
  const profile = {
    age: 68,
    annualIncome: 54000,
    accountBasedPensionBalance: 620000,
    spouseSuperBalance: 380000,
    investmentPortfolioValue: 150000,
    homeValue: 1200000,
    otherAssets: 50000,
    estatePlanningProgress: 0.75,
  };

  // Computed values
  const totalNetWorth = profile.accountBasedPensionBalance + profile.spouseSuperBalance + profile.investmentPortfolioValue + profile.homeValue + profile.otherAssets;
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;

  // Handlers
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  }, []);

  const resetGoalFilter = useCallback(() => {
    setSelectedGoal(null);
  }, []);

  // Filter strategies based on selected goal
  const filteredStrategies = selectedGoal ? strategies.filter(s => {
    switch (selectedGoal) {
      case 'maximize_pension':
        return s.category === 'pension';
      case 'age_pension_eligibility':
        return s.category === 'age_pension';
      case 'estate_planning':
        return s.category === 'estate';
      default:
        return true;
    }
  }) : strategies;

  // ============================================================================
  // Inline Components
  // ============================================================================

  const GoalsSelector = () => {
    const goals: { key: RetireeGoal; title: string; color: string }[] = [
      { key: 'maximize_pension', title: 'Maximize Pension', color: 'teal' },
      { key: 'age_pension_eligibility', title: 'Age Pension', color: 'blue' },
      { key: 'estate_planning', title: 'Estate Planning', color: 'purple' },
      { key: 'minimize_drawdown', title: 'Preserve Capital', color: 'green' },
      { key: 'healthcare_planning', title: 'Healthcare', color: 'red' },
      { key: 'aged_care_planning', title: 'Aged Care', color: 'orange' },
    ];

    const colorClasses: Record<string, { bgLight: string; text: string; gradient: string }> = {
      teal: { bgLight: 'bg-teal-100', text: 'text-teal-600', gradient: 'from-teal-500 to-teal-600' },
      blue: { bgLight: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
      purple: { bgLight: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
      green: { bgLight: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
      red: { bgLight: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
      orange: { bgLight: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Retirement Goals</h2>
          {selectedGoal && (
            <button onClick={resetGoalFilter} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Clear Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {goals.map(goal => {
            const colors = colorClasses[goal.color];
            const isSelected = selectedGoal === goal.key;
            return (
              <button
                key={goal.key}
                onClick={() => isSelected ? resetGoalFilter() : setSelectedGoal(goal.key)}
                className={`relative p-4 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105`
                    : `${colors.bgLight} hover:shadow-md hover:scale-105`
                }`}
              >
                <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {goal.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const QuickActionsGrid = () => {
    const actions = [
      { title: 'Age Pension', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
      { title: 'Min Drawdown', color: 'bg-green-100 text-green-600 hover:bg-green-200' },
      { title: 'Estate Planning', color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
      { title: 'Centrelink Test', color: 'bg-orange-100 text-orange-600 hover:bg-orange-200' },
      { title: 'Compare Pensions', color: 'bg-teal-100 text-teal-600 hover:bg-teal-200' },
    ];

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 ${action.color}`}
            >
              <span className="font-medium text-sm text-center">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const FinancialOverview = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
        <span className="text-sm text-gray-600">FY 2024-25</span>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Net Worth</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalNetWorth)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pension Balance</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(profile.accountBasedPensionBalance)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Income</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(profile.annualIncome)}</p>
            <p className="text-xs text-green-600">Tax-Free</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estate Planning</p>
            <p className="text-xl font-bold text-purple-600">{Math.round(profile.estatePlanningProgress * 100)}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );

  const StrategiesSection = () => {
    const complexityColors: Record<Complexity, string> = {
      simple: 'bg-green-100 text-green-700',
      moderate: 'bg-orange-100 text-orange-700',
      complex: 'bg-red-100 text-red-700',
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Retirement Strategies</h2>
          {selectedGoal && (
            <button onClick={resetGoalFilter} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Clear Filter
            </button>
          )}
        </div>
        <div className="space-y-4">
          {filteredStrategies.map(strategy => (
            <div key={strategy.id} className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${complexityColors[strategy.complexity]}`}>
                  {strategy.complexity.charAt(0).toUpperCase() + strategy.complexity.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Potential Savings</span>
                  <span className="font-bold text-green-600">{formatCurrency(strategy.potentialSavings)}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SuggestionsSection = () => {
    const priorityConfig: Record<Priority, { bgColor: string; borderColor: string; iconColor: string }> = {
      high: { bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-600' },
      medium: { bgColor: 'bg-orange-50', borderColor: 'border-orange-200', iconColor: 'text-orange-600' },
      low: { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600' },
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">AI Smart Suggestions</h2>
        </div>
        <div className="space-y-3">
          {suggestions.map(suggestion => {
            const config = priorityConfig[suggestion.priority];
            return (
              <div key={suggestion.id} className={`p-4 border rounded-xl ${config.bgColor} ${config.borderColor}`}>
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    {suggestion.potentialSavings > 0 && (
                      <p className="text-sm font-bold text-green-600">
                        Potential Savings: {formatCurrency(suggestion.potentialSavings)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TasksSection = () => {
    const priorityColors: Record<Priority, string> = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-orange-600 bg-orange-100',
      low: 'text-blue-600 bg-blue-100',
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">To-Do Tasks</h2>
          <span className="text-sm text-gray-600">{completedTasksCount}/{tasks.length} Completed</span>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className={`p-4 border rounded-xl transition-all ${task.isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTaskCompletion(task.id)} className="mt-0.5 flex-shrink-0">
                  {task.isCompleted ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${priorityColors[task.priority]}`}>
                      {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Med' : 'Low'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ActivitiesSection = () => {
    const activityColors: Record<Activity['type'], string> = {
      calculation: 'bg-blue-100 text-blue-600',
      document_upload: 'bg-green-100 text-green-600',
      tax_filing: 'bg-purple-100 text-purple-600',
      payment: 'bg-orange-100 text-orange-600',
      consultation: 'bg-pink-100 text-pink-600',
      alert: 'bg-red-100 text-red-600',
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[activity.type]}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                <p className="text-xs text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Retiree</h1>
                  <p className="text-gray-600">Ages 65+ · Retirement phase · Tax-free super income</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">FY 2024-25</p>
                <p className="text-2xl font-bold text-teal-600">Dashboard</p>
              </div>
            </div>
          </div>
        </header>

        {/* Goals Selector */}
        <section className="mb-6">
          <GoalsSelector />
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <QuickActionsGrid />
        </section>

        {/* Financial Overview */}
        <section className="mb-6">
          <FinancialOverview />
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <StrategiesSection />
            <SuggestionsSection />
            <ActivitiesSection />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <TasksSection />
          </div>
        </div>
      </div>
    </div>
  );
}
