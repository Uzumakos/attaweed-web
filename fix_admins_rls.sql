-- ============================================================================
-- Fix: infinite recursion in RLS policy for "admins" table
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop ALL existing policies on the admins table
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'admins'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON admins', pol.policyname);
  END LOOP;
END $$;

-- Step 2: Create a SECURITY DEFINER function that bypasses RLS
-- This function checks if a user is an admin WITHOUT triggering the policy
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = user_id
  );
$$;

-- Step 3: Create a function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = user_id AND role = 'Super Admin'
  );
$$;

-- Step 4: Create clean, non-recursive policies

-- Admins can read their own record
CREATE POLICY "admins_select_own"
  ON admins FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all records (uses the security definer function to avoid recursion)
CREATE POLICY "admins_select_all"
  ON admins FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can insert new admin records (only super admins or self-insert on signup)
CREATE POLICY "admins_insert"
  ON admins FOR INSERT
  WITH CHECK (
    auth.uid() = id  -- self-insert during signup
    OR public.is_super_admin(auth.uid())  -- super admin creating others
  );

-- Admins can update their own record, super admins can update any
CREATE POLICY "admins_update"
  ON admins FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_super_admin(auth.uid())
  );

-- Only super admins can delete admin records (not themselves)
CREATE POLICY "admins_delete"
  ON admins FOR DELETE
  USING (
    public.is_super_admin(auth.uid())
    AND auth.uid() != id
  );
