'use client'

import { CheckCircle, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    features: [
      'Single tax return',
      'Basic deductions',
      'Email support',
      'PDF export',
    ],
    notIncluded: [
      'Multiple returns',
      'Advanced optimization',
      'Priority support',
      'API access',
    ],
    current: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    features: [
      'Unlimited tax returns',
      'Advanced deductions',
      'Priority support',
      'All export formats',
      'Quarterly BAS',
      'Capital gains calculator',
    ],
    notIncluded: [
      'API access',
      'White label options',
    ],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Professional',
      'API access',
      'White label options',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    notIncluded: [],
    current: false,
  },
]

export default function SubscriptionPage() {
  const handlePlanChange = (planName: string) => {
    if (planName === 'Enterprise') {
      alert('Please contact our sales team for Enterprise pricing')
    } else {
      alert(`Switching to ${planName} plan...`)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscription Management</h1>
      
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-8">
        <p className="text-blue-100 mb-2">Current Plan</p>
        <h2 className="text-2xl font-bold mb-4">Professional Plan</h2>
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-bold">$49</span>
          <span className="text-blue-100">/month</span>
        </div>
        <p className="text-sm text-blue-100 mt-4">Next billing date: October 1, 2024</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-xl border ${
              plan.current ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            } relative`}
          >
            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-400">
                    <X className="text-gray-400 mr-2 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePlanChange(plan.name)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Switch Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Billing Information */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
            <p className="font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-gray-500">Expires 12/24</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
            <p className="font-medium">October 1, 2024</p>
            <p className="text-sm text-gray-500">$49.00 AUD</p>
          </div>
        </div>
        <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
          Update Payment Method
        </button>
      </div>
    </div>
  )
}
