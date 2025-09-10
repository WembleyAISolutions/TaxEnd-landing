/**
 * Australian Tax Engine - Main Integration Module
 * Combines all tax calculation modules for comprehensive tax analysis
 */

import FederalTaxCalculator, { FederalTaxResult } from './federal-calculator';
import MedicareLevyCalculator, { MedicareLevyResult, MedicareLevyInput } from './medicare-levy';
import MedicareSurchargeCalculator, { MedicareSurchargeResult, MedicareSurchargeInput } from './medicare-surcharge';
import TaxOffsetsCalculator, { TaxOffsetsResult, TaxOffsetsInput } from './tax-offsets';
import SuperannuationCalculator, { SuperannuationResult, SuperannuationInput } from './superannuation';
import BracketCreepAnalyzer, { BracketCreepResult, BracketCreepInput } from './bracket-creep';
import NSWTaxCalculator, { NSWTaxResult, NSWTaxInput } from './state-taxes/nsw';
import VICTaxCalculator, { VICTaxResult, VICTaxInput } from './state-taxes/vic';
import QLDTaxCalculator, { QLDTaxResult, QLDTaxInput } from './state-taxes/qld';

export interface ComprehensiveTaxResult {
  federal: FederalTaxResult;
  medicareLevy: MedicareLevyResult;
  medicareSurcharge: MedicareSurchargeResult;
  taxOffsets: TaxOffsetsResult;
  superannuation?: SuperannuationResult;
  bracketCreep?: BracketCreepResult;
  stateTaxes?: {
    nsw?: NSWTaxResult;
    vic?: VICTaxResult;
    qld?: QLDTaxResult;
  };
  summary: TaxSummary;
}

export interface TaxSummary {
  grossIncome: number;
  taxableIncome: number;
  totalFederalTax: number;
  totalMedicareLevies: number;
  totalTaxOffsets: number;
  totalStateTaxes: number;
  netTaxPayable: number;
  afterTaxIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface ComprehensiveTaxInput {
  // Basic income information
  grossIncome: number;
  taxableIncome: number;
  
  // Personal details
  age: number;
  familyStatus: 'single' | 'family';
  dependentChildren: number;
  isResident: boolean;
  isSenior: boolean;
  
  // Medicare and health insurance
  hasPrivateHealthInsurance: boolean;
  privateHealthInsurancePremium?: number;
  spouseIncome?: number;
  spouseHasPrivateHealthInsurance?: boolean;
  
  // Tax offsets
  medicalExpenses?: number;
  isInvalidPensioner?: boolean;
  pensionIncome?: number;
  
  // Superannuation (optional)
  superannuation?: {
    currentBalance: number;
    voluntaryContributions: number;
    retirementAge: number;
    riskProfile: 'Conservative' | 'Balanced' | 'Growth' | 'Aggressive';
    spouseSalary?: number;
    spouseAge?: number;
    spouseSuperBalance?: number;
  };
  
  // Bracket creep analysis (optional)
  bracketCreepAnalysis?: {
    projectionYears: number;
    inflationRate: number;
    salaryGrowthRate: number;
    includeIndexation: boolean;
    indexationRate?: number;
  };
  
  // State taxes (optional)
  state?: 'NSW' | 'VIC' | 'QLD';
  stateTaxes?: {
    propertyValue?: number;
    isFirstHomeBuyer?: boolean;
    isNewHome?: boolean;
    isOwnerOccupied?: boolean;
    landValue?: number;
    isInvestmentProperty?: boolean;
    isPrincipalPlaceOfResidence?: boolean;
    isAbsenteeOwner?: boolean;
    annualPayroll?: number;
    isSmallBusiness?: boolean;
    apprenticeWages?: number;
    isAustralianCitizen?: boolean;
  };
}

export class AustralianTaxEngine {
  private federalCalculator: FederalTaxCalculator;
  private medicareLevyCalculator: MedicareLevyCalculator;
  private medicareSurchargeCalculator: MedicareSurchargeCalculator;
  private taxOffsetsCalculator: TaxOffsetsCalculator;
  private superannuationCalculator: SuperannuationCalculator;
  private bracketCreepAnalyzer: BracketCreepAnalyzer;
  private nswCalculator: NSWTaxCalculator;
  private vicCalculator: VICTaxCalculator;
  private qldCalculator: QLDTaxCalculator;

  constructor() {
    this.federalCalculator = new FederalTaxCalculator();
    this.medicareLevyCalculator = new MedicareLevyCalculator();
    this.medicareSurchargeCalculator = new MedicareSurchargeCalculator();
    this.taxOffsetsCalculator = new TaxOffsetsCalculator();
    this.superannuationCalculator = new SuperannuationCalculator();
    this.bracketCreepAnalyzer = new BracketCreepAnalyzer();
    this.nswCalculator = new NSWTaxCalculator();
    this.vicCalculator = new VICTaxCalculator();
    this.qldCalculator = new QLDTaxCalculator();
  }

