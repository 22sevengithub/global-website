# Deployment Guide - Vault22 Global Website Frontend

> Quick reference for deploying the Next.js frontend to AWS S3/CloudFront

## 🚀 Quick Deploy

### One-Command Deploy

```bash
npm run build && \
aws s3 sync out/ s3://vault22-website-production/ --delete --cache-control "public, max-age=31536000, immutable" && \
aws s3 cp out/ s3://vault22-website-production/ --recursive --exclude "*" --include "*.html" --cache-control "public, max-age=0, must-revalidate"
```

## 📋 Prerequisites

1. **AWS CLI** configured with credentials
   ```bash
   aws configure
   # Enter Access Key ID, Secret Access Key, and region (us-east-1)
   ```

2. **Node.js 20+** installed
   ```bash
   node --version  # Should be 20.x or higher
   ```

3. **AWS Permissions** required:
   - `s3:PutObject`
   - `s3:DeleteObject`
   - `s3:ListBucket`
   - `cloudfront:CreateInvalidation` (optional, for CloudFront)

## 🔧 Deployment Process

### Step 1: Build the Static Site

```bash
# Clean previous builds
rm -rf .next out

# Install dependencies (if needed)
npm ci

# Build static export
npm run build
```

**What happens:**
- Next.js creates an optimized production build
- Static HTML, CSS, and JS files are generated in the `out/` directory
- All pages are pre-rendered as static HTML
- Images and assets are optimized

### Step 2: Deploy to S3

```bash
# Sync all files with long cache for static assets
aws s3 sync out/ s3://vault22-website-production/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Update HTML files with short cache for instant updates
aws s3 cp out/ s3://vault22-website-production/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"
```

**What happens:**
- `--delete` removes old files not in the new build
- Static assets (JS, CSS, images) get 1-year cache
- HTML files get no cache for instant content updates

### Step 3: Verify Deployment

```bash
# Check files were uploaded
aws s3 ls s3://vault22-website-production/ --recursive

# Test the website
curl -I http://vault22-website-production.s3-website-us-east-1.amazonaws.com/
```

Visit the website:
- **S3 URL**: http://vault22-website-production.s3-website-us-east-1.amazonaws.com/
- **CloudFront URL**: https://d2cqblnot4h6g2.cloudfront.net

### Step 4: Invalidate CloudFront Cache (If Using CDN)

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Note**: This step is only needed if you're using CloudFront CDN.

## 🏗️ Infrastructure

### AWS Resources

- **S3 Bucket**: `vault22-website-production`
- **Region**: `us-east-1`
- **Website Hosting**: Enabled
- **CloudFront Distribution**: `d2cqblnot4h6g2.cloudfront.net`

### S3 Bucket Configuration

The bucket is configured for static website hosting:
- **Index document**: `index.html`
- **Error document**: `404.html`
- **Public access**: Enabled (required for website hosting)
- **Bucket policy**: Public read access for all objects

## 📦 Environment Variables

### Build Time Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production builds, set the production backend URL:

```bash
NEXT_PUBLIC_STRAPI_URL=http://vault22-alb-722679130.us-east-1.elb.amazonaws.com
```

**Important**: Environment variables are baked into the build at build time. To update them, you must rebuild and redeploy.

## 🔄 Deployment Workflow

### Development to Production

1. **Develop locally**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

2. **Build for production**
   ```bash
   npm run build
   # Verify the out/ directory
   ```

3. **Test production build locally** (optional)
   ```bash
   npx serve out
   # Test at http://localhost:3000
   ```

4. **Deploy to S3**
   ```bash
   # Use the deployment commands from Step 2
   ```

5. **Verify in production**
   ```bash
   # Visit the live URLs
   ```

### Continuous Deployment (Future)

