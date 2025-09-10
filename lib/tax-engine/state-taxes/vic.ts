/**
 * Victoria State Tax Calculator
 * Implements VIC-specific taxes and duties for 2024-25
 */

export interface VICTaxResult {
  stampDuty: VICStampDutyResult;
  landTax: VICLandTaxResult;
  payrollTax: VICPayrollTaxResult;
  totalStateTaxes: number;
  applicableTaxes: string[];
}

export interface VICStampDutyResult {
  propertyValue: number;
  stampDuty: number;
  concessions: VICStampDutyConcession[];
  effectiveRate: number;
  breakdown: VICStampDutyBreakdown[];
}

export interface VICLandTaxResult {
  landValue: number;
  landTax: number;
  threshold: number;
  exemptions: VICLandTaxExemption[];
  effectiveRate: number;
  absenteeOwnerSurcharge?: number;
}

export interface VICPayrollTaxResult {
  payrollAmount: number;
  payrollTax: number;
  threshold: number;
  rate: number;
  exemptionApplied: boolean;
  mentalHealthLevy?: number;
}

export interface VICStampDutyConcession {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface VICStampDutyBreakdown {
  valueRange: { min: number; max: number | null };
  rate: number;
  dutyAmount: number;
}

export interface VICLandTaxExemption {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface VICTaxInput {
  // Property-related
  propertyValue?: number;
  isFirstHomeBuyer?: boolean;
  isNewHome?: boolean;
  isOwnerOccupied?: boolean;
  
  // Land tax
  landValue?: number;
  isInvestmentProperty?: boolean;
  isPrincipalPlaceOfResidence?: boolean;
  isAbsenteeOwner?: boolean;
  
  // Payroll tax
  annualPayroll?: number;
  isSmallBusiness?: boolean;
  
  // Personal details
  isAustralianCitizen?: boolean;
  isVICResident?: boolean;
}

// 2024-25 VIC Tax Rates and Thresholds
export const VIC_TAX_RATES_2024_25 = {
  stampDuty: {
    residential: [
      { min: 0, max: 25000, rate: 0.014, fixed: 0 },
      { min: 25001, max: 130000, rate: 0.024, fixed: 350 },
      { min: 130001, max: 960000, rate: 0.06, fixed: 2870 },
      { min: 960001, max: null, rate: 0.055, fixed: 52670 }
    ],
    firstHomeBuyer: {
      fullExemption: 600000,
      partialExemption: 750000,
      homeBuilderGrant: 10000
    }
  },
  landTax: {
    threshold: 300000, // 2024 threshold
    rates: [
      { min: 300001, max: 600000, rate: 0.003 },
      { min: 600001, max: 1000000, rate: 0.007 },
      { min: 1000001, max: 1800000, rate: 0.01 },
      { min: 1800001, max: 3000000, rate: 0.015 },
      { min: 3000001, max: null, rate: 0.025 }
    ],
    absenteeOwnerSurcharge: 0.02 // 2% surcharge for absentee owners
  },
  payrollTax: {
    threshold: 700000, // Annual payroll threshold
    rate: 0.0485, // 4.85%
    mentalHealthLevy: {
      threshold: 10000000, // $10M threshold for mental health levy
      rate: 0.0025 // 0.25%
    }
  }
};

export class VICTaxCalculator {
  private rates = VIC_TAX_RATES_2024_25;

