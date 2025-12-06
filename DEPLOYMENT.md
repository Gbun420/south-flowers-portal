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
   - Add in Site Settings → Build & Deploy → Environment

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

## Production Checklist

- [ ] Environment variables set
- [ ] Supabase tables created
- [ ] Build successful: `npm run build`
- [ ] Error pages working (404, 500)
- [ ] Loading states implemented
- [ ] SEO meta tags configured
- [ ] Domain configured
- [ ] SSL certificate active
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
