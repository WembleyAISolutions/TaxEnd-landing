// app/lib/tax-calculations/australian-calculator.ts
import { TaxInputData, TaxCalculationResult, AgeGroup } from '../../types/australian-tax';

// Australian tax brackets for 2024-25 financial year
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, offset: 0 },
  { min: 18201, max: 45000, rate: 0.19, offset: 0 },
  { min: 45001, max: 120000, rate: 0.325, offset: 5092 },
  { min: 120001, max: 180000, rate: 0.37, offset: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, offset: 51667 }
];

// Medicare levy rate
const MEDICARE_LEVY_RATE = 0.02;
const MEDICARE_LEVY_THRESHOLD = 29207; // Single person threshold 2024-25

// Low income tax offset
const LITO_MAX = 700;
const LITO_THRESHOLD = 37500;
const LITO_PHASE_OUT = 66667;

export class AustralianTaxCalculator {
  static calculateTax(inputData: TaxInputData, ageGroup?: AgeGroup): TaxCalculationResult {
    // Calculate taxable income
    const totalDeductions = (inputData.workRelatedDeductions || 0) + (inputData.otherDeductions || 0);
    const taxableIncome = Math.max(0, inputData.grossIncome - totalDeductions);

    // Calculate income tax
    const incomeTax = this.calculateIncomeTax(taxableIncome);
    
    // Calculate Medicare levy
    const medicareLevy = inputData.medicareExemption ? 0 : this.calculateMedicareLevy(taxableIncome);
    
    // Calculate total tax
    const totalTax = incomeTax + medicareLevy;
    
    // Calculate net income
    const netIncome = inputData.grossIncome - totalTax;
    
    // Calculate effective tax rate
    const effectiveTaxRate = inputData.grossIncome > 0 ? (totalTax / inputData.grossIncome) * 100 : 0;
    
    // Calculate marginal tax rate
    const marginalTaxRate = this.getMarginalTaxRate(taxableIncome);
    
    // Calculate estimated refund/owing
    const estimatedRefund = (inputData.payg || 0) - totalTax;
    
    // Generate recommendations based on age group and tax situation
    const recommendations = this.generateRecommendations(inputData, ageGroup, {
      taxableIncome,
      totalTax,
      effectiveTaxRate,
      estimatedRefund
    });

    return {
      grossIncome: inputData.grossIncome,
      taxableIncome,
      payg: incomeTax,
      medicareLevy,
      superannuation: inputData.superannuation || 0,
      frankedDividends: inputData.frankedDividends || 0,
      capitalGains: inputData.capitalGains || 0,
      estimatedRefund,
      totalDeductions,
      netIncome,
      effectiveTaxRate,
      marginalTaxRate,
      recommendations
    };
  }

  private static calculateIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;

    let tax = 0;
    
    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
        tax = bracket.offset + (taxableInBracket * bracket.rate);
      }
    }

    // Apply Low Income Tax Offset (LITO)
    const lito = this.calculateLITO(taxableIncome);
    tax = Math.max(0, tax - lito);

    return Math.round(tax);
  }

  private static calculateLITO(taxableIncome: number): number {
    if (taxableIncome <= LITO_THRESHOLD) {
      return LITO_MAX;
    } else if (taxableIncome <= LITO_PHASE_OUT) {
      const reduction = (taxableIncome - LITO_THRESHOLD) * 0.05;
      return Math.max(0, LITO_MAX - reduction);
    }
    return 0;
  }

  private static calculateMedicareLevy(taxableIncome: number): number {
    if (taxableIncome <= MEDICARE_LEVY_THRESHOLD) {
      return 0;
    }
    
    // Simplified calculation - in reality there are phase-in thresholds
    return Math.round(taxableIncome * MEDICARE_LEVY_RATE);
  }

  private static getMarginalTaxRate(taxableIncome: number): number {
    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
        return bracket.rate * 100;
      }
    }
    return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate * 100;
  }

  private static generateRecommendations(
    inputData: TaxInputData, 
    ageGroup: AgeGroup | undefined,
    calculationData: {
      taxableIncome: number;
      totalTax: number;
      effectiveTaxRate: number;
      estimatedRefund: number;
    }
  ): string[] {
    const recommendations: string[] = [];
    const { taxableIncome, effectiveTaxRate, estimatedRefund } = calculationData;

    // General recommendations
    if (effectiveTaxRate > 25) {
      recommendations.push("Consider salary sacrificing to superannuation to reduce your tax liability");
    }

    if ((inputData.workRelatedDeductions || 0) < 3000 && inputData.grossIncome > 50000) {
      recommendations.push("Review your work-related deductions - you may be missing eligible expenses");
    }

    if (estimatedRefund < -2000) {
      recommendations.push("Consider making quarterly tax payments to avoid a large tax bill");
    }

    // Age-specific recommendations
    switch (ageGroup) {
      case 'young':
        if (inputData.grossIncome > 40000) {
          recommendations.push("Consider the First Home Super Saver Scheme if you're saving for your first home");
        }
        if ((inputData.superannuation || 0) < inputData.grossIncome * 0.115) {
          recommendations.push("Ensure your employer is paying the correct superannuation guarantee (11.5%)");
        }
        break;

      case 'professional':
        if (inputData.grossIncome > 80000) {
          recommendations.push("Consider additional superannuation contributions to reduce tax and boost retirement savings");
        }
        if ((inputData.frankedDividends || 0) === 0 && inputData.grossIncome > 100000) {
          recommendations.push("Consider investing in Australian shares for franked dividend benefits");
        }
        break;

      case 'established':
        if (inputData.grossIncome > 120000) {
          recommendations.push("Maximize concessional super contributions ($30,000 annual cap) for significant tax savings");
        }
        if ((inputData.capitalGains || 0) > 0) {
          recommendations.push("Consider capital gains tax planning strategies, including the 50% CGT discount");
        }
        break;

      case 'senior':
        if (inputData.grossIncome > 100000) {
          recommendations.push("Consider transition to retirement strategies to optimize your tax position");
        }
        recommendations.push("Review catch-up superannuation contributions if you have unused concessional caps");
        break;

      case 'retiree':
        if ((inputData.superannuation || 0) > 0) {
          recommendations.push("Consider moving superannuation to pension phase for tax-free income");
        }
        recommendations.push("Optimize your Age Pension eligibility through strategic asset management");
        break;
    }

    return recommendations;
  }
}
