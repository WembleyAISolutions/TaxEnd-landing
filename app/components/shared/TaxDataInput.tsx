'use client';

import React, { useState, useEffect } from 'react';
import { TaxInputData, ValidationError, FormState } from '../../types/australian-tax';

interface TaxDataInputProps {
  initialData?: Partial<TaxInputData>;
  onDataChange: (data: TaxInputData) => void;
  onValidationChange: (isValid: boolean, errors: ValidationError[]) => void;
  className?: string;
}

const DEFAULT_DATA: TaxInputData = {
  grossIncome: 0,
  payg: 0,
  superannuation: 0,
  frankedDividends: 0,
  capitalGains: 0,
  workRelatedDeductions: 0,
  otherDeductions: 0,
  medicareExemption: false,
};

export default function TaxDataInput({ 
  initialData = {}, 
  onDataChange, 
  onValidationChange, 
  className = '' 
}: TaxDataInputProps) {
  const [formData, setFormData] = useState<TaxInputData>({
    ...DEFAULT_DATA,
    ...initialData,
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateForm = (data: TaxInputData): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    if (data.grossIncome < 0) {
      newErrors.push({ field: 'grossIncome', message: 'Gross income cannot be negative' });
    }

    if (data.grossIncome === 0) {
      newErrors.push({ field: 'grossIncome', message: 'Please enter your gross income' });
    }

    if (data.payg && data.payg < 0) {
      newErrors.push({ field: 'payg', message: 'PAYG cannot be negative' });
    }

    if (data.superannuation && data.superannuation < 0) {
      newErrors.push({ field: 'superannuation', message: 'Superannuation cannot be negative' });
    }

    if (data.frankedDividends && data.frankedDividends < 0) {
      newErrors.push({ field: 'frankedDividends', message: 'Franked dividends cannot be negative' });
    }

    if (data.capitalGains && data.capitalGains < 0) {
      newErrors.push({ field: 'capitalGains', message: 'Capital gains cannot be negative' });
    }

    if (data.workRelatedDeductions && data.workRelatedDeductions < 0) {
      newErrors.push({ field: 'workRelatedDeductions', message: 'Work-related deductions cannot be negative' });
    }

    if (data.otherDeductions && data.otherDeductions < 0) {
      newErrors.push({ field: 'otherDeductions', message: 'Other deductions cannot be negative' });
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof TaxInputData, value: number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    const newErrors = validateForm(newData);
    setErrors(newErrors);
    
    onDataChange(newData);
    onValidationChange(newErrors.length === 0, newErrors);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const InputField = ({ 
    label, 
    field, 
    value, 
    placeholder, 
    required = false,
    tooltip 
  }: {
    label: string;
    field: keyof TaxInputData;
    value: number;
    placeholder?: string;
    required?: boolean;
    tooltip?: string;
  }) => {
    const error = getFieldError(field);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <div className="group relative">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id={field}
            value={value || ''}
            onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
            placeholder={placeholder}
            className={`
              block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            `}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {value > 0 && (
          <p className="text-xs text-gray-500">{formatCurrency(value)}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Information</h3>
        <p className="text-sm text-gray-600">Enter your tax details for the current financial year</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Income</h4>
          
          <InputField
            label="Gross Income"
            field="grossIncome"
            value={formData.grossIncome}
            placeholder="80000"
            required
            tooltip="Your total income before tax and deductions"
          />
          
          <InputField
            label="PAYG Tax Withheld"
            field="payg"
            value={formData.payg || 0}
            placeholder="15000"
            tooltip="Tax already withheld from your salary or wages"
          />
          
          <InputField
            label="Superannuation"
            field="superannuation"
            value={formData.superannuation || 0}
            placeholder="7600"
            tooltip="Employer superannuation contributions (usually 11% of salary)"
          />
          
          <InputField
            label="Franked Dividends"
            field="frankedDividends"
            value={formData.frankedDividends || 0}
            placeholder="2000"
            tooltip="Dividends received from Australian companies with franking credits"
          />
          
          <InputField
            label="Capital Gains"
            field="capitalGains"
            value={formData.capitalGains || 0}
            placeholder="5000"
            tooltip="Profit from selling assets like shares or property"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Deductions</h4>
          
          <InputField
            label="Work-Related Deductions"
            field="workRelatedDeductions"
            value={formData.workRelatedDeductions || 0}
            placeholder="3000"
            tooltip="Expenses directly related to earning your income"
          />
          
          <InputField
            label="Other Deductions"
            field="otherDeductions"
            value={formData.otherDeductions || 0}
            placeholder="1000"
            tooltip="Other allowable deductions like donations, investment expenses"
          />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="medicareExemption" className="block text-sm font-medium text-gray-700">
                Medicare Levy Exemption
              </label>
              <div className="group relative">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Check if you qualify for Medicare levy exemption
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="medicareExemption"
                checked={formData.medicareExemption}
                onChange={(e) => handleInputChange('medicareExemption', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="medicareExemption" className="ml-2 text-sm text-gray-700">
                I qualify for Medicare levy exemption
              </label>
            </div>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
