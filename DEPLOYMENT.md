# Deployment Guide

## Prerequisites

- Node.js 18+ 
- Supabase project
- Environment variables configured

## Environment Setup

1. Copy the environment setup guide from `ENVIRONMENT_SETUP.md`
2. Create `.env.local` with your Supabase credentials
3. Test locally: `npm run build && npm start`

## Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from ENVIRONMENT_SETUP.md
   - **CRITICAL**: Set `NEXT_PUBLIC_SITE_URL` to your production domain
   - Redeploy after adding variables

3. **Custom Domain**
   - Add domain in Vercel Dashboard
   - Update DNS records as instructed

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18+

2. **Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required variables from `.env.example`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_SITE_URL` (e.g., `https://south-flowers-portal.netlify.app`)
   - **IMPORTANT**: Never commit secrets to `netlify.toml`

3. **Redirects**
   Create `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Docker

1. **Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t south-flowers .
   docker run -p 3000:3000 south-flowers
   ```

## Supabase Configuration Checklist

Before deploying, configure Supabase redirect URLs:

1. **Go to Supabase Dashboard**
   - Navigate to Authentication → URL Configuration

2. **Set Site URL**
   ```
   https://your-production-domain.com
   ```

3. **Add Redirect URLs**
   ```
   https://your-production-domain.com/auth/callback
   http://localhost:3000/auth/callback
   ```

4. **Save Changes**

## Production Checklist

### Environment & Configuration
- [ ] `.env.example` file created
- [ ] Environment variables set in hosting platform
- [ ] `NEXT_PUBLIC_SITE_URL` configured correctly
- [ ] Supabase redirect URLs configured
- [ ] No secrets in `netlify.toml` or repository

### Build & Deployment
- [ ] Supabase tables created
- [ ] Build successful: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Error pages working (404, 500)
- [ ] Loading states implemented
- [ ] Domain configured
- [ ] SSL certificate active

### Authentication Testing
- [ ] Member magic link flow works
- [ ] Staff magic link flow works
- [ ] Staff password login works
- [ ] Magic links redirect to production (NOT localhost)
- [ ] Auth callback completes successfully
- [ ] Role-based redirects work correctly

### Security & Performance
- [ ] No console.log in production code
- [ ] Error tracking configured
- [ ] SEO meta tags configured
- [ ] Analytics tracking set up

## Post-Deployment

1. **Test All Pages**
   - Home page: `/`
   - Login: `/login`
   - Staff login: `/staff/login`
   - Logo showcase: `/logos`

2. **Test Authentication**
   - Member magic link flow
   - Staff password login
   - Protected page redirects

3. **Monitor Performance**
   - Check Core Web Vitals
   - Monitor error rates
   - Test mobile responsiveness

## Troubleshooting

### Build Errors
- Check TypeScript: `npm run lint`
- Verify imports and paths
- Check environment variables

### Runtime Errors
- Check Supabase connection
- Verify API keys
- Check browser console

### Performance Issues
- Optimize images
- Check bundle size
- Enable caching

## Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test in development first
4. Review error boundaries

## Security Notes

- Never commit `.env.local`
- Use HTTPS in production
- Keep dependencies updated
- Monitor for security advisories
