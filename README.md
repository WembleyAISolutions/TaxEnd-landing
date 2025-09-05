# TaxEnd Landing

Official marketing website for **TaxEnd.ai** built with **Next.js (App Router)**, **Tailwind CSS**, and **shadcn/ui**. Content is authored in **MDX**, SEO is first-class, and deploys are optimized for **Vercel**.

> 中文要点：TaxEnd.ai 官网（Next.js 14 + Tailwind + shadcn/ui + MDX），默认部署到 Vercel，内置 SEO。

---

## ✨ Features

- **Next.js 14+ (App Router)** with edge-friendly defaults  
- **Tailwind CSS** + **shadcn/ui** components (tree-shaken)  
- **MDX content** for landing sections (Hero, Features, Pricing, FAQ, Blog)  
- **i18n** via `next-intl` (default: `en`, `zh`)  
- **SEO**: metadata, Open Graph, `/sitemap.xml`, `/robots.txt`, dynamic OG image route  
- **Analytics**: Plausible or GA4 (opt-in via env)  
- **Email forms**: Resend API (fallback: Formspree)  
- **Testing**: Vitest + Testing Library; Playwright for e2e  
- **CI**: GitHub Actions (typecheck, lint, test, build)  
- **One-click deploy** to Vercel (Docker optional)

> 中文要点：MDX 可写内容模块；i18n 中英支持；SEO/分析/邮件与 CI 一应俱全。

---

## 🧰 Requirements

- **Node.js 20+**
- **npm 9+** (or pnpm/yarn)  
- A Vercel account (for production deploys)  
- Optional: Resend account (contact form), Plausible/GA4 (analytics)

> 中文要点：Node 20+、npm 9+；生产建议用 Vercel；邮件/分析可选。

---

## 🚀 Quick Start

```bash
# 1) Clone
git clone https://github.com/WembleyAISolutions/TaxEnd-landing.git
cd TaxEnd-landing

# 2) Install
npm install

# 3) Configure env (optional)
cp .env.example .env.local

# 4) Run dev
npm run dev
# open http://localhost:3000
```

> 中文要点：克隆 → 安装 → 复制环境变量 → 本地运行。

---

## ⚙️ Configuration

Create `.env.local` from the example and fill values as needed:

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://www.taxend.ai
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,zh

# Analytics (pick one or none)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=taxend.ai
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (Resend) — optional
RESEND_API_KEY=your_resend_key
CONTACT_TO=hello@taxend.ai
CONTACT_FROM=Website <noreply@taxend.ai>

# Anti-abuse (optional - Cloudflare Turnstile)
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

> 中文要点：`SITE_URL` 与语言；选择 Plausible 或 GA4；邮件表单需 Resend；可加 Turnstile 防滥用。

---

## 📁 Project Structure

```
taxend-landing/
├── app/
│  ├── page.tsx              # Home page
│  ├── layout.tsx            # Root layout
│  ├── globals.css           # Global styles
│  ├── api/
│  │  ├── contact/route.ts   # Contact form API
│  │  └── og/route.ts        # Dynamic OG image
│  ├── robots.txt/route.ts
│  └── sitemap.xml/route.ts
├── components/
│  ├── Hero.tsx              # Hero section
│  ├── Features.tsx          # Features showcase
│  ├── Calculator.tsx        # Tax calculator
│  └── Footer.tsx            # Site footer
├── content/                 # MDX content (optional)
│  ├── home.mdx
│  ├── features.mdx
│  └── pricing.mdx
├── messages/                # i18n messages
│  ├── en.json
│  └── zh.json
├── lib/                     # Utility functions
├── public/                  # Static assets
├── styles/                  # Additional styles
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

> 中文要点：`app` 路由 + `content` 存放 MDX；`messages` 为多语言文案；API 路由涵盖表单与 OG 图片。

---

## ✏️ Authoring Content (MDX)

Each section/page can be an MDX file in `content/`. Example front-matter:

```mdx
---
title: "Smarter tax for modern business"
description: "AI-powered Australian tax management."
---

import { CTA } from "@/components/sections/CTA"

