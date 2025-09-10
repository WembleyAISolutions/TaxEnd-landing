/**
 * Queensland State Tax Calculator
 * Implements QLD-specific taxes and duties for 2024-25
 */

export interface QLDTaxResult {
  stampDuty: QLDStampDutyResult;
  landTax: QLDLandTaxResult;
  payrollTax: QLDPayrollTaxResult;
  totalStateTaxes: number;
  applicableTaxes: string[];
}

export interface QLDStampDutyResult {
  propertyValue: number;
  stampDuty: number;
  concessions: QLDStampDutyConcession[];
  effectiveRate: number;
  breakdown: QLDStampDutyBreakdown[];
}

export interface QLDLandTaxResult {
  landValue: number;
  landTax: number;
  threshold: number;
  exemptions: QLDLandTaxExemption[];
  effectiveRate: number;
  absenteeLandTax?: number;
}

export interface QLDPayrollTaxResult {
  payrollAmount: number;
  payrollTax: number;
  threshold: number;
  rate: number;
  exemptionApplied: boolean;
  apprenticeRebate?: number;
}

export interface QLDStampDutyConcession {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface QLDStampDutyBreakdown {
  valueRange: { min: number; max: number | null };
  rate: number;
  dutyAmount: number;
}

export interface QLDLandTaxExemption {
  name: string;
  description: string;
  saving: number;
  eligibilityMet: boolean;
}

export interface QLDTaxInput {
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
  apprenticeWages?: number;
  
  // Personal details
  isAustralianCitizen?: boolean;
  isQLDResident?: boolean;
}

// 2024-25 QLD Tax Rates and Thresholds
export const QLD_TAX_RATES_2024_25 = {
  stampDuty: {
    residential: [
      { min: 0, max: 5000, rate: 0, fixed: 0 },
      { min: 5001, max: 75000, rate: 0.015, fixed: 0 },
      { min: 75001, max: 540000, rate: 0.035, fixed: 1050 },
      { min: 540001, max: 1000000, rate: 0.045, fixed: 17325 },
      { min: 1000001, max: null, rate: 0.0575, fixed: 38025 }
    ],
    firstHomeBuyer: {
      fullExemption: 550000,
      partialExemption: 750000,
      homeBuilderGrant: 15000
    }
  },
  landTax: {
    threshold: 600000, // 2024 threshold
    rates: [
      { min: 600001, max: 999999, rate: 0.01 },
      { min: 1000000, max: 2999999, rate: 0.0175 },
      { min: 3000000, max: 4999999, rate: 0.0225 },
      { min: 5000000, max: 9999999, rate: 0.025 },
      { min: 10000000, max: null, rate: 0.0275 }
    ],
    absenteeLandTax: {
      threshold: 350000,
      rates: [
        { min: 350001, max: 2249999, rate: 0.015 },
        { min: 2250000, max: null, rate: 0.02 }
      ]
    }
  },
  payrollTax: {
    threshold: 1300000, // Annual payroll threshold
    rate: 0.0475, // 4.75%
    apprenticeRebate: {
      maxRebate: 20000, // Maximum rebate per apprentice
      rate: 0.25 // 25% of wages paid to apprentices
    }
  }
};

export class QLDTaxCalculator {
  private rates = QLD_TAX_RATES_2024_25;

