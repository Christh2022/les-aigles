-- ============================================
-- Admin tables for La Famille Les Aigles
-- Creates: partenaires, enfants, benevoles
-- Also aligns media fields used in admin UI
-- ============================================

-- Safety extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1) Core tables
-- ============================================

CREATE TABLE IF NOT EXISTS partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type TEXT,
  contact TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enfants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  age INTEGER CHECK (age >= 0),
  pays TEXT,
  statut TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS benevoles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  competences TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2) Helpful indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_partenaires_created_at ON partenaires(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enfants_created_at ON enfants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_benevoles_created_at ON benevoles(created_at DESC);

-- ============================================
-- 3) Align existing tables with admin forms
-- ============================================

ALTER TABLE formations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE evenements ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- 4) Row Level Security
-- ============================================

ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE enfants ENABLE ROW LEVEL SECURITY;
ALTER TABLE benevoles ENABLE ROW LEVEL SECURITY;

-- Public read (same behavior as blog/events/formations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'partenaires' AND policyname = 'Public read access partenaires'
  ) THEN
    CREATE POLICY "Public read access partenaires"
      ON partenaires FOR SELECT USING (true);
  END IF;
END
$$;

-- ============================================
-- 5) Storage bucket for image uploads
-- ============================================

-- Create public bucket used by admin uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read images bucket'
  ) THEN
    CREATE POLICY "Public read images bucket"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'images');
  END IF;
END
$$;

-- Authenticated users can upload/update/delete images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated upload images bucket'
  ) THEN
    CREATE POLICY "Authenticated upload images bucket"
      ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated update images bucket'
  ) THEN
    CREATE POLICY "Authenticated update images bucket"
      ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'images' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated delete images bucket'
  ) THEN
    CREATE POLICY "Authenticated delete images bucket"
      ON storage.objects
      FOR DELETE
      USING (bucket_id = 'images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'enfants' AND policyname = 'Public read access enfants'
  ) THEN
    CREATE POLICY "Public read access enfants"
      ON enfants FOR SELECT USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'benevoles' AND policyname = 'Public read access benevoles'
  ) THEN
    CREATE POLICY "Public read access benevoles"
      ON benevoles FOR SELECT USING (true);
  END IF;
END
$$;

-- Authenticated write for admin usage from frontend
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'partenaires' AND policyname = 'Authenticated manage partenaires'
  ) THEN
    CREATE POLICY "Authenticated manage partenaires"
      ON partenaires FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'enfants' AND policyname = 'Authenticated manage enfants'
  ) THEN
    CREATE POLICY "Authenticated manage enfants"
      ON enfants FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'benevoles' AND policyname = 'Authenticated manage benevoles'
  ) THEN
    CREATE POLICY "Authenticated manage benevoles"
      ON benevoles FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

-- Optional but recommended: enable admin CRUD on existing tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'articles' AND policyname = 'Authenticated manage articles'
  ) THEN
    CREATE POLICY "Authenticated manage articles"
      ON articles FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'formations' AND policyname = 'Authenticated manage formations'
  ) THEN
    CREATE POLICY "Authenticated manage formations"
      ON formations FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'evenements' AND policyname = 'Authenticated manage evenements'
  ) THEN
    CREATE POLICY "Authenticated manage evenements"
      ON evenements FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

-- ============================================
-- 6) Hardened RLS (admin-only management)
-- ============================================

-- Admin whitelist table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function used by policies
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated;

-- Only admins can view admin whitelist rows
DROP POLICY IF EXISTS "Admin read admin_users" ON public.admin_users;
CREATE POLICY "Admin read admin_users"
  ON public.admin_users
  FOR SELECT
  USING (public.is_admin_user());

-- ---- Remove previously broad policies (if present)
DROP POLICY IF EXISTS "Public read access partenaires" ON partenaires;
DROP POLICY IF EXISTS "Public read access enfants" ON enfants;
DROP POLICY IF EXISTS "Public read access benevoles" ON benevoles;

DROP POLICY IF EXISTS "Authenticated manage partenaires" ON partenaires;
DROP POLICY IF EXISTS "Authenticated manage enfants" ON enfants;
DROP POLICY IF EXISTS "Authenticated manage benevoles" ON benevoles;

DROP POLICY IF EXISTS "Authenticated manage articles" ON articles;
DROP POLICY IF EXISTS "Authenticated manage formations" ON formations;
DROP POLICY IF EXISTS "Authenticated manage evenements" ON evenements;

DROP POLICY IF EXISTS "Authenticated upload images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete images bucket" ON storage.objects;

-- ---- Admin-only full access for sensitive/admin tables
CREATE POLICY "Admin full access partenaires"
  ON partenaires
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin full access enfants"
  ON enfants
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin full access benevoles"
  ON benevoles
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ---- Public read remains for website content, but writes are admin-only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'articles' AND policyname = 'Public read access articles'
  ) THEN
    CREATE POLICY "Public read access articles"
      ON articles FOR SELECT USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'formations' AND policyname = 'Public read access formations'
  ) THEN
    CREATE POLICY "Public read access formations"
      ON formations FOR SELECT USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'evenements' AND policyname = 'Public read access evenements'
  ) THEN
    CREATE POLICY "Public read access evenements"
      ON evenements FOR SELECT USING (true);
  END IF;
END
$$;

CREATE POLICY "Admin write articles"
  ON articles
  FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin update articles"
  ON articles
  FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin delete articles"
  ON articles
  FOR DELETE
  USING (public.is_admin_user());

CREATE POLICY "Admin write formations"
  ON formations
  FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin update formations"
  ON formations
  FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin delete formations"
  ON formations
  FOR DELETE
  USING (public.is_admin_user());

CREATE POLICY "Admin write evenements"
  ON evenements
  FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin update evenements"
  ON evenements
  FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin delete evenements"
  ON evenements
  FOR DELETE
  USING (public.is_admin_user());

-- ---- Storage hardening: only admins can upload/update/delete in images bucket
CREATE POLICY "Admin upload images bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images' AND public.is_admin_user());

CREATE POLICY "Admin update images bucket"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'images' AND public.is_admin_user());

CREATE POLICY "Admin delete images bucket"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images' AND public.is_admin_user());

-- Example: whitelist first admin (replace with your real email)
-- INSERT INTO public.admin_users (user_id, email)
-- SELECT id, email FROM auth.users WHERE email = 'admin@your-domain.com'
-- ON CONFLICT (user_id) DO UPDATE SET is_active = true;
