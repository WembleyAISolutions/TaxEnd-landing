/**
 * Australian Federal Tax Constants for 2024-25 Financial Year
 * Source: Australian Taxation Office (ATO)
 * Last Updated: January 2025
 */

export const TAX_YEAR = '2024-25';

// Federal Income Tax Brackets for Residents
export const FEDERAL_TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 }
] as const;

// Non-Resident Tax Rates
export const NON_RESIDENT_TAX_BRACKETS = [
  { min: 0, max: 120000, rate: 0.325, base: 0 },
  { min: 120001, max: 180000, rate: 0.37, base: 39000 },
  { min: 180001, max: Infinity, rate: 0.45, base: 61200 }
] as const;

// Medicare Levy
export const MEDICARE_LEVY = {
  rate: 0.02,
  singleThreshold: 29207,
  familyThreshold: 49304,
  additionalDependent: 4544,
  seniorThreshold: 46361,
  seniorFamilyThreshold: 65010,
  phaseInRate: 0.1,
  phaseInCeiling: 36581
} as const;

// Medicare Levy Surcharge (MLS)
export const MEDICARE_LEVY_SURCHARGE = [
  { min: 0, max: 97000, rate: 0, tier: 'Base' },
  { min: 97001, max: 129333, rate: 0.01, tier: 'Tier 1' },
  { min: 129334, max: 161666, rate: 0.0125, tier: 'Tier 2' },
  { min: 161667, max: Infinity, rate: 0.015, tier: 'Tier 3' }
] as const;

// Low Income Tax Offset (LITO)
export const LOW_INCOME_TAX_OFFSET = {
  maxOffset: 700,
  fullOffsetThreshold: 37500,
  phaseOutStart: 37501,
  phaseOutEnd: 45000,
  phaseOutRate: 0.05,
  minOffset: 325
} as const;

// Superannuation
export const SUPERANNUATION = {
  guaranteeRate: 0.115,
  concessionalCap: {
    standard: 27500,
    catchUp: 30000
  },
  nonConcessionalCap: 110000,
  divisionTaxRate: 0.15,
  excessTaxRate: 0.47
} as const;

// HELP/HECS Repayment Thresholds 2024-25
export const HELP_REPAYMENT_RATES = [
  { min: 0, max: 54434, rate: 0 },
  { min: 54435, max: 62850, rate: 0.01 },
  { min: 62851, max: 66620, rate: 0.02 },
  { min: 66621, max: 70618, rate: 0.025 },
  { min: 70619, max: 74855, rate: 0.03 },
  { min: 74856, max: 79346, rate: 0.035 },
  { min: 79347, max: 84107, rate: 0.04 },
  { min: 84108, max: 89154, rate: 0.045 },
  { min: 89155, max: 94503, rate: 0.05 },
  { min: 94504, max: 100174, rate: 0.055 },
  { min: 100175, max: 106185, rate: 0.06 },
  { min: 106186, max: 112556, rate: 0.065 },
  { min: 112557, max: 119309, rate: 0.07 },
  { min: 119310, max: 126467, rate: 0.075 },
  { min: 126468, max: 134056, rate: 0.08 },
  { min: 134057, max: 142100, rate: 0.085 },
  { min: 142101, max: 150626, rate: 0.09 },
  { min: 150627, max: 159663, rate: 0.095 },
  { min: 159664, max: Infinity, rate: 0.10 }
] as const;
