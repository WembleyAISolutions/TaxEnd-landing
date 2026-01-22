/**
 * TaxEnd - Retiree Dashboard
 * Main dashboard for retirement phase (Ages 65+)
 */

'use client';

import React, { useState } from 'react';
import { Sunset, Sparkles } from 'lucide-react';
import { useRetiree } from '@/src/hooks/useRetiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import GoalsSelector from './GoalsSelector';
import QuickActionsGrid from './QuickActionsGrid';
import FinancialOverview from './FinancialOverview';
import StrategiesSection from './StrategiesSection';
import SuggestionsSection from './SuggestionsSection';
import TasksSection from './TasksSection';
import ActivitiesSection from './ActivitiesSection';
import AgePensionCalculator from './AgePensionCalculator';
import MinimumDrawdownCalculator from './MinimumDrawdownCalculator';
import EstatePlanningSection from './EstatePlanningSection';
import CentrelinkAssetsTest from './CentrelinkAssetsTest';
import PensionComparisonTool from './PensionComparisonTool';

export default function RetireeDashboard() {
  const dashboard = useRetiree();
  const [showAgePensionCalculator, setShowAgePensionCalculator] = useState(false);
  const [showMinimumDrawdown, setShowMinimumDrawdown] = useState(false);
  const [showEstatePlanning, setShowEstatePlanning] = useState(false);
  const [showCentrelinkTest, setShowCentrelinkTest] = useState(false);
  const [showPensionComparison, setShowPensionComparison] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Sunset className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Retiree</h1>
                  <p className="text-gray-600">
                    Ages 65+ · Retirement phase · Tax-free super income
                  </p>
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
          <GoalsSelector
            selectedGoal={dashboard.selectedGoal}
            onSelectGoal={dashboard.selectGoal}
            onResetFilter={dashboard.resetGoalFilter}
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <QuickActionsGrid
            onOpenAgePensionCalculator={() => setShowAgePensionCalculator(true)}
            onOpenMinimumDrawdown={() => setShowMinimumDrawdown(true)}
            onOpenEstatePlanning={() => setShowEstatePlanning(true)}
            onOpenCentrelinkTest={() => setShowCentrelinkTest(true)}
            onOpenPensionComparison={() => setShowPensionComparison(true)}
          />
        </section>

        {/* Financial Overview */}
        <section className="mb-6">
          <FinancialOverview
            totalNetWorth={dashboard.totalNetWorth}
            pensionBalance={dashboard.profile.accountBasedPensionBalance}
            annualIncome={dashboard.profile.annualIncome}
            estatePlanningProgress={dashboard.estatePlanningProgress}
          />
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strategies */}
            <StrategiesSection
              strategies={dashboard.taxStrategies}
              selectedGoal={dashboard.selectedGoal}
              onResetFilter={dashboard.resetGoalFilter}
            />

            {/* AI Suggestions */}
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-bold text-gray-900">AI Smart Suggestions</h2>
              </div>
              <SuggestionsSection suggestions={dashboard.suggestions} />
            </section>

            {/* Activities */}
            <ActivitiesSection activities={dashboard.activities} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TasksSection
              tasks={dashboard.tasks}
              completedCount={dashboard.completedTasksCount}
              totalCount={dashboard.tasks.length}
              onToggleTask={dashboard.toggleTaskCompletion}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAgePensionCalculator && (
        <AgePensionCalculator
          profile={dashboard.profile}
          onClose={() => setShowAgePensionCalculator(false)}
          onCalculate={dashboard.calculateAgePension}
          eligibility={dashboard.agePensionEligibility}
        />
      )}

      {showMinimumDrawdown && (
        <MinimumDrawdownCalculator
          profile={dashboard.profile}
          onClose={() => setShowMinimumDrawdown(false)}
          onCalculate={dashboard.calculateMinimumDrawdown}
          calculation={dashboard.minimumDrawdown}
        />
      )}

      {showEstatePlanning && (
        <EstatePlanningSection
          items={dashboard.estatePlanningItems}
          onClose={() => setShowEstatePlanning(false)}
          onUpdateItem={dashboard.updateEstatePlanningItem}
        />
      )}

      {showCentrelinkTest && (
        <CentrelinkAssetsTest
          profile={dashboard.profile}
          onClose={() => setShowCentrelinkTest(false)}
          onCalculate={dashboard.calculateCentrelink}
          assessment={dashboard.centrelinkAssessment}
        />
      )}

      {showPensionComparison && (
        <PensionComparisonTool
          profile={dashboard.profile}
          onClose={() => setShowPensionComparison(false)}
        />
      )}
    </div>
  );
}
