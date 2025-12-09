# Production Deployment Guide - South Flowers Portal

## 🚀 Quick Start Deployment to Netlify

### Step 1: Environment Variables Setup

1. **Go to Netlify Dashboard**
   - Navigate to: Site Settings → Environment Variables
   - Click "Add a variable"

2. **Add Required Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hcfqmpfeamphmeenhouc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2TqV4RxEff0KebhrBuqU-A_HTv2UgDp
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SITE_URL=https://south-flowers-portal.netlify.app
   ```

   **⚠️ CRITICAL**: The `NEXT_PUBLIC_SITE_URL` must match your actual Netlify domain

### Step 2: Supabase Configuration

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Select project: `hcfqmpfeamphmeenhouc`

2. **Navigate to Authentication → URL Configuration**

3. **Set Site URL**
   ```
   https://south-flowers-portal.netlify.app
   ```

4. **Add Redirect URLs** (one per line)
   ```
   https://south-flowers-portal.netlify.app/auth/callback
   http://localhost:3000/auth/callback
   ```

5. **Save Changes**

### Step 3: Deploy to Netlify

1. **Trigger Deployment**
   - Push to main branch, or
   - Click "Trigger deploy" in Netlify dashboard

2. **Monitor Build**
   - Check build logs for errors
   - Verify build completes successfully

3. **Verify Deployment**
   - Site should be live at: https://south-flowers-portal.netlify.app

## ✅ Post-Deployment Testing Checklist

### Authentication Flow Testing

#### Test 1: Member Magic Link Login
- [ ] Go to https://south-flowers-portal.netlify.app/login
- [ ] Enter email address
- [ ] Click "Send Magic Link"
- [ ] Check email for magic link
- [ ] Click magic link
- [ ] **VERIFY**: URL redirects to `https://south-flowers-portal.netlify.app/auth/callback` (NOT localhost)
- [ ] **VERIFY**: Successfully redirected to `/dashboard`
- [ ] **VERIFY**: No console errors in browser

#### Test 2: Staff Magic Link Login
- [ ] Go to https://south-flowers-portal.netlify.app/staff/login
- [ ] Select "Magic Link" tab
- [ ] Enter staff email
- [ ] Click "Send Magic Link"
- [ ] Check email and click link
- [ ] **VERIFY**: Redirects to production URL (NOT localhost)
- [ ] **VERIFY**: Successfully redirected to `/staff/dashboard`

#### Test 3: Staff Password Login
- [ ] Go to https://south-flowers-portal.netlify.app/staff/login
- [ ] Select "Password" tab
- [ ] Enter credentials
- [ ] Click "Sign In"
- [ ] **VERIFY**: Successfully redirected to `/staff/dashboard`

### Route Protection Testing

#### Test 4: Unauthenticated Access
- [ ] Open incognito/private window
- [ ] Try to access: https://south-flowers-portal.netlify.app/dashboard
- [ ] **VERIFY**: Redirected to `/login`
- [ ] Try to access: https://south-flowers-portal.netlify.app/staff/dashboard
- [ ] **VERIFY**: Redirected to `/login`

#### Test 5: Role-Based Access
- [ ] Login as member
- [ ] Try to access: `/staff/dashboard`
- [ ] **VERIFY**: Redirected to `/dashboard`
- [ ] Login as staff
- [ ] Try to access: `/admin/master`
- [ ] **VERIFY**: Redirected to `/staff/dashboard`

### Functionality Testing

#### Test 6: Member Dashboard
- [ ] Login as member
- [ ] View strains catalog
- [ ] View order history
- [ ] Check profile page
- [ ] **VERIFY**: All data loads correctly
- [ ] **VERIFY**: No console errors

#### Test 7: Staff Dashboard
- [ ] Login as staff
- [ ] View members list
- [ ] View orders
- [ ] Check inventory
- [ ] **VERIFY**: All features work
- [ ] **VERIFY**: No console errors

## 🐛 Troubleshooting

### Issue: Magic Link Redirects to Localhost

**Symptom**: Magic link URL contains `http://localhost:3000`

**Solution**:
1. Verify `NEXT_PUBLIC_SITE_URL` is set in Netlify environment variables
2. Verify the value matches your production domain exactly
3. Redeploy the site after setting the variable
4. Clear browser cache and test again

### Issue: Auth Callback Stuck on Loading

**Symptom**: `/auth/callback` page shows loading spinner indefinitely

**Possible Causes**:
1. **Missing environment variables**
   - Check Netlify dashboard has all required env vars
   
2. **Supabase redirect URL not configured**
   - Verify Supabase has production URL in redirect URLs list
   
3. **Invalid auth code**
   - Check browser console for errors
   - Try generating a new magic link

**Debug Steps**:
```javascript
// Open browser console on callback page
// Check for these errors:
- "Environment check: missing"
- "Code exchange error"
- "No code in URL"
```

### Issue: Build Fails on Netlify

**Common Causes**:
1. TypeScript errors
   - Run `npm run lint` locally
   - Fix all errors before deploying

2. Missing dependencies
   - Verify `package.json` is committed
   - Check build logs for missing packages

3. Environment variables not set
   - Verify all required env vars are in Netlify

### Issue: 404 on Protected Routes

**Solution**:
- Verify `netlify.toml` has SPA fallback redirect
- Should contain:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

## 📊 Production Monitoring

### What to Monitor

1. **Authentication Success Rate**
   - Track magic link click-through rate
   - Monitor auth callback completion rate

2. **Error Rates**
   - Check browser console errors
   - Monitor Supabase error logs

3. **Performance**
   - Page load times
   - Time to interactive
   - Core Web Vitals

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse, WebPageTest

## 🔒 Security Checklist

- [ ] No secrets committed to repository
- [ ] `.env.local` in `.gitignore`
- [ ] Environment variables only in Netlify dashboard
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Supabase RLS policies enabled
- [ ] Service role key only used server-side
- [ ] Regular dependency updates

## 📝 Maintenance

### Regular Tasks

1. **Weekly**
   - Check error logs
   - Monitor authentication success rate
   - Review user feedback

2. **Monthly**
   - Update dependencies: `npm update`
   - Review and rotate API keys
   - Check Supabase usage/quotas

3. **Quarterly**
   - Security audit
   - Performance optimization
   - User experience review

## 🆘 Support

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Magic link not received | Check spam folder, verify email in Supabase |
| Login fails | Clear browser cache, try incognito mode |
| Dashboard not loading | Check browser console, verify auth session |
| 500 errors | Check Supabase connection, verify env vars |

### Getting Help

1. Check browser console for errors
2. Review Netlify build logs
3. Check Supabase logs
4. Review this deployment guide
5. Contact development team

## ✨ Success Criteria

Your deployment is successful when:

- ✅ Site loads at production URL
- ✅ Magic links redirect to production (NOT localhost)
- ✅ All authentication flows work
- ✅ Route protection works correctly
- ✅ No console errors in production
- ✅ All role-based features accessible
- ✅ Database operations work correctly
- ✅ Mobile responsive design works

---

**Last Updated**: 2025-12-09
**Production URL**: https://south-flowers-portal.netlify.app
**Supabase Project**: hcfqmpfeamphmeenhouc