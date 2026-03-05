# Alternative Method: Create Storage Bucket via Supabase Dashboard UI

Since you don't have SQL owner permissions, use the Dashboard UI instead:

## Steps to Create Storage Bucket:

1. **Go to Supabase Dashboard**
2. **Navigate to Storage** (in the left sidebar)
3. **Click "New Bucket"** button
4. **Fill in the bucket details:**
   - **Name**: `tour-images`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
5. **Click "Save"**

## After Creating the Bucket:

Once the bucket is created via the UI, you'll need to set up the RLS policies. Run this simplified SQL script:

```sql
-- Set up RLS policies for tour-images bucket
-- Run this AFTER creating the bucket via the UI

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
```

## Why This Works:

- **UI Creation**: Uses your existing permissions to create the bucket
- **SQL Policies**: Policy creation usually doesn't require owner permissions
- **Same Result**: You get the same functional bucket with proper RLS

Try creating the bucket via the Storage UI first, then let me know so I can verify it's working!