  /**
   * Calculate comprehensive tax analysis
   */
  calculateComprehensiveTax(input: ComprehensiveTaxInput): ComprehensiveTaxResult {
    // Calculate federal tax
    const federal = this.federalCalculator.calculateFederalTax(input.taxableIncome);

    // Calculate Medicare levy
    const medicareLevyInput: MedicareLevyInput = {
      taxableIncome: input.taxableIncome,
      familyStatus: input.familyStatus,
      dependentChildren: input.dependentChildren,
      isSenior: input.isSenior,
      hasPrivateHealthInsurance: input.hasPrivateHealthInsurance,
      spouseIncome: input.spouseIncome
    };
    const medicareLevy = this.medicareLevyCalculator.calculateMedicareLevy(medicareLevyInput);

    // Calculate Medicare surcharge
    const medicareSurchargeInput: MedicareSurchargeInput = {
      taxableIncome: input.taxableIncome,
      familyStatus: input.familyStatus,
      dependentChildren: input.dependentChildren,
      hasPrivateHealthInsurance: input.hasPrivateHealthInsurance,
      spouseIncome: input.spouseIncome,
      spouseHasPrivateHealthInsurance: input.spouseHasPrivateHealthInsurance
    };
    const medicareSurcharge = this.medicareSurchargeCalculator.calculateMedicareSurcharge(medicareSurchargeInput);

    // Calculate tax offsets
    const taxOffsetsInput: TaxOffsetsInput = {
      taxableIncome: input.taxableIncome,
      federalTax: federal.federalTax,
      age: input.age,
      isResident: input.isResident,
      hasSpouse: input.familyStatus === 'family',
      spouseIncome: input.spouseIncome,
      dependentChildren: input.dependentChildren,
      medicalExpenses: input.medicalExpenses,
      privateHealthInsurancePremium: input.privateHealthInsurancePremium,
      hasPrivateHealthInsurance: input.hasPrivateHealthInsurance,
      pensionIncome: input.pensionIncome,
      isInvalidPensioner: input.isInvalidPensioner
    };
    const taxOffsets = this.taxOffsetsCalculator.calculateTaxOffsets(taxOffsetsInput);

    // Calculate superannuation (if requested)
    let superannuation: SuperannuationResult | undefined;
    if (input.superannuation) {
      const superInput: SuperannuationInput = {
        salary: input.grossIncome,
        age: input.age,
        currentSuperBalance: input.superannuation.currentBalance,
        marginalTaxRate: federal.marginalRate,
        voluntaryContributions: input.superannuation.voluntaryContributions,
        spouseSalary: input.superannuation.spouseSalary,
        spouseAge: input.superannuation.spouseAge,
        spouseSuperBalance: input.superannuation.spouseSuperBalance,
        retirementAge: input.superannuation.retirementAge,
        riskProfile: input.superannuation.riskProfile
      };
      superannuation = this.superannuationCalculator.calculateSuperannuation(superInput);
    }

    // Calculate bracket creep analysis (if requested)
    let bracketCreep: BracketCreepResult | undefined;
    if (input.bracketCreepAnalysis) {
      const bracketCreepInput: BracketCreepInput = {
        currentIncome: input.taxableIncome,
        currentAge: input.age,
        projectionYears: input.bracketCreepAnalysis.projectionYears,
        inflationRate: input.bracketCreepAnalysis.inflationRate,
        salaryGrowthRate: input.bracketCreepAnalysis.salaryGrowthRate,
        includeIndexation: input.bracketCreepAnalysis.includeIndexation,
        indexationRate: input.bracketCreepAnalysis.indexationRate
      };
      bracketCreep = this.bracketCreepAnalyzer.analyzeBracketCreep(bracketCreepInput);
    }

    // Calculate state taxes (if requested)
    let stateTaxes: { nsw?: NSWTaxResult; vic?: VICTaxResult; qld?: QLDTaxResult } | undefined;
    if (input.state && input.stateTaxes) {
      stateTaxes = {};
      
      switch (input.state) {
        case 'NSW':
          const nswInput: NSWTaxInput = {
            ...input.stateTaxes,
            isNSWResident: true
          };
          stateTaxes.nsw = this.nswCalculator.calculateNSWTaxes(nswInput);
          break;
          
        case 'VIC':
          const vicInput: VICTaxInput = {
            ...input.stateTaxes,
            isVICResident: true
          };
          stateTaxes.vic = this.vicCalculator.calculateVICTaxes(vicInput);
          break;
          
        case 'QLD':
          const qldInput: QLDTaxInput = {
            ...input.stateTaxes,
            isQLDResident: true
          };
          stateTaxes.qld = this.qldCalculator.calculateQLDTaxes(qldInput);
          break;
      }
    }

    // Calculate summary
    const summary = this.calculateSummary(
      input,
      federal,
      medicareLevy,
      medicareSurcharge,
      taxOffsets,
      stateTaxes
    );

    return {
      federal,
      medicareLevy,
      medicareSurcharge,
      taxOffsets,
      superannuation,
      bracketCreep,
      stateTaxes,
      summary
    };
  }

