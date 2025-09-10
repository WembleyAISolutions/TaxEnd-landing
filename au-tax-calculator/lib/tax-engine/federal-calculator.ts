import {
  FEDERAL_TAX_BRACKETS,
  NON_RESIDENT_TAX_BRACKETS,
  MEDICARE_LEVY,
  MEDICARE_LEVY_SURCHARGE,
  LOW_INCOME_TAX_OFFSET,
  HELP_REPAYMENT_RATES,
  SUPERANNUATION
} from './constants';
import type { TaxCalculationInput, TaxCalculationResult } from '../types/tax-types';

/**
 * Calculate base income tax using progressive tax brackets
 */
export function calculateBaseTax(income: number, isResident: boolean = true): number {
  if (income <= 0) return 0;
  
  const brackets = isResident ? FEDERAL_TAX_BRACKETS : NON_RESIDENT_TAX_BRACKETS;
  
  for (const bracket of brackets) {
    if (income <= bracket.max || bracket.max === Infinity) {
      if (income <= bracket.min) return bracket.base;
      const taxableInBracket = income - bracket.min;
      return bracket.base + (taxableInBracket * bracket.rate);
    }
  }
  
  return 0;
}

/**
 * Calculate Medicare Levy with phase-in for low income earners
 */
export function calculateMedicareLevy(
  income: number,
  familyStatus: 'single' | 'family' = 'single',
  numberOfDependents: number = 0,
  isSenior: boolean = false
): number {
  if (income <= 0) return 0;
  
  // Determine applicable threshold
  let threshold: number;
  if (isSenior) {
    threshold = familyStatus === 'single' 
      ? MEDICARE_LEVY.seniorThreshold
      : MEDICARE_LEVY.seniorFamilyThreshold + (numberOfDependents * MEDICARE_LEVY.additionalDependent);
  } else {
    threshold = familyStatus === 'single'
      ? MEDICARE_LEVY.singleThreshold
      : MEDICARE_LEVY.familyThreshold + (numberOfDependents * MEDICARE_LEVY.additionalDependent);
  }
  
  const phaseInCeiling = threshold * 1.25;
  
  if (income <= threshold) {
    return 0;
  } else if (income <= phaseInCeiling) {
    // Phase-in range: 10% of income above threshold
    const levy = (income - threshold) * MEDICARE_LEVY.phaseInRate;
    // Cap at 2% of income
    return Math.min(levy, income * MEDICARE_LEVY.rate);
  } else {
    // Full 2% rate
    return income * MEDICARE_LEVY.rate;
  }
}

/**
 * Calculate Medicare Levy Surcharge for high earners without private health insurance
 */
export function calculateMedicareLevySurcharge(
  income: number,
  hasPrivateHealthInsurance: boolean = false,
  familyStatus: 'single' | 'family' = 'single'
): number {
  if (hasPrivateHealthInsurance || income <= 0) return 0;
  
  // For families, use combined income (simplified - would need partner's income in real scenario)
  const incomeForMLS = income;
  
  for (const tier of MEDICARE_LEVY_SURCHARGE) {
    if (incomeForMLS <= tier.max || tier.max === Infinity) {
      return incomeForMLS * tier.rate;
    }
  }
  
  return 0;
}

/**
 * Calculate Low Income Tax Offset (LITO)
 */
export function calculateLowIncomeTaxOffset(income: number): number {
  if (income <= 0) return 0;
  
  const { maxOffset, fullOffsetThreshold, phaseOutStart, phaseOutEnd, phaseOutRate } = LOW_INCOME_TAX_OFFSET;
  
  if (income <= fullOffsetThreshold) {
    return maxOffset;
  } else if (income < phaseOutEnd) {
    const reduction = (income - phaseOutStart + 1) * phaseOutRate;
    return Math.max(0, maxOffset - reduction);
  }
  
  return 0;
}

/**
 * Calculate HELP/HECS repayment
 */
export function calculateHelpRepayment(income: number, helpDebt: number): number {
  if (helpDebt <= 0 || income <= 0) return 0;
  
  for (const bracket of HELP_REPAYMENT_RATES) {
    if (income <= bracket.max || bracket.max === Infinity) {
      const repayment = income * bracket.rate;
      // Can't repay more than the debt
      return Math.min(repayment, helpDebt);
    }
  }
  
  return 0;
}

/**
 * Get current marginal tax rate
 */
export function getMarginalRate(income: number, isResident: boolean = true): number {
  if (income <= 0) return 0;
  
  const brackets = isResident ? FEDERAL_TAX_BRACKETS : NON_RESIDENT_TAX_BRACKETS;
  
  for (const bracket of brackets) {
    if (income <= bracket.max || bracket.max === Infinity) {
      return bracket.rate;
    }
  }
  
  return brackets[brackets.length - 1].rate;
}

