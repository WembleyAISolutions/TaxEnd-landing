import { describe, it, expect } from '@jest/globals';
import {
  calculateBaseTax,
  calculateMedicareLevy,
  calculateMedicareLevySurcharge,
  calculateLowIncomeTaxOffset,
  calculateHelpRepayment,
  getMarginalRate,
  calculateFederalTax
} from '../lib/tax-engine/federal-calculator';
import type { TaxCalculationInput } from '../lib/types/tax-types';

describe('Federal Tax Calculator', () => {
  describe('calculateBaseTax', () => {
    it('should calculate correct tax for tax-free threshold', () => {
      expect(calculateBaseTax(18200, true)).toBe(0);
    });

    it('should calculate correct tax for 19% bracket', () => {
      expect(calculateBaseTax(30000, true)).toBeCloseTo(2242, 0); // (30000 - 18200) * 0.19
    });

    it('should calculate correct tax for 32.5% bracket', () => {
      expect(calculateBaseTax(80000, true)).toBeCloseTo(16467, 0); // 5092 + (80000 - 45000) * 0.325
    });

    it('should calculate correct tax for non-residents', () => {
      expect(calculateBaseTax(50000, false)).toBe(16250); // 50000 * 0.325
    });
  });

  describe('calculateMedicareLevy', () => {
    it('should return 0 for income below threshold', () => {
      expect(calculateMedicareLevy(25000, 'single', 0, false)).toBe(0);
    });

    it('should calculate phase-in for income just above threshold', () => {
      const result = calculateMedicareLevy(30000, 'single', 0, false);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(30000 * 0.02);
    });

    it('should calculate full 2% for high income', () => {
      expect(calculateMedicareLevy(100000, 'single', 0, false)).toBe(2000);
    });

    it('should adjust threshold for families with dependents', () => {
      const singleLevy = calculateMedicareLevy(50000, 'single', 0, false);
      const familyLevy = calculateMedicareLevy(50000, 'family', 2, false);
      expect(familyLevy).toBeLessThan(singleLevy);
    });
  });

  describe('calculateMedicareLevySurcharge', () => {
    it('should return 0 for those with private health insurance', () => {
      expect(calculateMedicareLevySurcharge(150000, true, 'single')).toBe(0);
    });

    it('should return 0 for income below threshold', () => {
      expect(calculateMedicareLevySurcharge(90000, false, 'single')).toBe(0);
    });

    it('should calculate 1% surcharge for tier 1', () => {
      expect(calculateMedicareLevySurcharge(100000, false, 'single')).toBe(1000);
    });

    it('should calculate 1.5% surcharge for tier 3', () => {
      expect(calculateMedicareLevySurcharge(200000, false, 'single')).toBe(3000);
    });
  });

  describe('calculateLowIncomeTaxOffset', () => {
    it('should return full offset for low income', () => {
      expect(calculateLowIncomeTaxOffset(30000)).toBe(700);
    });

    it('should return reduced offset in phase-out range', () => {
      const offset = calculateLowIncomeTaxOffset(40000);
      expect(offset).toBeGreaterThan(0);
      expect(offset).toBeLessThan(700);
    });

    it('should return 0 for high income', () => {
      expect(calculateLowIncomeTaxOffset(50000)).toBe(0);
    });
  });

  describe('calculateHelpRepayment', () => {
    it('should return 0 for income below threshold', () => {
      expect(calculateHelpRepayment(50000, 30000)).toBe(0);
    });

    it('should calculate 1% repayment for first bracket', () => {
      expect(calculateHelpRepayment(60000, 30000)).toBe(600);
    });

    it('should not exceed debt amount', () => {
      expect(calculateHelpRepayment(100000, 500)).toBe(500);
    });
  });

  describe('getMarginalRate', () => {
    it('should return 0% for tax-free threshold', () => {
      expect(getMarginalRate(15000, true)).toBe(0);
    });

    it('should return 19% for second bracket', () => {
      expect(getMarginalRate(30000, true)).toBe(0.19);
    });

    it('should return 32.5% for third bracket', () => {
      expect(getMarginalRate(80000, true)).toBe(0.325);
    });

    it('should return 45% for top bracket', () => {
      expect(getMarginalRate(200000, true)).toBe(0.45);
    });
  });

  describe('calculateFederalTax - Integration Tests', () => {
    it('should calculate comprehensive tax for typical resident', () => {
      const input: TaxCalculationInput = {
        annualIncome: 80000,
        isResident: true,
        hasPrivateHealthInsurance: false,
        familyStatus: 'single',
        numberOfDependents: 0,
        age: 30,
        isSenior: false,
        superContribution: 5000,
        salarySacrifice: 0,
        helpDebt: 25000,
        workDeductions: 2000
      };

      const result = calculateFederalTax(input);

      expect(result.grossIncome).toBe(80000);
      expect(result.taxableIncome).toBe(78000); // 80000 - 2000 deductions
      expect(result.baseTax).toBeGreaterThan(0);
      expect(result.medicareLevy).toBeGreaterThan(0);
      expect(result.lowIncomeTaxOffset).toBe(0); // Income too high
      expect(result.helpRepayment).toBeGreaterThan(0);
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.netIncome).toBeLessThan(result.grossIncome);
      expect(result.effectiveRate).toBeGreaterThan(0);
      expect(result.marginalRate).toBe(0.325);
    });

    it('should calculate tax for low income earner with LITO', () => {
      const input: TaxCalculationInput = {
        annualIncome: 35000,
        isResident: true,
        hasPrivateHealthInsurance: false,
        familyStatus: 'single',
        numberOfDependents: 0,
        age: 25,
        isSenior: false,
        superContribution: 0,
        salarySacrifice: 0,
        helpDebt: 0,
        workDeductions: 0
      };

      const result = calculateFederalTax(input);

      expect(result.grossIncome).toBe(35000);
      expect(result.taxableIncome).toBe(35000);
      expect(result.baseTax).toBeGreaterThan(0);
      expect(result.lowIncomeTaxOffset).toBe(700); // Full LITO
      expect(result.medicareLevy).toBeGreaterThan(0); // Above threshold
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.marginalRate).toBe(0.19);
    });

    it('should calculate tax for high income earner with MLS', () => {
      const input: TaxCalculationInput = {
        annualIncome: 150000,
        isResident: true,
        hasPrivateHealthInsurance: false,
        familyStatus: 'single',
        numberOfDependents: 0,
        age: 40,
        isSenior: false,
        superContribution: 10000,
        salarySacrifice: 5000,
        helpDebt: 0,
        workDeductions: 3000
      };

      const result = calculateFederalTax(input);

      expect(result.grossIncome).toBe(150000);
      expect(result.taxableIncome).toBe(142000); // 150000 - 5000 - 3000
      expect(result.baseTax).toBeGreaterThan(0);
      expect(result.medicareLevy).toBeGreaterThan(0);
      expect(result.medicareLevySurcharge).toBeGreaterThan(0); // No PHI
      expect(result.lowIncomeTaxOffset).toBe(0); // Income too high
      expect(result.superannuationContribution).toBe(15000);
      expect(result.superTaxSaving).toBeGreaterThan(0);
      expect(result.marginalRate).toBe(0.37);
    });

    it('should calculate tax for non-resident', () => {
      const input: TaxCalculationInput = {
        annualIncome: 70000,
        isResident: false,
        hasPrivateHealthInsurance: false,
        familyStatus: 'single',
        numberOfDependents: 0,
        age: 30,
        isSenior: false,
        superContribution: 0,
        salarySacrifice: 0,
        helpDebt: 0,
        workDeductions: 0
      };

      const result = calculateFederalTax(input);

      expect(result.grossIncome).toBe(70000);
      expect(result.taxableIncome).toBe(70000);
      expect(result.baseTax).toBe(22750); // 70000 * 0.325
      expect(result.medicareLevy).toBe(0); // Non-residents don't pay
      expect(result.medicareLevySurcharge).toBe(0); // Non-residents don't pay
      expect(result.lowIncomeTaxOffset).toBe(0); // Non-residents don't get
      expect(result.marginalRate).toBe(0.325);
    });

    it('should handle edge case of zero income', () => {
      const input: TaxCalculationInput = {
        annualIncome: 0,
        isResident: true,
        hasPrivateHealthInsurance: false,
        familyStatus: 'single',
        numberOfDependents: 0,
        age: 30,
        isSenior: false,
        superContribution: 0,
        salarySacrifice: 0,
        helpDebt: 0,
        workDeductions: 0
      };

      const result = calculateFederalTax(input);

      expect(result.grossIncome).toBe(0);
      expect(result.taxableIncome).toBe(0);
      expect(result.baseTax).toBe(0);
      expect(result.medicareLevy).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(0);
      expect(result.effectiveRate).toBe(0);
      expect(result.marginalRate).toBe(0);
    });
  });
});
