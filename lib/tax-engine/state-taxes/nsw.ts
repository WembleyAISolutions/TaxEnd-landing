/**
 * New South Wales State Tax Calculator
 * Implements NSW-specific taxes and duties for 2024-25
 */

export interface NSWTaxResult {
  stampDuty: StampDutyResult;
  landTax: LandTaxResult;
  payrollTax: PayrollTaxResult;
  totalStateTaxes: number;
  applicableTaxes: string[];
}

export interface StampDutyResult {
  propertyValue: number;
  stampDuty: number;
  concessions: StampDutyConcession[];
  effectiveRate: number;
  breakdown: StampDutyBreakdown[];
}

export interface LandTaxResult {
  landValue: number;
  landTax: number;
  threshold: number;
  exemptions: LandTaxExemption[];
  effectiveRate: number;
}

export interface PayrollTaxResult {
  payrollAmount: number;
  payrollTax: number;
  threshold: number;
  rate: number;
  exemptionApplied: boolean;
}

export interface StampDutyConcession {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface StampDutyBreakdown {
  valueRange: { min: number; max: number | null };
  rate: number;
  dutyAmount: number;
}

export interface LandTaxExemption {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface NSWTaxInput {
  // Property-related
  propertyValue?: number;
  isFirstHomeBuyer?: boolean;
  isNewHome?: boolean;
  isOwnerOccupied?: boolean;
  
  // Land tax
  landValue?: number;
  isInvestmentProperty?: boolean;
  isPrincipalPlaceOfResidence?: boolean;
  
  // Payroll tax
  annualPayroll?: number;
  isSmallBusiness?: boolean;
  
  // Personal details
  isAustralianCitizen?: boolean;
  isNSWResident?: boolean;
}

// 2024-25 NSW Tax Rates and Thresholds
export const NSW_TAX_RATES_2024_25 = {
  stampDuty: {
    residential: [
      { min: 0, max: 14000, rate: 0.0125, fixed: 0 },
      { min: 14001, max: 32000, rate: 0.015, fixed: 175 },
      { min: 32001, max: 85000, rate: 0.0175, fixed: 445 },
      { min: 85001, max: 319000, rate: 0.035, fixed: 1372.5 },
      { min: 319001, max: 1064000, rate: 0.045, fixed: 9562.5 },
      { min: 1064001, max: null, rate: 0.055, fixed: 43087.5 }
    ],
    firstHomeBuyer: {
      fullExemption: 650000,
      partialExemption: 800000,
      newHomeGrant: 10000
    }
  },
  landTax: {
    threshold: 1075000, // 2024 threshold
    rates: [
      { min: 1075001, max: 6571000, rate: 0.017 },
      { min: 6571001, max: null, rate: 0.02 }
    ],
    premiumRate: 0.02 // Additional 2% for foreign persons
  },
  payrollTax: {
    threshold: 1200000, // Annual payroll threshold
    rate: 0.0485, // 4.85%
    smallBusinessThreshold: 50000 // Monthly threshold for small business
  }
};

export class NSWTaxCalculator {
  private rates = NSW_TAX_RATES_2024_25;

  /**
   * Calculate all applicable NSW state taxes
   */
  calculateNSWTaxes(input: NSWTaxInput): NSWTaxResult {
    const applicableTaxes: string[] = [];
    let totalStateTaxes = 0;

    // Calculate stamp duty
    const stampDuty = input.propertyValue ? 
      this.calculateStampDuty(input) : 
      this.createEmptyStampDutyResult();
    
    if (stampDuty.stampDuty > 0) {
      applicableTaxes.push('Stamp Duty');
      totalStateTaxes += stampDuty.stampDuty;
    }

    // Calculate land tax
    const landTax = input.landValue ? 
      this.calculateLandTax(input) : 
      this.createEmptyLandTaxResult();
    
    if (landTax.landTax > 0) {
      applicableTaxes.push('Land Tax');
      totalStateTaxes += landTax.landTax;
    }

    // Calculate payroll tax
    const payrollTax = input.annualPayroll ? 
      this.calculatePayrollTax(input) : 
      this.createEmptyPayrollTaxResult();
    
    if (payrollTax.payrollTax > 0) {
      applicableTaxes.push('Payroll Tax');
      totalStateTaxes += payrollTax.payrollTax;
    }

    return {
      stampDuty,
      landTax,
      payrollTax,
      totalStateTaxes: Math.round(totalStateTaxes * 100) / 100,
      applicableTaxes
    };
  }

  /**
   * Calculate NSW stamp duty on property purchases
   */
  private calculateStampDuty(input: NSWTaxInput): StampDutyResult {
    const propertyValue = input.propertyValue!;
    const rates = this.rates.stampDuty.residential;
    
    let stampDuty = 0;
    const breakdown: StampDutyBreakdown[] = [];

    // Calculate base stamp duty
    for (const bracket of rates) {
      if (propertyValue <= bracket.min) break;

      const maxValue = bracket.max || Infinity;
      const taxableInBracket = Math.min(propertyValue, maxValue) - bracket.min + 1;
      
      if (taxableInBracket > 0) {
        const dutyInBracket = (taxableInBracket * bracket.rate) + (bracket.fixed || 0);
        stampDuty += dutyInBracket;

        breakdown.push({
          valueRange: { min: bracket.min, max: bracket.max },
          rate: bracket.rate,
          dutyAmount: dutyInBracket
        });
      }
    }

    // Apply concessions
    const concessions = this.calculateStampDutyConcessions(input, stampDuty);
    const totalConcessions = concessions.reduce((sum, c) => sum + c.saving, 0);
    const finalStampDuty = Math.max(0, stampDuty - totalConcessions);

    return {
      propertyValue,
      stampDuty: Math.round(finalStampDuty * 100) / 100,
      concessions,
      effectiveRate: propertyValue > 0 ? finalStampDuty / propertyValue : 0,
      breakdown
    };
  }

