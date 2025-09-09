'use client'

import { Calculator, Globe, Shield, Zap, Users, TrendingUp } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Calculator,
      title: "Real-time Calculations",
      description: "Instant tax calculations with 2024-25 Australian tax rates",
      color: "bg-blue-500"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "English and Chinese support for multicultural Australia",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "100% ATO Compliant",
      description: "Always up-to-date with latest Australian tax regulations",
      color: "bg-purple-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your tax calculations in seconds, not hours",
      color: "bg-yellow-500"
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Residents, non-residents, and working holiday makers",
      color: "bg-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Comprehensive",
      description: "Income tax, Medicare levy, superannuation, and HECS",
      color: "bg-red-500"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TaxEnd.AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed for Australian tax requirements
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="group p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Calculate Your Tax?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of Australians who trust TaxEnd.AI for their tax calculations
              </p>
              <a 
                href="/calculator"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Start Calculating Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
