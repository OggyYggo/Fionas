-- RLS Policies for tour-images bucket
-- Run this in Supabase SQL Editor AFTER creating the bucket via UI

DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

CREATE POLICY "Tour images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tour images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');
