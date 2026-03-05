# Supabase Setup for Tour Management

## Setup Instructions

### 1. Run the SQL Script

Execute the `setup-tours.sql` script in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the contents of `setup-tours.sql`
5. Click **Run**

### 2. Verify Storage Bucket

After running the SQL script:

1. Go to **Storage** in your Supabase dashboard
2. You should see a `tour-images` bucket
3. The bucket should be set to **Public**
4. File size limit: 5MB
5. Allowed MIME types: JPEG, PNG, GIF, WebP

### 3. Check Tables

1. Go to **Table Editor** in your Supabase dashboard
2. You should see a `tours` table with the following structure:
   - `id` (BIGINT, Primary Key)
   - `title` (VARCHAR)
   - `description` (TEXT)
   - `image` (TEXT)
   - `duration` (VARCHAR)
   - `max_people` (VARCHAR)
   - `price` (VARCHAR)
   - `tag` (VARCHAR)
   - `featured` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/tours`
3. Try adding a new tour with an image
4. Verify the tour appears in the database and the image is uploaded to storage

## Features

### Tour Management
- ✅ Create, Read, Update, Delete tours
- ✅ Image upload to Supabase Storage
- ✅ Automatic public URL generation
- ✅ Featured tour management
- ✅ Category/tag system

### Security
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for tours
- ✅ Authenticated users can manage tours
- ✅ Public access to tour images
- ✅ Authenticated users can upload/manage images

### Performance
- ✅ Indexes on frequently queried columns
- ✅ Automatic timestamp updates
- ✅ Optimized queries

## Troubleshooting

### Image Upload Issues
- Make sure the `tour-images` bucket exists and is public
- Check that RLS policies are correctly applied
- Verify file size doesn't exceed 5MB limit

### Tour Not Showing
- Check browser console for errors
- Verify Supabase connection in `.env.local`
- Ensure RLS policies allow public read access

### Permission Errors
- Make sure you're authenticated when trying to create/update tours
- Check that RLS policies are correctly configured
- Verify Supabase keys in your environment variables

## Environment Variables

Make sure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
