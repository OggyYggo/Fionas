-- Additional RLS policy for bucket listing
-- Run this in Supabase SQL Editor to fix bucket access

-- Allow public access to list buckets (needed for SimpleTourService)
DROP POLICY IF EXISTS "Allow bucket listing" ON storage.buckets;

CREATE POLICY "Allow bucket listing" ON storage.buckets
  FOR SELECT USING (true);

-- Also ensure RLS is enabled on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
