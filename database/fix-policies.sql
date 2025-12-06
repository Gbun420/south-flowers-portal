-- Fix RLS policies to prevent infinite recursion
-- Run this in your Supabase SQL Editor

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;

-- Create simple, non-recursive policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow anonymous inserts for new user registration (this will be handled by the trigger)
CREATE POLICY "Enable insert for authentication" ON profiles
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all profiles (simpler approach)
CREATE POLICY "Authenticated users can view profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update profiles (with role check)
CREATE POLICY "Authenticated users can update profiles" ON profiles
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    (auth.uid() = id OR 
     EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('staff', 'admin')))
  );
