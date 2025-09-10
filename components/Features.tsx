import { 
  TrendingUp, 
  Calculator, 
  Home, 
  PiggyBank, 
  Zap, 
  Target, 
  Shield, 
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const flagshipFeature = {
  icon: TrendingUp,
  title: "Bracket Creep Analyzer",
  subtitle: "Flagship Feature",
  description: "Australia's most advanced bracket creep prediction tool. See exactly how inflation and wage growth will push you into higher tax brackets over the next decade.",
  metrics: [
    "Save up to $5,000/year",
    "Predict 10-year tax impact",
    "Track real purchasing power",
    "Plan salary negotiations"
  ],
  benefits: [
    "Identify optimal salary sacrifice amounts",
    "Time major purchases strategically", 
    "Maximize superannuation contributions",
    "Plan career progression timing"
  ]
};

const calculatorFeatures = [
  {
    icon: Calculator,
    title: "Income Tax Calculator",
    description: "Comprehensive PAYG tax calculations with all deductions, offsets, and Medicare levy. Features 2024-25 latest tax rates and HECS/HELP calculations.",
    highlights: ["2024-25 latest rates", "HECS/HELP support", "Medicare levy", "All deduction types"]
  },
  {
    icon: BarChart3,
    title: "CGT Calculator",
    description: "Calculate CGT on property, shares, and investments with 50% discount optimization. Smart holding period analysis with small business concessions.",
    highlights: ["50% discount optimization", "Smart holding analysis", "Property & shares", "Small business relief"]
  },
  {
    icon: Home,
    title: "Negative Gearing",
    description: "Analyze rental property investments with depreciation and interest deductions. Complete cash flow analysis for true after-tax returns.",
    highlights: ["Investment property optimization", "Complete cash flow analysis", "Interest deductions", "ROI calculations"]
  }
];

const additionalFeatures = [
  {
    icon: Shield,
    title: "100% ATO Compliant",
    description: "Always updated with latest tax legislation and rates"
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Instant calculations as you type with live updates"
  },
  {
    icon: Target,
    title: "Precision Accuracy",
    description: "Down-to-the-cent accuracy using official ATO formulas"
  },
  {
    icon: Clock,
    title: "Multi-Year Planning",
    description: "Project tax scenarios up to 10 years into the future"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Australia's Most Advanced Tax Tools
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Smart Tax Planning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic tax calculations to advanced bracket creep analysis, we've got every Australian taxpayer covered
          </p>
        </div>

        {/* Flagship Feature - Bracket Creep Analyzer */}
        <div className="mb-20">
          <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                FLAGSHIP FEATURE
              </div>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-gray-900">{flagshipFeature.title}</CardTitle>
                  <p className="text-blue-600 font-semibold">{flagshipFeature.subtitle}</p>
                </div>
              </div>
              <CardDescription className="text-lg text-gray-700">
                {flagshipFeature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Key Metrics
                  </h4>
                  <ul className="space-y-2">
                    {flagshipFeature.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Strategic Benefits
                  </h4>
                  <ul className="space-y-2">
                    {flagshipFeature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculator Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Calculator Suite</h3>
            <p className="text-lg text-gray-600">Everything you need for comprehensive tax planning</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {calculatorFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.highlights.map((highlight, hidx) => (
                        <div key={hidx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Features */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TaxEnd.AI</h3>
            <p className="text-lg text-gray-600">Built for accuracy, designed for simplicity</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Tax Strategy?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of Australians who are already saving money and planning smarter with TaxEnd.AI
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Always up-to-date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
