import { TaxInputData, TaxCalculationResult, AgeGroup } from '../../types/australian-tax';
import { AustralianTaxCalculator } from './australian-calculator';

export interface ProjectionParameters {
  startYear: number;
  endYear: number;
  incomeGrowthRate: number; // Annual percentage
  inflationRate: number; // Annual percentage
  superContributionStrategy: 'minimum' | 'maximum' | 'custom';
  customSuperContribution?: number;
  salaryPackagingAmount?: number;
  investmentContributions?: number;
  expectedInvestmentReturn?: number;
}

export interface YearlyProjection {
  year: number;
  age: number;
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  totalTax: number;
  netIncome: number;
  superBalance: number;
  superContributions: number;
  investmentBalance: number;
  totalWealth: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface ScenarioComparison {
  scenarioName: string;
  projections: YearlyProjection[];
  totalTaxPaid: number;
  finalNetWorth: number;
  totalSuperBalance: number;
  averageEffectiveTaxRate: number;
}

export interface WhatIfAnalysis {
  baseScenario: ScenarioComparison;
  alternativeScenarios: ScenarioComparison[];
  recommendations: string[];
}

export class ScenarioAnalyzer {
  private static readonly SUPER_GUARANTEE_RATE = 0.115; // 11.5% for 2024-25
  private static readonly SUPER_CONCESSIONAL_CAP = 30000;
  private static readonly SUPER_TAX_RATE = 0.15;

  static projectScenario(
    baseData: TaxInputData,
    ageGroup: AgeGroup,
    currentAge: number,
    parameters: ProjectionParameters
  ): YearlyProjection[] {
    const projections: YearlyProjection[] = [];
    let currentIncome = baseData.grossIncome;
    let superBalance = baseData.superannuation || 0;
    let investmentBalance = 0;

    for (let year = parameters.startYear; year <= parameters.endYear; year++) {
      const age = currentAge + (year - parameters.startYear);
      
      // Apply income growth
      if (year > parameters.startYear) {
        currentIncome *= (1 + parameters.incomeGrowthRate / 100);
      }

      // Calculate super contributions
      const mandatorySuper = currentIncome * this.SUPER_GUARANTEE_RATE;
      let totalSuperContributions = mandatorySuper;

      if (parameters.superContributionStrategy === 'maximum') {
        totalSuperContributions = Math.min(this.SUPER_CONCESSIONAL_CAP, currentIncome * 0.25);
      } else if (parameters.superContributionStrategy === 'custom' && parameters.customSuperContribution) {
        totalSuperContributions = Math.min(
          this.SUPER_CONCESSIONAL_CAP,
          mandatorySuper + parameters.customSuperContribution
        );
      }

      // Calculate salary packaging impact
      const salaryPackaging = parameters.salaryPackagingAmount || 0;
      const adjustedIncome = Math.max(0, currentIncome - salaryPackaging);

      // Calculate tax
      const taxData: TaxInputData = {
        ...baseData,
        grossIncome: adjustedIncome,
        superannuation: totalSuperContributions,
      };

      const taxResult = AustralianTaxCalculator.calculateTax(taxData, ageGroup);

      // Update super balance (with investment returns)
      const superReturn = age < 65 ? 0.07 : 0.05; // Assume 7% in accumulation, 5% in pension
      superBalance = superBalance * (1 + superReturn) + totalSuperContributions * (1 - this.SUPER_TAX_RATE);

      // Update investment balance
      const investmentContribution = parameters.investmentContributions || 0;
      const investmentReturn = parameters.expectedInvestmentReturn || 0.06;
      investmentBalance = investmentBalance * (1 + investmentReturn) + investmentContribution;

      const projection: YearlyProjection = {
        year,
        age,
        grossIncome: currentIncome,
        taxableIncome: taxResult.taxableIncome,
        incomeTax: taxResult.payg,
        medicareLevy: taxResult.medicareLevy,
        totalTax: taxResult.payg + taxResult.medicareLevy,
        netIncome: taxResult.netIncome,
        superBalance,
        superContributions: totalSuperContributions,
        investmentBalance,
        totalWealth: superBalance + investmentBalance,
        effectiveTaxRate: taxResult.effectiveTaxRate,
        marginalTaxRate: taxResult.marginalTaxRate,
      };

      projections.push(projection);
    }

    return projections;
  }

