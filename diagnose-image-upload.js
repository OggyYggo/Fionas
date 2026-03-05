// Image Upload Diagnostic Script
// Run this in the browser console to diagnose image upload issues

async function diagnoseImageUpload() {
  console.log('🔧 Diagnosing image upload functionality...')
  
  try {
    // 1. Check if SimpleTourService is available
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    console.log('✅ SimpleTourService imported successfully')
    
    // 2. Test Supabase connection
    console.log('🔍 Testing Supabase connection...')
    const supabase = await SimpleTourService.getSupabase()
    console.log('✅ Supabase connection successful')
    
    // 3. Check available buckets
    console.log('🔍 Checking storage buckets...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Error listing buckets:', bucketError)
      return
    }
    
    console.log('✅ Available buckets:', buckets)
    
    const tourImagesBucket = buckets.find(b => b.name === 'tour-images')
    if (!tourImagesBucket) {
      console.error('❌ "tour-images" bucket not found!')
      console.log('💡 Solution: Create a bucket named "tour-images" in your Supabase Dashboard')
      return
    }
    
    console.log('✅ "tour-images" bucket found')
    
    // 4. Test bucket permissions
    console.log('🔍 Testing bucket permissions...')
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('tour-images')
        .list('tours')
      
      if (listError) {
        console.error('❌ Error listing files in bucket:', listError)
        console.log('💡 This might be a permissions issue. Check your Supabase storage policies.')
      } else {
        console.log('✅ Bucket permissions seem OK')
      }
    } catch (permError) {
      console.error('❌ Permission test failed:', permError)
    }
    
    // 5. Create a test file upload
    console.log('🔍 Testing with a small test image...')
    
    // Create a small test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1, 1)
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('❌ Failed to create test blob')
        return
      }
      
      const testFile = new File([blob], 'test-upload.png', { type: 'image/png' })
      console.log('🔍 Created test file:', testFile.name, testFile.size, 'bytes')
      
      try {
        const imageUrl = await SimpleTourService.saveImage(testFile)
        console.log('✅ Test upload successful:', imageUrl)
      } catch (uploadError) {
        console.error('❌ Test upload failed:', uploadError)
        console.log('💡 Check the error message above for specific issues')
      }
    }, 'image/png')
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error)
  }
}

// Function to create the "tour-images" bucket if it doesn't exist
async function createTourImagesBucket() {
  console.log('🔧 Attempting to create "tour-images" bucket...')
  
  try {
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    const supabase = await SimpleTourService.getSupabase()
    
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      console.error('❌ Failed to create bucket:', error)
      console.log('💡 You may need to create this bucket manually in the Supabase Dashboard')
      console.log('💡 Go to: Storage > Buckets > New Bucket')
      console.log('💡 Name: "tour-images", Public: true')
    } else {
      console.log('✅ Bucket created successfully:', data)
    }
  } catch (error) {
    console.error('❌ Bucket creation failed:', error)
  }
}

console.log('🔧 Diagnostic functions loaded:')
console.log('- Run diagnoseImageUpload() to check the upload system')
console.log('- Run createTourImagesBucket() to create the storage bucket if needed')
