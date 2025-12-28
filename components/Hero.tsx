import { Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Navigation */}
      <nav className="absolute top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Calculator className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl">TaxEnd.AI</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#calculator" className="text-gray-700 hover:text-indigo-600">Calculator</a>
              <a href="/en/pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a>
              <Link href="/en/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Tax Solutions for
            <span className="text-indigo-600 block">Australian Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered tax management platform for individuals, businesses & advisors.
            Complete Australian Tax Management Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/signup">
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-lg font-semibold">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Active Users", value: "10,000+" },
          { label: "Tax Saved", value: "$50M+" },
          { label: "Calculations", value: "1M+" },
          { label: "Accuracy", value: "99.9%" },
        ].map((stat, idx) => (
          <div key={idx}>
            <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