Consider setting up GitHub Actions for automated deployments:
- Trigger on push to `main` branch
- Run tests
- Build static site
- Deploy to S3
- Invalidate CloudFront cache

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear all caches and rebuild
rm -rf .next out node_modules package-lock.json
npm install
npm run build
```

Common issues:
- **Node version mismatch**: Use Node 20+
- **Memory errors**: Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
- **Dependency conflicts**: Delete `node_modules` and reinstall

### Deployment Fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify bucket exists
aws s3 ls s3://vault22-website-production/

# Check permissions
aws s3 ls s3://vault22-website-production/ --recursive
```

Common issues:
- **Access Denied**: Check IAM permissions
- **Bucket not found**: Verify bucket name and region
- **Slow upload**: Use `--region us-east-1` for faster uploads

### Site Not Loading

1. **Check S3 website hosting is enabled**
   ```bash
   aws s3api get-bucket-website --bucket vault22-website-production
   ```

2. **Verify bucket policy allows public read**
   ```bash
   aws s3api get-bucket-policy --bucket vault22-website-production
   ```

3. **Check files were uploaded**
   ```bash
   aws s3 ls s3://vault22-website-production/
   ```

4. **Test with curl**
   ```bash
   curl -I http://vault22-website-production.s3-website-us-east-1.amazonaws.com/
   ```

### Old Content Still Showing

- **HTML files** should update immediately (no cache)
- **If using CloudFront**, invalidate the cache:
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
  ```
- **Browser cache**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## 💡 Pro Tips

### Faster Deployments

```bash
# Only sync changed files (no --delete)
aws s3 sync out/ s3://vault22-website-production/ \
  --cache-control "public, max-age=31536000, immutable"
```

### Dry Run

```bash
# Preview changes without uploading
aws s3 sync out/ s3://vault22-website-production/ --dryrun
```

### Specific File Patterns

```bash
# Only deploy HTML files
aws s3 cp out/ s3://vault22-website-production/ \
  --recursive \
  --exclude "*" \
  --include "*.html"
```

### Parallel Uploads

```bash
# Faster uploads for large sites
aws configure set default.s3.max_concurrent_requests 20
```

## 📊 Monitoring

### Check Deployment Status

```bash
# Last modified time of index.html
aws s3api head-object \
  --bucket vault22-website-production \
  --key index.html \
  --query 'LastModified'
```

### Site Health Check

```bash
# Check site is responding
curl -o /dev/null -s -w "%{http_code}\n" \
  http://vault22-website-production.s3-website-us-east-1.amazonaws.com/
# Should return 200
```

### CloudFront Metrics (if using CDN)

View in AWS Console:
- CloudFront → Distributions → YOUR_DISTRIBUTION → Monitoring
- Metrics: Requests, Data Transfer, Error Rate

## 💰 Cost Optimization

### S3 Costs

- **Storage**: ~$0.023/GB/month
- **Requests**: ~$0.005/1000 PUT requests
- **Data Transfer**: ~$0.09/GB (first 10TB)

**Estimated monthly cost**: $1-5 for a small website

### Reduce Costs

1. **Enable CloudFront**: Reduces S3 data transfer costs
2. **Optimize images**: Use next/image optimization (requires server)
3. **Compress files**: Enable gzip/brotli compression
4. **Use S3 Lifecycle**: Archive old deployment versions

## 🔐 Security Checklist

- [ ] S3 bucket has public read access (required for website hosting)
- [ ] No sensitive data in static files
- [ ] Environment variables don't contain secrets
- [ ] CloudFront HTTPS enabled (recommended)
- [ ] CORS configured on Strapi backend
- [ ] Regular security audits of dependencies

## 📚 Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS CLI S3 Commands](https://docs.aws.amazon.com/cli/latest/reference/s3/)

## 🆘 Support

If you encounter issues:

1. Check this troubleshooting section
2. Verify AWS credentials and permissions
3. Review CloudWatch logs (if applicable)
4. Check Next.js build output for errors
5. Test the build locally before deploying

---

**Last Updated**: October 2025
**AWS Account**: 077890164880
**Region**: us-east-1
