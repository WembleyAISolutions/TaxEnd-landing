import Hero from '../components/Hero'
import Features from '../components/Features'
import TaxCalculator from '../components/TaxCalculator'
import ContactForm from '../components/ContactForm'
import Analytics from '../components/Analytics'

export default function Home() {
  return (
    <>
      <Analytics />
      <main>
        <Hero />
        <Features />
        <TaxCalculator />
        <ContactForm />
      </main>
    </>
  )
}
