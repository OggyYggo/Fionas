// Node.js script to create storage bucket
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createStorageBucket() {
  try {
    console.log('🔧 Creating tour-images storage bucket...');
    
    // Check if bucket already exists
    console.log('🔍 Checking existing buckets...');
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      console.log('\n💡 Manual bucket creation required:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Navigate to Storage');
      console.log('3. Click "New bucket"');
      console.log('4. Name: tour-images');
      console.log('5. Public: true');
      console.log('6. File size limit: 5MB');
      console.log('7. Allowed MIME types: image/*');
      return;
    }
    
    console.log('📋 Existing buckets:', existingBuckets?.map(b => b.name).join(', ') || 'None');
    
    const tourImagesBucket = existingBuckets?.find(b => b.name === 'tour-images');
    if (tourImagesBucket) {
      console.log('✅ tour-images bucket already exists!');
      return;
    }
    
    // Create the bucket
    console.log('🔧 Creating tour-images bucket...');
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error('❌ Failed to create bucket:', error.message);
      console.log('\n💡 Manual bucket creation required:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Navigate to Storage');
      console.log('3. Click "New bucket"');
      console.log('4. Name: tour-images');
      console.log('5. Public: true');
      console.log('6. File size limit: 5MB');
      console.log('7. Allowed MIME types: image/*');
      return;
    }
    
    console.log('✅ Bucket created successfully!');
    
    // Set up storage policies using SQL (since RPC might not be available)
    console.log('\n📝 Storage policies need to be set up manually:');
    console.log('Run this SQL in your Supabase SQL Editor:');
    console.log('---');
    console.log(`
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Tour images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tour images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tour images" ON storage.objects;

-- Create new policies
CREATE POLICY "Tour images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tour images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
  FOR DELETE USING (bucket_id = 'tour-images' AND auth.role() = 'authenticated');
    `);
    console.log('---');
    
    console.log('\n🎉 tour-images bucket is ready for use!');
    
  } catch (error) {
    console.error('❌ Bucket creation failed:', error.message);
  }
}

createStorageBucket();
