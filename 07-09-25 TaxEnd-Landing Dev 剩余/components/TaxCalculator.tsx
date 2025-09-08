'use client'

import Link from 'next/link'
import { Calculator, ArrowRight } from 'lucide-react'

export default function TaxCalculator() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our Tax Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Get instant tax calculations with our comprehensive Australian tax calculator
            </p>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Description */}
              <div className="text-left space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Calculate Your 2024-25 Tax
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Income tax calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Medicare levy & surcharge
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    HECS-HELP repayments
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Superannuation calculations
                  </li>
                </ul>
              </div>

              {/* Right side - Quick preview */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Annual Income</div>
                  <div className="text-2xl font-bold text-gray-900">$75,000</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <div className="text-sm text-indigo-600 mb-1">Estimated Tax</div>
                  <div className="text-2xl font-bold text-indigo-600">$14,617</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-green-600 mb-1">Take Home</div>
                  <div className="text-2xl font-bold text-green-600">$60,383</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            href="/calculator"
            className="group inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Calculator className="w-6 h-6" />
            Open Full Calculator
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Additional info */}
          <p className="mt-6 text-sm text-gray-500">
            Free to use • No registration required • 100% ATO compliant
          </p>
        </div>
      </div>
    </section>
  )
}
