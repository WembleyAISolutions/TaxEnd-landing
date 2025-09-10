/**
 * Australian Superannuation Calculator
 * Implements superannuation calculations and optimization strategies for 2024-25
 */

export interface SuperannuationResult {
  mandatoryContribution: number;
  voluntaryContribution: number;
  totalContribution: number;
  taxSavings: number;
  netCost: number;
  futureValue: FutureValueProjection;
  recommendations: SuperRecommendation[];
}

export interface FutureValueProjection {
  years: number;
  projectedBalance: number;
  totalContributions: number;
  totalReturns: number;
  assumedReturnRate: number;
}

export interface SuperRecommendation {
  strategy: string;
  description: string;
  potentialSaving: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  suitability: string;
}

export interface SuperannuationInput {
  salary: number;
  age: number;
  currentSuperBalance: number;
  marginalTaxRate: number;
  voluntaryContributions: number;
  spouseSalary?: number;
  spouseAge?: number;
  spouseSuperBalance?: number;
  retirementAge: number;
  riskProfile: 'Conservative' | 'Balanced' | 'Growth' | 'Aggressive';
}

// 2024-25 Superannuation rates and caps
export const SUPER_RATES_2024_25 = {
  mandatoryRate: 0.115, // 11.5% from 1 July 2024
  concessionalCap: 30000, // Annual concessional contributions cap
  nonConcessionalCap: 120000, // Annual non-concessional contributions cap
  superTaxRate: 0.15, // 15% tax on concessional contributions
  preservationAge: {
    before1960: 55,
    from1960to1964: 56,
    from1965: 60
  },
  pensionAge: 67,
  transferBalanceCap: 1900000, // 2024-25 transfer balance cap
  divisionTaxRate: 0.30 // Division 293 tax rate for high earners
};

// Assumed investment returns by risk profile
export const INVESTMENT_RETURNS = {
  Conservative: 0.05, // 5% p.a.
  Balanced: 0.07, // 7% p.a.
  Growth: 0.08, // 8% p.a.
  Aggressive: 0.09 // 9% p.a.
};

export class SuperannuationCalculator {
  private rates = SUPER_RATES_2024_25;
  private returns = INVESTMENT_RETURNS;

