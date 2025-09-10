/**
 * Australian Medicare Levy Surcharge Calculator
 * Implements Medicare Levy Surcharge calculations for 2024-25
 */

export interface MedicareSurchargeResult {
  income: number;
  surcharge: number;
  rate: number;
  tier: number;
  exemptionApplied: boolean;
  thresholds: {
    single: SurchargeTier[];
    family: SurchargeTier[];
  };
}

export interface SurchargeTier {
  tier: number;
  singleMin: number;
  singleMax: number | null;
  familyMin: number;
  familyMax: number | null;
  rate: number;
}

export interface MedicareSurchargeInput {
  taxableIncome: number;
  familyStatus: 'single' | 'family';
  dependentChildren: number;
  hasPrivateHealthInsurance: boolean;
  spouseIncome?: number;
  spouseHasPrivateHealthInsurance?: boolean;
}

// 2024-25 Medicare Levy Surcharge tiers
export const MEDICARE_SURCHARGE_TIERS_2024_25: SurchargeTier[] = [
  {
    tier: 0,
    singleMin: 0,
    singleMax: 97000,
    familyMin: 0,
    familyMax: 194000,
    rate: 0
  },
  {
    tier: 1,
    singleMin: 97001,
    singleMax: 113000,
    familyMin: 194001,
    familyMax: 226000,
    rate: 0.01 // 1.0%
  },
  {
    tier: 2,
    singleMin: 113001,
    singleMax: 151000,
    familyMin: 226001,
    familyMax: 302000,
    rate: 0.0125 // 1.25%
  },
  {
    tier: 3,
    singleMin: 151001,
    singleMax: null,
    familyMin: 302001,
    familyMax: null,
    rate: 0.015 // 1.5%
  }
];

export const ADDITIONAL_CHILD_THRESHOLD = 1500;

export class MedicareSurchargeCalculator {
  private tiers = MEDICARE_SURCHARGE_TIERS_2024_25;

  /**
   * Calculate Medicare Levy Surcharge
   */
  calculateMedicareSurcharge(input: MedicareSurchargeInput): MedicareSurchargeResult {
    const { taxableIncome, familyStatus, dependentChildren, hasPrivateHealthInsurance } = input;

    if (taxableIncome < 0) {
      throw new Error('Taxable income cannot be negative');
    }

    // Check if exempt due to private health insurance
    if (hasPrivateHealthInsurance) {
      // For families, both partners need appropriate cover
      if (familyStatus === 'family' && input.spouseHasPrivateHealthInsurance === false) {
        // Spouse doesn't have cover, surcharge may apply
      } else {
        return this.createExemptResult(taxableIncome);
      }
    }

    // Calculate income for surcharge purposes
    const surchargeIncome = this.calculateSurchargeIncome(input);
    
    // Find applicable tier
    const tier = this.findApplicableTier(surchargeIncome, familyStatus, dependentChildren);
    
    if (tier.rate === 0) {
      return this.createExemptResult(taxableIncome);
    }

    const surcharge = taxableIncome * tier.rate;

    return {
      income: taxableIncome,
      surcharge: Math.round(surcharge * 100) / 100,
      rate: tier.rate,
      tier: tier.tier,
      exemptionApplied: false,
      thresholds: {
        single: this.tiers,
        family: this.tiers
      }
    };
  }

  /**
   * Calculate income for surcharge purposes (includes spouse income for families)
   */
  private calculateSurchargeIncome(input: MedicareSurchargeInput): number {
    let surchargeIncome = input.taxableIncome;
    
    if (input.familyStatus === 'family' && input.spouseIncome) {
      surchargeIncome += input.spouseIncome;
    }
    
    return surchargeIncome;
  }

  /**
   * Find applicable surcharge tier
   */
  private findApplicableTier(
    surchargeIncome: number,
    familyStatus: 'single' | 'family',
    dependentChildren: number
  ): SurchargeTier {
    for (const tier of this.tiers) {
      const minThreshold = familyStatus === 'single' ? tier.singleMin : tier.familyMin;
      const maxThreshold = familyStatus === 'single' ? tier.singleMax : tier.familyMax;
      
      // Adjust thresholds for dependent children
      const adjustedMinThreshold = familyStatus === 'family' ? 
        minThreshold + (dependentChildren * ADDITIONAL_CHILD_THRESHOLD) : minThreshold;
      const adjustedMaxThreshold = maxThreshold ? 
        (familyStatus === 'family' ? maxThreshold + (dependentChildren * ADDITIONAL_CHILD_THRESHOLD) : maxThreshold) : null;

      if (surchargeIncome >= adjustedMinThreshold && 
          (adjustedMaxThreshold === null || surchargeIncome <= adjustedMaxThreshold)) {
        return tier;
      }
    }
    
    // Default to highest tier if no match found
    return this.tiers[this.tiers.length - 1];
  }

  /**
   * Create exempt result
   */
  private createExemptResult(taxableIncome: number): MedicareSurchargeResult {
    return {
      income: taxableIncome,
      surcharge: 0,
      rate: 0,
      tier: 0,
      exemptionApplied: true,
      thresholds: {
        single: this.tiers,
        family: this.tiers
      }
    };
  }

  /**
   * Check if Medicare Levy Surcharge applies
   */
  isLiable(input: MedicareSurchargeInput): boolean {
    const result = this.calculateMedicareSurcharge(input);
    return result.surcharge > 0;
  }

  /**
   * Get surcharge rate for given circumstances
   */
  getSurchargeRate(input: MedicareSurchargeInput): number {
    const result = this.calculateMedicareSurcharge(input);
    return result.rate;
  }

  /**
   * Calculate potential savings from private health insurance
   */
  calculateInsuranceSavings(
    input: MedicareSurchargeInput,
    annualPremium: number
  ): {
    surchargeWithoutInsurance: number;
    surchargeWithInsurance: number;
    potentialSavings: number;
    worthwhile: boolean;
  } {
    // Calculate surcharge without insurance
    const withoutInsurance = this.calculateMedicareSurcharge({
      ...input,
      hasPrivateHealthInsurance: false,
      spouseHasPrivateHealthInsurance: false
    });

    // Calculate surcharge with insurance
    const withInsurance = this.calculateMedicareSurcharge({
      ...input,
      hasPrivateHealthInsurance: true,
      spouseHasPrivateHealthInsurance: true
    });

    const potentialSavings = withoutInsurance.surcharge - withInsurance.surcharge - annualPremium;

    return {
      surchargeWithoutInsurance: withoutInsurance.surcharge,
      surchargeWithInsurance: withInsurance.surcharge,
      potentialSavings,
      worthwhile: potentialSavings > 0
    };
  }

  /**
   * Get adjusted thresholds for families with children
   */
  getAdjustedThresholds(dependentChildren: number): SurchargeTier[] {
    return this.tiers.map(tier => ({
      ...tier,
      familyMin: tier.familyMin + (dependentChildren * ADDITIONAL_CHILD_THRESHOLD),
      familyMax: tier.familyMax ? tier.familyMax + (dependentChildren * ADDITIONAL_CHILD_THRESHOLD) : null
    }));
  }

  /**
   * Get current surcharge tiers
   */
  getSurchargeTiers(): SurchargeTier[] {
    return [...this.tiers];
  }
}

export default MedicareSurchargeCalculator;