/**
 * Get tax bracket information
 */
export function getTaxBracketInfo(income: number, isResident: boolean = true): {
  bracketIndex: number;
  currentBracketMax: number;
  nextThreshold: number;
  distanceToNext: number;
} {
  const brackets = isResident ? FEDERAL_TAX_BRACKETS : NON_RESIDENT_TAX_BRACKETS;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (income <= bracket.max || bracket.max === Infinity) {
      const nextThreshold = bracket.max === Infinity ? 0 : bracket.max + 1;
      return {
        bracketIndex: i,
        currentBracketMax: bracket.max,
        nextThreshold,
        distanceToNext: nextThreshold > 0 ? nextThreshold - income : 0
      };
    }
  }
  
  return {
    bracketIndex: brackets.length - 1,
    currentBracketMax: Infinity,
    nextThreshold: 0,
    distanceToNext: 0
  };
}

/**
 * Calculate superannuation tax benefit
 */
export function calculateSuperTaxBenefit(
  contribution: number,
  marginalRate: number
): number {
  if (contribution <= 0) return 0;
  
  // Tax saved = contribution * (marginal rate - super tax rate)
  const superTaxRate = SUPERANNUATION.divisionTaxRate;
  return contribution * Math.max(0, marginalRate - superTaxRate);
}

/**
 * Main comprehensive tax calculation function
 */
export function calculateFederalTax(input: TaxCalculationInput): TaxCalculationResult {
  const {
    annualIncome,
    isResident = true,
    hasPrivateHealthInsurance = false,
    familyStatus = 'single',
    numberOfDependents = 0,
    isSenior = false,
    superContribution = 0,
    salarySacrifice = 0,
    helpDebt = 0,
    workDeductions = 0
  } = input;
  
  // Calculate taxable income
  const totalSuperContribution = superContribution + salarySacrifice;
  const taxableIncome = Math.max(0, annualIncome - salarySacrifice - workDeductions);
  
  // Calculate tax components
  const baseTax = calculateBaseTax(taxableIncome, isResident);
  
  const medicareLevy = isResident
    ? calculateMedicareLevy(taxableIncome, familyStatus, numberOfDependents, isSenior)
    : 0;
  
  const medicareLevySurcharge = isResident
    ? calculateMedicareLevySurcharge(taxableIncome, hasPrivateHealthInsurance, familyStatus)
    : 0;
  
  const lowIncomeTaxOffset = isResident
    ? calculateLowIncomeTaxOffset(taxableIncome)
    : 0;
  
  const helpRepayment = calculateHelpRepayment(taxableIncome, helpDebt || 0);
  
  // Calculate total tax
  const totalTax = Math.max(
    0,
    baseTax + medicareLevy + medicareLevySurcharge - lowIncomeTaxOffset + helpRepayment
  );
  
  // Calculate super tax (15% on concessional contributions)
  const superTax = totalSuperContribution * SUPERANNUATION.divisionTaxRate;
  const totalTaxWithSuper = totalTax + superTax;
  
  // Net income after all taxes
  const netIncome = annualIncome - totalTax - totalSuperContribution;
  const afterSuperIncome = annualIncome - totalSuperContribution;
  
  // Calculate rates
  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) : 0;
  const marginalRate = getMarginalRate(taxableIncome, isResident);
  
  // Calculate take-home pay periods
  const monthlyTakeHome = netIncome / 12;
  const fortnightlyTakeHome = netIncome / 26;
  const weeklyTakeHome = netIncome / 52;
  const dailyTakeHome = netIncome / 365;
  
  // Get bracket info
  const bracketInfo = getTaxBracketInfo(taxableIncome, isResident);
  
  // Calculate super tax benefit
  const superTaxSaving = calculateSuperTaxBenefit(totalSuperContribution, marginalRate);
  
  return {
    grossIncome: annualIncome,
    taxableIncome,
    baseTax,
    medicareLevy,
    medicareLevySurcharge,
    lowIncomeTaxOffset,
    helpRepayment,
    totalTax,
    totalTaxWithSuper,
    netIncome,
    effectiveRate,
    marginalRate,
    monthlyTakeHome,
    fortnightlyTakeHome,
    weeklyTakeHome,
    dailyTakeHome,
    taxBracket: bracketInfo.bracketIndex,
    nextBracketThreshold: bracketInfo.nextThreshold,
    distanceToNextBracket: bracketInfo.distanceToNext,
    superannuationContribution: totalSuperContribution,
    afterSuperIncome,
    superTaxSaving
  };
}
