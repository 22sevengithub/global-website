# Vault22 Global Website - Frontend

> Next.js frontend application for the Vault22 Global Website with integrated chatbot and CMS support.

## 🌐 Live Website

- **Production**: https://d2cqblnot4h6g2.cloudfront.net
- **S3 Direct**: http://vault22-website-production.s3-website-us-east-1.amazonaws.com/

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

This is the frontend application for Vault22 Global Website, built with Next.js 14 and designed to be deployed as a static site on AWS S3/CloudFront. The application includes multiple pages, an integrated chatbot (Vaulty), and connects to a Strapi CMS backend for dynamic content like FAQs.

## Tech Stack

- **Framework**: Next.js 14.2.5
- **Language**: TypeScript 5.5.3
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: React 18.3.1
- **Markdown**: react-markdown 10.1.0
- **HTTP Client**: Axios 1.7.2
- **Deployment**: AWS S3 + CloudFront

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- AWS CLI (for deployment)
- Access to Strapi backend (optional for local dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/22sevengithub/global-website.git
cd global-website

# Install dependencies
npm install
```

### Local Development

```bash
# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Note**: The dev script automatically kills any process running on port 3000 before starting.

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build static site for production
npm run build

# Start production server (requires build first)
npm start

# Run linter
npm run lint

# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

### Development Workflow

1. Make changes to components, pages, or styles
2. Test locally with `npm run dev`
3. Build static export with `npm run build`
4. Verify the `out/` directory contains the static files
5. Deploy to AWS S3 (see Deployment section)

## Deployment

### Quick Deploy

The easiest way to deploy is from the parent `website/` directory using the Makefile:

```bash
cd /path/to/website
make deploy-frontend
```

### Manual Deployment

#### 1. Build the Static Site

```bash
npm run build
```

This creates an `out/` directory with static HTML, CSS, and JS files optimized for production.

#### 2. Deploy to AWS S3

```bash
# Sync all files with long cache for assets
aws s3 sync out/ s3://vault22-website-production/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Update HTML files with short cache
aws s3 cp out/ s3://vault22-website-production/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"
```

#### 3. Invalidate CloudFront Cache (Optional)

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Docker Deployment

```bash
# Build Docker image
docker build -t vault22-frontend:latest .

# Run container
docker run -p 3000:3000 vault22-frontend:latest
```

## Project Structure

```
frontend/
├── components/          # React components
│   ├── Chatbot.tsx     # Vaulty chatbot component
│   ├── Header.tsx      # Site header/navigation
│   ├── Footer.tsx      # Site footer
│   └── Layout.tsx      # Page layout wrapper
├── pages/              # Next.js pages (routes)
│   ├── _app.tsx        # App wrapper
│   ├── index.tsx       # Home page
│   ├── about.tsx       # About page
│   ├── products.tsx    # Products page
│   ├── faq.tsx         # FAQ page (with Strapi integration)
│   └── contact.tsx     # Contact page
├── public/             # Static assets
│   ├── favicon.png     # Site favicon
│   └── vault22.png     # Vault22 logo
├── src/
│   └── styles/
│       └── globals.css # Global styles and Tailwind imports
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Features

### Pages

- **Home** (`/`) - Landing page with hero section
- **About** (`/about`) - Company information
- **Products** (`/products`) - Product/service offerings
- **FAQ** (`/faq`) - Frequently asked questions (integrated with Strapi CMS)
- **Contact** (`/contact`) - Contact form and information

### Vaulty Chatbot

The integrated chatbot ("Vaulty") provides:
- Natural language interaction
- Markdown rendering for formatted responses
- Context-aware assistance
- Minimizable floating interface

### Strapi CMS Integration

The FAQ page connects to a Strapi backend to fetch dynamic content:
- Real-time FAQ updates without redeployment
- Categorized questions
- Ordered display
- Admin-managed content

## Environment Variables

### Build Time Variables

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production, set the Strapi URL to your production backend:

```bash
NEXT_PUBLIC_STRAPI_URL=http://vault22-alb-722679130.us-east-1.elb.amazonaws.com
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are included in the browser bundle.

## Configuration

### Next.js Config (`next.config.js`)

The application is configured for static export:

```javascript
module.exports = {
  output: 'export',              // Static HTML export
  images: { unoptimized: true }, // Required for S3 hosting
  trailingSlash: true,           // Better S3 compatibility
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL
      || 'http://localhost:1337'
  }
}
```

### Tailwind CSS

Tailwind is configured with custom colors and styling to match Vault22 brand guidelines. See `tailwind.config.js` for details.

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next out node_modules package-lock.json
npm install
npm run build
```

### Port 3000 Already in Use

The dev script automatically handles this, but you can manually kill the process:

```bash
lsof -ti :3000 | xargs kill -9
```

### Chatbot Not Loading

1. Check browser console for errors
2. Verify `components/Chatbot.tsx` is imported in the page
3. Ensure Tailwind CSS is properly configured

### FAQ Page Not Loading Data

1. Verify Strapi backend is running
2. Check `NEXT_PUBLIC_STRAPI_URL` environment variable
3. Verify CORS is enabled on Strapi backend
4. Check network tab in browser dev tools

### Static Export Issues

- Ensure no server-side features are used (like `getServerSideProps`)
- Use `getStaticProps` or client-side data fetching instead
- Check that `output: 'export'` is in `next.config.js`

### Deployment Issues

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify S3 bucket exists
aws s3 ls s3://vault22-website-production/

# Check files were uploaded
aws s3 ls s3://vault22-website-production/ --recursive
```

## Performance

- Static site generation for optimal load times
- CloudFront CDN for global distribution
- Optimized caching strategy:
  - HTML: No cache (instant updates)
  - Assets: 1 year cache (immutable)
- Tailwind CSS purging for minimal CSS bundle size

## Security

- No sensitive data in static files
- Environment variables evaluated at build time
- S3 bucket configured for public read (required for hosting)
- HTTPS via CloudFront (recommended for production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Build static export with `npm run build`
5. Submit a pull request

## Related Documentation

- Parent project README: `/website/README.md`
- Deployment guide: `/website/DEPLOYMENT_GUIDE.md`
- Quick deploy reference: `/website/QUICK_DEPLOY.md`

## Support

For issues or questions:
1. Check this README and troubleshooting section
2. Review the deployment documentation in `/website/`
3. Check AWS CloudWatch logs for backend issues
4. Verify Strapi backend status

## License

Copyright © 2025 Vault22. All rights reserved.

---

**Last Updated**: October 2025
**Repository**: https://github.com/22sevengithub/global-website
**Maintainer**: Vault22 Development Team
