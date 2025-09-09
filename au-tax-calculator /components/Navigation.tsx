'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calculator, Menu, X, Globe } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  const navItems = [
    { href: '/', label: language === 'en' ? 'Home' : '首页' },
    { href: '/calculator', label: language === 'en' ? 'Calculator' : '计算器' },
    { href: '/features', label: language === 'en' ? 'Features' : '功能' },
    { href: '/pricing', label: language === 'en' ? 'Pricing' : '价格' },
    { href: '#contact', label: language === 'en' ? 'Contact' : '联系' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TaxEnd.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">EN</option>
                <option value="zh">中文</option>
              </select>
            </div>

            {/* CTA Button */}
            <Link
              href="/calculator"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {language === 'en' ? 'Start Calculating' : '开始计算'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-2 px-3 py-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              
              {/* Mobile CTA Button */}
              <Link
                href="/calculator"
                className="block mx-3 mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Start Calculating' : '开始计算'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
