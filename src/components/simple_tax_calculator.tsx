import React, { useState } from 'react';
import { Calculator, DollarSign, FileText, TrendingUp, Info, Globe, Users } from 'lucide-react';

const AustralianTaxCalculator = () => {
  const [language, setLanguage] = useState('en');
  const [residencyStatus, setResidencyStatus] = useState('resident');
  
  const [income, setIncome] = useState({
    salary: 0,
    investment: 0,
    rental: 0,
    capitalGains: 0,
    foreignIncome: 0
  });

  const [deductions, setDeductions] = useState({
    workExpenses: 0,
    investmentExpenses: 0,
    donations: 0
  });

  const [superannuation, setSuperannuation] = useState({
    employerContributions: 0,
    personalDeductible: 0,
    selfEmployed: false
  });

  const [personalInfo, setPersonalInfo] = useState({
    hasPrivateHealth: false,
    hasHECS: false
  });

  // 翻译对象
  const translations = {
    en: {
      title: "Australian Personal Income Tax Calculator 2024-25",
      income: "Income",
      deductions: "Deductions",
      superannuation: "Superannuation",
      taxCalculation: "Tax Calculation",
      salaryWages: "Salary & Wages",
      investmentIncome: "Investment Income",
      totalIncome: "Total Income",
      taxableIncome: "Taxable Income",
      totalTax: "Total Tax",
      afterTaxIncome: "After-tax Income",
      effectiveRate: "Effective Tax Rate",
      resident: "Australian Tax Resident",
      nonResident: "Non-resident",
      workingHoliday: "Working Holiday Maker"
    },
    zh: {
      title: "澳洲个人所得税计算器 2024-25",
      income: "收入",
      deductions: "扣除项目",
      superannuation: "养老金",
      taxCalculation: "税务计算",
      salaryWages: "工资薪金",
      investmentIncome: "投资收入",
      totalIncome: "总收入",
      taxableIncome: "应税收入",
      totalTax: "总税额",
      afterTaxIncome: "税后收入",
      effectiveRate: "有效税率",
      resident: "澳洲税务居民",
      nonResident: "非税务居民",
      workingHoliday: "打工度假签证"
    }
  };

  const t = translations[language] || translations.en;

  // 税率计算
  const calculateTax = () => {
    const totalIncome = Object.values(income).reduce((sum, val) => sum + Number(val), 0);
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + Number(val), 0);
    const superDeductions = Number(superannuation.personalDeductible);
    
    const taxableIncome = Math.max(0, totalIncome - totalDeductions - superDeductions);

    // 根据居住身份选择税率
    let taxBrackets = [];
    if (residencyStatus === 'resident') {
      taxBrackets = [
        { min: 0, max: 18200, rate: 0 },
        { min: 18201, max: 45000, rate: 0.19 },
        { min: 45001, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: Infinity, rate: 0.45 }
      ];
    } else if (residencyStatus === 'working-holiday') {
      taxBrackets = [
        { min: 0, max: 45000, rate: 0.15 },
        { min: 45001, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: Infinity, rate: 0.45 }
      ];
    } else {
      taxBrackets = [
        { min: 0, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: Infinity, rate: 0.45 }
      ];
    }

    let incomeTax = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
        incomeTax += taxableInBracket * bracket.rate;
      }
    }

    // Medicare Levy (仅居民)
    const medicareLevy = (residencyStatus === 'resident' && taxableIncome > 23226) ? taxableIncome * 0.02 : 0;
    
    // Medicare Levy Surcharge (仅居民且无私保)
    let medicareLevySurcharge = 0;
    if (residencyStatus === 'resident' && !personalInfo.hasPrivateHealth && taxableIncome > 93000) {
      if (taxableIncome <= 108000) medicareLevySurcharge = taxableIncome * 0.01;
      else if (taxableIncome <= 144000) medicareLevySurcharge = taxableIncome * 0.0125;
      else medicareLevySurcharge = taxableIncome * 0.015;
    }

    // HECS还款
    let hecsRepayment = 0;
    if (personalInfo.hasHECS && taxableIncome > 51550) {
      const hecsRate = taxableIncome <= 59518 ? 0.01 : taxableIncome <= 63089 ? 0.02 : 0.025;
      hecsRepayment = taxableIncome * hecsRate;
    }

    // 雇主养老金
    const employerSuper = superannuation.selfEmployed ? 0 : Number(income.salary) * 0.11;

    const totalTax = incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment;
    const afterTaxIncome = taxableIncome - totalTax;
    const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

    return {
      totalIncome,
      totalDeductions,
      superDeductions,
      taxableIncome,
      incomeTax,
      medicareLevy,
      medicareLevySurcharge,
      hecsRepayment,
      totalTax,
      afterTaxIncome,
      effectiveRate,
      employerSuper
    };
  };

  const results = calculateTax();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">TaxEnd.AI</h1>
          </div>
          <p className="text-gray-600 text-lg">{t.title}</p>
          
          <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <select 
                value={residencyStatus} 
                onChange={(e) => setResidencyStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="resident">{t.resident}</option>
                <option value="non-resident">{t.nonResident}</option>
                <option value="working-holiday">{t.workingHoliday}</option>
              </select>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 收入部分 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">{t.income}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.salaryWages}
                </label>
                <input
                  type="number"
                  value={income.salary}
                  onChange={(e) => setIncome(prev => ({...prev, salary: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.investmentIncome}
                </label>
                <input
                  type="number"
                  value={income.investment}
                  onChange={(e) => setIncome(prev => ({...prev, investment: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Income
                </label>
                <input
                  type="number"
                  value={income.rental}
                  onChange={(e) => setIncome(prev => ({...prev, rental: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              {residencyStatus === 'resident' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foreign Income
                  </label>
                  <input
                    type="number"
                    value={income.foreignIncome}
                    onChange={(e) => setIncome(prev => ({...prev, foreignIncome: Number(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 扣除部分 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold">{t.deductions}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Expenses
                </label>
                <input
                  type="number"
                  value={deductions.workExpenses}
                  onChange={(e) => setDeductions(prev => ({...prev, workExpenses: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Expenses
                </label>
                <input
                  type="number"
                  value={deductions.investmentExpenses}
                  onChange={(e) => setDeductions(prev => ({...prev, investmentExpenses: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donations
                </label>
                <input
                  type="number"
                  value={deductions.donations}
                  onChange={(e) => setDeductions(prev => ({...prev, donations: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              {residencyStatus === 'resident' && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="privateHealth"
                      checked={personalInfo.hasPrivateHealth}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, hasPrivateHealth: e.target.checked}))}
                      className="mr-2"
                    />
                    <label htmlFor="privateHealth" className="text-sm">
                      Private Health Insurance
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hecs"
                      checked={personalInfo.hasHECS}
                      onChange={(e) => setPersonalInfo(prev => ({...prev, hasHECS: e.target.checked}))}
                      className="mr-2"
                    />
                    <label htmlFor="hecs" className="text-sm">
                      HECS-HELP Debt
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 养老金部分 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">{t.superannuation}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Deductible
                </label>
                <input
                  type="number"
                  value={superannuation.personalDeductible}
                  onChange={(e) => setSuperannuation(prev => ({...prev, personalDeductible: Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selfEmployed"
                  checked={superannuation.selfEmployed}
                  onChange={(e) => setSuperannuation(prev => ({...prev, selfEmployed: e.target.checked}))}
                  className="mr-2"
                />
                <label htmlFor="selfEmployed" className="text-sm">
                  Self-employed
                </label>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Employer Super:</strong> {formatCurrency(results.employerSuper)}
                </p>
              </div>
            </div>
          </div>

          {/* 计算结果 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">{t.taxCalculation}</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">{t.totalIncome}</span>
                <span className="font-medium">{formatCurrency(results.totalIncome)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Total Deductions</span>
                <span className="font-medium text-orange-600">-{formatCurrency(results.totalDeductions)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b font-semibold">
                <span>{t.taxableIncome}</span>
                <span>{formatCurrency(results.taxableIncome)}</span>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Income Tax</span>
                  <span className="text-red-600">{formatCurrency(results.incomeTax)}</span>
                </div>
                
                {results.medicareLevy > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Medicare Levy</span>
                    <span className="text-red-600">{formatCurrency(results.medicareLevy)}</span>
                  </div>
                )}
                
                {results.medicareLevySurcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Medicare Levy Surcharge</span>
                    <span className="text-red-600">{formatCurrency(results.medicareLevySurcharge)}</span>
                  </div>
                )}
                
                {results.hecsRepayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>HECS Repayment</span>
                    <span className="text-red-600">{formatCurrency(results.hecsRepayment)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center py-3 border-t font-bold text-lg">
                <span>{t.totalTax}</span>
                <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3 font-bold">
                <span className="text-green-800">{t.afterTaxIncome}</span>
                <span className="text-green-800">{formatCurrency(results.afterTaxIncome)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">{t.effectiveRate}</span>
                <span className="text-sm font-medium">{results.effectiveRate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">
                  This calculator provides estimates based on 2024-25 tax rates. Consult a tax professional for accurate advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AustralianTaxCalculator;
