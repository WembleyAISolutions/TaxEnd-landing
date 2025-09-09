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
- **pnpm 9+** (recommended)  
- A Vercel account (for production deploys)  
- Optional: Resend account (contact form), Plausible/GA4 (analytics)

> 中文要点：Node 20+、pnpm 9+；生产建议用 Vercel；邮件/分析可选。

---

## 🚀 Quick Start

```bash
# 1) Clone
git clone https://github.com/<org>/TaxEnd-landing.git
cd TaxEnd-landing

# 2) Install
pnpm install

# 3) Configure env
cp .env.example .env.local

# 4) Run dev
pnpm dev
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

# Email (Resend) – optional
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
├─ app/
│  ├─ (marketing)/          # landing routes (home/pricing/faq/blog)
│  ├─ api/
│  │  ├─ contact/route.ts   # contact form (Resend/Formspree)
│  │  └─ og/route.ts        # dynamic Open Graph image
│  ├─ robots.txt/route.ts
│  └─ sitemap.xml/route.ts
├─ components/
│  ├─ ui/*                  # shadcn/ui components
│  └─ sections/*            # landing sections
├─ content/                 # MDX content (home, features, pricing, faq, blog)
│  ├─ home.mdx
│  ├─ features.mdx
│  ├─ pricing.mdx
│  ├─ faq.mdx
│  └─ blog/*.mdx
├─ messages/                # i18n messages (next-intl)
│  ├─ en.json
│  └─ zh.json
├─ lib/                     # helpers (seo, analytics, i18n, utils)
├─ public/                  # static assets (favicons, images)
├─ styles/                  # globals.css, tailwind layers
├─ tests/                   # unit/integration tests (vitest)
├─ e2e/                     # Playwright e2e tests
├─ .github/workflows/ci.yml # CI pipeline
└─ ...
```

> 中文要点：`app` 路由 + `content` 存放 MDX；`messages` 为多语言文案；API 路由涵盖表单与 OG 图片。

---

## ✍️ Authoring Content (MDX)

Each section/page is an MDX file in `content/`. Example front-matter:

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

- **Tailwind CSS** for styling; global layers in `styles/globals.css`.
- **shadcn/ui** for accessible components.
- Add new shadcn components:

```bash
# example
pnpm dlx shadcn@latest add button card input dialog
```

> 中文要点：样式用 Tailwind；组件从 shadcn/ui 按需添加，自动摇树优化。

---

## 🌐 i18n (next-intl)

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

Common scripts (pnpm):

| Script            | Purpose                              |
|-------------------|--------------------------------------|
| `pnpm dev`        | Run local dev server                 |
| `pnpm build`      | Build for production                 |
| `pnpm start`      | Start production server              |
| `pnpm lint`       | ESLint                               |
| `pnpm typecheck`  | TypeScript check                     |
| `pnpm test`       | Unit tests (Vitest)                  |
| `pnpm test:e2e`   | E2E tests (Playwright)               |
| `pnpm format`     | Prettier format                      |

Testing tips:

```bash
pnpm test
pnpm exec playwright install
pnpm test:e2e
```

> 中文要点：常用脚本见表；单元测试用 Vitest，端到端用 Playwright。

---

## 🤖 CI

A minimal GitHub Actions workflow is provided at `.github/workflows/ci.yml`:

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
          cache: pnpm
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test -- --run
      - run: pnpm build
```

> 中文要点：CI 在 push/PR 触发，做类型检查、Lint、测试与构建。

---

## ☁️ Deployment (Vercel)

- Import the repo in Vercel and select the project root.  
- Framework preset: **Next.js**.  
- Env vars: copy from `.env.local` to Vercel Project Settings → Environment Variables.  
- Set build command to **`pnpm build`** and output directory **`.vercel/output`** (Vercel auto-detects for Next.js).  
- Connect a custom domain when ready.

CLI alternative:

```bash
pnpm dlx vercel@latest
pnpm dlx vercel@latest deploy --prod
```

> 中文要点：Vercel 导入仓库，复制环境变量；默认构建设置即可；可绑定自定义域名。

---

## 🛠 Troubleshooting

- **Node version mismatch**: ensure Node 20+ (`node -v`).  
- **Env not loaded**: verify `.env.local` exists and you restarted dev server.  
- **i18n 404**: check `NEXT_PUBLIC_SUPPORTED_LOCALES` and file `messages/<locale>.json`.  
- **shadcn import paths**: use `@/components/...`; check `tsconfig.json` `paths`.  
- **Images not found**: place static assets under `public/`.

> 中文要点：常见问题见上；重点检查 Node 版本、环境变量、路径与多语言文件。

---

## 🧭 Roadmap

- Add more MDX sections (Case Studies, Partners).  
- CMS integration (optional; e.g., Contentlayer/Notion).  
- More locales.  
- A/B testing for hero copy (optional).

> 中文要点：可逐步扩展板块、接入 CMS、增加语言与 A/B 测试。

---

## 📝 License

MIT License. See `LICENSE` for details.

> 中文要点：MIT 许可。

---

## 🙌 Credits

Built with Next.js, Tailwind CSS, shadcn/ui, and the amazing open-source community.

> 中文要点：感谢开源社区。

