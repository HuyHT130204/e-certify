-- SQL Schema for E-Certify LMS Platform
-- Run this in Supabase SQL Editor

-- 0. Create Role Type (ENUM) for RBAC
-- Note: PostgreSQL doesn't support IF NOT EXISTS for CREATE TYPE
-- This DO block checks if the type exists before creating it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');
    END IF;
END $$;

-- 0.1. Create Profiles Table (for user roles and metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role public.app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 0.2. Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 0.3. Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- 0.4. Admins can view all profiles (for user management)
-- NOTE: This policy causes infinite recursion if it queries profiles table
-- Instead, admins should use service_role key or API routes for admin operations
-- For now, users can only view their own profile. Admin operations use service_role.
-- If you need admin to view all profiles, create a SECURITY DEFINER function instead.

-- 0.5. Admins can update any profile (for role assignment)
-- Same issue - removed to prevent recursion
-- Admin role assignment should be done via service_role in API routes

-- 0.6. Function to handle new user signup (copy to profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 0.7. Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 0.8. Function to get user role (for Auth Hook)
-- Note: This function is kept for backward compatibility but not used in JWT hook
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_name public.app_role;
BEGIN
  SELECT role INTO role_name
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(role_name::text, 'student');
END;
$$;

-- 0.9. Function for JWT Claims Hook (requires JSONB input/output)
-- This function is used by Supabase Auth Hook to add custom claims to JWT token
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

-- 1. Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  instructor_id UUID REFERENCES auth.users(id)
);

-- 2. Create Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  video_url TEXT,
  mux_asset_id TEXT, -- For Mux video asset
  mux_playback_id TEXT, -- For Mux player
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- 3. Create Enrollments Table
-- This table links users to courses
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 4. Create Lesson Progress Table
-- This table tracks which user has completed which lesson
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  UNIQUE(user_id, lesson_id)
);

-- 5. Create Certificates Table
-- This table links a completed course to its on-chain certificate
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  mint_address TEXT NOT NULL UNIQUE, -- The cNFT asset ID
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 6. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Courses: Public read access (for published courses)
-- Add is_published column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE courses ADD COLUMN is_published BOOLEAN DEFAULT false;
  END IF;
END $$;

CREATE POLICY "Allow public read access to published courses"
  ON courses FOR SELECT
  USING (is_published = true OR auth.uid() = instructor_id);

-- Courses: Teachers can create new courses
CREATE POLICY "Teachers can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
    AND auth.uid() = instructor_id
  );

-- Courses: Teachers can update their own courses
CREATE POLICY "Teachers can update their own courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
    AND auth.uid() = instructor_id
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
    AND auth.uid() = instructor_id
  );

-- Courses: Admins have full access
CREATE POLICY "Admins have full access to courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Lessons: Users can see lessons if they are enrolled
CREATE POLICY "Allow read access to enrolled users"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = lessons.course_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Lessons: Teachers can manage lessons for their courses
CREATE POLICY "Teachers can manage lessons for their courses"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.instructor_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.instructor_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
      )
    )
  );

-- Lessons: Admins have full access
CREATE POLICY "Admins have full access to lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Enrollments: Users can manage their own enrollments
CREATE POLICY "Allow users to manage their own enrollments"
  ON enrollments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Lesson Progress: Users can manage their own progress
CREATE POLICY "Allow users to manage their own progress"
  ON lesson_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Certificates: Users can view their own certificates
CREATE POLICY "Allow users to view their own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

-- Certificates: System can create certificates (via service_role)
-- This should be handled via service_role key in API routes, not RLS

-- 9. Create Function to Update Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create Trigger for Courses Updated At
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

