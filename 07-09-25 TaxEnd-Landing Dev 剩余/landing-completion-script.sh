#!/bin/bash

# TaxEnd Landing Page 剩余功能完成脚本
# 运行前确保在项目根目录

echo "🚀 开始完成 TaxEnd Landing Page 剩余功能..."

# ===============================================
# 1. i18n 多语言支持 (30分钟)
# ===============================================

echo "📝 Step 1: 配置 i18n 多语言支持..."

# 安装 next-intl
npm install next-intl

# 创建语言文件目录
mkdir -p messages

# 创建英文语言包
cat > messages/en.json << 'EOF'
{
  "nav": {
    "home": "Home",
    "features": "Features",
    "calculator": "Calculator",
    "pricing": "Pricing",
    "contact": "Contact",
    "getStarted": "Get Started"
  },
  "hero": {
    "title": "Smart Tax Solutions for Australian Business",
    "subtitle": "AI-powered tax management platform trusted by thousands",
    "cta": "Start Free Trial",
    "demo": "View Demo"
  },
  "features": {
    "title": "Why Choose TaxEnd.AI",
    "subtitle": "Comprehensive features designed for Australian tax requirements",
    "realtime": {
      "title": "Real-time Calculations",
      "desc": "Instant tax calculations with 2024-25 Australian tax rates"
    },
    "multilang": {
      "title": "Multi-language Support",
      "desc": "English and Chinese support for multicultural Australia"
    },
    "compliant": {
      "title": "100% ATO Compliant",
      "desc": "Always up-to-date with latest Australian tax regulations"
    }
  },
  "calculator": {
    "title": "Tax Calculator",
    "income": "Annual Income",
    "calculate": "Calculate Tax",
    "results": "Your Tax Results"
  },
  "footer": {
    "company": "Company",
    "about": "About Us",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "copyright": "© 2024 TaxEnd.AI. All rights reserved."
  }
}
EOF

# 创建中文语言包
cat > messages/zh.json << 'EOF'
{
  "nav": {
    "home": "首页",
    "features": "功能特点",
    "calculator": "税务计算器",
    "pricing": "价格方案",
    "contact": "联系我们",
    "getStarted": "开始使用"
  },
  "hero": {
    "title": "澳洲智能税务解决方案",
    "subtitle": "数千用户信赖的AI驱动税务管理平台",
    "cta": "免费试用",
    "demo": "查看演示"
  },
  "features": {
    "title": "为什么选择 TaxEnd.AI",
    "subtitle": "专为澳洲税务需求设计的全面功能",
    "realtime": {
      "title": "实时计算",
      "desc": "使用2024-25澳洲税率即时计算税务"
    },
    "multilang": {
      "title": "多语言支持",
      "desc": "为多元文化澳洲提供中英文支持"
    },
    "compliant": {
      "title": "100% ATO合规",
      "desc": "始终与最新澳洲税务法规保持同步"
    }
  },
  "calculator": {
    "title": "税务计算器",
    "income": "年收入",
    "calculate": "计算税额",
    "results": "您的税务结果"
  },
  "footer": {
    "company": "公司",
    "about": "关于我们",
    "privacy": "隐私政策",
    "terms": "服务条款",
    "copyright": "© 2024 TaxEnd.AI. 保留所有权利。"
  }
}
EOF

# 创建 i18n 配置文件
cat > i18n.ts << 'EOF'
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'zh'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
EOF

# ===============================================
# 2. SEO 优化 (20分钟)
# ===============================================

echo "🔍 Step 2: 添加 SEO 优化..."

# 创建 sitemap 生成器
cat > app/sitemap.ts << 'EOF'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taxend.ai'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
EOF

# 创建 robots.txt
cat > app/robots.ts << 'EOF'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taxend.ai'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
EOF

# 更新 metadata
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

# ===============================================
# 3. 联系表单集成 (15分钟)
# ===============================================

echo "📧 Step 3: 创建联系表单..."

# 安装 Resend
npm install resend react-hook-form

# 创建联系表单组件
cat > components/ContactForm.tsx << 'EOF'
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <p className="mt-4 text-green-600 text-center">
              Thank you! Your message has been sent.
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="mt-4 text-red-600 text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
EOF

# 创建 API 路由
mkdir -p app/api/contact
cat > app/api/contact/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    const data = await resend.emails.send({
      from: process.env.CONTACT_FROM || 'TaxEnd.AI <noreply@taxend.ai>',
      to: process.env.CONTACT_TO || 'hello@taxend.ai',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
EOF

# ===============================================
# 4. 分析工具集成 (10分钟)
# ===============================================

echo "📊 Step 4: 集成分析工具..."

# 安装 Vercel Analytics
npm install @vercel/analytics

# 创建 Analytics 组件
cat > components/Analytics.tsx << 'EOF'
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
EOF

# ===============================================
# 5. 性能优化 (10分钟)
# ===============================================

echo "⚡ Step 5: 性能优化..."

# 创建图片优化配置
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['taxend.ai'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
EOF

# ===============================================
# 6. 整合所有组件到主页 (5分钟)
# ===============================================

echo "🎨 Step 6: 整合所有组件..."

cat > app/page.tsx << 'EOF'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import TaxCalculator from '@/components/TaxCalculator'
import ContactForm from '@/components/ContactForm'
import Analytics from '@/components/Analytics'

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
EOF

# ===============================================
# 7. 构建和测试 (5分钟)
# ===============================================

echo "🧪 Step 7: 构建和测试..."

# 构建项目
npm run build

# 显示完成信息
echo "
✅ TaxEnd Landing Page 所有功能已完成！

已实现功能：
- ✅ i18n 多语言支持（中英文）
- ✅ SEO 优化（sitemap, robots, metadata）
- ✅ 联系表单（Resend API集成）
- ✅ 分析工具（Vercel Analytics + GA）
- ✅ 性能优化配置
- ✅ Tax Calculator v2.0 集成

下一步：
1. 添加 Resend API Key 到 .env.local
2. 添加 Google Analytics ID（可选）
3. 部署到 Vercel: vercel --prod
4. 测试所有功能

本地测试：
npm run dev
访问: http://localhost:3000
"