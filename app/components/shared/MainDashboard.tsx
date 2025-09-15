'use client';

import React, { useState } from 'react';
import { AgeGroup } from '../../types/australian-tax';
import AgeSelector from './AgeSelector';
import YoungProfessionalDashboard from '../age-dashboards/YoungProfessionalDashboard';
import ProfessionalDashboard from '../age-dashboards/ProfessionalDashboard';

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
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Established Professional Dashboard Coming Soon</h3>
            <p className="text-gray-600">This dashboard is being developed for established professionals (ages 46-55)</p>
          </div>
        );
      case 'senior':
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Senior Professional Dashboard Coming Soon</h3>
            <p className="text-gray-600">This dashboard is being developed for senior professionals (ages 56-65)</p>
          </div>
        );
      case 'retiree':
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M7 7h10M7 11h10M7 15h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Retiree Dashboard Coming Soon</h3>
            <p className="text-gray-600">This dashboard is being developed for retirees (ages 65+)</p>
          </div>
        );
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
