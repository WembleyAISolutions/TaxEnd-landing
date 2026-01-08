/**
 * TrustInfoModal Component
 * 信托信息模态框
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
              <h2 className="text-2xl font-bold text-gray-900">家族信托规划</h2>
              <p className="text-sm text-gray-600">了解信托结构如何帮助优化税务和资产保护</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trust Types */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">常见信托类型</h3>
            <div className="space-y-3">
              <div className="p-4 border border-purple-200 rounded-xl bg-purple-50">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">全权信托 (Discretionary Trust)</h4>
                    <p className="text-sm text-gray-600">
                      受托人有权决定如何分配收入给受益人，最灵活的信托类型
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">单位信托 (Unit Trust)</h4>
                    <p className="text-sm text-gray-600">
                      受益人按持有单位比例获得收入，适合投资合资
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-xl bg-green-50">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">混合信托 (Hybrid Trust)</h4>
                    <p className="text-sm text-gray-600">
                      结合全权信托和单位信托特点，提供更多灵活性
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">主要优势</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">资产保护</h4>
                </div>
                <p className="text-sm text-gray-600">保护资产免受债权人追索</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">收入分配优化</h4>
                </div>
                <p className="text-sm text-gray-600">将收入分配给低税率家庭成员</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">遗产规划</h4>
                </div>
                <p className="text-sm text-gray-600">简化资产传承给下一代</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">CGT优惠</h4>
                </div>
                <p className="text-sm text-gray-600">可能获得50% CGT折扣</p>
              </div>
            </div>
          </section>

          {/* Considerations */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">注意事项</h3>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>设立成本约 $1,500 - $3,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>年度合规成本约 $1,000 - $2,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>需要定期审查和更新</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>ATO密切监控信托分配</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠️</span>
                  <span>需要专业税务建议</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">需要专业建议？</h3>
            <p className="text-sm text-gray-600 mb-4">
              信托设立需要根据个人情况定制，建议咨询专业税务顾问
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
              预约税务顾问
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
