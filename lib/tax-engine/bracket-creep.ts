/**
 * Australian Bracket Creep Analyzer
 * Analyzes the impact of bracket creep on taxpayers over time
 */

export interface BracketCreepResult {
  currentYear: BracketCreepAnalysis;
  projections: BracketCreepProjection[];
  summary: BracketCreepSummary;
  recommendations: BracketCreepRecommendation[];
}

export interface BracketCreepAnalysis {
  year: number;
  income: number;
  federalTax: number;
  marginalRate: number;
  averageRate: number;
  afterTaxIncome: number;
  realAfterTaxIncome: number; // Adjusted for inflation
}

export interface BracketCreepProjection {
  year: number;
  nominalIncome: number;
  realIncome: number; // Adjusted for inflation
  federalTax: number;
  marginalRate: number;
  averageRate: number;
  afterTaxIncome: number;
  realAfterTaxIncome: number;
  bracketCreepImpact: number; // Additional tax due to bracket creep
  cumulativeBracketCreep: number;
}

export interface BracketCreepSummary {
  totalBracketCreepImpact: number;
  averageAnnualImpact: number;
  realIncomeDecline: number;
  effectiveTaxRateIncrease: number;
  yearsAnalyzed: number;
}

export interface BracketCreepRecommendation {
  strategy: string;
  description: string;
  potentialMitigation: number;
  timeframe: string;
  complexity: 'Simple' | 'Moderate' | 'Complex';
}

export interface BracketCreepInput {
  currentIncome: number;
  currentAge: number;
  projectionYears: number;
  inflationRate: number;
  salaryGrowthRate: number;
  includeIndexation: boolean; // Whether tax brackets are indexed
  indexationRate?: number; // Rate at which brackets are indexed (if any)
}

// Historical and projected inflation rates
export const ECONOMIC_ASSUMPTIONS = {
  defaultInflationRate: 0.025, // 2.5% RBA target
  defaultSalaryGrowthRate: 0.03, // 3% typical salary growth
  defaultIndexationRate: 0.025, // Assume brackets indexed to inflation
  bracketIndexationLag: 1 // Years of lag in bracket indexation
};

export class BracketCreepAnalyzer {
  private assumptions = ECONOMIC_ASSUMPTIONS;

  /**
   * Analyze bracket creep impact over time
   */
  analyzeBracketCreep(input: BracketCreepInput): BracketCreepResult {
    const currentYear = new Date().getFullYear();
    const projections: BracketCreepProjection[] = [];
    
    // Import federal calculator for tax calculations
    const FederalTaxCalculator = require('./federal-calculator').default;
    const taxCalculator = new FederalTaxCalculator();

    // Calculate current year baseline
    const currentAnalysis = this.calculateCurrentYear(input, taxCalculator);
    
    let cumulativeBracketCreep = 0;

    // Project future years
    for (let year = 1; year <= input.projectionYears; year++) {
      const projection = this.calculateProjection(
        input,
        year,
        currentYear + year,
        taxCalculator,
        cumulativeBracketCreep
      );
      
      cumulativeBracketCreep = projection.cumulativeBracketCreep;
      projections.push(projection);
    }

    // Calculate summary
    const summary = this.calculateSummary(projections, input);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(input, summary);

    return {
      currentYear: currentAnalysis,
      projections,
      summary,
      recommendations
    };
  }

  /**
   * Calculate current year analysis
   */
  private calculateCurrentYear(
    input: BracketCreepInput,
    taxCalculator: any
  ): BracketCreepAnalysis {
    const taxResult = taxCalculator.calculateFederalTax(input.currentIncome);
    const afterTaxIncome = input.currentIncome - taxResult.federalTax;

    return {
      year: new Date().getFullYear(),
      income: input.currentIncome,
      federalTax: taxResult.federalTax,
      marginalRate: taxResult.marginalRate,
      averageRate: taxResult.averageRate / 100,
      afterTaxIncome,
      realAfterTaxIncome: afterTaxIncome // Base year, so real = nominal
    };
  }

