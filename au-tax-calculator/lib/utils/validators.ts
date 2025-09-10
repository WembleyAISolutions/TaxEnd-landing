import { z } from 'zod';

/**
 * Validation schemas for tax calculations
 */

export const TaxCalculationInputSchema = z.object({
  annualIncome: z.number()
    .min(0, 'Income cannot be negative')
    .max(10000000, 'Income seems unrealistic'),
  
  isResident: z.boolean(),
  
  hasPrivateHealthInsurance: z.boolean().optional(),
  
  familyStatus: z.enum(['single', 'family']).optional(),
  
  numberOfDependents: z.number()
    .min(0)
    .max(20)
    .int()
    .optional(),
  
  age: z.number()
    .min(0)
    .max(120)
    .optional(),
  
  isSenior: z.boolean().optional(),
  
  superContribution: z.number()
    .min(0)
    .max(27500)
    .optional(),
  
  salarySacrifice: z.number()
    .min(0)
    .optional(),
  
  helpDebt: z.number()
    .min(0)
    .optional(),
  
  workDeductions: z.number()
    .min(0)
    .optional()
});

export type ValidatedTaxInput = z.infer<typeof TaxCalculationInputSchema>;

/**
 * Validate and sanitize tax input
 */
export function validateTaxInput(input: unknown): ValidatedTaxInput {
  return TaxCalculationInputSchema.parse(input);
}

/**
 * Check if income is valid
 */
export function isValidIncome(income: number): boolean {
  return income >= 0 && income <= 10000000 && !isNaN(income);
}

/**
 * Check if super contribution is within caps
 */
export function isValidSuperContribution(
  contribution: number,
  age: number = 49
): boolean {
  const cap = age >= 50 ? 30000 : 27500;
  return contribution >= 0 && contribution <= cap;
}
