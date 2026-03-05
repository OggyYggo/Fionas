-- Simple fix for tour-images storage bucket - Run this in Supabase SQL Editor

-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tour-images', 
  'tour-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up Row Level Security (RLS) for storage
-- Allow public access to tour images (read)
CREATE POLICY "Tour images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'tour-images');

-- Allow authenticated users to upload tour images
CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update tour images
CREATE POLICY "Authenticated users can update tour images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete tour images
CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Verify bucket creation
SELECT * FROM storage.buckets WHERE name = 'tour-images';
