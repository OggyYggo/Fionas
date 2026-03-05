# Image Upload Troubleshooting Guide

## Common Issues and Solutions

### 1. "Storage bucket 'tour-images' does not exist"
**Problem**: The Supabase storage bucket hasn't been created yet.

**Solution**:
1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Enter bucket name: `tour-images`
5. Set as **Public** bucket
6. Click **"Save"**

### 2. "Permission denied" errors
**Problem**: Storage policies don't allow uploads.

**Solution**:
1. In Supabase Dashboard, go to **Storage > Policies**
2. Create a new policy for the `tour-images` bucket
3. Use this SQL template:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow image uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tour-images' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public image access" ON storage.objects
FOR SELECT USING (bucket_id = 'tour-images');
```

### 3. File size too large
**Problem**: Image exceeds the 5MB limit.

**Solution**:
- Resize images before uploading
- Or increase the bucket size limit in Supabase Dashboard

### 4. Wrong file format
**Problem**: Non-image files are being uploaded.

**Solution**:
- Only upload valid image files (JPG, PNG, GIF, WebP)
- The system now validates file types automatically

### 5. CORS issues
**Problem**: Browser blocks cross-origin requests.

**Solution**:
In Supabase Dashboard, go to **Settings > API** and ensure your domain is in the CORS settings.

## Quick Fix Steps

1. **Create the bucket** (if not exists):
   ```javascript
   // Run in browser console
   createTourImagesBucket()
   ```

2. **Diagnose the issue**:
   ```javascript
   // Run in browser console
   diagnoseImageUpload()
   ```

3. **Check console logs** for detailed error messages

4. **Verify environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Testing

Use the test script to verify everything works:
1. Navigate to `/admin/tours`
2. Open browser console
3. Run `diagnoseImageUpload()`
4. Try uploading a small test image

## Enhanced Features

The updated image upload system now includes:
- ✅ File validation (type, size)
- ✅ Bucket existence checking
- ✅ Detailed error messages
- ✅ Automatic filename sanitization
- ✅ Upload progress tracking
- ✅ Better error handling
