'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { PRICING_PLANS, PricingPlan } from '@/src/lib/stripe';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingTier {
  key: PricingPlan;
  name: string;
  price: number;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    key: 'basic',
    name: PRICING_PLANS.basic.name,
    price: PRICING_PLANS.basic.price,
    description: PRICING_PLANS.basic.description,
    features: PRICING_PLANS.basic.features,
    buttonText: "Start Free Trial"
  },
  {
    key: 'pro',
    name: PRICING_PLANS.pro.name,
    price: PRICING_PLANS.pro.price,
    description: PRICING_PLANS.pro.description,
    features: PRICING_PLANS.pro.features,
    highlighted: true,
    buttonText: "Start Free Trial"
  },
  {
    key: 'enterprise',
    name: PRICING_PLANS.enterprise.name,
    price: PRICING_PLANS.enterprise.price,
    description: PRICING_PLANS.enterprise.description,
    features: PRICING_PLANS.enterprise.features,
    buttonText: "Contact Sales"
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planKey: PricingPlan) => {
    if (planKey === 'enterprise') {
      // For enterprise, redirect to contact form or sales
      window.location.href = '/contact?plan=enterprise';
      return;
    }

    try {
      setLoadingPlan(planKey);
      setError(null);

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planKey,
          billingCycle: billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number, cycle: 'monthly' | 'yearly') => {
    if (cycle === 'yearly') {
      // Apply 20% discount for yearly billing
      const yearlyPrice = price * 12 * 0.8;
      return `$${yearlyPrice.toFixed(0)}`;
    }
    return `$${price.toFixed(0)}`;
  };

  const getPriceLabel = (cycle: 'monthly' | 'yearly') => {
    return cycle === 'monthly' ? '/month' : '/year';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your tax needs
          </p>
          
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                tier.highlighted
                  ? 'ring-2 ring-indigo-600 transform scale-105'
                  : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">
                    {formatPrice(tier.price, billingCycle)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {getPriceLabel(billingCycle)}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-600 mt-1">
                    Save ${(tier.price * 12 * 0.2).toFixed(0)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier.key)}
                disabled={loadingPlan === tier.key}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  tier.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50'
                }`}
              >
                {loadingPlan === tier.key ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  tier.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and PayPal through our secure Stripe integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
