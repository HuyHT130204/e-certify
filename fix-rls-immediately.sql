-- IMMEDIATE FIX: Remove recursive RLS policies
-- Run this in Supabase SQL Editor NOW to fix the infinite recursion error

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Verify only the safe policy remains
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

-- The remaining policy should be:
-- "Users can view their own profile" (auth.uid() = id)
-- "Users can update their own profile" (auth.uid() = id)

