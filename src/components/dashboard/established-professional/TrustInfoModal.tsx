/**
 * TrustInfoModal Component
 * Trust information modal
 */

'use client';

import React from 'react';
import { X, Building2, Shield, Users, TrendingUp, DollarSign } from 'lucide-react';

interface TrustInfoModalProps {
  onClose: () => void;
}

export default function TrustInfoModal({ onClose }: TrustInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Family Trust Planning</h2>
              <p className="text-sm text-gray-600">Learn how trust structures can help optimize tax and asset protection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trust Types */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Common Trust Types</h3>
            <div className="space-y-3">
              <div className="p-4 border border-purple-200 rounded-xl bg-purple-50">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Discretionary Trust</h4>
                    <p className="text-sm text-gray-600">
                      The trustee has discretion in distributing income to beneficiaries - the most flexible trust type
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Unit Trust</h4>
                    <p className="text-sm text-gray-600">
                      Beneficiaries receive income proportional to their unit holdings - suitable for investment joint ventures
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-xl bg-green-50">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hybrid Trust</h4>
                    <p className="text-sm text-gray-600">
                      Combines features of discretionary and unit trusts for greater flexibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Asset Protection</h4>
                </div>
                <p className="text-sm text-gray-600">Protect assets from creditor claims</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Income Distribution Optimization</h4>
                </div>
                <p className="text-sm text-gray-600">Distribute income to lower-taxed family members</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Estate Planning</h4>
                </div>
                <p className="text-sm text-gray-600">Simplify asset transfer to the next generation</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">CGT Benefits</h4>
                </div>
                <p className="text-sm text-gray-600">May qualify for 50% CGT discount</p>
              </div>
            </div>
          </section>

          {/* Considerations */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Important Considerations</h3>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>Setup costs approximately $1,500 - $3,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>Annual compliance costs approximately $1,000 - $2,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>Requires regular review and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>ATO closely monitors trust distributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>Professional tax advice recommended</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Professional Advice?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Trust setup should be tailored to your individual circumstances - consult a professional tax advisor
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
              Book Tax Advisor
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
