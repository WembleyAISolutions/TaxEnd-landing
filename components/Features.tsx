import { Zap, Globe, Shield, Calculator, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Real-time Calculations",
    description: "Instant tax calculations with 2024-25 Australian tax rates"
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "English and Chinese support for multicultural Australia"
  },
  {
    icon: Shield,
    title: "100% ATO Compliant",
    description: "Always up-to-date with latest Australian tax regulations"
  },
  {
    icon: Calculator,
    title: "Smart Deductions",
    description: "AI-powered deduction finder to maximize your returns"
  },
  {
    icon: Users,
    title: "All Taxpayer Types",
    description: "Residents, non-residents, and working holiday makers"
  },
  {
    icon: TrendingUp,
    title: "Superannuation",
    description: "Complete super contribution and tax offset calculations"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TaxEnd.AI
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive features designed for Australian tax requirements
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="p-6 rounded-xl border hover:shadow-lg transition">
                <Icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
