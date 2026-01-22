/**
 * EstatePlanningSection Component
 * Estate planning checklist and guidance for retirees
 */

'use client';

import React from 'react';
import { RetireeProfile, EstatePlanningItem } from '@/src/types/retiree';
import { formatCurrency } from '@/src/lib/tax-calculations';
import { X, FileText, CheckCircle2, Circle, AlertTriangle, Users, Building, Heart } from 'lucide-react';

interface EstatePlanningSectionProps {
  profile: RetireeProfile;
  items: EstatePlanningItem[];
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
}

const categoryIcons = {
  legal: FileText,
  financial: Building,
  beneficiaries: Users,
  healthcare: Heart,
};

const categoryColors = {
  legal: 'from-purple-500 to-indigo-600',
  financial: 'from-green-500 to-emerald-600',
  beneficiaries: 'from-blue-500 to-cyan-600',
  healthcare: 'from-pink-500 to-rose-600',
};

const categoryBgColors = {
  legal: 'bg-purple-50 border-purple-200',
  financial: 'bg-green-50 border-green-200',
  beneficiaries: 'bg-blue-50 border-blue-200',
  healthcare: 'bg-pink-50 border-pink-200',
};

export default function EstatePlanningSection({
  profile,
  items,
  onClose,
  onToggleItem,
}: EstatePlanningSectionProps) {
  const completedCount = items.filter((item) => item.status === 'completed').length;
  const totalCount = items.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EstatePlanningItem[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Estate Planning Checklist</h2>
              <p className="text-sm text-gray-600">Ensure your affairs are in order</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Overview */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Your Progress</h3>
              <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalCount} items completed
            </p>
          </div>

          {/* Estimated Estate Value */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(
                  profile.accountBasedPensionBalance +
                    profile.nonSuperInvestments +
                    profile.homeValue +
                    (profile.otherAssets || 0)
                )}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Super Death Benefits</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(profile.accountBasedPensionBalance)}
              </p>
              <p className="text-xs text-gray-500">Tax-free to dependants</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Non-Super Assets</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(profile.homeValue + profile.nonSuperInvestments)}
              </p>
            </div>
          </div>

          {/* Checklist by Category */}
          {Object.entries(groupedItems).map(([category, categoryItems]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const gradientColor = categoryColors[category as keyof typeof categoryColors];
            const bgColor = categoryBgColors[category as keyof typeof categoryBgColors];
            const categoryCompleted = categoryItems.filter((i) => i.status === 'completed').length;

            return (
              <div key={category} className={`p-4 rounded-xl border ${bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${gradientColor} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                  </div>
                  <span className="text-sm text-gray-600">
                    {categoryCompleted}/{categoryItems.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 bg-white rounded-lg border ${
                        item.status === 'completed' ? 'border-green-200' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          {item.priority === 'high' && item.status !== 'completed' && (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Important Notes */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">Super Death Benefit Tax Rules</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Death benefits to dependants (spouse, children under 18) are tax-free</li>
              <li>• Non-dependants pay 15% tax on taxable component + 2% Medicare levy</li>
              <li>• Binding death benefit nominations ensure your wishes are followed</li>
              <li>• Reversionary pension nominations keep funds in super environment</li>
              <li>• Consider testamentary trusts for asset protection of beneficiaries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