  /**
   * Calculate all applicable QLD state taxes
   */
  calculateQLDTaxes(input: QLDTaxInput): QLDTaxResult {
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
    
    if (landTax.landTax > 0 || (landTax.absenteeLandTax && landTax.absenteeLandTax > 0)) {
      applicableTaxes.push('Land Tax');
      totalStateTaxes += landTax.landTax + (landTax.absenteeLandTax || 0);
    }

    // Calculate payroll tax
    const payrollTax = input.annualPayroll ? 
      this.calculatePayrollTax(input) : 
      this.createEmptyPayrollTaxResult();
    
    if (payrollTax.payrollTax > 0) {
      applicableTaxes.push('Payroll Tax');
      totalStateTaxes += payrollTax.payrollTax - (payrollTax.apprenticeRebate || 0);
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
   * Calculate QLD stamp duty on property purchases
   */
  private calculateStampDuty(input: QLDTaxInput): QLDStampDutyResult {
    const propertyValue = input.propertyValue!;
    const rates = this.rates.stampDuty.residential;
    
    let stampDuty = 0;
    const breakdown: QLDStampDutyBreakdown[] = [];

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
    input: QLDTaxInput,
    baseStampDuty: number
  ): QLDStampDutyConcession[] {
    const concessions: QLDStampDutyConcession[] = [];
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
   * Calculate QLD land tax
   */
  private calculateLandTax(input: QLDTaxInput): QLDLandTaxResult {
    const landValue = input.landValue!;
    const threshold = this.rates.landTax.threshold;
    
    let landTax = 0;
    let absenteeLandTax = 0;
    const exemptions: QLDLandTaxExemption[] = [];

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
        absenteeLandTax: 0
      };
    }

    // Calculate standard land tax if above threshold
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

    // Calculate absentee land tax (separate calculation)
    if (input.isAbsenteeOwner) {
      const absenteeThreshold = this.rates.landTax.absenteeLandTax.threshold;
      
      if (landValue > absenteeThreshold) {
        const absenteeRates = this.rates.landTax.absenteeLandTax.rates;
        
        for (const bracket of absenteeRates) {
          if (landValue <= bracket.min) break;

          const maxValue = bracket.max || Infinity;
          const taxableInBracket = Math.min(landValue, maxValue) - bracket.min + 1;
          
          if (taxableInBracket > 0) {
            absenteeLandTax += taxableInBracket * bracket.rate;
          }
        }
      }
    }

    return {
      landValue,
      landTax: Math.round(landTax * 100) / 100,
      threshold,
      exemptions,
      effectiveRate: landValue > 0 ? landTax / landValue : 0,
      absenteeLandTax: absenteeLandTax > 0 ? Math.round(absenteeLandTax * 100) / 100 : undefined
    };
  }

  /**
   * Calculate QLD payroll tax
   */
  private calculatePayrollTax(input: QLDTaxInput): QLDPayrollTaxResult {
    const payrollAmount = input.annualPayroll!;
    const threshold = this.rates.payrollTax.threshold;
    const rate = this.rates.payrollTax.rate;
    
    let payrollTax = 0;
    let apprenticeRebate = 0;
    let exemptionApplied = false;

    if (payrollAmount <= threshold) {
      exemptionApplied = true;
    } else {
      payrollTax = payrollAmount * rate;
    }

    // Calculate apprentice rebate
    if (input.apprenticeWages && input.apprenticeWages > 0) {
      const rebateCalc = this.rates.payrollTax.apprenticeRebate;
      apprenticeRebate = Math.min(
        input.apprenticeWages * rebateCalc.rate,
        rebateCalc.maxRebate
      );
    }

    return {
      payrollAmount,
      payrollTax: Math.round(payrollTax * 100) / 100,
      threshold,
      rate,
      exemptionApplied,
      apprenticeRebate: apprenticeRebate > 0 ? Math.round(apprenticeRebate * 100) / 100 : undefined
    };
  }

  /**
   * Create empty results for unused calculations
   */
  private createEmptyStampDutyResult(): QLDStampDutyResult {
    return {
      propertyValue: 0,
      stampDuty: 0,
      concessions: [],
      effectiveRate: 0,
      breakdown: []
    };
  }

  private createEmptyLandTaxResult(): QLDLandTaxResult {
    return {
      landValue: 0,
      landTax: 0,
      threshold: this.rates.landTax.threshold,
      exemptions: [],
      effectiveRate: 0,
      absenteeLandTax: undefined
    };
  }

  private createEmptyPayrollTaxResult(): QLDPayrollTaxResult {
    return {
      payrollAmount: 0,
      payrollTax: 0,
      threshold: this.rates.payrollTax.threshold,
      rate: this.rates.payrollTax.rate,
      exemptionApplied: true,
      apprenticeRebate: undefined
    };
  }

  /**
   * Get QLD tax rates and thresholds
   */
  getQLDTaxRates() {
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
   * Compare land tax scenarios (resident vs absentee)
   */
  compareLandTaxScenarios(landValue: number): {
    resident: { landTax: number; totalTax: number };
    absentee: { landTax: number; absenteeTax: number; totalTax: number };
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
    const absenteeTotal = absenteeResult.landTax + (absenteeResult.absenteeLandTax || 0);

    return {
      resident: {
        landTax: residentResult.landTax,
        totalTax: residentTotal
      },
      absentee: {
        landTax: absenteeResult.landTax,
        absenteeTax: absenteeResult.absenteeLandTax || 0,
        totalTax: absenteeTotal
      },
      difference: absenteeTotal - residentTotal
    };
  }

  /**
   * Calculate payroll tax savings from apprentice employment
   */
  calculateApprenticeRebate(payrollAmount: number, apprenticeWages: number): {
    basePayrollTax: number;
    apprenticeRebate: number;
    netPayrollTax: number;
    savingsRate: number;
  } {
    const baseResult = this.calculatePayrollTax({
      annualPayroll: payrollAmount,
      apprenticeWages: 0
    });

    const withApprenticeResult = this.calculatePayrollTax({
      annualPayroll: payrollAmount,
      apprenticeWages
    });

    const rebate = withApprenticeResult.apprenticeRebate || 0;
    const netTax = baseResult.payrollTax - rebate;
    const savingsRate = baseResult.payrollTax > 0 ? rebate / baseResult.payrollTax : 0;

    return {
      basePayrollTax: baseResult.payrollTax,
      apprenticeRebate: rebate,
      netPayrollTax: Math.max(0, netTax),
      savingsRate: Math.round(savingsRate * 10000) / 100 // Convert to percentage
    };
  }
}

export default QLDTaxCalculator;
