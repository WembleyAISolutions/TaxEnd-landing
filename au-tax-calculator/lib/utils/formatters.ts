/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    showSign?: boolean;
  } = {}
): string {
  const {
    decimals = 0,
    prefix = '$',
    suffix = '',
    showSign = false
  } = options;
  
  const sign = showSign && amount > 0 ? '+' : '';
  
  return `${sign}${prefix}${Math.abs(amount).toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(
  rate: number,
  decimals: number = 1
): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

/**
 * Format number with commas
 */
export function formatNumber(
  value: number,
  decimals: number = 0
): string {
  return value.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format tax year
 */
export function formatTaxYear(year: string): string {
  return `FY ${year}`;
}

/**
 * Format pay period amount
 */
export function formatPayPeriod(
  amount: number,
  period: 'weekly' | 'fortnightly' | 'monthly' | 'annually'
): string {
  const formatted = formatCurrency(amount);
  const periodLabel = {
    weekly: 'per week',
    fortnightly: 'per fortnight',
    monthly: 'per month',
    annually: 'per year'
  }[period];
  
  return `${formatted} ${periodLabel}`;
}
