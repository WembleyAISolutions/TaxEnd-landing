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
