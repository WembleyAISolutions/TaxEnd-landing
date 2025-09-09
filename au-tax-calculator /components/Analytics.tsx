'use client'

import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import Script from 'next/script'

export default function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      {/* Vercel Analytics */}
      <VercelAnalytics />

      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  )
}
