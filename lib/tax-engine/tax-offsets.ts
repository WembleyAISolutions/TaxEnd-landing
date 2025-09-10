/**
 * Australian Tax Offsets Calculator
 * Implements LITO and other tax offsets for 2024-25
 */

export interface TaxOffsetsResult {
  totalOffsets: number;
  appliedOffsets: AppliedOffset[];
  taxAfterOffsets: number;
  originalTax: number;
}

export interface AppliedOffset {
  name: string;
  type: OffsetType;
  amount: number;
  eligibilityMet: boolean;
  phaseOutApplied: boolean;
  description: string;
}

export interface TaxOffsetsInput {
  taxableIncome: number;
  federalTax: number;
  age: number;
  isResident: boolean;
  hasSpouse: boolean;
  spouseIncome?: number;
  dependentChildren: number;
  medicalExpenses?: number;
  privateHealthInsurancePremium?: number;
  hasPrivateHealthInsurance: boolean;
  pensionIncome?: number;
  isInvalidPensioner?: boolean;
}

export enum OffsetType {
  LITO = 'LITO',
  LMITO = 'LMITO', // Low and Middle Income Tax Offset (if applicable)
  SAPTO = 'SAPTO', // Senior Australians and Pensioners Tax Offset
  MEDICAL = 'MEDICAL',
  PRIVATE_HEALTH = 'PRIVATE_HEALTH',
  DEPENDENT_SPOUSE = 'DEPENDENT_SPOUSE'
}

// 2024-25 Tax Offset rates and thresholds
export const TAX_OFFSETS_2024_25 = {
  LITO: {
    maxOffset: 700,
    phaseOutStart: 37500,
    phaseOutEnd: 45000,
    phaseOutRate: 0.05 // 5 cents per dollar
  },
  SAPTO: {
    single: {
      maxOffset: 2230,
      phaseOutStart: 32279,
      phaseOutEnd: 57948,
      phaseOutRate: 0.125
    },
    couple: {
      maxOffset: 1602,
      combinedPhaseOutStart: 28974,
      combinedPhaseOutEnd: 41790,
      phaseOutRate: 0.125
    }
  },
  MEDICAL: {
    threshold: 2759, // 2024-25 threshold
    rate: 0.20 // 20% of excess
  },
  PRIVATE_HEALTH: {
    maxRebate: 0.3424, // Maximum 34.24% for lowest income tier
    tier1: { income: 97000, rebate: 0.3424 },
    tier2: { income: 113000, rebate: 0.2284 },
    tier3: { income: 151000, rebate: 0.1142 },
    tier4: { income: Infinity, rebate: 0 }
  }
};

export class TaxOffsetsCalculator {
  private offsets = TAX_OFFSETS_2024_25;

  /**
   * Calculate all applicable tax offsets
   */
  calculateTaxOffsets(input: TaxOffsetsInput): TaxOffsetsResult {
    const appliedOffsets: AppliedOffset[] = [];
    let totalOffsets = 0;

    // Low Income Tax Offset (LITO)
    const litoOffset = this.calculateLITO(input.taxableIncome);
    if (litoOffset.amount > 0) {
      appliedOffsets.push(litoOffset);
      totalOffsets += litoOffset.amount;
    }

    // Senior Australians and Pensioners Tax Offset (SAPTO)
    if (input.age >= 65 || input.isInvalidPensioner) {
      const saptoOffset = this.calculateSAPTO(input);
      if (saptoOffset.amount > 0) {
        appliedOffsets.push(saptoOffset);
        totalOffsets += saptoOffset.amount;
      }
    }

    // Medical Expenses Tax Offset
    if (input.medicalExpenses && input.medicalExpenses > 0) {
      const medicalOffset = this.calculateMedicalOffset(input.taxableIncome, input.medicalExpenses);
      if (medicalOffset.amount > 0) {
        appliedOffsets.push(medicalOffset);
        totalOffsets += medicalOffset.amount;
      }
    }

    // Private Health Insurance Rebate
    if (input.hasPrivateHealthInsurance && input.privateHealthInsurancePremium) {
      const healthOffset = this.calculatePrivateHealthRebate(
        input.taxableIncome,
        input.privateHealthInsurancePremium,
        input.hasSpouse
      );
      if (healthOffset.amount > 0) {
        appliedOffsets.push(healthOffset);
        totalOffsets += healthOffset.amount;
      }
    }

    // Ensure offsets don't exceed tax liability
    const maxOffsets = Math.min(totalOffsets, input.federalTax);
    const taxAfterOffsets = Math.max(0, input.federalTax - maxOffsets);

    return {
      totalOffsets: Math.round(maxOffsets * 100) / 100,
      appliedOffsets,
      taxAfterOffsets: Math.round(taxAfterOffsets * 100) / 100,
      originalTax: input.federalTax
    };
  }

  /**
   * Calculate Low Income Tax Offset (LITO)
   */
  private calculateLITO(taxableIncome: number): AppliedOffset {
    const lito = this.offsets.LITO;
    let amount = 0;
    let phaseOutApplied = false;

    if (taxableIncome <= lito.phaseOutStart) {
      amount = lito.maxOffset;
    } else if (taxableIncome < lito.phaseOutEnd) {
      const excess = taxableIncome - lito.phaseOutStart;
      amount = lito.maxOffset - (excess * lito.phaseOutRate);
      phaseOutApplied = true;
    }

    return {
      name: 'Low Income Tax Offset',
      type: OffsetType.LITO,
      amount: Math.max(0, Math.round(amount * 100) / 100),
      eligibilityMet: amount > 0,
      phaseOutApplied,
      description: 'Reduces tax for low income earners'
    };
  }