  /**
   * Calculate stamp duty concessions
   */
  private calculateStampDutyConcessions(
    input: NSWTaxInput,
    baseStampDuty: number
  ): StampDutyConcession[] {
    const concessions: StampDutyConcession[] = [];
    const propertyValue = input.propertyValue!;
    const fhb = this.rates.stampDuty.firstHomeBuyer;

    // First Home Buyer concession
    if (input.isFirstHomeBuyer) {
      let saving = 0;
      let eligibilityMet = false;

      if (propertyValue <= fhb.fullExemption) {
        // Full exemption
        saving = baseStampDuty;
        eligibilityMet = true;
      } else if (propertyValue <= fhb.partialExemption) {
        // Partial exemption (sliding scale)
        const excessValue = propertyValue - fhb.fullExemption;
        const excessRange = fhb.partialExemption - fhb.fullExemption;
        const reductionFactor = 1 - (excessValue / excessRange);
        saving = baseStampDuty * reductionFactor;
        eligibilityMet = true;
      }

      concessions.push({
        name: 'First Home Buyer Exemption',
        description: eligibilityMet ? 
          `${saving === baseStampDuty ? 'Full' : 'Partial'} stamp duty exemption for first home buyers` :
          'Not eligible - property value exceeds threshold',
        saving: Math.round(saving * 100) / 100,
        eligibilityMet
      });
    }

    // New Home Grant (additional benefit for new homes)
    if (input.isFirstHomeBuyer && input.isNewHome && propertyValue <= fhb.partialExemption) {
      concessions.push({
        name: 'New Home Grant',
        description: `Additional $${fhb.newHomeGrant.toLocaleString()} grant for new homes`,
        saving: fhb.newHomeGrant,
        eligibilityMet: true
      });
    }

    return concessions;
  }

  /**
   * Calculate NSW land tax
   */
  private calculateLandTax(input: NSWTaxInput): LandTaxResult {
    const landValue = input.landValue!;
    const threshold = this.rates.landTax.threshold;
    
    let landTax = 0;
    const exemptions: LandTaxExemption[] = [];

    // Check for principal place of residence exemption
    if (input.isPrincipalPlaceOfResidence) {
      exemptions.push({
        name: 'Principal Place of Residence Exemption',
        description: 'Land tax does not apply to your principal place of residence',
        saving: 0, // Would be calculated if not exempt
        eligibilityMet: true
      });
      
      return {
        landValue,
        landTax: 0,
        threshold,
        exemptions,
        effectiveRate: 0
      };
    }

    // Calculate land tax if above threshold
    if (landValue > threshold) {
      const rates = this.rates.landTax.rates;
      
      for (const bracket of rates) {
        if (landValue <= bracket.min) break;

        const maxValue = bracket.max || Infinity;
        const taxableInBracket = Math.min(landValue, maxValue) - bracket.min + 1;
        
        if (taxableInBracket > 0) {
          landTax += taxableInBracket * bracket.rate;
        }
      }
    }

    return {
      landValue,
      landTax: Math.round(landTax * 100) / 100,
      threshold,
      exemptions,
      effectiveRate: landValue > 0 ? landTax / landValue : 0
    };
  }

  /**
   * Calculate NSW payroll tax
   */
  private calculatePayrollTax(input: NSWTaxInput): PayrollTaxResult {
    const payrollAmount = input.annualPayroll!;
    const threshold = this.rates.payrollTax.threshold;
    const rate = this.rates.payrollTax.rate;
    
    let payrollTax = 0;
    let exemptionApplied = false;

    if (payrollAmount <= threshold) {
      exemptionApplied = true;
    } else {
      payrollTax = payrollAmount * rate;
    }

    return {
      payrollAmount,
      payrollTax: Math.round(payrollTax * 100) / 100,
      threshold,
      rate,
      exemptionApplied
    };
  }

  /**
   * Create empty results for unused calculations
   */
  private createEmptyStampDutyResult(): StampDutyResult {
    return {
      propertyValue: 0,
      stampDuty: 0,
      concessions: [],
      effectiveRate: 0,
      breakdown: []
    };
  }

  private createEmptyLandTaxResult(): LandTaxResult {
    return {
      landValue: 0,
      landTax: 0,
      threshold: this.rates.landTax.threshold,
      exemptions: [],
      effectiveRate: 0
    };
  }

  private createEmptyPayrollTaxResult(): PayrollTaxResult {
    return {
      payrollAmount: 0,
      payrollTax: 0,
      threshold: this.rates.payrollTax.threshold,
      rate: this.rates.payrollTax.rate,
      exemptionApplied: true
    };
  }

  /**
   * Get NSW tax rates and thresholds
   */
  getNSWTaxRates() {
    return { ...this.rates };
  }

  /**
   * Calculate stamp duty for different property values (comparison tool)
   */
  compareStampDutyByValue(values: number[], isFirstHomeBuyer: boolean = false): {
    propertyValue: number;
    stampDuty: number;
    effectiveRate: number;
  }[] {
    return values.map(value => {
      const result = this.calculateStampDuty({
        propertyValue: value,
        isFirstHomeBuyer,
        isNewHome: false,
        isOwnerOccupied: true
      });
      
      return {
        propertyValue: value,
        stampDuty: result.stampDuty,
        effectiveRate: result.effectiveRate
      };
    });
  }
}

export default NSWTaxCalculator;
