/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for S3 deployment
  images: {
    unoptimized: true,
    domains: ['localhost', 'strapi'],
  },
  trailingSlash: true,
  // In production, the API URL will be set via environment variable
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  },
};

module.exports = nextConfig;