import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
