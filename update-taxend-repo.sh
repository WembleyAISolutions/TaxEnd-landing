#!/bin/bash

# 更新现有 TaxEnd-landing 仓库为 Next.js 项目

echo "📦 更新 TaxEnd-landing 仓库..."

# 1. 克隆现有仓库
git clone https://github.com/WembleyAISolutions/TaxEnd-landing.git
cd TaxEnd-landing

# 2. 备份现有文件
mkdir -p backup
mv README.md backup/README-old.md 2>/dev/null || true

# 3. 初始化 Next.js 项目（保留 git 历史）
echo "📝 创建 package.json..."
cat > package.json << 'EOF'
{
  "name": "taxend-landing",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.363.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
EOF

# 4. 安装依赖
echo "📦 安装依赖..."
npm install

# 5. 创建 Next.js 配置
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOF

# 6. 创建 TypeScript 配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 7. 创建 Tailwind 配置
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'taxend-blue': '#3B82F6',
        'taxend-indigo': '#6366F1',
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# 8. 创建 PostCSS 配置
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 9. 创建目录结构
mkdir -p app components public

# 10. 创建全局样式
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
EOF

# 11. 创建 layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaxEnd.AI - Smart Tax Solutions for Australian Business",
  description: "AI-powered tax management platform for individuals, businesses & advisors. Complete Australian Tax Management Platform.",
  keywords: "Australian tax, tax calculator, ATO, tax management, AI tax assistant",
  openGraph: {
    title: "TaxEnd.AI - Smart Tax Solutions",
    description: "AI-powered Australian tax management platform",
    url: "https://taxend.ai",
    siteName: "TaxEnd.AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

# 12. 创建主页组件
cat > app/page.tsx << 'EOF'
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Calculator from '@/components/Calculator';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Calculator />
      <Footer />
    </main>
  );
}
EOF

# 13. 创建 Hero 组件
mkdir -p components
cat > components/Hero.tsx << 'EOF'
import { Calculator, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Navigation */}
      <nav className="absolute top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Calculator className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl">TaxEnd.AI</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#calculator" className="text-gray-700 hover:text-indigo-600">Calculator</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Tax Solutions for
            <span className="text-indigo-600 block">Australian Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered tax management platform for individuals, businesses & advisors. 
            Complete Australian Tax Management Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-lg font-semibold">
              View Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10,000+" },
              { label: "Tax Saved", value: "$50M+" },
              { label: "Calculations", value: "1M+" },
              { label: "Accuracy", value: "99.9%" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# 14. 创建 Features 组件
cat > components/Features.tsx << 'EOF'
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
EOF

# 15. 创建简单的 Calculator 组件
cat > components/Calculator.tsx << 'EOF'
export default function Calculator() {
  return (
    <section id="calculator" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try Our Tax Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Get instant estimates for your 2024-25 tax obligations
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <input
                type="number"
                placeholder="Enter your annual income"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residency Status
              </label>
              <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Australian Resident</option>
                <option>Non-resident</option>
                <option>Working Holiday Maker</option>
              </select>
            </div>
          </div>
          
          <button className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg">
            Calculate Tax
          </button>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              For full calculations and deductions, sign up for free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

# 16. 创建 Footer 组件
cat > components/Footer.tsx << 'EOF'
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Calculator className="h-6 w-6" />
            <span className="font-bold text-lg">TaxEnd.AI</span>
          </div>
          <p className="text-gray-400">
            © 2025 TaxEnd.AI - Smart Tax Solutions for Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
EOF

# 17. 更新 .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# 18. 创建新的 README
cat > README.md << 'EOF'
# TaxEnd.AI Landing Page

Official landing page for TaxEnd.AI - AI-powered tax solutions for Australian businesses.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠 Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons

## 📝 Features

- Responsive design
- SEO optimized
- Tax calculator preview
- Multi-language ready

## 🌐 Deployment

Deployed on Vercel: [tax-end-landing.vercel.app](https://tax-end-landing.vercel.app)

## 📄 License

MIT
EOF

echo "✅ 项目文件创建完成!"
echo ""
echo "📝 现在执行以下命令完成部署："
echo ""
echo "1. 提交到 GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: Complete Next.js landing page implementation'"
echo "   git push origin main"
echo ""
echo "2. Vercel 会自动部署（因为已连接）"
echo ""
echo "3. 或手动触发部署:"
echo "   npx vercel --prod"
