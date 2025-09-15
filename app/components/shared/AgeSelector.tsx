'use client';

import React from 'react';
import { AgeGroup, AGE_GROUP_CONFIGS } from '../../types/australian-tax';

interface AgeSelectorProps {
  selectedAge: AgeGroup;
  onAgeChange: (ageGroup: AgeGroup) => void;
  className?: string;
}

export default function AgeSelector({ selectedAge, onAgeChange, className = '' }: AgeSelectorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Life Stage</h3>
        <p className="text-sm text-gray-600">Choose the stage that best describes your current situation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.values(AGE_GROUP_CONFIGS).map((config) => (
          <button
            key={config.id}
            onClick={() => onAgeChange(config.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedAge === config.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className={`w-3 h-3 rounded-full mb-2 ${config.color}`}></div>
            <div className="font-medium text-gray-900 text-sm mb-1">
              {config.label}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Ages {config.ageRange}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2">
              {config.description}
            </div>
            
            {selectedAge === config.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {selectedAge && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className={`w-4 h-4 rounded-full mt-0.5 ${AGE_GROUP_CONFIGS[selectedAge].color}`}></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {AGE_GROUP_CONFIGS[selectedAge].label}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {AGE_GROUP_CONFIGS[selectedAge].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-medium text-gray-700 mb-1">Primary Focus</div>
                  <ul className="text-gray-600 space-y-1">
                    {AGE_GROUP_CONFIGS[selectedAge].primaryFocus.map((focus, index) => (
                      <li key={index}>• {focus}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-gray-700 mb-1">Common Goals</div>
                  <ul className="text-gray-600 space-y-1">
                    {AGE_GROUP_CONFIGS[selectedAge].commonGoals.map((goal, index) => (
                      <li key={index}>• {goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-medium text-gray-700 mb-1">Tax Strategies</div>
                  <ul className="text-gray-600 space-y-1">
                    {AGE_GROUP_CONFIGS[selectedAge].taxStrategies.map((strategy, index) => (
                      <li key={index}>• {strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
