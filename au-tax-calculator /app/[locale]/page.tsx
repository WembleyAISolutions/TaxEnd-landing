import Hero from '../../components/Hero'
import Features from '../../components/Features'
import EnhancedTaxCalculator from '../../components/EnhancedTaxCalculator'
import ContactForm from '../../components/ContactForm'
import Analytics from '../../components/Analytics'
import { locales } from '../../i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Analytics />
      <Hero />
      <EnhancedTaxCalculator />
      <Features />
      <ContactForm />
    </main>
  )
}
