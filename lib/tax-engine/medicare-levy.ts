/**
 * Australian Medicare Levy Calculator
 * Implements Medicare Levy calculations for 2024-25
 */

export interface MedicareLevyResult {
  income: number;
  medicareLevy: number;
  rate: number;
  exemptionApplied: boolean;
  reductionApplied: boolean;
  thresholds: {
    single: number;
    family: number;
    seniorSingle: number;
    seniorFamily: number;
  };
}

export interface MedicareLevyInput {
  taxableIncome: number;
  familyStatus: 'single' | 'family';
  dependentChildren: number;
  isSenior: boolean;
  hasPrivateHealthInsurance: boolean;
  spouseIncome?: number;
}

// 2024-25 Medicare Levy thresholds
export const MEDICARE_LEVY_THRESHOLDS_2024_25 = {
  single: 26000,
  family: 43846,
  seniorSingle: 41089,
  seniorFamily: 69295,
  additionalChild: 4027,
  rate: 0.02 // 2%
};

export class MedicareLevyCalculator {
  private thresholds = MEDICARE_LEVY_THRESHOLDS_2024_25;

  /**
   * Calculate Medicare Levy
   */
  calculateMedicareLevy(input: MedicareLevyInput): MedicareLevyResult {
    const { taxableIncome, familyStatus, dependentChildren, isSenior } = input;

    if (taxableIncome < 0) {
      throw new Error('Taxable income cannot be negative');
    }

    // Determine applicable threshold
    let threshold = this.getThreshold(familyStatus, isSenior, dependentChildren);
    
    // Check for exemption (below threshold)
    if (taxableIncome <= threshold) {
      return {
        income: taxableIncome,
        medicareLevy: 0,
        rate: 0,
        exemptionApplied: true,
        reductionApplied: false,
        thresholds: {
          single: this.thresholds.single,
          family: this.thresholds.family,
          seniorSingle: this.thresholds.seniorSingle,
          seniorFamily: this.thresholds.seniorFamily
        }
      };
    }

    // Calculate reduction threshold (10% above main threshold)
    const reductionThreshold = threshold * 1.1;
    let medicareLevy = 0;
    let reductionApplied = false;

    if (taxableIncome <= reductionThreshold) {
      // Reduction applies - graduated rate
      const excessIncome = taxableIncome - threshold;
      const reductionRange = reductionThreshold - threshold;
      const reductionRate = (excessIncome / reductionRange) * this.thresholds.rate;
      medicareLevy = taxableIncome * reductionRate;
      reductionApplied = true;
    } else {
      // Full rate applies
      medicareLevy = taxableIncome * this.thresholds.rate;
    }

    return {
      income: taxableIncome,
      medicareLevy: Math.round(medicareLevy * 100) / 100,
      rate: this.thresholds.rate,
      exemptionApplied: false,
      reductionApplied,
      thresholds: {
        single: this.thresholds.single,
        family: this.thresholds.family,
        seniorSingle: this.thresholds.seniorSingle,
        seniorFamily: this.thresholds.seniorFamily
      }
    };
  }

  /**
   * Get applicable threshold based on circumstances
   */
  private getThreshold(
    familyStatus: 'single' | 'family',
    isSenior: boolean,
    dependentChildren: number
  ): number {
    let baseThreshold: number;

    if (familyStatus === 'single') {
      baseThreshold = isSenior ? this.thresholds.seniorSingle : this.thresholds.single;
    } else {
      baseThreshold = isSenior ? this.thresholds.seniorFamily : this.thresholds.family;
      // Add additional amount for each dependent child
      baseThreshold += dependentChildren * this.thresholds.additionalChild;
    }

    return baseThreshold;
  }

  /**
   * Check if Medicare Levy exemption applies
   */
  isExempt(input: MedicareLevyInput): boolean {
    const threshold = this.getThreshold(
      input.familyStatus,
      input.isSenior,
      input.dependentChildren
    );
    return input.taxableIncome <= threshold;
  }

  /**
   * Check if Medicare Levy reduction applies
   */
  hasReduction(input: MedicareLevyInput): boolean {
    const threshold = this.getThreshold(
      input.familyStatus,
      input.isSenior,
      input.dependentChildren
    );
    const reductionThreshold = threshold * 1.1;
    
    return input.taxableIncome > threshold && input.taxableIncome <= reductionThreshold;
  }

  /**
   * Get Medicare Levy rate for given income and circumstances
   */
  getEffectiveRate(input: MedicareLevyInput): number {
    const result = this.calculateMedicareLevy(input);
    return result.income > 0 ? result.medicareLevy / result.income : 0;
  }

  /**
   * Calculate family threshold including spouse income
   */
  calculateFamilyThreshold(
    baseIncome: number,
    spouseIncome: number,
    dependentChildren: number,
    isSenior: boolean = false
  ): number {
    const familyThreshold = isSenior ? 
      this.thresholds.seniorFamily : 
      this.thresholds.family;
    
    return familyThreshold + (dependentChildren * this.thresholds.additionalChild);
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return { ...this.thresholds };
  }
}

export default MedicareLevyCalculator;
