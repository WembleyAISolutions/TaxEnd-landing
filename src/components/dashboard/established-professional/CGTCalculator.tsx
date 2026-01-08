/**
 * CGTCalculator Component
 * CGT计算器模态框
 */

'use client';

import React, { useState } from 'react';
import { EstablishedProfessionalProfile, CGTEvent, CGTAssetType } from '@/src/types/established-professional';
import { calculateCGT, formatCurrency, calculateHoldingPeriod } from '@/src/lib/tax-calculations';
import { X, BarChart3, TrendingUp } from 'lucide-react';

interface CGTCalculatorProps {
  profile: EstablishedProfessionalProfile;
  onClose: () => void;
  onAddEvent: (event: CGTEvent) => void;
}

const assetTypes: { value: CGTAssetType; label: string }[] = [
  { value: 'shares', label: '股票' },
  { value: 'property', label: '房产' },
  { value: 'cryptocurrency', label: '加密货币' },
  { value: 'collectibles', label: '收藏品' },
  { value: 'businessAssets', label: '商业资产' },
  { value: 'other', label: '其他' },
];

export default function CGTCalculator({ profile, onClose, onAddEvent }: CGTCalculatorProps) {
  const [assetType, setAssetType] = useState<CGTAssetType>('shares');
  const [assetName, setAssetName] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(
    new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [disposalDate, setDisposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [costBase, setCostBase] = useState('100000');
  const [saleProceeds, setSaleProceeds] = useState('150000');
  const [result, setResult] = useState<CGTEvent | null>(null);

const handleCalculate = () => {
  const holdingPeriod = calculateHoldingPeriod(
    new Date(acquisitionDate),
    new Date(disposalDate)
  );
  const eligibleForDiscount = holdingPeriod >= 365;
  
  const event = calculateCGT(
    {
      id: Date.now().toString(),
      assetType,
      assetName: assetName || assetTypes.find(t => t.value === assetType)?.label || '资产',
      acquisitionDate: new Date(acquisitionDate),
      disposalDate: new Date(disposalDate),
      costBase: parseFloat(costBase) || 0,
      saleProceeds: parseFloat(saleProceeds) || 0,
      discountApplied: eligibleForDiscount,
    },
    profile.annualIncome
  );
  setResult(event);
};

  const holdingPeriod = calculateHoldingPeriod(
    new Date(acquisitionDate),
    new Date(disposalDate)
  );
  const eligibleForDiscount = holdingPeriod >= 365;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">CGT计算器</h2>
              <p className="text-sm text-gray-600">计算资本利得税义务</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">资产类型</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as CGTAssetType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {assetTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">资产名称 (可选)</label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如: BHP股票"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">购入日期</label>
                <input
                  type="date"
                  value={acquisitionDate}
                  onChange={(e) => setAcquisitionDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出售日期</label>
                <input
                  type="date"
                  value={disposalDate}
                  onChange={(e) => setDisposalDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">成本基础</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={costBase}
                    onChange={(e) => setCostBase(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">出售所得</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={saleProceeds}
                    onChange={(e) => setSaleProceeds(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>

            {/* Discount Eligibility */}
            <div
              className={`p-4 rounded-xl border ${
                eligibleForDiscount
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{eligibleForDiscount ? '✅' : '⚠️'}</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {eligibleForDiscount ? '符合50% CGT折扣' : '不符合CGT折扣'}
                  </p>
                  <p className="text-sm text-gray-600">
                    持有期: {holdingPeriod}天 (需≥365天)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            计算CGT
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">CGT计算结果</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">资本收益</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.capitalGain)}
                  </p>
                </div>

                {result.discountApplied && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">50%折扣后</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(result.taxableGain)}
                    </p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">💰 应缴CGT</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.estimatedTax)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-2">💡 提示</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 考虑用资本损失抵消资本收益</li>
                  <li>• Super内的CGT税率更优惠</li>
                  <li>• 持有资产超过12个月可享受50%折扣</li>
                  <li>• 咨询税务顾问了解更多策略</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
