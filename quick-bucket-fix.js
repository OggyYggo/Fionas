// Quick Fix - Create Storage Bucket Now
// Copy and paste this entire script into your browser console

(async function createBucketNow() {
  console.log('🔧 Creating tour-images bucket right now...')
  
  try {
    // Import Supabase
    const { supabase } = await import('/lib/supabase.js')
    console.log('✅ Supabase imported')
    
    // Check existing buckets
    console.log('🔍 Checking existing buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Cannot list buckets:', listError)
      console.log('💡 You may need admin permissions. Try manual creation.')
      return
    }
    
    console.log('📋 Current buckets:', buckets?.map(b => b.name))
    
    // Check if bucket already exists
    if (buckets?.find(b => b.name === 'tour-images')) {
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
      console.error('❌ Auto-creation failed:', error)
      console.log('📝 Manual steps:')
      console.log('1. Go to https://smdpixrzvsstuxrcirbo.supabase.co')
      console.log('2. Navigate to Storage')
      console.log('3. Click "New bucket"')
      console.log('4. Name: tour-images')
      console.log('5. Public: true')
      console.log('6. File size limit: 5242880')
      console.log('7. Allowed MIME types: image/*')
      return
    }
    
    console.log('🎉 SUCCESS! Bucket created:', data)
    
    // Test the bucket
    console.log('🧪 Testing the new bucket...')
    const { data: testData, error: testError } = await supabase.storage
      .from('tour-images')
      .list()
    
    if (testError) {
      console.log('⚠️ Bucket created but test failed:', testError)
      console.log('💡 May need storage policies setup')
    } else {
      console.log('✅ Bucket is working!')
    }
    
    console.log('🚀 You can now upload images!')
    
  } catch (error) {
    console.error('❌ Script failed:', error)
  }
})()

// After running this, try uploading an image again
// If it still fails, follow the manual steps in the console output
