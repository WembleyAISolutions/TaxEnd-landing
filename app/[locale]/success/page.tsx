'use client';

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, HelpCircle, Home } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to TaxEnd! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your subscription has been successfully activated
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500">
              Order ID: {sessionId.slice(-12)}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ArrowRight className="h-6 w-6 text-blue-600 mr-3" />
              What's Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Check Your Email</h3>
                  <p className="text-gray-600 text-sm">
                    We've sent you a confirmation email with your subscription details and login instructions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Access Your Dashboard</h3>
                  <p className="text-gray-600 text-sm">
                    Log in to your TaxEnd dashboard to start managing your tax calculations and forms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Started</h3>
                  <p className="text-gray-600 text-sm">
                    Explore our comprehensive tax tools and start optimizing your tax management today.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Resources */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="h-6 w-6 text-green-600 mr-3" />
              Need Help?
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  Contact Support
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Our support team is here to help you get the most out of TaxEnd.
                </p>
                <a 
                  href="mailto:support@taxend.ai" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  support@taxend.ai
                  <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn how to make the most of your TaxEnd subscription with our comprehensive guides.
                </p>
                <a 
                  href="/docs" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Documentation
                  <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Join our community of tax professionals and business owners.
                </p>
                <a 
                  href="/community" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Join Community
                  <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@taxend.ai" className="text-blue-600 hover:text-blue-700">
              support@taxend.ai
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your TaxEnd Subscription
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">✓</div>
              <h3 className="font-semibold text-gray-900 mb-1">Unlimited Calculations</h3>
              <p className="text-gray-600 text-sm">
                Process unlimited tax calculations with our advanced engine
              </p>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">Priority Support</h3>
              <p className="text-gray-600 text-sm">
                Get fast, expert help when you need it most
              </p>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-1">Advanced Features</h3>
              <p className="text-gray-600 text-sm">
                Access all premium tools and tax optimization features
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