  /**
   * Calculate comprehensive superannuation analysis
   */
  calculateSuperannuation(input: SuperannuationInput): SuperannuationResult {
    const mandatoryContribution = this.calculateMandatoryContribution(input.salary);
    const voluntaryContribution = input.voluntaryContributions;
    const totalContribution = mandatoryContribution + voluntaryContribution;

    // Calculate tax savings from voluntary contributions
    const taxSavings = this.calculateTaxSavings(
      voluntaryContribution,
      input.marginalTaxRate
    );

    const netCost = voluntaryContribution - taxSavings;

    // Project future value
    const yearsToRetirement = input.retirementAge - input.age;
    const futureValue = this.projectFutureValue(
      input.currentSuperBalance,
      totalContribution,
      yearsToRetirement,
      input.riskProfile
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(input);

    return {
      mandatoryContribution: Math.round(mandatoryContribution * 100) / 100,
      voluntaryContribution,
      totalContribution: Math.round(totalContribution * 100) / 100,
      taxSavings: Math.round(taxSavings * 100) / 100,
      netCost: Math.round(netCost * 100) / 100,
      futureValue,
      recommendations
    };
  }

  /**
   * Calculate mandatory superannuation contribution
   */
  private calculateMandatoryContribution(salary: number): number {
    return salary * this.rates.mandatoryRate;
  }

  /**
   * Calculate tax savings from voluntary contributions
   */
  private calculateTaxSavings(
    voluntaryContribution: number,
    marginalTaxRate: number
  ): number {
    // Tax saving = (Marginal rate - Super tax rate) × Contribution
    const taxDifference = marginalTaxRate - this.rates.superTaxRate;
    return voluntaryContribution * Math.max(0, taxDifference);
  }

  /**
   * Project future superannuation balance
   */
  private projectFutureValue(
    currentBalance: number,
    annualContribution: number,
    years: number,
    riskProfile: keyof typeof INVESTMENT_RETURNS
  ): FutureValueProjection {
    const returnRate = this.returns[riskProfile];
    const totalContributions = annualContribution * years;
    
    // Future value of current balance
    const futureCurrentBalance = currentBalance * Math.pow(1 + returnRate, years);
    
    // Future value of annual contributions (annuity)
    const futureContributions = annualContribution * 
      ((Math.pow(1 + returnRate, years) - 1) / returnRate);
    
    const projectedBalance = futureCurrentBalance + futureContributions;
    const totalReturns = projectedBalance - currentBalance - totalContributions;

    return {
      years,
      projectedBalance: Math.round(projectedBalance * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalReturns: Math.round(totalReturns * 100) / 100,
      assumedReturnRate: returnRate
    };
  }

  /**
   * Generate personalized superannuation recommendations
   */
  private generateRecommendations(input: SuperannuationInput): SuperRecommendation[] {
    const recommendations: SuperRecommendation[] = [];
    const currentContributions = this.calculateMandatoryContribution(input.salary) + input.voluntaryContributions;

    // Recommendation 1: Maximize concessional contributions
    if (currentContributions < this.rates.concessionalCap) {
      const additionalCapacity = this.rates.concessionalCap - currentContributions;
      const potentialSaving = this.calculateTaxSavings(additionalCapacity, input.marginalTaxRate);
      
      recommendations.push({
        strategy: 'Maximize Concessional Contributions',
        description: `You can contribute an additional $${additionalCapacity.toLocaleString()} in concessional contributions this year.`,
        potentialSaving,
        riskLevel: 'Low',
        suitability: 'Suitable for most taxpayers with available income'
      });
    }

    // Recommendation 2: Salary sacrifice strategy
    if (input.marginalTaxRate > this.rates.superTaxRate) {
      const salaryToSacrifice = Math.min(10000, this.rates.concessionalCap - currentContributions);
      const potentialSaving = this.calculateTaxSavings(salaryToSacrifice, input.marginalTaxRate);
      
      recommendations.push({
        strategy: 'Salary Sacrifice',
        description: `Consider salary sacrificing $${salaryToSacrifice.toLocaleString()} to reduce your tax burden.`,
        potentialSaving,
        riskLevel: 'Low',
        suitability: 'Ideal for higher income earners'
      });
    }

    // Recommendation 3: Spouse contribution strategy
    if (input.spouseSalary !== undefined && input.spouseSalary < 40000) {
      const spouseContribution = Math.min(3000, 40000 - input.spouseSalary);
      const taxOffset = Math.min(540, spouseContribution * 0.18);
      
      recommendations.push({
        strategy: 'Spouse Contribution',
        description: `Contribute $${spouseContribution.toLocaleString()} to your spouse's super for a tax offset of up to $${taxOffset.toLocaleString()}.`,
        potentialSaving: taxOffset,
        riskLevel: 'Low',
        suitability: 'Suitable when spouse has low income'
      });
    }

    // Recommendation 4: Catch-up contributions (if over 50)
    if (input.age >= 50) {
      recommendations.push({
        strategy: 'Catch-up Contributions',
        description: 'Consider making additional contributions as you approach retirement to boost your super balance.',
        potentialSaving: 0,
        riskLevel: 'Medium',
        suitability: 'Important for those nearing retirement with insufficient savings'
      });
    }

    // Recommendation 5: Investment strategy review
    const yearsToRetirement = input.retirementAge - input.age;
    if (yearsToRetirement > 10 && input.riskProfile === 'Conservative') {
      recommendations.push({
        strategy: 'Review Investment Strategy',
        description: 'With significant time until retirement, consider a more growth-oriented investment strategy.',
        potentialSaving: 0,
        riskLevel: 'Medium',
        suitability: 'Suitable for those with long investment timeframes'
      });
    }

    return recommendations;
  }

  /**
   * Calculate optimal contribution strategy
   */
  calculateOptimalContribution(
    salary: number,
    marginalTaxRate: number,
    currentContributions: number
  ): {
    recommendedContribution: number;
    taxSavings: number;
    netCost: number;
  } {
    const mandatoryContribution = this.calculateMandatoryContribution(salary);
    const maxAdditional = this.rates.concessionalCap - mandatoryContribution - currentContributions;
    
    // Recommend contributing up to the cap if tax rate is beneficial
    const recommendedAdditional = marginalTaxRate > this.rates.superTaxRate ? 
      Math.min(maxAdditional, salary * 0.1) : 0; // Max 10% of salary as additional
    
    const taxSavings = this.calculateTaxSavings(recommendedAdditional, marginalTaxRate);
    const netCost = recommendedAdditional - taxSavings;

    return {
      recommendedContribution: Math.round(recommendedAdditional * 100) / 100,
      taxSavings: Math.round(taxSavings * 100) / 100,
      netCost: Math.round(netCost * 100) / 100
    };
  }

  /**
   * Check if Division 293 tax applies (high income earners)
   */
  isDivision293Applicable(
    taxableIncome: number,
    concessionalContributions: number
  ): {
    applicable: boolean;
    additionalTax: number;
    threshold: number;
  } {
    const threshold = 250000;
    const applicable = taxableIncome + concessionalContributions > threshold;
    
    let additionalTax = 0;
    if (applicable) {
      const excess = Math.min(
        concessionalContributions,
        (taxableIncome + concessionalContributions) - threshold
      );
      additionalTax = excess * this.rates.divisionTaxRate;
    }

    return {
      applicable,
      additionalTax: Math.round(additionalTax * 100) / 100,
      threshold
    };
  }

  /**
   * Get current superannuation rates and caps
   */
  getSuperRates() {
    return { ...this.rates };
  }

  /**
   * Get investment return assumptions
   */
  getInvestmentReturns() {
    return { ...this.returns };
  }
}

export default SuperannuationCalculator;
