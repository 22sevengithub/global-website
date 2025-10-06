/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for S3 deployment (API routes won't work)
  images: {
    unoptimized: true,
    domains: ['localhost', 'strapi'],
  },
  trailingSlash: true, // Re-enable for S3 compatibility
  // In production, the API URL will be set via environment variable
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    // API will be called directly (CORS needs to be configured on API server)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io'
  },
};

module.exports = nextConfig;