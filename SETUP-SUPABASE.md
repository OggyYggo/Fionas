# 🚀 Supabase Tour Management Setup Guide

## ✅ What's Been Implemented

Your tour management system is now fully connected to Supabase! Here's what you can do:

### 📋 Features Available
- ✅ **Create Tours**: Add new tours with images through admin panel
- ✅ **Edit Tours**: Update existing tour information
- ✅ **Delete Tours**: Remove tours from the system
- ✅ **Image Upload**: Automatic image storage in Supabase Storage
- ✅ **Real-time Sync**: All changes instantly reflected on frontend
- ✅ **Database Persistence**: Tours stored securely in Supabase

## 🔧 Setup Steps

### 1. Run the SQL Script
Copy the contents of `supabase/setup-tours.sql` and run it in your Supabase SQL Editor:

```sql
-- Go to your Supabase project → SQL Editor → New query
-- Paste the entire SQL script and click "Run"
```

### 2. Verify Environment Variables
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Connection
Visit: `http://localhost:3000/api/test-tours`
You should see a JSON response with tour data.

## 🎯 How to Use

### Access Admin Panel
1. Navigate to: `http://localhost:3000/admin/tours`
2. Click **"Add New Tour"** button
3. Fill in the tour details:
   - Title (e.g., "Chocolate Hills Adventure")
   - Description (detailed tour description)
   - Price (e.g., "₱3,500")
   - Duration (select from dropdown)
   - Max People (e.g., "Max 10")
   - Category Tag (Island Hopping, Adventure, etc.)
   - Featured Tour (toggle for highlighting)
   - Image (upload tour photo)

### Image Upload
- Images are automatically uploaded to Supabase Storage
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Images are publicly accessible

### Managing Tours
- **View**: All tours displayed in a table with thumbnails
- **Edit**: Click the edit icon to update tour details
- **Delete**: Click the trash icon to remove a tour
- **Preview**: Click the eye icon to see the live tour page

## 🗄️ Database Schema

### Tours Table
```sql
CREATE TABLE tours (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  max_people VARCHAR(50) NOT NULL,
  price VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Bucket
- **Name**: `tour-images`
- **Access**: Public
- **File Limit**: 5MB
- **Formats**: JPEG, PNG, GIF, WebP

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ Public read access to tours
- ✅ Authenticated users can manage tours
- ✅ Public access to tour images
- ✅ Authenticated users can upload images

### Data Validation
- ✅ Required field validation
- ✅ File type checking
- ✅ File size limits
- ✅ SQL injection protection

## 🚨 Troubleshooting

### Common Issues

#### "Tour not saving"
- Check browser console for errors
- Verify Supabase connection in `.env.local`
- Ensure SQL script was executed

#### "Image upload failed"
- Check if `tour-images` bucket exists in Supabase Storage
- Verify bucket is set to public
- Check file size (max 5MB)

#### "Permission denied"
- Ensure you're authenticated in Supabase
- Check RLS policies in SQL script
- Verify Supabase keys are correct

### Debug Steps
1. Check browser console (F12)
2. Test API endpoint: `/api/test-tours`
3. Verify Supabase connection
4. Check SQL script execution

## 📱 Frontend Integration

The system automatically updates:
- ✅ Tour listing page (`/tours`)
- ✅ Tour detail pages (`/tours/[id]`)
- ✅ Admin panel (`/admin/tours`)
- ✅ Search and filtering

## 🎉 Next Steps

1. **Run the SQL script** in Supabase
2. **Test the connection** at `/api/test-tours`
3. **Add your first tour** through admin panel
4. **Verify it appears** on the frontend

Your tour management system is now fully functional with Supabase! 🎊
