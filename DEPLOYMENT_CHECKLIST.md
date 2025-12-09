# Deployment Checklist - Quick Reference

## 🎯 Pre-Deployment (Do This First!)

### 1. Netlify Environment Variables
Go to: **Netlify Dashboard → Site Settings → Environment Variables**

Add these 4 variables:
```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_SITE_URL (e.g., https://south-flowers-portal.netlify.app)
```

### 2. Supabase Redirect URLs
Go to: **Supabase Dashboard → Authentication → URL Configuration**

**Site URL:**
```
https://south-flowers-portal.netlify.app
```

**Redirect URLs (add both):**
```
https://south-flowers-portal.netlify.app/auth/callback
http://localhost:3000/auth/callback
```

## 🚀 Deployment

### Build & Deploy
```bash
# Local test first
npm run build
npm start

# If successful, push to trigger Netlify deployment
git add .
git commit -m "Production deployment with fixed auth redirects"
git push origin main
```

## ✅ Post-Deployment Testing

### Critical Tests (Do These First!)

#### 1. Magic Link Test
- [ ] Go to `/login`
- [ ] Enter email
- [ ] Send magic link
- [ ] Click link in email
- [ ] **CHECK**: URL is `https://south-flowers-portal.netlify.app/auth/callback` (NOT localhost)
- [ ] **CHECK**: Redirects to `/dashboard` successfully

#### 2. Staff Login Test
- [ ] Go to `/staff/login`
- [ ] Test magic link flow
- [ ] **CHECK**: Redirects to production URL
- [ ] Test password login
- [ ] **CHECK**: Redirects to `/staff/dashboard`

#### 3. Route Protection Test
- [ ] Open incognito window
- [ ] Try accessing `/dashboard` directly
- [ ] **CHECK**: Redirects to `/login`
- [ ] Try accessing `/staff/dashboard`
- [ ] **CHECK**: Redirects to `/login`

### Console Check
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab
- [ ] **VERIFY**: No red errors
- [ ] **VERIFY**: No "localhost" in any URLs

## 🐛 If Something Goes Wrong

### Magic Link Still Goes to Localhost?
1. ✅ Check `NEXT_PUBLIC_SITE_URL` is set in Netlify
2. ✅ Redeploy the site
3. ✅ Clear browser cache
4. ✅ Try in incognito mode

### Auth Callback Stuck?
1. ✅ Check Supabase redirect URLs are configured
2. ✅ Check browser console for errors
3. ✅ Verify all env vars are set in Netlify
4. ✅ Try generating a new magic link

### Build Failed?
1. ✅ Run `npm run lint` locally
2. ✅ Fix any TypeScript errors
3. ✅ Check Netlify build logs
4. ✅ Verify `package.json` is committed

## 📋 Final Verification

Once deployed, verify:
- [ ] Site loads at production URL
- [ ] Login page works
- [ ] Magic links work (production URLs)
- [ ] Dashboard loads for members
- [ ] Staff dashboard loads for staff
- [ ] No console errors
- [ ] Mobile view works
- [ ] All routes protected correctly

## 🎉 Success!

If all checkboxes above are ✅, your deployment is successful!

---

**Quick Links:**
- Production Site: https://south-flowers-portal.netlify.app
- Netlify Dashboard: https://app.netlify.com
- Supabase Dashboard: https://supabase.com/dashboard

**Need Help?**
See: [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)