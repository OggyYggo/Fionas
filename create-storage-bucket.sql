-- Create storage bucket for tour images (simplified version)
-- Run this in Supabase SQL Editor with proper permissions

-- Disable RLS temporarily for storage
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Create the bucket
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

-- Re-enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Create policies for the bucket
CREATE POLICY "Tour images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tour images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

-- Verify bucket creation
SELECT * FROM storage.buckets WHERE name = 'tour-images';
