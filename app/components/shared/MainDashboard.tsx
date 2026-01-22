'use client';

import React, { useState } from 'react';
import { AgeGroup } from '../../types/australian-tax';
import AgeSelector from './AgeSelector';
import YoungProfessionalDashboard from '../age-dashboards/YoungProfessionalDashboard';
import ProfessionalDashboard from '../age-dashboards/ProfessionalDashboard';
import { EstablishedProfessionalDashboard } from '../../../src/components/dashboard/established-professional';
import { SeniorProfessionalDashboard } from '../../../src/components/dashboard/senior-professional';
import { RetireeDashboard } from '../../../src/components/dashboard/retiree';

interface MainDashboardProps {
  className?: string;
}

export default function MainDashboard({ className = '' }: MainDashboardProps) {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('young');

  const renderDashboard = () => {
    switch (selectedAge) {
      case 'young':
        return <YoungProfessionalDashboard />;
      case 'professional':
        return <ProfessionalDashboard />;
      case 'established':
        return <EstablishedProfessionalDashboard />;
      case 'senior':
        return <SeniorProfessionalDashboard />;
      case 'retiree':
        return <RetireeDashboard />;
      default:
        return <YoungProfessionalDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Australian Tax Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Personalized tax planning for every stage of life
          </p>
        </div>

        {/* Age Selector */}
        <div className="mb-8">
          <AgeSelector
            selectedAge={selectedAge}
            onAgeChange={setSelectedAge}
          />
        </div>

        {/* Dashboard Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderDashboard()}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This tool provides estimates based on current tax rates and general assumptions. 
              Tax situations can be complex and individual circumstances vary significantly.
            </p>
            <p>
              For personalized tax advice, please consult with a qualified tax professional or accountant. 
              This tool should not be used as a substitute for professional tax advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
