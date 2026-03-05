// Create Tour Images Bucket Script
// Run this in browser console to create the required storage bucket

async function createTourImagesBucket() {
  console.log('🔧 Creating tour-images storage bucket...')
  
  try {
    const { supabase } = await import('/lib/supabase.js')
    console.log('✅ Supabase client imported')
    
    // First check if bucket already exists
    console.log('🔍 Checking existing buckets...')
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }
    
    console.log('📋 Existing buckets:', existingBuckets)
    
    const tourImagesBucket = existingBuckets?.find(b => b.name === 'tour-images')
    if (tourImagesBucket) {
      console.log('✅ tour-images bucket already exists!')
      return
    }
    
    // Create the bucket
    console.log('🔧 Creating tour-images bucket...')
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      console.error('❌ Failed to create bucket:', error)
      console.log('💡 You may need to create this bucket manually in the Supabase Dashboard')
      console.log('💡 Manual steps:')
      console.log('   1. Go to Supabase Dashboard')
      console.log('   2. Navigate to Storage')
      console.log('   3. Click "New bucket"')
      console.log('   4. Name: tour-images')
      console.log('   5. Public: true')
      console.log('   6. File size limit: 5MB')
      console.log('   7. Allowed MIME types: image/*')
      return
    }
    
    console.log('✅ Bucket created successfully:', data)
    
    // Set up storage policies for public access
    console.log('🔧 Setting up storage policies...')
    try {
      // Allow public access to view images
      const { error: policyError } = await supabase.rpc('create_policy', {
        policy_name: 'Allow public image access',
        table_name: 'storage.objects',
        definition: {
          SELECT: {
            condition: "bucket_id = 'tour-images'"
          }
        }
      })
      
      if (policyError) {
        console.log('ℹ️ Policy creation failed (may need manual setup):', policyError.message)
        console.log('💡 Manual policy setup in Supabase Dashboard:')
        console.log('   1. Go to Storage > Policies')
        console.log('   2. Create new policy for "tour-images" bucket')
        console.log('   3. Use SQL: CREATE POLICY "Allow public image access" ON storage.objects FOR SELECT USING (bucket_id = "tour-images")')
      } else {
        console.log('✅ Storage policies created')
      }
    } catch (policyError) {
      console.log('ℹ️ Policy setup may require manual configuration')
    }
    
    console.log('🎉 tour-images bucket is ready for use!')
    
  } catch (error) {
    console.error('❌ Bucket creation failed:', error)
  }
}

// Alternative function to create bucket with admin privileges
async function createBucketWithServiceKey() {
  console.log('🔧 Attempting to create bucket with elevated permissions...')
  
  try {
    // This might require service role key instead of anon key
    console.log('💡 If this fails, you may need to:')
    console.log('   1. Use service role key instead of anon key')
    console.log('   2. Create bucket manually in Supabase Dashboard')
    console.log('   3. Check your Supabase project permissions')
    
    const { supabase } = await import('/lib/supabase.js')
    
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880
    })
    
    if (error) {
      console.error('❌ Service key creation failed:', error)
    } else {
      console.log('✅ Bucket created with service key:', data)
    }
    
  } catch (error) {
    console.error('❌ Service key method failed:', error)
  }
}

console.log('🔧 Bucket creation functions loaded:')
console.log('- Run createTourImagesBucket() to create the bucket')
console.log('- Run createBucketWithServiceKey() if the first method fails')
console.log('- Or follow manual instructions in the console output')
