export default function PricePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TaxEnd.AI Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Basic</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">Free</p>
            <ul className="space-y-3 mb-8">
              <li>✓ Basic tax calculations</li>
              <li>✓ Income tax calculator</li>
              <li>✓ Basic reporting</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">$29/month</p>
            <ul className="space-y-3 mb-8">
              <li>✓ All Basic features</li>
              <li>✓ Advanced calculations</li>
              <li>✓ Multi-state comparisons</li>
              <li>✓ Export reports</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Start Free Trial
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">Custom</p>
            <ul className="space-y-3 mb-8">
              <li>✓ All Pro features</li>
              <li>✓ API access</li>
              <li>✓ Custom integrations</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
