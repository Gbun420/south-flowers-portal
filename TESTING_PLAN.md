# Authentication & Authorization Testing Plan

## 🧪 Test Environment Setup

### 1. Database Setup
Run these SQL scripts in Supabase SQL Editor:
```sql
-- 1. Apply RLS Policies
-- Run: database/fix-rls-policies.sql

-- 2. Create Order Transaction Function  
-- Run: database/create-order-function.sql

-- 3. Create Test Users
INSERT INTO profiles (id, email, role, full_name, monthly_limit_remaining) VALUES
('test-member-id', 'member@test.com', 'member', 'Test Member', 30),
('test-staff-id', 'staff@test.com', 'staff', 'Test Staff', 30),
('test-admin-id', 'admin@test.com', 'admin', 'Test Admin', 30),
('test-master-id', 'master@test.com', 'master_admin', 'Test Master Admin', 30);

-- 4. Create Test Strains
INSERT INTO strains (id, name, type, thc_percent, cbd_percent, stock_grams, price_per_gram, is_visible) VALUES
('test-strain-1', 'Test Strain 1', 'hybrid', 20.0, 5.0, 100, 10.00, true),
('test-strain-2', 'Test Strain 2', 'indica', 18.0, 8.0, 50, 12.50, true);
```

### 2. Test Users
Create these auth users in Supabase Authentication:
- **member@test.com** - Member role
- **staff@test.com** - Staff role  
- **admin@test.com** - Admin role
- **master@test.com** - Master Admin role

## 🧪 Testing Scenarios

### **Scenario 1: Member Role Testing**
1. **Login as member@test.com**
2. **Expected**: Redirect to `/dashboard`
3. **Test Dashboard Access**:
   - Can view own profile
   - Can view strains
   - Can create orders (max 7g)
   - CANNOT access `/staff/*` routes
   - CANNOT access `/admin/*` routes

### **Scenario 2: Staff Role Testing**  
1. **Login as staff@test.com**
2. **Expected**: Redirect to `/staff/dashboard`
3. **Test Staff Access**:
   - Can view all member profiles
   - Can manage inventory
   - Can update order status
   - Can create new members
   - CANNOT access `/admin/master` route
   - CAN access `/staff/*` routes

### **Scenario 3: Admin Role Testing**
1. **Login as admin@test.com**  
2. **Expected**: Redirect to `/staff/dashboard`
3. **Test Admin Access**:
   - All staff permissions
   - Can manage other staff
   - CANNOT access `/admin/master` route
   - CAN access `/staff/*` routes

### **Scenario 4: Master Admin Testing**
1. **Login as master@test.com**
2. **Expected**: Redirect to `/admin/master`
3. **Test Master Admin Access**:
   - All admin permissions
   - Can manage system settings
   - CAN access `/admin/*` routes
   - CAN access `/staff/*` routes

### **Scenario 5: Route Protection Testing**
1. **Try direct URL access without auth**:
   - `/dashboard` → Redirect to `/login`
   - `/staff/dashboard` → Redirect to `/login`
   - `/admin/master` → Redirect to `/login`

2. **Try cross-role access**:
   - Member tries `/staff/dashboard` → Redirect to `/dashboard`
   - Staff tries `/admin/master` → Redirect to `/staff/dashboard`

### **Scenario 6: Order Creation Testing**
1. **Test Stock Validation**:
   - Create order for 10g → Should fail (exceeds 7g limit)
   - Create order for 5g when stock is 3g → Should fail (insufficient stock)
   - Create order for 5g when stock is 10g → Should succeed

### **Scenario 7: Profile Creation Testing**
1. **New User Registration**:
   - Sign up new user
   - Check profile auto-creation
   - Verify role is set to 'member'

## 🔍 Testing Checklist

### **Authentication Flow**
- [ ] Magic link login works
- [ ] Session persistence after refresh
- [ ] Auto-redirect to correct dashboard based on role
- [ ] Logout clears session properly

### **Role-Based Access Control**
- [ ] Member cannot access staff routes
- [ ] Staff cannot access admin routes  
- [ ] Admin cannot access master admin routes
- [ ] Master admin can access all routes
- [ ] Unauthenticated users redirected to login

### **Database Security**
- [ ] RLS policies prevent data leakage
- [ ] Users can only see own data
- [ ] Staff can see all member data
- [ ] Admin operations work with service role

### **Order System**
- [ ] Stock validation prevents overselling
- [ ] Monthly limits enforced
- [ ] Atomic transactions work
- [ ] Order status updates work

### **Error Handling**
- [ ] Graceful error messages
- [ ] Error boundaries work
- [ ] No console errors in production
- [ ] Proper loading states

## 🐛 Issue Tracking

### **Known Issues**
- Document any issues found during testing
- Include steps to reproduce
- Note browser and environment

### **Fix Verification**
- [ ] Issue resolved after fix
- [ ] Regression testing completed
- [ ] All scenarios pass

## 📊 Test Results Summary

### **Pass/Fail Status**
- Member Authentication: ⭕ Pending
- Staff Authentication: ⭕ Pending  
- Admin Authentication: ⭕ Pending
- Master Admin Authentication: ⭕ Pending
- Route Protection: ⭕ Pending
- Order System: ⭕ Pending
- Database Security: ⭕ Pending

### **Performance Metrics**
- Login Response Time: ⭕ Pending
- Dashboard Load Time: ⭕ Pending
- Order Creation Time: ⭕ Pending

## 🚀 Next Steps

1. **Execute all test scenarios**
2. **Document any issues found**
3. **Fix critical problems**
4. **Retest after fixes**
5. **Production readiness assessment**