  /**
   * Calculate Senior Australians and Pensioners Tax Offset (SAPTO)
   */
  private calculateSAPTO(input: TaxOffsetsInput): AppliedOffset {
    const sapto = this.offsets.SAPTO;
    let amount = 0;
    let phaseOutApplied = false;

    if (input.hasSpouse) {
      // Couple calculation
      const combinedIncome = input.taxableIncome + (input.spouseIncome || 0);
      if (combinedIncome <= sapto.couple.combinedPhaseOutStart) {
        amount = sapto.couple.maxOffset;
      } else if (combinedIncome < sapto.couple.combinedPhaseOutEnd) {
        const excess = combinedIncome - sapto.couple.combinedPhaseOutStart;
        amount = sapto.couple.maxOffset - (excess * sapto.couple.phaseOutRate);
        phaseOutApplied = true;
      }
    } else {
      // Single calculation
      if (input.taxableIncome <= sapto.single.phaseOutStart) {
        amount = sapto.single.maxOffset;
      } else if (input.taxableIncome < sapto.single.phaseOutEnd) {
        const excess = input.taxableIncome - sapto.single.phaseOutStart;
        amount = sapto.single.maxOffset - (excess * sapto.single.phaseOutRate);
        phaseOutApplied = true;
      }
    }

    return {
      name: 'Senior Australians and Pensioners Tax Offset',
      type: OffsetType.SAPTO,
      amount: Math.max(0, Math.round(amount * 100) / 100),
      eligibilityMet: amount > 0,
      phaseOutApplied,
      description: 'Tax offset for seniors and pensioners'
    };
  }

  /**
   * Calculate Medical Expenses Tax Offset
   */
  private calculateMedicalOffset(taxableIncome: number, medicalExpenses: number): AppliedOffset {
    const medical = this.offsets.MEDICAL;
    const threshold = medical.threshold;
    
    let amount = 0;
    if (medicalExpenses > threshold) {
      const excess = medicalExpenses - threshold;
      amount = excess * medical.rate;
    }

    return {
      name: 'Medical Expenses Tax Offset',
      type: OffsetType.MEDICAL,
      amount: Math.round(amount * 100) / 100,
      eligibilityMet: amount > 0,
      phaseOutApplied: false,
      description: `20% of medical expenses above $${threshold.toLocaleString()}`
    };
  }

  /**
   * Calculate Private Health Insurance Rebate
   */
  private calculatePrivateHealthRebate(
    taxableIncome: number,
    premium: number,
    hasSpouse: boolean
  ): AppliedOffset {
    const health = this.offsets.PRIVATE_HEALTH;
    let rebateRate = 0;

    // Determine rebate rate based on income
    const incomeThreshold = hasSpouse ? taxableIncome * 2 : taxableIncome; // Simplified family threshold

    if (incomeThreshold <= health.tier1.income) {
      rebateRate = health.tier1.rebate;
    } else if (incomeThreshold <= health.tier2.income) {
      rebateRate = health.tier2.rebate;
    } else if (incomeThreshold <= health.tier3.income) {
      rebateRate = health.tier3.rebate;
    } else {
      rebateRate = health.tier4.rebate;
    }

    const amount = premium * rebateRate;

    return {
      name: 'Private Health Insurance Rebate',
      type: OffsetType.PRIVATE_HEALTH,
      amount: Math.round(amount * 100) / 100,
      eligibilityMet: amount > 0,
      phaseOutApplied: rebateRate < health.tier1.rebate,
      description: `${(rebateRate * 100).toFixed(1)}% rebate on health insurance premiums`
    };
  }

  /**
   * Check eligibility for specific offset
   */
  isEligibleForOffset(offsetType: OffsetType, input: TaxOffsetsInput): boolean {
    switch (offsetType) {
      case OffsetType.LITO:
        return input.taxableIncome < this.offsets.LITO.phaseOutEnd;
      
      case OffsetType.SAPTO:
        return input.age >= 65 || input.isInvalidPensioner === true;
      
      case OffsetType.MEDICAL:
        return (input.medicalExpenses || 0) > this.offsets.MEDICAL.threshold;
      
      case OffsetType.PRIVATE_HEALTH:
        return input.hasPrivateHealthInsurance && (input.privateHealthInsurancePremium || 0) > 0;
      
      default:
        return false;
    }
  }

  /**
   * Get maximum possible offset for given type
   */
  getMaximumOffset(offsetType: OffsetType, input: TaxOffsetsInput): number {
    switch (offsetType) {
      case OffsetType.LITO:
        return this.offsets.LITO.maxOffset;
      
      case OffsetType.SAPTO:
        return input.hasSpouse ? 
          this.offsets.SAPTO.couple.maxOffset : 
          this.offsets.SAPTO.single.maxOffset;
      
      default:
        return 0;
    }
  }

  /**
   * Get current offset rates and thresholds
   */
  getOffsetRates() {
    return { ...this.offsets };
  }
}

export default TaxOffsetsCalculator;
