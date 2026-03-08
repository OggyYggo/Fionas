# 🚀 5-Photo Gallery Setup Guide

## 📋 Overview
Your tour system now supports up to 5 photos per tour! Here's how to set it up and test it.

## 🔧 Step 1: Update Database Schema

### Run the SQL Migration
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** 
3. Click **New query**
4. Copy and paste the entire content of `supabase/add-gallery-urls-column.sql`
5. Click **Run**

### SQL Script Content:
```sql
-- Add gallery_urls column to tours table for supporting up to 5 photos
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];

-- Add comment to document the purpose and limit
COMMENT ON COLUMN tours.gallery_urls IS 'Array of up to 5 additional tour photo URLs';

-- Create a migration script to update existing tours with empty gallery arrays
UPDATE tours 
SET gallery_urls = '{}' 
WHERE gallery_urls IS NULL;

-- Add index for better performance on gallery queries (optional)
CREATE INDEX IF NOT EXISTS idx_tours_gallery_urls ON tours USING GIN(gallery_urls);

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tours' AND column_name = 'gallery_urls';
```

## ✅ Step 2: Verify Setup

### Check Database Connection
Visit: `http://localhost:3000/api/check-supabase`
- Should show success message
- If not, check your Supabase credentials in `.env.local`

### Test Tour Creation
1. Go to: `http://localhost:3000/admin/tours`
2. Click "Add New Tour"
3. Fill in the tour details
4. **Upload Main Image**: Click the main image upload area
5. **Upload Gallery Photos**: Click the gallery photos area to upload up to 5 additional photos
6. Click "Create Tour"

## 🎯 Features Added

### 1. Tour Type Updates
- ✅ Added `gallery_urls?: string[]` field to Tour interface
- ✅ Supports up to 5 photos per tour

### 2. Database Schema
- ✅ Added `gallery_urls` column (TEXT array) to tours table
- ✅ Automatically updates existing tours with empty arrays
- ✅ Includes performance index for gallery queries

### 3. Admin Form (TourForm)
- ✅ Main image upload (existing functionality)
- ✅ Gallery photos upload section (up to 5 photos)
- ✅ Preview of existing gallery photos
- ✅ Preview of new photos to upload
- ✅ Remove individual photos functionality
- ✅ Photo counter (X/5 photos)
- ✅ File validation and WebP conversion

### 4. Backend Service (SimpleTourService)
- ✅ Handles gallery_urls in createTour()
- ✅ Handles gallery_urls in updateTour()
- ✅ Returns gallery_urls in all read operations
- ✅ Maintains backward compatibility

### 5. Frontend Display (TourPackages)
- ✅ Shows main image when no gallery exists
- ✅ Shows gallery thumbnails when available
- ✅ Photo count indicator (e.g., "4 photos")
- ✅ Thumbnail preview (first 3 photos + "+X more")
- ✅ Responsive and accessible design

## 🔍 Testing Checklist

### Basic Functionality
- [ ] Can create a new tour with main image only
- [ ] Can create a new tour with main image + gallery photos
- [ ] Can upload exactly 5 gallery photos
- [ ] System prevents uploading more than 5 photos
- [ ] Can remove individual gallery photos
- [ ] Can edit existing tours and add/remove gallery photos

### Display Verification
- [ ] Tours without gallery show only main image
- [ ] Tours with gallery show thumbnail previews
- [ ] Photo count indicator appears correctly
- [ ] Thumbnails are properly sized and positioned
- [ ] Hover effects work on gallery thumbnails

### Database Verification
- [ ] Gallery URLs are saved in database
- [ ] Existing tours have empty gallery arrays
- [ ] New tours save gallery URLs correctly
- [ ] Update operations preserve gallery data

## 🚨 Troubleshooting

### If gallery photos don't upload:
1. Check browser console for errors
2. Verify Supabase storage bucket exists
3. Check file size limits (5MB per image)
4. Ensure you're logged in (authenticated)

### If photos don't display:
1. Check if database column exists
2. Verify photo URLs are accessible
3. Check browser network tab for image loading errors

### If form shows errors:
1. Check all required fields are filled
2. Verify image files are valid (PNG, JPG, GIF, WebP)
3. Ensure you don't exceed 5 gallery photos limit

## 🎉 Success Indicators

When everything is working, you'll see:
- ✅ Gallery upload section in admin form
- ✅ Photo counter showing "X/5 photos"
- ✅ Thumbnail previews on tour cards
- ✅ Photo count badges on tour cards
- ✅ Smooth upload and display experience

## 📝 Next Steps

1. **Run the SQL migration** in Supabase
2. **Test tour creation** with multiple photos
3. **Verify display** on the tours page
4. **Monitor performance** with multiple images

Your tour system is now ready to showcase beautiful photo galleries! 📸✨
