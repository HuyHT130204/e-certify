-- SQL Script to create JWT Claims Hook Function
-- Run this in Supabase SQL Editor
-- This function is required for Supabase Auth Hook to add custom claims to JWT token

CREATE OR REPLACE FUNCTION public.get_custom_claims(claims JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  user_role public.app_role;
BEGIN
  -- Extract user_id from the incoming claims (usually 'sub' field)
  user_id := (claims->>'sub')::UUID;

  -- Fetch the user's role from the profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;

  -- Add the 'user_role' claim to the existing claims
  -- If user_role is null, default to 'student'
  RETURN claims || jsonb_build_object('user_role', COALESCE(user_role::text, 'student'));
END;
$$;

-- Verify the function was created
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  pg_get_function_result(oid) as return_type
FROM pg_proc
WHERE proname = 'get_custom_claims';

