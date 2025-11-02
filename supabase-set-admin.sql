-- SQL Script to Set Admin User
-- Run this in Supabase SQL Editor AFTER running supabase-schema.sql

-- Update the profile for huyht1302@gmail.com to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'huyht1302@gmail.com'
);

-- Verify the update
SELECT 
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'huyht1302@gmail.com';

