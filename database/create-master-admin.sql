-- Create Master Admin User
-- Run this script in Supabase SQL Editor to create the first master admin

-- Step 1: Create the auth user (replace with your email)
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  'owner@southflowers.mt', -- Replace with actual master admin email
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Master Admin"}',
  false
) RETURNING id;

-- Step 2: Create the profile with master_admin role
-- Replace the UUID below with the ID returned from Step 1
INSERT INTO profiles (
  id,
  email,
  role,
  full_name,
  monthly_limit_remaining,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with the actual UUID from Step 1
  'owner@southflowers.mt', -- Replace with actual master admin email
  'master_admin',
  'Master Admin',
  999999, -- Unlimited monthly limit
  NOW(),
  NOW()
);

-- Alternative: If you already have an auth user, just update their role
-- UPDATE profiles SET role = 'master_admin' WHERE email = 'your-email@example.com';

-- Verify the master admin was created
SELECT * FROM profiles WHERE role = 'master_admin';
