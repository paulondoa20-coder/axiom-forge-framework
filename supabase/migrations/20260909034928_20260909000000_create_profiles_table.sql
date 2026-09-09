/*
# Create profiles table (UDI — Unified Digital Identity)

## Summary
Creates the `profiles` table that stores each user's public identity in Vitala.
This is the foundation of the UDI (Unified Digital Identity) domain — it holds
the display name, avatar, bio, location, headline, and trust/ICV score.

## New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users ON DELETE CASCADE)
  - `display_name` (text, nullable — shown across the app)
  - `handle` (text, nullable, unique — public @handle)
  - `headline` (text, nullable — one-line professional tagline)
  - `avatar_url` (text, nullable — public URL to avatar image)
  - `bio` (text, nullable, max 2000 chars)
  - `neighborhood` (text, nullable — sub-city area)
  - `city` (text, nullable — city name)
  - `country` (text, nullable — country name)
  - `icv_score` (integer, default 0 — Identity Confidence & Verification score)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Indexes
- `idx_profiles_city` on `city` for location-based queries
- `idx_profiles_handle` on `handle` (unique) for handle lookups

## Security (RLS)
- RLS enabled on `profiles`.
- Owner can SELECT/INSERT/UPDATE their own row (auth.uid() = id).
- Public profiles are readable by anyone (SELECT to anon, authenticated)
  — profiles are public identity, so anyone can view them.
- Only the owner can modify their profile.
- No one can DELETE a profile (rows are cascade-deleted with auth.users).

## Automation
- Trigger `on_auth_user_created` inserts a blank profile row when a new
  auth.users record is created, so every user has a profile from day one.
- Trigger `profiles_updated_at` keeps `updated_at` current on every UPDATE.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  handle text UNIQUE,
  headline text,
  avatar_url text,
  bio text CHECK (length(bio) <= 2000),
  neighborhood text,
  city text,
  country text,
  icv_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Owner: full read/write on own row
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Public: anyone can read any profile (public identity)
DROP POLICY IF EXISTS "select_public_profile" ON profiles;
CREATE POLICY "select_public_profile" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();