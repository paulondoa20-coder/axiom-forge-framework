/*
# Storage policies for avatars bucket

## Summary
The `avatars` bucket is a public storage bucket for user profile pictures.
This migration sets the RLS policies so:
- Anyone can read avatar images (public identity).
- Only the owner can upload/update/delete their own avatar.

## Policies
- SELECT (read): public — anyone (anon + authenticated) can view avatars.
- INSERT: authenticated users can upload only to a path starting with their own user id.
- UPDATE: authenticated users can update only their own avatar.
- DELETE: authenticated users can delete only their own avatar.
*/

-- Public read access for avatars
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

-- Owner can upload to their own path (folder = user id)
DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Owner can update their own avatar
DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Owner can delete their own avatar
DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);