'use client'

import Link from 'next/link'
import { Calculator, ArrowRight, Globe, Users, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function Hero() {
  const [language, setLanguage] = useState('en')

  const content = {
    en: {
      title: "Smart Tax Solutions for Australian Business",
      subtitle: "AI-powered tax management platform trusted by thousands of Australians",
      cta: "Start Calculating",
      demo: "View Demo",
      features: [
        "Real-time 2024-25 tax calculations",
        "Multi-language support (English & Chinese)",
        "100% ATO compliant"
      ]
    },
    zh: {
      title: "澳洲智能税务解决方案",
      subtitle: "数千澳洲用户信赖的AI驱动税务管理平台",
      cta: "开始计算",
      demo: "查看演示",
      features: [
        "实时2024-25税率计算",
        "多语言支持（中英文）",
        "100% ATO合规"
      ]
    }
  }

  const t = content[language as keyof typeof content]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:outline-none"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-xl">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">TaxEnd.AI</h1>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {t.title}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {t.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/calculator"
                  className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Calculator className="w-5 h-5" />
                  {t.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                  {t.demo}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">10,000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">ATO Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Tax Calculator</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Annual Income</label>
                      <div className="h-12 bg-gray-100 rounded-lg flex items-center px-4">
                        <span className="text-gray-500">$75,000</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tax Payable</label>
                      <div className="h-12 bg-indigo-50 rounded-lg flex items-center px-4 border-2 border-indigo-200">
                        <span className="text-indigo-600 font-semibold">$14,617</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">After Tax Income</label>
                      <div className="h-12 bg-green-50 rounded-lg flex items-center px-4 border-2 border-green-200">
                        <span className="text-green-600 font-semibold">$60,383</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/calculator"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculate Now
                  </Link>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                Free!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                2024-25
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
