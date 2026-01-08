/**
 * TaxEnd - Tax Calculation Utilities
 * 税务计算工具库
 * 
 * 包含澳洲税务计算的核心逻辑
 */

import {
  TAX_BRACKETS_2024_25,
  MEDICARE_LEVY_RATE,
  SUPER_LIMITS_2024_25,
  SUPERANNUATION_GUARANTEE_RATE,
  SuperContributionCalculation,
  CGTEvent,
  TaxBracket,
} from '@/src/types/established-professional';

/**
 * 计算年度应税收入的税款
 * @param income 年收入
 * @returns 预估税款（包括Medicare Levy）
 */
export function calculateIncomeTax(income: number): number {
  let tax = 0;

  // Find applicable tax bracket
  for (const bracket of TAX_BRACKETS_2024_25) {
    if (income > bracket.min) {
      if (bracket.max === null || income <= bracket.max) {
        // Income falls in this bracket
        tax = bracket.baseTax + (income - bracket.min) * bracket.rate;
        break;
      }
    }
  }

  // Add Medicare Levy (2%)
  const medicareLevy = income * MEDICARE_LEVY_RATE;

  return tax + medicareLevy;
}

/**
 * 获取边际税率
 * @param income 年收入
 * @returns 边际税率（小数形式）
 */
export function getMarginalTaxRate(income: number): number {
  for (const bracket of TAX_BRACKETS_2024_25) {
    if (bracket.max === null) {
      if (income >= bracket.min) {
        return bracket.rate;
      }
    } else if (income >= bracket.min && income <= bracket.max) {
      return bracket.rate;
    }
  }
  return 0;
}

/**
 * 计算Super供款策略
 * @param params 计算参数
 * @returns Super供款计算结果
 */
export function calculateSuperContribution(params: {
  currentBalance: number;
  annualIncome: number;
  additionalConcessional: number;
  additionalNonConcessional: number;
}): SuperContributionCalculation {
  const {
    currentBalance,
    annualIncome,
    additionalConcessional,
    additionalNonConcessional,
  } = params;

  // Calculate employer contribution (11.5% SG rate)
  const employerContribution = annualIncome * SUPERANNUATION_GUARANTEE_RATE;

  // Total concessional contributions
  const totalConcessional = Math.min(
    employerContribution + additionalConcessional,
    SUPER_LIMITS_2024_25.concessionalCap
  );

  // Total non-concessional contributions
  const totalNonConcessional = Math.min(
    additionalNonConcessional,
    SUPER_LIMITS_2024_25.nonConcessionalCap
  );

  // Calculate tax saved on concessional contributions
  // (Marginal rate - 15% super contribution tax)
  const marginalRate = getMarginalTaxRate(annualIncome);
  const superTaxRate = 0.15;
  const taxSaved = additionalConcessional * (marginalRate - superTaxRate);

  // Project retirement balance (simple 7% annual return over 10 years)
  const yearsToRetirement = 10;
  const annualReturn = 0.07;
  const totalContributions = totalConcessional + totalNonConcessional;
  const projectedBalance =
    (currentBalance + totalContributions) * Math.pow(1 + annualReturn, yearsToRetirement);

  return {
    currentBalance,
    annualIncome,
    concessionalContribution: totalConcessional,
    nonConcessionalContribution: totalNonConcessional,
    employerContribution,
    taxSaved,
    projectedRetirementBalance: projectedBalance,
  };
}

/**
 * 计算CGT（资本利得税）
 * @param event CGT事件
 * @param annualIncome 年收入（用于确定边际税率）
 * @returns 更新后的CGT事件（包含计算结果）
 */
