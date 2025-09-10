'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Calculator, User, Heart, GraduationCap, Briefcase, HelpCircle, DollarSign } from 'lucide-react';
import type { TaxCalculationInput } from '../../lib/types/tax-types';

interface InputFormProps {
  input: TaxCalculationInput;
  onChange: (input: TaxCalculationInput) => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

export default function InputForm({ input, onChange, onCalculate, isCalculating = false }: InputFormProps) {
  // Add a separate state to manage input display value
  const [incomeInputValue, setIncomeInputValue] = useState<string>('');

  const handleInputChange = (field: keyof TaxCalculationInput, value: any) => {
    onChange({
      ...input,
      [field]: value
    });
  };

  const handleNumberChange = (field: keyof TaxCalculationInput, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Income Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Income Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income" className="flex items-center gap-2">
                Annual Income
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your total gross annual income before tax</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="income"
                  type="number"
                  value={incomeInputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIncomeInputValue(value);
                    handleInputChange('annualIncome', parseFloat(value) || 0);
                  }}
                  onFocus={(e) => {
                    // When focused, if value is 0, clear the input
                    if (e.target.value === '0') {
                      setIncomeInputValue('');
                    }
                  }}
                  onBlur={(e) => {
                    // When unfocused, if empty, set to 0
                    if (e.target.value === '') {
                      setIncomeInputValue('0');
                    }
                  }}
                  className="pl-10"
                  placeholder="85000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residency">Residency Status *</Label>
              <select
                id="residency"
                value={input.isResident ? 'resident' : 'non-resident'}
                onChange={(e) => handleInputChange('isResident', e.target.value === 'resident')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="resident">Australian Resident</option>
                <option value="non-resident">Non-resident</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workDeductions">Work-related Deductions</Label>
              <Input
                id="workDeductions"
                type="number"
                value={input.workDeductions || ''}
                onChange={(e) => handleNumberChange('workDeductions', e.target.value)}
                placeholder="0"
                min="0"
                step="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={input.age || ''}
                onChange={(e) => handleNumberChange('age', e.target.value)}
                placeholder="Enter your age"
                min="0"
                max="120"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family & Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Family & Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="familyStatus">Family Status</Label>
              <select
                id="familyStatus"
                value={input.familyStatus || 'single'}
                onChange={(e) => handleInputChange('familyStatus', e.target.value as 'single' | 'family')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfDependents">Number of Dependents</Label>
              <Input
                id="numberOfDependents"
                type="number"
                value={input.numberOfDependents || ''}
                onChange={(e) => handleNumberChange('numberOfDependents', e.target.value)}
                placeholder="0"
                min="0"
                max="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Private Health Insurance
              </Label>
              <select
                value={input.hasPrivateHealthInsurance ? 'yes' : 'no'}
                onChange={(e) => handleInputChange('hasPrivateHealthInsurance', e.target.value === 'yes')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Senior/Pensioner Status</Label>
              <select
                value={input.isSenior ? 'yes' : 'no'}
                onChange={(e) => handleInputChange('isSenior', e.target.value === 'yes')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Superannuation & HELP Debt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Superannuation & Debts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="superContribution">Voluntary Super Contributions</Label>
              <Input
                id="superContribution"
                type="number"
                value={input.superContribution || ''}
                onChange={(e) => handleNumberChange('superContribution', e.target.value)}
                placeholder="0"
                min="0"
                max="27500"
                step="500"
              />
              <p className="text-xs text-gray-500">Annual concessional cap: $27,500</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salarySacrifice">Salary Sacrifice</Label>
              <Input
                id="salarySacrifice"
                type="number"
                value={input.salarySacrifice || ''}
                onChange={(e) => handleNumberChange('salarySacrifice', e.target.value)}
                placeholder="0"
                min="0"
                step="500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="helpDebt" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              HELP/HECS Debt
            </Label>
            <Input
              id="helpDebt"
              type="number"
              value={input.helpDebt || ''}
              onChange={(e) => handleNumberChange('helpDebt', e.target.value)}
              placeholder="0"
              min="0"
              step="1000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button 
        onClick={onCalculate} 
        className="w-full" 
        size="lg"
        disabled={isCalculating || !input.annualIncome || input.annualIncome <= 0}
      >
        {isCalculating ? 'Calculating...' : 'Calculate Tax'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          * Required fields. All calculations are estimates based on 2024-25 tax rates.
        </p>
      </div>
    </div>
  );
}