# Welcome to TaxEnd
<CTA />
```

> 中文要点：页面/模块用 MDX（含前言区块）；可直接引入 React 组件。

---

## 🎨 UI & Styling

- **Tailwind CSS** for styling; global layers in `app/globals.css`.
- **shadcn/ui** for accessible components (optional).
- Add new shadcn components:

```bash
# example (if using shadcn)
npx shadcn-ui@latest add button card input dialog
```

> 中文要点：样式用 Tailwind；组件从 shadcn/ui 按需添加，自动摇树优化。

---

## 🌍 i18n (next-intl)

- Default locale from `NEXT_PUBLIC_DEFAULT_LOCALE`.
- Messages live in `messages/{locale}.json`.
- Usage example:

```tsx
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  return <h1>{t("headline")}</h1>;
}
```

> 中文要点：`messages` 放文案；`useTranslations("ns")` 获取多语言文本。

---

## 🔍 SEO

- `app/api/og/route.ts` generates dynamic OG images.
- `sitemap.xml` and `robots.txt` are route handlers.
- Set page metadata with `generateMetadata` or export `metadata`.

> 中文要点：内置 OG 图、站点地图与 robots；页面级 metadata 可自定义。

---

## ✉️ Contact Form

- Primary: **Resend** (server route at `app/api/contact/route.ts`)
- Fallback: **Formspree** when `RESEND_API_KEY` is missing.

Request shape:

```ts
POST /api/contact
{
  name: string;
  email: string;
  message: string;
}
```

> 中文要点：服务端路由发送邮件；没配 Resend 时可切回 Formspree。

---

## 📈 Analytics

- **Plausible**: set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- **GA4**: set `NEXT_PUBLIC_GA_ID`.
- Analytics is optional and loaded only when env vars exist.

> 中文要点：分析按需启用；无环境变量则不加载。

---

## 🧪 Scripts & Testing

Common scripts (npm):

| Script            | Purpose                              |
|-------------------|--------------------------------------|
| `npm run dev`     | Run local dev server                 |
| `npm run build`   | Build for production                 |
| `npm run start`   | Start production server              |
| `npm run lint`    | ESLint                               |
| `npm run test`    | Run tests (if configured)            |

> 中文要点：常用脚本见表；单元测试用 Vitest，端到端用 Playwright。

---

## 🤖 CI/CD

GitHub Actions workflow can be added at `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

> 中文要点：CI 在 push/PR 触发，做类型检查、Lint、测试与构建。

---

## ☁️ Deployment (Vercel)

### Option 1: Vercel Dashboard
1. Import the repo in Vercel
2. Framework preset: **Next.js**
3. Add environment variables from `.env.local`
4. Deploy!

### Option 2: CLI
```bash
npx vercel
npx vercel --prod
```

### Custom Domain
Connect your domain in Vercel Project Settings → Domains.

> 中文要点：Vercel 导入仓库，复制环境变量；默认构建设置即可；可绑定自定义域名。

---

## 🛠 Troubleshooting

- **Node version mismatch**: ensure Node 20+ (`node -v`).  
- **Env not loaded**: verify `.env.local` exists and restart dev server.  
- **Build errors**: run `npm run build` locally to debug.
- **404 on deploy**: check Vercel build logs for errors.

> 中文要点：常见问题见上；重点检查 Node 版本、环境变量、路径与多语言文件。

---

## 🧭 Roadmap

- [ ] Add more MDX sections (Case Studies, Partners)
- [ ] CMS integration (Contentlayer/Notion)
- [ ] More locales (Japanese, Korean)
- [ ] A/B testing for hero copy
- [ ] Advanced tax calculator features
- [ ] User authentication
- [ ] Dashboard for tax calculations

> 中文要点：可逐步扩展板块、接入 CMS、增加语言与 A/B 测试。

---

## 📝 License

MIT License. See `LICENSE` for details.

> 中文要点：MIT 许可。

---

## 🙌 Credits

Built with Next.js, Tailwind CSS, and the amazing open-source community.

Special thanks to:
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)

---

## 📞 Contact

For questions or support:
- Website: [taxend.ai](https://taxend.ai)
- Email: taxend@wembleydigital.com.au
- GitHub: [WembleyAISolutions/TaxEnd-landing](https://github.com/WembleyAISolutions/TaxEnd-landing)

> 中文要点：感谢开源社区。
