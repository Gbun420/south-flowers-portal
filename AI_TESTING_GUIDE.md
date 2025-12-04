# 🧪 AI Testing Guide - MaltaIntelliNews Portal

## 📋 **Testing Checklist & Instructions**

### **🔧 Phase 1: Environment Setup**

#### **1.1 Set Required Environment Variables**
Go to your Vercel dashboard: https://vercel.com/gbun420s-projects/south-flowers-portal

**Required Variables:**
```env
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_AI_API_KEY=AIza-your-google-ai-key-here
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=https://south-flowers-portal-17qlbb8y6-gbun420s-projects.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**How to Add:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with Production, Preview, and Development environments
3. Redeploy after adding variables

#### **1.2 Verify API Keys**
Test your API keys:
```bash
# Test OpenAI key
curl -H "Authorization: Bearer YOUR_OPENAI_KEY" https://api.openai.com/v1/models

# Test Google AI key
curl -H "x-goog-api-key: YOUR_GOOGLE_AI_KEY" https://generativelanguage.googleapis.com/v1/models
```

---

### **🧪 Phase 2: Core AI Feature Testing**

#### **2.1 AI Article Generation Test**

**Test URL:** `https://your-domain.com/admin/intelligent-workflow`

**Steps:**
1. Navigate to AI Workflow page
2. Look for "Generate AI Article" section
3. Enter test prompt: "Write about Malta's tourism industry"
4. Click "Generate Article"
5. **Expected Results:**
   - Loading indicator appears
   - Article generated within 10-30 seconds
   - Content appears in editor
   - No error messages

**❌ Possible Errors & Solutions:**
- **Error:** "API key invalid" → Check OPENAI_API_KEY
- **Error:** "Rate limit exceeded" → Check API quota
- **Error:** "Network timeout" → Check internet connection
- **Error:** "Content policy violation" → Try different prompt

#### **2.2 AI Analysis Test**

**Test URL:** `https://your-domain.com/admin/ai`

**Steps:**
1. Go to AI Analysis dashboard
2. Check if AI metrics are displayed
3. Look for:
   - AI usage statistics
   - Content quality scores
   - Processing times
4. **Expected Results:**
   - Dashboard loads with AI metrics
   - Charts/graphs display data
   - No "AI service unavailable" errors

**❌ Possible Errors & Solutions:**
- **Error:** "AI service unavailable" → Check API keys
- **Error:** "No data available" → Generate some AI content first
- **Error:** "Dashboard loading failed" → Check browser console

#### **2.3 Intelligent Workflow Test**

**Test URL:** `https://your-domain.com/api/intelligent-articles`

**Steps:**
1. Open browser developer tools
2. Go to Console tab
3. Run: `fetch('/api/intelligent-articles').then(r => r.json()).then(console.log)`
4. **Expected Results:**
   - Returns array of AI-generated articles
   - Each article has: id, title, content, category
   - No 500 errors

**❌ Possible Errors & Solutions:**
- **Error:** "500 Internal Server Error" → Check server logs
- **Error:** "API key missing" → Verify environment variables
- **Error:** "Database connection failed" → Check DATABASE_URL

---

### **🧪 Phase 3: Integration Testing**

#### **3.1 Article Creation with AI**

**Test URL:** `https://your-domain.com/admin/articles/new`

**Steps:**
1. Navigate to article creation
2. Fill in title: "AI Test Article"
3. Click "Generate with AI" button (if available)
4. Add AI-generated content
5. Save article
6. **Expected Results:**
   - AI content appears in content field
   - Article saves successfully
   - Redirect to articles list
   - New article appears in list

**❌ Possible Errors & Solutions:**
- **Error:** "Failed to save article" → Check database connection
- **Error:** "AI generation failed" → Check API keys
- **Error:** "Validation error" → Check required fields

#### **3.2 Real-time AI Features**

**Test URL:** `https://your-domain.com/`

**Steps:**
1. Go to homepage
2. Look for AI-generated content indicators
3. Check if articles show "AI Generated" badges
4. Test auto-refresh functionality
5. **Expected Results:**
   - AI badges display correctly
   - Content updates every 30 seconds
   - No broken AI features

**❌ Possible Errors & Solutions:**
- **Error:** "Content not updating" → Check API endpoints
- **Error:** "AI badges missing" → Check component rendering
- **Error:** "Auto-refresh failing" → Check JavaScript errors

---

### **🧪 Phase 4: Performance & Error Testing**

#### **4.1 Load Testing**

**Test Multiple AI Requests:**
```javascript
// In browser console
for(let i = 0; i < 5; i++) {
  fetch('/api/ai-articles', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({prompt: `Test article ${i}`})
  }).then(r => r.json()).then(console.log);
}
```

**Expected Results:**
- All requests complete successfully
- No rate limiting errors
- Server remains responsive

#### **4.2 Error Handling Test**

**Test Invalid API Key:**
1. Temporarily remove OPENAI_API_KEY from Vercel
2. Redeploy
3. Try AI generation
4. **Expected Results:**
   - Graceful error message
   - No server crashes
   - User-friendly error display

#### **4.3 Edge Cases Testing**

**Test Scenarios:**
1. Very long prompts (1000+ characters)
2. Special characters in prompts
3. Empty prompts
4. Malformed requests
5. Concurrent requests

**Expected Results:**
- Proper validation
- Appropriate error messages
- System stability

---

### **🔍 Phase 5: Monitoring & Debugging**

#### **5.1 Browser Console Testing**

**Check for Errors:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed requests

#### **5.2 Vercel Logs Monitoring**

**Check Deployment Logs:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Logs" tab
4. Look for error messages
5. Filter by "ERROR" level

#### **5.3 API Endpoint Testing**

**Test All AI Endpoints:**
```bash
# Test AI articles endpoint
curl -X POST https://your-domain.com/api/ai-articles \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test article"}'

# Test intelligent workflow
curl https://your-domain.com/api/intelligent-articles

# Test workflow status
curl https://your-domain.com/api/workflow/status
```

---

### **📊 Error Reporting Template**

**When you find errors, report them with this format:**

```
🐛 **Error Report**
- **URL:** [page where error occurred]
- **Action:** [what you were doing]
- **Error Message:** [exact error text]
- **Browser Console:** [any console errors]
- **Network Status:** [any failed requests]
- **Environment Variables:** [which ones are set]
- **Expected Behavior:** [what should happen]
- **Actual Behavior:** [what actually happened]
- **Steps to Reproduce:** [detailed steps]
```

---

### **🚀 Quick Test Commands**

**Run these in browser console:**

```javascript
// Test AI API
fetch('/api/ai-articles', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({prompt: 'Test Malta news article'})
}).then(r => r.json()).then(console.log);

// Test workflow status
fetch('/api/workflow/status').then(r => r.json()).then(console.log);

// Test intelligent articles
fetch('/api/intelligent-articles').then(r => r.json()).then(console.log);
```

---

### **✅ Success Criteria**

**Your AI testing is successful when:**

- ✅ All environment variables are set
- ✅ AI article generation works
- ✅ AI dashboard displays data
- ✅ Articles save with AI content
- ✅ No console errors
- ✅ All API endpoints respond
- ✅ Error handling works gracefully
- ✅ Performance is acceptable

---

### **🔄 Next Steps After Testing**

1. **Document all findings**
2. **Fix any discovered errors**
3. **Optimize performance**
4. **Add more test cases**
5. **Set up monitoring**

**🎯 Start with environment setup, then proceed through each phase systematically!**