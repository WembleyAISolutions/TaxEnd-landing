import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '../../i18n'
import Navigation from '../../components/Navigation'
import ErrorBoundary from '../../components/ErrorBoundary'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'TaxEnd.AI - Smart Tax Solutions for Australian Business',
  description: 'AI-powered tax management platform for individuals, businesses & tax advisors. Real-time calculations with 2024-25 Australian tax rates.',
  keywords: 'Australian tax calculator, ATO tax, tax return, 2024-25 tax rates, superannuation, Medicare levy',
  authors: [{ name: 'TaxEnd.AI' }],
  creator: 'TaxEnd.AI',
  publisher: 'TaxEnd.AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'TaxEnd.AI - Smart Tax Solutions',
    description: 'AI-powered tax management for Australians',
    url: 'https://taxend.ai',
    siteName: 'TaxEnd.AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaxEnd.AI - Smart Tax Solutions',
    description: 'AI-powered tax management for Australians',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <Navigation />
            {children}
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
