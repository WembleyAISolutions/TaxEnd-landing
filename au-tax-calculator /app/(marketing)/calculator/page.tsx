import { Metadata } from 'next'
import AustralianTaxCalculator from '../../../components/AustralianTaxCalculator'

export const metadata: Metadata = {
  title: 'Australian Tax Calculator 2024-25 | TaxEnd.AI',
  description: 'Free Australian tax calculator with real-time calculations using 2024-25 tax rates. Calculate income tax, Medicare levy, and superannuation for residents and non-residents.',
  keywords: 'Australian tax calculator, 2024-25 tax rates, income tax calculator, Medicare levy, superannuation calculator, ATO tax calculator',
  openGraph: {
    title: 'Australian Tax Calculator 2024-25 | TaxEnd.AI',
    description: 'Free Australian tax calculator with real-time calculations using 2024-25 tax rates.',
    type: 'website',
  },
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <AustralianTaxCalculator />
    </div>
  )
}