  /**
   * Calculate projection for a specific year
   */
  private calculateProjection(
    input: BracketCreepInput,
    yearOffset: number,
    projectionYear: number,
    taxCalculator: any,
    previousCumulativeBracketCreep: number
  ): BracketCreepProjection {
    // Calculate nominal income growth
    const nominalIncome = input.currentIncome * 
      Math.pow(1 + input.salaryGrowthRate, yearOffset);
    
    // Calculate real income (adjusted for inflation)
    const realIncome = nominalIncome / 
      Math.pow(1 + input.inflationRate, yearOffset);

    // Calculate tax with current brackets (no indexation scenario)
    const taxWithoutIndexation = taxCalculator.calculateFederalTax(nominalIncome);
    
    // Calculate tax with indexed brackets (if applicable)
    let taxWithIndexation = taxWithoutIndexation;
    if (input.includeIndexation && input.indexationRate) {
      // Simulate indexed brackets (simplified - would need actual bracket adjustment)
      const indexationFactor = Math.pow(1 + input.indexationRate, 
        Math.max(0, yearOffset - this.assumptions.bracketIndexationLag));
      
      // Approximate tax with indexed brackets
      const effectiveIncome = nominalIncome / indexationFactor;
      const indexedTaxResult = taxCalculator.calculateFederalTax(effectiveIncome);
      taxWithIndexation = {
        ...indexedTaxResult,
        federalTax: indexedTaxResult.federalTax * indexationFactor
      };
    }

    const federalTax = input.includeIndexation ? 
      taxWithIndexation.federalTax : taxWithoutIndexation.federalTax;
    
    const afterTaxIncome = nominalIncome - federalTax;
    const realAfterTaxIncome = afterTaxIncome / 
      Math.pow(1 + input.inflationRate, yearOffset);

    // Calculate bracket creep impact
    const baselineTax = input.currentIncome * (taxWithoutIndexation.averageRate / 100);
    const inflationAdjustedBaselineTax = baselineTax * 
      Math.pow(1 + input.inflationRate, yearOffset);
    
    const bracketCreepImpact = federalTax - inflationAdjustedBaselineTax;
    const cumulativeBracketCreep = previousCumulativeBracketCreep + bracketCreepImpact;

    return {
      year: projectionYear,
      nominalIncome: Math.round(nominalIncome * 100) / 100,
      realIncome: Math.round(realIncome * 100) / 100,
      federalTax: Math.round(federalTax * 100) / 100,
      marginalRate: taxWithoutIndexation.marginalRate,
      averageRate: taxWithoutIndexation.averageRate / 100,
      afterTaxIncome: Math.round(afterTaxIncome * 100) / 100,
      realAfterTaxIncome: Math.round(realAfterTaxIncome * 100) / 100,
      bracketCreepImpact: Math.round(bracketCreepImpact * 100) / 100,
      cumulativeBracketCreep: Math.round(cumulativeBracketCreep * 100) / 100
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(
    projections: BracketCreepProjection[],
    input: BracketCreepInput
  ): BracketCreepSummary {
    const totalBracketCreepImpact = projections.reduce(
      (sum, p) => sum + p.bracketCreepImpact, 0
    );
    
    const averageAnnualImpact = totalBracketCreepImpact / projections.length;
    
    const firstYear = projections[0];
    const lastYear = projections[projections.length - 1];
    
    const realIncomeDecline = firstYear.realAfterTaxIncome - lastYear.realAfterTaxIncome;
    const effectiveTaxRateIncrease = lastYear.averageRate - firstYear.averageRate;

    return {
      totalBracketCreepImpact: Math.round(totalBracketCreepImpact * 100) / 100,
      averageAnnualImpact: Math.round(averageAnnualImpact * 100) / 100,
      realIncomeDecline: Math.round(realIncomeDecline * 100) / 100,
      effectiveTaxRateIncrease: Math.round(effectiveTaxRateIncrease * 10000) / 100, // Convert to percentage
      yearsAnalyzed: projections.length
    };
  }

  /**
   * Generate recommendations to mitigate bracket creep
   */
  private generateRecommendations(
    input: BracketCreepInput,
    summary: BracketCreepSummary
  ): BracketCreepRecommendation[] {
    const recommendations: BracketCreepRecommendation[] = [];

    // Recommendation 1: Salary sacrifice to superannuation
    const superSacrificeAmount = Math.min(10000, input.currentIncome * 0.1);
    const potentialSaving = superSacrificeAmount * 0.15; // Approximate tax saving
    
    recommendations.push({
      strategy: 'Salary Sacrifice to Superannuation',
      description: `Salary sacrifice $${superSacrificeAmount.toLocaleString()} annually to reduce taxable income and mitigate bracket creep.`,
      potentialMitigation: potentialSaving * input.projectionYears,
      timeframe: 'Immediate and ongoing',
      complexity: 'Simple'
    });

    // Recommendation 2: Investment in tax-effective structures
    if (summary.totalBracketCreepImpact > 5000) {
      recommendations.push({
        strategy: 'Tax-Effective Investment Structures',
        description: 'Consider investing in tax-effective vehicles like franked dividends, growth assets, or investment bonds.',
        potentialMitigation: summary.totalBracketCreepImpact * 0.3,
        timeframe: 'Medium to long term',
        complexity: 'Moderate'
      });
    }

    // Recommendation 3: Income splitting strategies
    recommendations.push({
      strategy: 'Income Splitting Strategies',
      description: 'Explore legitimate income splitting opportunities with family members in lower tax brackets.',
      potentialMitigation: summary.averageAnnualImpact * 0.5 * input.projectionYears,
      timeframe: 'Requires planning',
      complexity: 'Complex'
    });

    // Recommendation 4: Timing of income and deductions
    recommendations.push({
      strategy: 'Strategic Timing of Income and Deductions',
      description: 'Time the receipt of income and claiming of deductions to optimize tax outcomes across financial years.',
      potentialMitigation: summary.averageAnnualImpact * 0.2 * input.projectionYears,
      timeframe: 'Annual planning',
      complexity: 'Moderate'
    });

    // Recommendation 5: Professional tax advice
    if (summary.totalBracketCreepImpact > 10000) {
      recommendations.push({
        strategy: 'Professional Tax Planning',
        description: 'Engage a tax professional to develop a comprehensive strategy tailored to your specific circumstances.',
        potentialMitigation: summary.totalBracketCreepImpact * 0.4,
        timeframe: 'Immediate consultation',
        complexity: 'Simple'
      });
    }

    return recommendations;
  }

  /**
   * Compare scenarios with and without bracket indexation
   */
  compareIndexationScenarios(input: BracketCreepInput): {
    withoutIndexation: BracketCreepResult;
    withIndexation: BracketCreepResult;
    difference: {
      totalTaxSavings: number;
      averageAnnualSavings: number;
      realIncomeProtection: number;
    };
  } {
    // Scenario 1: Without indexation
    const withoutIndexation = this.analyzeBracketCreep({
      ...input,
      includeIndexation: false
    });

    // Scenario 2: With indexation
    const withIndexation = this.analyzeBracketCreep({
      ...input,
      includeIndexation: true,
      indexationRate: input.indexationRate || this.assumptions.defaultIndexationRate
    });

    // Calculate differences
    const totalTaxSavings = withoutIndexation.summary.totalBracketCreepImpact - 
      withIndexation.summary.totalBracketCreepImpact;
    
    const averageAnnualSavings = totalTaxSavings / input.projectionYears;
    
    const realIncomeProtection = withIndexation.summary.realIncomeDecline - 
      withoutIndexation.summary.realIncomeDecline;

    return {
      withoutIndexation,
      withIndexation,
      difference: {
        totalTaxSavings: Math.round(totalTaxSavings * 100) / 100,
        averageAnnualSavings: Math.round(averageAnnualSavings * 100) / 100,
        realIncomeProtection: Math.round(realIncomeProtection * 100) / 100
      }
    };
  }

  /**
   * Get economic assumptions used in calculations
   */
  getEconomicAssumptions() {
    return { ...this.assumptions };
  }
}

export default BracketCreepAnalyzer;