  /**
   * Calculate tax summary
   */
  private calculateSummary(
    input: ComprehensiveTaxInput,
    federal: FederalTaxResult,
    medicareLevy: MedicareLevyResult,
    medicareSurcharge: MedicareSurchargeResult,
    taxOffsets: TaxOffsetsResult,
    stateTaxes?: { nsw?: NSWTaxResult; vic?: VICTaxResult; qld?: QLDTaxResult }
  ): TaxSummary {
    const totalMedicareLevies = medicareLevy.medicareLevy + medicareSurcharge.surcharge;
    
    let totalStateTaxes = 0;
    if (stateTaxes) {
      if (stateTaxes.nsw) totalStateTaxes += stateTaxes.nsw.totalStateTaxes;
      if (stateTaxes.vic) totalStateTaxes += stateTaxes.vic.totalStateTaxes;
      if (stateTaxes.qld) totalStateTaxes += stateTaxes.qld.totalStateTaxes;
    }

    const netTaxPayable = Math.max(0, 
      federal.federalTax + totalMedicareLevies - taxOffsets.totalOffsets + totalStateTaxes
    );
    
    const afterTaxIncome = input.grossIncome - netTaxPayable;
    const effectiveTaxRate = input.grossIncome > 0 ? netTaxPayable / input.grossIncome : 0;

    return {
      grossIncome: input.grossIncome,
      taxableIncome: input.taxableIncome,
      totalFederalTax: federal.federalTax,
      totalMedicareLevies,
      totalTaxOffsets: taxOffsets.totalOffsets,
      totalStateTaxes,
      netTaxPayable: Math.round(netTaxPayable * 100) / 100,
      afterTaxIncome: Math.round(afterTaxIncome * 100) / 100,
      effectiveTaxRate: Math.round(effectiveTaxRate * 10000) / 100, // Convert to percentage
      marginalTaxRate: federal.marginalRate
    };
  }

  /**
   * Quick tax calculation for simple scenarios
   */
  calculateSimpleTax(taxableIncome: number, options: {
    familyStatus?: 'single' | 'family';
    hasPrivateHealthInsurance?: boolean;
    age?: number;
  } = {}): {
    federalTax: number;
    medicareLevy: number;
    medicareSurcharge: number;
    totalTax: number;
    afterTaxIncome: number;
    effectiveRate: number;
  } {
    const federal = this.federalCalculator.calculateFederalTax(taxableIncome);
    
    const medicareLevyInput: MedicareLevyInput = {
      taxableIncome,
      familyStatus: options.familyStatus || 'single',
      dependentChildren: 0,
      isSenior: (options.age || 0) >= 65,
      hasPrivateHealthInsurance: options.hasPrivateHealthInsurance || false
    };
    const medicareLevy = this.medicareLevyCalculator.calculateMedicareLevy(medicareLevyInput);

    const medicareSurchargeInput: MedicareSurchargeInput = {
      taxableIncome,
      familyStatus: options.familyStatus || 'single',
      dependentChildren: 0,
      hasPrivateHealthInsurance: options.hasPrivateHealthInsurance || false
    };
    const medicareSurcharge = this.medicareSurchargeCalculator.calculateMedicareSurcharge(medicareSurchargeInput);

    const totalTax = federal.federalTax + medicareLevy.medicareLevy + medicareSurcharge.surcharge;
    const afterTaxIncome = taxableIncome - totalTax;
    const effectiveRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;

    return {
      federalTax: federal.federalTax,
      medicareLevy: medicareLevy.medicareLevy,
      medicareSurcharge: medicareSurcharge.surcharge,
      totalTax: Math.round(totalTax * 100) / 100,
      afterTaxIncome: Math.round(afterTaxIncome * 100) / 100,
      effectiveRate: Math.round(effectiveRate * 10000) / 100
    };
  }

  /**
   * Compare tax scenarios
   */
  compareTaxScenarios(scenarios: { name: string; input: ComprehensiveTaxInput }[]): {
    name: string;
    result: ComprehensiveTaxResult;
  }[] {
    return scenarios.map(scenario => ({
      name: scenario.name,
      result: this.calculateComprehensiveTax(scenario.input)
    }));
  }

  /**
   * Get all calculator instances for direct access
   */
  getCalculators() {
    return {
      federal: this.federalCalculator,
      medicareLevy: this.medicareLevyCalculator,
      medicareSurcharge: this.medicareSurchargeCalculator,
      taxOffsets: this.taxOffsetsCalculator,
      superannuation: this.superannuationCalculator,
      bracketCreep: this.bracketCreepAnalyzer,
      nsw: this.nswCalculator,
      vic: this.vicCalculator,
      qld: this.qldCalculator
    };
  }
}

// Export all individual calculators and types
export {
  FederalTaxCalculator,
  MedicareLevyCalculator,
  MedicareSurchargeCalculator,
  TaxOffsetsCalculator,
  SuperannuationCalculator,
  BracketCreepAnalyzer,
  NSWTaxCalculator,
  VICTaxCalculator,
  QLDTaxCalculator
};

export type {
  FederalTaxResult,
  MedicareLevyResult,
  MedicareSurchargeResult,
  TaxOffsetsResult,
  SuperannuationResult,
  BracketCreepResult,
  NSWTaxResult,
  VICTaxResult,
  QLDTaxResult
};

export default AustralianTaxEngine;
