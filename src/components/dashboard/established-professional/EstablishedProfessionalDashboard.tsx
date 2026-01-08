/**
 * TaxEnd - Established Professional Dashboard
 * 成熟专业人士仪表板主组件
 * 
 * 针对46-55岁高收入人群的财富管理和税务优化
 */

'use client';

import React, { useState } from 'react';
import { Building2, Sparkles } from 'lucide-react';
import { useEstablishedProfessional } from '@/src/hooks/useEstablishedProfessional';
import WealthGoalsSelector from './WealthGoalsSelector';
import QuickActionsGrid from './QuickActionsGrid';
import NetWorthSummary from './NetWorthSummary';
import TaxStrategiesSection from './TaxStrategiesSection';
import AISuggestionsSection from './AISuggestionsSection';
import TasksSection from './TasksSection';
import ActivitiesSection from './ActivitiesSection';
import SuperCalculator from './SuperCalculator';
import CGTCalculator from './CGTCalculator';
import TrustInfoModal from './TrustInfoModal';

export default function EstablishedProfessionalDashboard() {
  const dashboard = useEstablishedProfessional();
  const [showSuperCalculator, setShowSuperCalculator] = useState(false);
  const [showCGTCalculator, setShowCGTCalculator] = useState(false);
  const [showTrustInfo, setShowTrustInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">成熟专业人士</h1>
                  <p className="text-gray-600">Established Professional · 46-55岁 · 高收入者，专注财富积累</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">2024-25财年</p>
                <p className="text-2xl font-bold text-purple-600">Dashboard</p>
              </div>
            </div>
          </div>
        </header>

        {/* Wealth Goals Selector */}
        <section className="mb-6">
          <WealthGoalsSelector
            selectedGoal={dashboard.selectedGoal}
            onSelectGoal={dashboard.selectGoal}
            onResetFilter={dashboard.resetGoalFilter}
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <QuickActionsGrid
            onOpenSuperCalculator={() => setShowSuperCalculator(true)}
            onOpenCGTCalculator={() => setShowCGTCalculator(true)}
            onOpenTrustInfo={() => setShowTrustInfo(true)}
          />
        </section>

        {/* Net Worth Summary */}
        <section className="mb-6">
          <NetWorthSummary
            totalNetWorth={dashboard.totalNetWorth}
            estimatedTax={dashboard.estimatedAnnualTax}
            potentialSavings={dashboard.potentialTaxSavings}
          />
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tax Strategies */}
            <TaxStrategiesSection
              strategies={dashboard.taxStrategies}
              selectedGoal={dashboard.selectedGoal}
              onResetFilter={dashboard.resetGoalFilter}
            />

            {/* AI Suggestions */}
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">AI 智能建议</h2>
              </div>
              <AISuggestionsSection suggestions={dashboard.suggestions} />
            </section>

            {/* Activities */}
            <ActivitiesSection activities={dashboard.activities} />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Tasks */}
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
      {showSuperCalculator && (
        <SuperCalculator
          profile={dashboard.profile}
          onClose={() => setShowSuperCalculator(false)}
          onCalculate={dashboard.calculateSuper}
          calculation={dashboard.superCalculation}
        />
      )}

      {showCGTCalculator && (
        <CGTCalculator
          profile={dashboard.profile}
          onClose={() => setShowCGTCalculator(false)}
          onAddEvent={dashboard.addCGTEvent}
        />
      )}

      {showTrustInfo && (
        <TrustInfoModal onClose={() => setShowTrustInfo(false)} />
      )}
    </div>
  );
}
