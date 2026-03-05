-- Fix for duplicate RLS policies
-- Run this in Supabase SQL Editor

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Tours are publicly viewable" ON tours;
DROP POLICY IF EXISTS "Authenticated users can manage tours" ON tours;
DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Recreate tours table policies
CREATE POLICY "Tours are publicly viewable" ON tours
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tours" ON tours
  FOR ALL USING (auth.role() = 'authenticated');

-- Recreate storage policies (only if bucket exists)
DO $$
BEGIN
  -- Check if bucket exists before creating policies
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'tour-images') THEN
    CREATE POLICY "Tour images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'tour-images');

    CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

    CREATE POLICY "Authenticated users can update tour images" ON storage.objects
      FOR UPDATE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

    CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
      FOR DELETE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');
    
    RAISE NOTICE 'Storage policies created for tour-images bucket';
  ELSE
    RAISE NOTICE 'tour-images bucket does not exist - storage policies not created';
  END IF;
END $$;

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('tours', 'objects')
ORDER BY tablename, policyname;
