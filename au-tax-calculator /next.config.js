const withNextIntl = require('next-intl/plugin')(
  // This is the default location for the i18n config
  './next-intl.config.js'
);

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
}

module.exports = withNextIntl(nextConfig)
