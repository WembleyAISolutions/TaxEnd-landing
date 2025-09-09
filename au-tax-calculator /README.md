# AU Tax Calculator 🇦🇺

A comprehensive Australian Personal Income Tax Calculator for the 2024-25 financial year. Built with modern web technologies for accurate, real-time tax calculations.

## 🌟 Features

### Core Calculations
- **Income Tax** - Progressive tax brackets for 2024-25
- **Medicare Levy** - 2% for eligible incomes above $23,226
- **Medicare Levy Surcharge** - For high earners without private health insurance
- **HECS-HELP Repayments** - Student loan repayment calculations
- **Superannuation** - Employer contributions (11%) and personal deductible contributions

### Residency Types
- Australian Tax Residents
- Non-residents
- Working Holiday Makers (417/462 visa holders)

### User Experience
- 🌏 Bilingual support (English/中文)
- 📱 Fully responsive design
- ⚡ Real-time calculations
- 🎨 Modern, intuitive interface
- ♿ Accessibility compliant

## 🚀 Live Demo

Visit: [https://taxend-landing.vercel.app/calculator](https://taxend-landing.vercel.app/calculator)

## 💻 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Package Manager:** npm/pnpm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/WembleyAISolutions/TaxEnd-landing.git
cd au-tax-calculator

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

## 📁 Project Structure

au-tax-calculator/
├── app/
│   ├── (marketing)/
│   │   └── calculator/
│   │       └── page.tsx        # Calculator page
│   ├── api/                    # API routes
│   └── layout.tsx              # Root layout
├── components/
│   ├── AustralianTaxCalculator.tsx  # Main calculator component
│   ├── Hero.tsx                     # Landing hero section
│   └── ui/                          # UI components
├── public/                     # Static assets
├── messages/                   # i18n translations
│   ├── en.json
│   └── zh.json
├── lib/                        # Utility functions
└── styles/                     # Global styles

## 📊 Tax Brackets (2024-25)

### Australian Residents
| Taxable Income | Tax Rate |
|----------------|----------|
| $0 - $18,200 | 0% |
| $18,201 - $45,000 | 19% |
| $45,001 - $120,000 | 32.5% |
| $120,001 - $180,000 | 37% |
| $180,001+ | 45% |

### Non-Residents
| Taxable Income | Tax Rate |
|----------------|----------|
| $0 - $120,000 | 32.5% |
| $120,001 - $180,000 | 37% |
| $180,001+ | 45% |

### Working Holiday Makers
| Taxable Income | Tax Rate |
|----------------|----------|
| $0 - $45,000 | 15% |
| $45,001 - $120,000 | 32.5% |
| $120,001 - $180,000 | 37% |
| $180,001+ | 45% |

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional: Google Analytics
```

### Customization
Tax rates: Edit components/AustralianTaxCalculator.tsx
Translations: Update files in messages/
Styling: Modify Tailwind classes or globals.css

## 📝 API Reference

### Calculator Endpoint (Future)
```http
POST /api/calculate
Content-Type: application/json

{
  "income": 80000,
  "residencyStatus": "resident",
  "deductions": 5000,
  "hasPrivateHealth": true,
  "hasHECS": false
}
```

## 🧪 Testing
```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This calculator provides estimates based on publicly available tax rates for the 2024-25 financial year. Results are for informational purposes only and should not be considered as professional tax advice. Please consult with a qualified tax professional or the Australian Taxation Office (ATO) for accurate tax planning.

## 🙏 Acknowledgments

- Australian Taxation Office (ATO) for tax rate information
- Built with Next.js and the React ecosystem
- Deployed on Vercel platform

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/WembleyAISolutions/TaxEnd-landing/issues)
- Email: taxend@wembleydigital.com.au

## 🔄 Updates

Last updated: September 2024
- Tax rates current as of 2024-25 financial year
- Medicare levy thresholds updated
- HECS-HELP repayment rates current

---

Made with ❤️ by [Wembley AI Solutions](https://github.com/WembleyAISolutions)