export function calculateCGT(event: Omit<CGTEvent, 'capitalGain' | 'taxableGain' | 'estimatedTax'>, annualIncome: number): CGTEvent {
  const { acquisitionDate, disposalDate, costBase, saleProceeds } = event;

  // Calculate capital gain
  const capitalGain = saleProceeds - costBase;

  if (capitalGain <= 0) {
    return {
      ...event,
      capitalGain: 0,
      taxableGain: 0,
      estimatedTax: 0,
      discountApplied: false,
    };
  }

  // Check if eligible for CGT discount (held > 12 months)
  const holdingPeriodDays = Math.floor(
    (disposalDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const eligibleForDiscount = holdingPeriodDays >= 365;

  // Apply 50% CGT discount if eligible
  const taxableGain = eligibleForDiscount ? capitalGain * 0.5 : capitalGain;

  // Calculate tax at marginal rate
  const marginalRate = getMarginalTaxRate(annualIncome);
  const estimatedTax = taxableGain * marginalRate;

  return {
    ...event,
    capitalGain,
    taxableGain,
    estimatedTax,
    discountApplied: eligibleForDiscount,
  };
}

/**
 * 计算持有期（天数）
 * @param acquisitionDate 购入日期
 * @param disposalDate 出售日期
 * @returns 持有天数
 */
export function calculateHoldingPeriod(acquisitionDate: Date, disposalDate: Date): number {
  return Math.floor(
    (disposalDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * 检查是否符合CGT折扣条件
 * @param acquisitionDate 购入日期
 * @param disposalDate 出售日期
 * @returns 是否符合50% CGT折扣
 */
export function isEligibleForCGTDiscount(acquisitionDate: Date, disposalDate: Date): boolean {
  return calculateHoldingPeriod(acquisitionDate, disposalDate) >= 365;
}

/**
 * 格式化货币
 * @param amount 金额
 * @param showCents 是否显示分
 * @returns 格式化的货币字符串
 */
export function formatCurrency(amount: number, showCents: boolean = false): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/**
 * 格式化百分比
 * @param value 值（小数形式）
 * @param decimals 小数位数
 * @returns 格式化的百分比字符串
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 计算净值
 * @param assets 资产明细
 * @returns 总净值
 */
export function calculateNetWorth(assets: {
  superBalance: number;
  investmentPortfolio: number;
  propertyValue: number;
  otherAssets?: number;
}): number {
  return (
    assets.superBalance +
    assets.investmentPortfolio +
    assets.propertyValue +
    (assets.otherAssets || 0)
  );
}

/**
 * 估算退休时的Super余额
 * @param params 计算参数
 * @returns 预估余额
 */
export function estimateRetirementSuper(params: {
  currentBalance: number;
  annualContribution: number;
  yearsToRetirement: number;
  annualReturn?: number;
}): number {
  const {
    currentBalance,
    annualContribution,
    yearsToRetirement,
    annualReturn = 0.07, // Default 7% return
  } = params;

  // Future value of current balance
  const futureValueOfBalance = currentBalance * Math.pow(1 + annualReturn, yearsToRetirement);

  // Future value of annual contributions (annuity)
  const futureValueOfContributions =
    annualContribution * ((Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn);

  return futureValueOfBalance + futureValueOfContributions;
}

/**
 * 计算实际税率（Effective Tax Rate）
 * @param income 年收入
 * @returns 实际税率
 */
export function calculateEffectiveTaxRate(income: number): number {
  if (income === 0) return 0;
  const totalTax = calculateIncomeTax(income);
  return totalTax / income;
}

/**
 * 验证Super供款是否超过限额
 * @param concessional 优惠性供款
 * @param nonConcessional 非优惠性供款
 * @returns 验证结果
 */
export function validateSuperContributions(
  concessional: number,
  nonConcessional: number
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (concessional > SUPER_LIMITS_2024_25.concessionalCap) {
    errors.push(
      `优惠性供款超过年度限额 ${formatCurrency(SUPER_LIMITS_2024_25.concessionalCap)}`
    );
  }

  if (nonConcessional > SUPER_LIMITS_2024_25.nonConcessionalCap) {
    errors.push(
      `非优惠性供款超过年度限额 ${formatCurrency(SUPER_LIMITS_2024_25.nonConcessionalCap)}`
    );
  }

  if (concessional > SUPER_LIMITS_2024_25.concessionalCap * 0.8) {
    warnings.push('接近优惠性供款限额，请注意雇主供款');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 计算家族信托的潜在税务节省
 * @param familyIncome 家庭总收入
 * @param numberOfBeneficiaries 受益人数量
 * @returns 估算的年度节税
 */
export function estimateTrustTaxSavings(
  familyIncome: number,
  numberOfBeneficiaries: number
): number {
  // Simplified calculation: compare single high earner vs distributed income
  const singleTax = calculateIncomeTax(familyIncome);

  // Distribute income evenly among beneficiaries
  const distributedIncome = familyIncome / numberOfBeneficiaries;
  const distributedTax = calculateIncomeTax(distributedIncome) * numberOfBeneficiaries;

  return Math.max(0, singleTax - distributedTax);
}
