-- Create admin user for glennbundy@gmail.com
-- Run this in your Supabase SQL Editor

-- First, create the auth user (this might already exist)
-- You may need to do this step through the Supabase Dashboard > Authentication > Users

-- Then create the admin profile
INSERT INTO profiles (
  id, 
  email, 
  role, 
  monthly_limit_remaining, 
  full_name,
  created_at
) VALUES (
  'admin-user-id', -- Replace with actual auth user ID after creating auth user
  'glennbundy@gmail.com',
  'admin',
  999, -- High limit for admin
  'Glenn Bundy',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  monthly_limit_remaining = 999,
  full_name = 'Glenn Bundy';

-- Alternative: If you know the user ID, you can update directly
-- UPDATE profiles SET role = 'admin', monthly_limit_remaining = 999 WHERE email = 'glennbundy@gmail.com';
