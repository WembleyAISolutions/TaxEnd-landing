'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started',
    features: [
      { text: 'Basic tax calculations', included: true },
      { text: 'Income tax calculator', included: true },
      { text: 'Basic reporting', included: true },
    ],
    buttonText: 'Get Started',
    buttonLink: '/en/signup',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious tax optimization',
    features: [
      { text: 'All Basic features', included: true },
      { text: 'Advanced calculations', included: true },
      { text: 'Multi-state comparisons', included: true },
      { text: 'Export reports', included: true },
    ],
    buttonText: 'Start Free Trial',
    buttonLink: '/en/signup?plan=pro',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and advisors',
    features: [
      { text: 'All Pro features', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Priority support', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonLink: 'mailto:sales@taxend.ai?subject=Enterprise%20Plan%20Inquiry',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700',
    popular: false,
    isExternal: true,
  },
];

export default function PricingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TaxEnd.AI Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-blue-600">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? 'text-gray-900' : 'text-gray-400'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.isExternal ? (
                <a href={plan.buttonLink}>
                  <button
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </a>
              ) : (
                <Link href={plan.buttonLink}>
                  <button
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
