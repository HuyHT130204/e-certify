-- Fix RLS policies for profiles table
-- This ensures users can read their own profile correctly

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Recreate the policy with explicit check
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Verify the policy
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

