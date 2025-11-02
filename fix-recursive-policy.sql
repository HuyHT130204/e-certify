-- Fix infinite recursion in RLS policies for profiles table
-- The issue: "Admins can view all profiles" policy queries profiles table, causing recursion

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Drop the update policy too (it has the same issue)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- The basic policy "Users can view their own profile" is enough for now
-- Admins can still view all profiles via service_role or through the admin API routes
-- For now, we rely on:
-- 1. Users can view their own profile (auth.uid() = id)
-- 2. JWT token contains user_role claim (from Auth Hook)

-- If you need admin to view all profiles, you can:
-- Option 1: Create a function that bypasses RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE(id UUID, role public.app_role, full_name TEXT, avatar_url TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.role,
    p.full_name,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$;

-- Option 2: Allow service_role to bypass RLS (already done by default)
-- Admin operations should use service_role key in API routes

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

