# 🗄️ **Database Setup Guide - Production Ready**

## 📊 **Current Status**

### ✅ **Local Database (Working)**
- **Type**: SQLite
- **File**: `dev.db` (53KB)
- **Status**: Fully functional
- **Tables**: 4 (articles, news_sources, trends, users)

### ❌ **Production Database (Missing)**
- **Problem**: Vercel doesn't support SQLite
- **Solution**: Need cloud database
- **Impact**: Data persistence in production

---

## 🛠️ **Immediate Solutions**

### **Option 1: Vercel Postgres (Recommended)**

**Step 1: Create Database**
```bash
# Go to Vercel Dashboard
# 1. Project → Storage → Create Database
# 2. Choose Postgres
# 3. Select region (closest to users)
# 4. Create database
```

**Step 2: Get Connection String**
```bash
# After creation, Vercel will show:
# DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"
```

**Step 3: Update Environment**
```bash
# Add to Vercel Environment Variables:
vercel env add DATABASE_URL
# Choose: Production, Preview, Development
# Paste the Postgres connection string
```

**Step 4: Update Prisma Schema**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Step 5: Deploy**
```bash
vercel --prod
```

---

### **Option 2: Supabase (Free Alternative)**

**Step 1: Create Supabase Account**
1. Go to https://supabase.com
2. Sign up → New Project
3. Choose region → Create database

**Step 2: Get Connection String**
```bash
# Supabase Dashboard → Settings → Database
# Connection string: postgres://[user]:[password]@[host]:[port]/[database]
```

**Step 3: Configure Vercel**
```bash
# Add to Vercel Environment:
vercel env add DATABASE_URL
# Value: postgres://[supabase-connection-string]
```

**Step 4: Update Schema**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### **Option 3: Railway (Simple)**

**Step 1: Create Railway Account**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

**Step 2: Create Postgres Database**
```bash
# Create database
railway add postgresql

# Get connection string
railway variables get DATABASE_URL
```

**Step 3: Add to Vercel**
```bash
# Add DATABASE_URL to Vercel environment
vercel env add DATABASE_URL
```

---

## 🔄 **Database Migration Steps**

### **After Setting Up Production Database:**

**Step 1: Update Prisma Schema**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  # Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Step 2: Generate New Client**
```bash
npx prisma generate
```

**Step 3: Push Schema to Production**
```bash
# Push schema to new database
npx prisma db push
```

**Step 4: Seed Initial Data (Optional)**
```bash
# Create seed script if needed
npx prisma db seed
```

**Step 5: Deploy**
```bash
vercel --prod
```

---

## 🧪 **Testing Database Connection**

### **Test API Endpoints:**

**1. Test Articles API**
```bash
curl https://your-domain.com/api/news
```

**2. Test Admin Stats**
```bash
curl https://your-domain.com/api/admin/stats
```

**3. Test AI Articles**
```bash
curl -X POST https://your-domain.com/api/ai-articles \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test article"}'
```

### **Expected Results:**
- ✅ Articles load from database
- ✅ Admin stats show real data
- ✅ AI articles save to database
- ✅ No "database connection" errors

---

## 🚨 **Common Database Issues & Solutions**

### **Issue 1: Connection Timeout**
```bash
# Solution: Add connection pooling
DATABASE_URL="postgres://user:pass@host:port/db?connection_limit=10"
```

### **Issue 2: SSL Certificate Error**
```bash
# Solution: Force SSL
DATABASE_URL="postgres://user:pass@host:port/db?sslmode=require"
```

### **Issue 3: Permission Denied**
```bash
# Solution: Check database user permissions
# Grant SELECT, INSERT, UPDATE, DELETE
```

### **Issue 4: Migration Conflicts**
```bash
# Solution: Reset and migrate
npx prisma migrate reset
npx prisma migrate dev
```

---

## 📋 **Database Setup Checklist**

### **Pre-Deployment:**
- [ ] Choose database provider (Vercel/Supabase/Railway)
- [ ] Create production database
- [ ] Get connection string
- [ ] Update Prisma schema to PostgreSQL
- [ ] Add DATABASE_URL to Vercel environment
- [ ] Test database connection locally

### **Post-Deployment:**
- [ ] Deploy to Vercel
- [ ] Run database migrations
- [ ] Test all API endpoints
- [ ] Verify data persistence
- [ ] Check error logs

---

## 🎯 **Quick Start Commands**

### **Vercel Postgres Setup:**
```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Create database via dashboard
# Go to: https://vercel.com/dashboard/stores

# 3. Add environment variable
vercel env add DATABASE_URL

# 4. Update schema and deploy
npx prisma generate
npx prisma db push
vercel --prod
```

### **Supabase Setup:**
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Get connection string from dashboard
# 4. Add to Vercel environment
# 5. Update schema and deploy
```

---

## 🔍 **Database Testing Commands**

### **Test Connection:**
```javascript
// In browser console on your site
fetch('/api/news')
  .then(r => r.json())
  .then(data => console.log('Database test:', data))
  .catch(err => console.error('Database error:', err));
```

### **Test AI Features:**
```javascript
// Test AI article creation
fetch('/api/ai-articles', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({prompt: 'Test Malta news'})
}).then(r => r.json()).then(console.log);
```

---

## 🎉 **Success Criteria**

**Your database is working when:**

✅ **Connection**: No database connection errors
✅ **Data**: Articles load from database
✅ **Persistence**: New articles save permanently
✅ **AI Features**: AI-generated content stores in database
✅ **Admin**: Admin dashboard shows real data
✅ **Performance**: Fast response times (<2 seconds)

---

**🚀 Start with Vercel Postgres for the easiest setup!**