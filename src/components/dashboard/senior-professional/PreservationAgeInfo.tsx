/**
 * PreservationAgeInfo Component
 * Information about preservation age and super access conditions
 */

'use client';

import React from 'react';
import { SeniorProfessionalProfile, PRESERVATION_AGES } from '@/src/types/senior-professional';
import { X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PreservationAgeInfoProps {
  profile: SeniorProfessionalProfile;
  onClose: () => void;
}

export default function PreservationAgeInfo({
  profile,
  onClose,
}: PreservationAgeInfoProps) {
  const hasReachedPreservation = profile.age >= profile.preservationAge;
  const yearsUntilPreservation = Math.max(0, profile.preservationAge - profile.age);

  const accessConditions = [
    {
      title: 'Reached preservation age and retired',
      description: 'Permanently retired from the workforce with no intention to work again',
      available: hasReachedPreservation,
      taxFree: profile.age >= 60,
    },
    {
      title: 'Reached preservation age - TTR',
      description: 'Still working but can access super as a Transition to Retirement pension',
      available: hasReachedPreservation,
      taxFree: false,
      note: 'TTR pension income taxed at marginal rate with 15% offset if under 60',
    },
    {
      title: 'Ceased employment after age 60',
      description: 'Left a job after turning 60 (can start new employment)',
      available: profile.age >= 60,
      taxFree: true,
    },
    {
      title: 'Reached age 65',
      description: 'Full unrestricted access regardless of employment status',
      available: profile.age >= 65,
      taxFree: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Preservation Age & Access</h2>
              <p className="text-sm text-gray-600">Understanding when you can access your super</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Your Status */}
          <div className={`p-6 rounded-xl border ${hasReachedPreservation ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-4">
              {hasReachedPreservation ? (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <Clock className="w-8 h-8 text-amber-600 flex-shrink-0" />
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {hasReachedPreservation
                    ? 'You Have Reached Preservation Age!'
                    : `${yearsUntilPreservation} Years Until Preservation Age`}
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Your Age</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preservation Age</p>
                    <p className="text-2xl font-bold text-amber-600">{profile.preservationAge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preservation Age Table */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Preservation Age by Date of Birth</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date of Birth</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Preservation Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-3 text-sm">Before 1 July 1960</td><td className="px-4 py-3 text-sm text-right font-medium">55</td></tr>
                  <tr><td className="px-4 py-3 text-sm">1 July 1960 - 30 June 1961</td><td className="px-4 py-3 text-sm text-right font-medium">56</td></tr>
                  <tr><td className="px-4 py-3 text-sm">1 July 1961 - 30 June 1962</td><td className="px-4 py-3 text-sm text-right font-medium">57</td></tr>
                  <tr><td className="px-4 py-3 text-sm">1 July 1962 - 30 June 1963</td><td className="px-4 py-3 text-sm text-right font-medium">58</td></tr>
                  <tr><td className="px-4 py-3 text-sm">1 July 1963 - 30 June 1964</td><td className="px-4 py-3 text-sm text-right font-medium">59</td></tr>
                  <tr className="bg-amber-50"><td className="px-4 py-3 text-sm font-medium">From 1 July 1964</td><td className="px-4 py-3 text-sm text-right font-bold text-amber-600">60</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Access Conditions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Your Super Access Conditions</h3>
            <div className="space-y-3">
              {accessConditions.map((condition, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    condition.available
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {condition.available ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{condition.title}</h4>
                        {condition.available && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            condition.taxFree
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {condition.taxFree ? 'Tax-Free' : 'Taxable'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                      {condition.note && (
                        <p className="text-xs text-amber-600 mt-1">{condition.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Important Notes</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• After age 60, all super withdrawals are tax-free</li>
                  <li>• Between preservation age and 60, tax applies to taxable component</li>
                  <li>• You can mix TTR pension with continued employment</li>
                  <li>• Retirement means ending a gainful employment arrangement</li>
                  <li>• Consider Age Pension implications before accessing large amounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