  /**
   * Calculate all applicable VIC state taxes
   */
  calculateVICTaxes(input: VICTaxInput): VICTaxResult {
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
    
    if (landTax.landTax > 0 || (landTax.absenteeOwnerSurcharge && landTax.absenteeOwnerSurcharge > 0)) {
      applicableTaxes.push('Land Tax');
      totalStateTaxes += landTax.landTax + (landTax.absenteeOwnerSurcharge || 0);
    }

    // Calculate payroll tax
    const payrollTax = input.annualPayroll ? 
      this.calculatePayrollTax(input) : 
      this.createEmptyPayrollTaxResult();
    
    if (payrollTax.payrollTax > 0 || (payrollTax.mentalHealthLevy && payrollTax.mentalHealthLevy > 0)) {
      applicableTaxes.push('Payroll Tax');
      totalStateTaxes += payrollTax.payrollTax + (payrollTax.mentalHealthLevy || 0);
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
   * Calculate VIC stamp duty on property purchases
   */
  private calculateStampDuty(input: VICTaxInput): VICStampDutyResult {
    const propertyValue = input.propertyValue!;
    const rates = this.rates.stampDuty.residential;
    
    let stampDuty = 0;
    const breakdown: VICStampDutyBreakdown[] = [];

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
    input: VICTaxInput,
    baseStampDuty: number
  ): VICStampDutyConcession[] {
    const concessions: VICStampDutyConcession[] = [];
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

    // HomeBuilder Grant (for new homes)
    if (input.isFirstHomeBuyer && input.isNewHome && propertyValue <= fhb.partialExemption) {
      concessions.push({
        name: 'HomeBuilder Grant',
        description: `Additional $${fhb.homeBuilderGrant.toLocaleString()} grant for new homes`,
        saving: fhb.homeBuilderGrant,
        eligibilityMet: true
      });
    }

    return concessions;
  }

  /**
   * Calculate VIC land tax
   */
  private calculateLandTax(input: VICTaxInput): VICLandTaxResult {
    const landValue = input.landValue!;
    const threshold = this.rates.landTax.threshold;
    
    let landTax = 0;
    let absenteeOwnerSurcharge = 0;
    const exemptions: VICLandTaxExemption[] = [];

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
        effectiveRate: 0,
        absenteeOwnerSurcharge: 0
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

    // Calculate absentee owner surcharge
    if (input.isAbsenteeOwner && landValue > 0) {
      absenteeOwnerSurcharge = landValue * this.rates.landTax.absenteeOwnerSurcharge;
    }

    return {
      landValue,
      landTax: Math.round(landTax * 100) / 100,
      threshold,
      exemptions,
      effectiveRate: landValue > 0 ? landTax / landValue : 0,
      absenteeOwnerSurcharge: Math.round(absenteeOwnerSurcharge * 100) / 100
    };
  }

  /**
   * Calculate VIC payroll tax
   */
  private calculatePayrollTax(input: VICTaxInput): VICPayrollTaxResult {
    const payrollAmount = input.annualPayroll!;
    const threshold = this.rates.payrollTax.threshold;
    const rate = this.rates.payrollTax.rate;
    const mentalHealthLevy = this.rates.payrollTax.mentalHealthLevy;
    
    let payrollTax = 0;
    let mentalHealthLevyAmount = 0;
    let exemptionApplied = false;

    if (payrollAmount <= threshold) {
      exemptionApplied = true;
    } else {
      payrollTax = payrollAmount * rate;
    }

    // Calculate mental health levy for large employers
    if (payrollAmount > mentalHealthLevy.threshold) {
      mentalHealthLevyAmount = payrollAmount * mentalHealthLevy.rate;
    }

    return {
      payrollAmount,
      payrollTax: Math.round(payrollTax * 100) / 100,
      threshold,
      rate,
      exemptionApplied,
      mentalHealthLevy: mentalHealthLevyAmount > 0 ? Math.round(mentalHealthLevyAmount * 100) / 100 : undefined
    };
  }

  /**
   * Create empty results for unused calculations
   */
  private createEmptyStampDutyResult(): VICStampDutyResult {
    return {
      propertyValue: 0,
      stampDuty: 0,
      concessions: [],
      effectiveRate: 0,
      breakdown: []
    };
  }

  private createEmptyLandTaxResult(): VICLandTaxResult {
    return {
      landValue: 0,
      landTax: 0,
      threshold: this.rates.landTax.threshold,
      exemptions: [],
      effectiveRate: 0,
      absenteeOwnerSurcharge: 0
    };
  }

  private createEmptyPayrollTaxResult(): VICPayrollTaxResult {
    return {
      payrollAmount: 0,
      payrollTax: 0,
      threshold: this.rates.payrollTax.threshold,
      rate: this.rates.payrollTax.rate,
      exemptionApplied: true,
      mentalHealthLevy: undefined
    };
  }

  /**
   * Get VIC tax rates and thresholds
   */
  getVICTaxRates() {
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

  /**
   * Compare land tax with and without absentee owner surcharge
   */
  compareLandTaxScenarios(landValue: number): {
    resident: { landTax: number; totalTax: number };
    absentee: { landTax: number; surcharge: number; totalTax: number };
    difference: number;
  } {
    const residentResult = this.calculateLandTax({
      landValue,
      isPrincipalPlaceOfResidence: false,
      isAbsenteeOwner: false
    });

    const absenteeResult = this.calculateLandTax({
      landValue,
      isPrincipalPlaceOfResidence: false,
      isAbsenteeOwner: true
    });

    const residentTotal = residentResult.landTax;
    const absenteeTotal = absenteeResult.landTax + (absenteeResult.absenteeOwnerSurcharge || 0);

    return {
      resident: {
        landTax: residentResult.landTax,
        totalTax: residentTotal
      },
      absentee: {
        landTax: absenteeResult.landTax,
        surcharge: absenteeResult.absenteeOwnerSurcharge || 0,
        totalTax: absenteeTotal
      },
      difference: absenteeTotal - residentTotal
    };
  }
}

export default VICTaxCalculator;
