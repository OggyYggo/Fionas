# Fix Storage Bucket Issue

## Problem
The `tour-images` storage bucket doesn't exist in your Supabase project, preventing image uploads.

## Quick Solutions

### Option 1: Automatic Creation (Recommended)
Run this in your browser console on the admin page:

```javascript
createTourImagesBucket()
```

### Option 2: Manual Creation (If automatic fails)

1. **Go to Supabase Dashboard**
   - Login to your Supabase project
   - Navigate to **Storage** in the left sidebar

2. **Create New Bucket**
   - Click **"New bucket"**
   - **Bucket name**: `tour-images`
   - **Public bucket**: ✅ Yes
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: `image/*`
   - Click **"Save"**

3. **Set Storage Policies**
   - Go to **Storage > Policies**
   - Click **"New policy"**
   - **Using the editor**
   - **Table**: `storage.objects`
   - **Policy name**: `Allow public image access`
   - **Policy definition**:
   ```sql
   CREATE POLICY "Allow public image access" ON storage.objects
   FOR SELECT USING (bucket_id = 'tour-images');
   ```
   - Click **"Save"**

### Option 3: Use Placeholders (Temporary Fix)
The form now automatically uses placeholder images if upload fails, so you can:
- ✅ Save tours without images
- ✅ Update images later after fixing storage
- ✅ Continue working on other features

## Verification

After creating the bucket, test it:

```javascript
// Test bucket creation
diagnoseImageUpload()
```

## Current Status

✅ **Tour saving works** - Uses placeholder images if storage fails
⚠️ **Image upload needs bucket** - Run the creation script above
🔧 **Storage policies** - May need manual configuration

## Files Updated

- `TourForm.tsx` - Now uses placeholder images on upload failure
- `create-tour-images-bucket.js` - Automatic bucket creation script
- `diagnose-image-upload.js` - Diagnostic tools

## Next Steps

1. Run `createTourImagesBucket()` in browser console
2. Test image upload functionality
3. If it fails, follow manual creation steps
4. Verify with `diagnoseImageUpload()`

The tour form should now work even without the storage bucket, using placeholder images until you fix the storage configuration.
