-- Updated RLS policies for development (allows unauthenticated uploads)
-- Run this in Supabase SQL Editor to replace the previous policies

DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Allow public access to tour images (read)
CREATE POLICY "Tour images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'tour-images');

-- Allow anyone to upload tour images (development mode)
CREATE POLICY "Anyone can upload tour images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tour-images');

-- Allow anyone to update tour images (development mode)
CREATE POLICY "Anyone can update tour images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tour-images');

-- Allow anyone to delete tour images (development mode)
CREATE POLICY "Anyone can delete tour images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tour-images');
