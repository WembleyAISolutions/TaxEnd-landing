import Stripe from 'stripe';

// Only initialize Stripe on the server side
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
};

// For backward compatibility, export stripe instance but only on server side
export const stripe = typeof window === 'undefined' ? getStripe() : null;

export const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    description: 'Perfect for individuals',
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'NEED_TO_CREATE_BASIC_PRODUCT_IN_STRIPE',
    yearlyPriceId: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || 'NEED_TO_CREATE_BASIC_YEARLY_PRODUCT_IN_STRIPE',
    features: [
      'Basic tax calculations',
      'Simple tax forms',
      'Email support',
      'Up to 5 tax returns per year'
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Best for small businesses',
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'NEED_TO_CREATE_PRO_PRODUCT_IN_STRIPE',
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'NEED_TO_CREATE_PRO_YEARLY_PRODUCT_IN_STRIPE',
    features: [
      'Advanced tax calculations',
      'All tax forms',
      'Priority support',
      'Unlimited tax returns',
      'Tax optimization suggestions',
      'Multi-year comparisons'
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'NEED_TO_CREATE_ENTERPRISE_PRODUCT_IN_STRIPE',
    yearlyPriceId: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'NEED_TO_CREATE_ENTERPRISE_YEARLY_PRODUCT_IN_STRIPE',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting',
      'API access',
      'White-label options'
    ],
  },
} as const;

export type PricingPlan = keyof typeof PRICING_PLANS;

// Helper function to get the correct price ID based on billing cycle
export function getPriceId(plan: PricingPlan, billingCycle: 'monthly' | 'yearly'): string {
  const planConfig = PRICING_PLANS[plan];
  return billingCycle === 'yearly' ? planConfig.yearlyPriceId : planConfig.priceId;
}

// Helper function to calculate discounted price for yearly billing
export function getDiscountedPrice(price: number, billingCycle: 'monthly' | 'yearly'): number {
  if (billingCycle === 'yearly') {
    return price * 12 * 0.8; // 20% discount for yearly
  }
  return price;
}
