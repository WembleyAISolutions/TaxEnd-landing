/**
 * Australian Federal Tax Calculator
 * Implements 2024-25 tax brackets and calculations
 */

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseAmount: number;
}

export interface FederalTaxResult {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  marginalRate: number;
  averageRate: number;
  taxFreeThreshold: number;
  breakdown: TaxBracketBreakdown[];
}

export interface TaxBracketBreakdown {
  bracket: TaxBracket;
  taxableAmount: number;
  taxAmount: number;
}

// 2024-25 Australian Federal Tax Brackets
export const TAX_BRACKETS_2024_25: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, baseAmount: 0 },
  { min: 18201, max: 45000, rate: 0.19, baseAmount: 0 },
  { min: 45001, max: 120000, rate: 0.325, baseAmount: 5092 },
  { min: 120001, max: 180000, rate: 0.37, baseAmount: 29467 },
  { min: 180001, max: null, rate: 0.45, baseAmount: 51667 }
];

export class FederalTaxCalculator {
  private taxBrackets: TaxBracket[];

  constructor(taxYear: string = '2024-25') {
    this.taxBrackets = TAX_BRACKETS_2024_25;
  }

  /**
   * Calculate federal tax for given taxable income
   */
  calculateFederalTax(taxableIncome: number): FederalTaxResult {
    if (taxableIncome < 0) {
      throw new Error('Taxable income cannot be negative');
    }

    const breakdown: TaxBracketBreakdown[] = [];
    let totalTax = 0;
    let marginalRate = 0;

    for (const bracket of this.taxBrackets) {
      if (taxableIncome <= bracket.min) break;

      const maxIncome = bracket.max || Infinity;
      const taxableInBracket = Math.min(taxableIncome, maxIncome) - bracket.min + 1;
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate;
        totalTax += taxInBracket;
        marginalRate = bracket.rate;

        breakdown.push({
          bracket,
          taxableAmount: taxableInBracket,
          taxAmount: taxInBracket
        });
      }
    }

    // Add base amounts for higher brackets
    for (const bracket of this.taxBrackets) {
      if (taxableIncome > bracket.min && bracket.baseAmount > 0) {
        totalTax += bracket.baseAmount;
        break;
      }
    }

    const averageRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;

    return {
      grossIncome: taxableIncome,
      taxableIncome,
      federalTax: Math.round(totalTax * 100) / 100,
      marginalRate,
      averageRate: Math.round(averageRate * 10000) / 100, // Convert to percentage
      taxFreeThreshold: 18200,
      breakdown
    };
  }

  /**
   * Get marginal tax rate for given income
   */
  getMarginalRate(taxableIncome: number): number {
    for (const bracket of this.taxBrackets) {
      const maxIncome = bracket.max || Infinity;
      if (taxableIncome >= bracket.min && taxableIncome <= maxIncome) {
        return bracket.rate;
      }
    }
    return 0;
  }

  /**
   * Calculate tax on additional income (marginal calculation)
   */
  calculateMarginalTax(currentIncome: number, additionalIncome: number): number {
    const currentTax = this.calculateFederalTax(currentIncome).federalTax;
    const newTax = this.calculateFederalTax(currentIncome + additionalIncome).federalTax;
    return newTax - currentTax;
  }

  /**
   * Get all tax brackets
   */
  getTaxBrackets(): TaxBracket[] {
    return [...this.taxBrackets];
  }
}

export default FederalTaxCalculator;
