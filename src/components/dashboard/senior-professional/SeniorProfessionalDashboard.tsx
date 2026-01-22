/**
 * TaxEnd - Senior Professional Dashboard
 * Main dashboard for pre-retirement planning (Ages 56-65)
 */

'use client';

import React, { useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useSeniorProfessional } from '@/src/hooks/useSeniorProfessional';
import { formatCurrency } from '@/src/lib/tax-calculations';
import GoalsSelector from './GoalsSelector';
import QuickActionsGrid from './QuickActionsGrid';
import FinancialOverview from './FinancialOverview';
import StrategiesSection from './StrategiesSection';
import SuggestionsSection from './SuggestionsSection';
import TasksSection from './TasksSection';
import ActivitiesSection from './ActivitiesSection';
import TTRStrategyCalculator from './TTRStrategyCalculator';
import CatchUpContributionsCalculator from './CatchUpContributionsCalculator';
import DownsizerCalculator from './DownsizerCalculator';
import PensionPlanningSection from './PensionPlanningSection';
import PreservationAgeInfo from './PreservationAgeInfo';

export default function SeniorProfessionalDashboard() {
  const dashboard = useSeniorProfessional();
  const [showTTRCalculator, setShowTTRCalculator] = useState(false);
  const [showCatchUpCalculator, setShowCatchUpCalculator] = useState(false);
  const [showDownsizerCalculator, setShowDownsizerCalculator] = useState(false);
  const [showPensionPlanning, setShowPensionPlanning] = useState(false);
  const [showPreservationInfo, setShowPreservationInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Senior Professional</h1>
                  <p className="text-gray-600">
                    Ages 56-65 · Pre-retirement planning · {dashboard.yearsToRetirement} years to retirement
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">FY 2024-25</p>
                <p className="text-2xl font-bold text-amber-600">Dashboard</p>
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
            onOpenTTRCalculator={() => setShowTTRCalculator(true)}
            onOpenCatchUpCalculator={() => setShowCatchUpCalculator(true)}
            onOpenDownsizerCalculator={() => setShowDownsizerCalculator(true)}
            onOpenPensionPlanning={() => setShowPensionPlanning(true)}
            onOpenPreservationInfo={() => setShowPreservationInfo(true)}
          />
        </section>

        {/* Financial Overview */}
        <section className="mb-6">
          <FinancialOverview
            totalNetWorth={dashboard.totalNetWorth}
            superBalance={dashboard.profile.superBalance}
            estimatedTax={dashboard.estimatedAnnualTax}
            potentialSavings={dashboard.potentialTaxSavings}
            yearsToRetirement={dashboard.yearsToRetirement}
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
                <Sparkles className="w-5 h-5 text-amber-600" />
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
      {showTTRCalculator && (
        <TTRStrategyCalculator
          profile={dashboard.profile}
          onClose={() => setShowTTRCalculator(false)}
          onCalculate={dashboard.calculateTTR}
          calculation={dashboard.ttrCalculation}
        />
      )}

      {showCatchUpCalculator && (
        <CatchUpContributionsCalculator
          profile={dashboard.profile}
          onClose={() => setShowCatchUpCalculator(false)}
          onCalculate={dashboard.calculateCatchUp}
          calculation={dashboard.catchUpCalculation}
        />
      )}

      {showDownsizerCalculator && (
        <DownsizerCalculator
          profile={dashboard.profile}
          onClose={() => setShowDownsizerCalculator(false)}
          onCalculate={dashboard.calculateDownsizer}
          calculation={dashboard.downsizerCalculation}
        />
      )}

      {showPensionPlanning && (
        <PensionPlanningSection
          profile={dashboard.profile}
          onClose={() => setShowPensionPlanning(false)}
          onCalculate={dashboard.calculatePensionProjection}
          projection={dashboard.pensionProjection}
        />
      )}

      {showPreservationInfo && (
        <PreservationAgeInfo
          profile={dashboard.profile}
          onClose={() => setShowPreservationInfo(false)}
        />
      )}
    </div>
  );
}
