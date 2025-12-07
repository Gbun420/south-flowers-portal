-- Admin Setup Script for South Flowers Portal
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/hcfqmpfeamphmeenhouc/sql

-- Step 1: Create admin user in auth system
-- Go to Supabase Dashboard > Authentication > Users > "Add user"
-- Email: glennbundy@gmail.com
-- Password: (choose a secure password)
-- Mark as "Auto-confirm" to skip email verification

-- Step 2: After creating the auth user, get the user ID and run this:

-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from the auth user
INSERT INTO profiles (
  id, 
  email, 
  role, 
  monthly_limit_remaining, 
  full_name,
  created_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual auth user ID
  'glennbundy@gmail.com',
  'admin',
  9999, -- Unlimited for admin
  'Glenn Bundy',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  monthly_limit_remaining = 9999,
  full_name = 'Glenn Bundy';

-- Step 3: Verify admin status
SELECT * FROM profiles WHERE email = 'glennbundy@gmail.com';

-- Alternative: If you already have a user account, just update role
-- UPDATE profiles SET role = 'admin', monthly_limit_remaining = 9999 WHERE email = 'glennbundy@gmail.com';