  static compareScenarios(
    baseData: TaxInputData,
    ageGroup: AgeGroup,
    currentAge: number,
    scenarios: Array<{ name: string; parameters: ProjectionParameters }>
  ): ScenarioComparison[] {
    return scenarios.map(scenario => {
      const projections = this.projectScenario(baseData, ageGroup, currentAge, scenario.parameters);
      
      const totalTaxPaid = projections.reduce((sum, p) => sum + p.totalTax, 0);
      const finalProjection = projections[projections.length - 1];
      const averageEffectiveTaxRate = projections.reduce((sum, p) => sum + p.effectiveTaxRate, 0) / projections.length;

      return {
        scenarioName: scenario.name,
        projections,
        totalTaxPaid,
        finalNetWorth: finalProjection.totalWealth,
        totalSuperBalance: finalProjection.superBalance,
        averageEffectiveTaxRate,
      };
    });
  }

  static analyzeWhatIf(
    baseData: TaxInputData,
    ageGroup: AgeGroup,
    currentAge: number,
    baseParameters: ProjectionParameters
  ): WhatIfAnalysis {
    const baseScenario = this.compareScenarios(
      baseData,
      ageGroup,
      currentAge,
      [{ name: 'Current Strategy', parameters: baseParameters }]
    )[0];

    // Generate alternative scenarios
    const alternatives: Array<{ name: string; parameters: ProjectionParameters }> = [];

    // Scenario 1: Maximum super contributions
    if (baseParameters.superContributionStrategy !== 'maximum') {
      alternatives.push({
        name: 'Maximum Super Contributions',
        parameters: {
          ...baseParameters,
          superContributionStrategy: 'maximum',
        },
      });
    }

    // Scenario 2: Salary packaging
    if (!baseParameters.salaryPackagingAmount || baseParameters.salaryPackagingAmount < 15000) {
      alternatives.push({
        name: 'Salary Packaging ($15,000)',
        parameters: {
          ...baseParameters,
          salaryPackagingAmount: 15000,
        },
      });
    }

    // Scenario 3: Higher investment contributions
    const currentInvestment = baseParameters.investmentContributions || 0;
    alternatives.push({
      name: 'Increased Investment ($10,000/year)',
      parameters: {
        ...baseParameters,
        investmentContributions: currentInvestment + 10000,
      },
    });

    // Scenario 4: Conservative investment returns
    alternatives.push({
      name: 'Conservative Returns (4%)',
      parameters: {
        ...baseParameters,
        expectedInvestmentReturn: 0.04,
      },
    });

    // Scenario 5: Aggressive investment returns
    alternatives.push({
      name: 'Aggressive Returns (8%)',
      parameters: {
        ...baseParameters,
        expectedInvestmentReturn: 0.08,
      },
    });

    const alternativeScenarios = this.compareScenarios(
      baseData,
      ageGroup,
      currentAge,
      alternatives
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(baseScenario, alternativeScenarios);

    return {
      baseScenario,
      alternativeScenarios,
      recommendations,
    };
  }

  private static generateRecommendations(
    baseScenario: ScenarioComparison,
    alternatives: ScenarioComparison[]
  ): string[] {
    const recommendations: string[] = [];

    // Find the best performing alternative
    const bestAlternative = alternatives.reduce((best, current) => 
      current.finalNetWorth > best.finalNetWorth ? current : best
    );

    if (bestAlternative.finalNetWorth > baseScenario.finalNetWorth) {
      const improvement = bestAlternative.finalNetWorth - baseScenario.finalNetWorth;
      recommendations.push(
        `Consider "${bestAlternative.scenarioName}" - it could increase your final net worth by ${this.formatCurrency(improvement)}`
      );
    }

    // Tax efficiency recommendations
    const mostTaxEfficient = alternatives.reduce((best, current) => 
      current.totalTaxPaid < best.totalTaxPaid ? current : best
    );

    if (mostTaxEfficient.totalTaxPaid < baseScenario.totalTaxPaid) {
      const savings = baseScenario.totalTaxPaid - mostTaxEfficient.totalTaxPaid;
      recommendations.push(
        `"${mostTaxEfficient.scenarioName}" could save you ${this.formatCurrency(savings)} in total tax over the projection period`
      );
    }

    // Super balance recommendations
    const bestSuper = alternatives.reduce((best, current) => 
      current.totalSuperBalance > best.totalSuperBalance ? current : best
    );

    if (bestSuper.totalSuperBalance > baseScenario.totalSuperBalance) {
      const improvement = bestSuper.totalSuperBalance - baseScenario.totalSuperBalance;
      recommendations.push(
        `"${bestSuper.scenarioName}" could boost your superannuation balance by ${this.formatCurrency(improvement)}`
      );
    }

    // Risk-based recommendations
    const conservativeScenario = alternatives.find(s => s.scenarioName.includes('Conservative'));
    const aggressiveScenario = alternatives.find(s => s.scenarioName.includes('Aggressive'));

    if (conservativeScenario && aggressiveScenario) {
      const riskPremium = aggressiveScenario.finalNetWorth - conservativeScenario.finalNetWorth;
      recommendations.push(
        `The difference between conservative and aggressive investment returns is ${this.formatCurrency(riskPremium)} - consider your risk tolerance`
      );
    }

    // Age-specific recommendations
    const currentAge = baseScenario.projections[0].age;
    if (currentAge < 40) {
      recommendations.push(
        'At your age, consider maximizing growth investments and superannuation contributions for long-term wealth building'
      );
    } else if (currentAge < 55) {
      recommendations.push(
        'Focus on tax-efficient strategies and consider salary packaging options to optimize your peak earning years'
      );
    } else {
      recommendations.push(
        'Consider transition to retirement strategies and ensure your investment allocation matches your risk profile'
      );
    }

    return recommendations;
  }

  static calculateBreakEvenAnalysis(
    baseData: TaxInputData,
    ageGroup: AgeGroup,
    currentAge: number,
    strategy1: ProjectionParameters,
    strategy2: ProjectionParameters
  ): {
    breakEvenYear?: number;
    strategy1Advantage: number[];
    strategy2Advantage: number[];
    crossoverPoints: number[];
  } {
    const projections1 = this.projectScenario(baseData, ageGroup, currentAge, strategy1);
    const projections2 = this.projectScenario(baseData, ageGroup, currentAge, strategy2);

    const strategy1Advantage: number[] = [];
    const strategy2Advantage: number[] = [];
    const crossoverPoints: number[] = [];
    let breakEvenYear: number | undefined;

    for (let i = 0; i < Math.min(projections1.length, projections2.length); i++) {
      const diff = projections1[i].totalWealth - projections2[i].totalWealth;
      
      if (diff > 0) {
        strategy1Advantage.push(diff);
        strategy2Advantage.push(0);
      } else {
        strategy1Advantage.push(0);
        strategy2Advantage.push(Math.abs(diff));
      }

      // Check for crossover
      if (i > 0) {
        const prevDiff = projections1[i-1].totalWealth - projections2[i-1].totalWealth;
        if ((prevDiff > 0 && diff < 0) || (prevDiff < 0 && diff > 0)) {
          crossoverPoints.push(projections1[i].year);
          if (!breakEvenYear) {
            breakEvenYear = projections1[i].year;
          }
        }
      }
    }

    return {
      breakEvenYear,
      strategy1Advantage,
      strategy2Advantage,
      crossoverPoints,
    };
  }

  static calculateOptimalContributionAmount(
    baseData: TaxInputData,
    ageGroup: AgeGroup,
    currentAge: number,
    baseParameters: ProjectionParameters,
    maxContribution: number = 30000
  ): {
    optimalAmount: number;
    projections: Array<{ contribution: number; finalWealth: number; totalTax: number }>;
  } {
    const projections: Array<{ contribution: number; finalWealth: number; totalTax: number }> = [];
    let optimalAmount = 0;
    let bestWealth = 0;

    // Test different contribution amounts
    for (let contribution = 0; contribution <= maxContribution; contribution += 2500) {
      const testParameters: ProjectionParameters = {
        ...baseParameters,
        superContributionStrategy: 'custom',
        customSuperContribution: contribution,
      };

      const yearlyProjections = this.projectScenario(baseData, ageGroup, currentAge, testParameters);
      const finalProjection = yearlyProjections[yearlyProjections.length - 1];
      const totalTax = yearlyProjections.reduce((sum, p) => sum + p.totalTax, 0);

      projections.push({
        contribution,
        finalWealth: finalProjection.totalWealth,
        totalTax,
      });

      if (finalProjection.totalWealth > bestWealth) {
        bestWealth = finalProjection.totalWealth;
        optimalAmount = contribution;
      }
    }

    return {
      optimalAmount,
      projections,
    };
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static exportProjectionData(projections: YearlyProjection[]): string {
    const headers = [
      'Year', 'Age', 'Gross Income', 'Taxable Income', 'Income Tax', 'Medicare Levy',
      'Total Tax', 'Net Income', 'Super Balance', 'Super Contributions', 'Investment Balance',
      'Total Wealth', 'Effective Tax Rate', 'Marginal Tax Rate'
    ];

    const csvData = [
      headers.join(','),
      ...projections.map(p => [
        p.year,
        p.age,
        p.grossIncome.toFixed(2),
        p.taxableIncome.toFixed(2),
        p.incomeTax.toFixed(2),
        p.medicareLevy.toFixed(2),
        p.totalTax.toFixed(2),
        p.netIncome.toFixed(2),
        p.superBalance.toFixed(2),
        p.superContributions.toFixed(2),
        p.investmentBalance.toFixed(2),
        p.totalWealth.toFixed(2),
        p.effectiveTaxRate.toFixed(2),
        p.marginalTaxRate.toFixed(2),
      ].join(','))
    ];

    return csvData.join('\n');
  }
}
