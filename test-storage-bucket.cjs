// Test file to verify Supabase storage bucket connection
// Run with: node test-storage-bucket.cjs

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorageBucket() {
  try {
    console.log('🔗 Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    
    // Test basic connection first
    const { data, error } = await supabase
      .from('tour_packages')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return
    }
    
    console.log('✅ Database connection successful!')
    
    // Test storage bucket access
    console.log('\n🪣 Testing tour-images bucket access...')
    
    try {
      // List buckets
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      
      if (bucketError) {
        console.error('❌ Failed to list buckets:', bucketError.message)
        return
      }
      
      console.log('📦 Available buckets:')
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (public: ${bucket.public})`)
      })
      
      // Check if tour-images bucket exists
      const tourImagesBucket = buckets.find(b => b.name === 'tour-images')
      
      if (tourImagesBucket) {
        console.log('✅ tour-images bucket found!')
        
        // Try to list files in the bucket
        const { data: files, error: filesError } = await supabase.storage
          .from('tour-images')
          .list()
        
        if (filesError) {
          console.error('❌ Failed to list files in tour-images bucket:', filesError.message)
        } else {
          console.log(`📁 Files in tour-images bucket: ${files.length} files`)
          files.forEach(file => {
            console.log(`  - ${file.name} (${file.size} bytes)`)
          })
        }
        
        // Test public URL generation
        const { data: publicUrl } = supabase.storage
          .from('tour-images')
          .getPublicUrl('test-image.jpg')
        
        console.log('🔗 Sample public URL format:', publicUrl.publicUrl)
        
      } else {
        console.log('❌ tour-images bucket NOT found!')
        console.log('💡 You need to run the SQL script to create the bucket:')
        console.log('   1. Go to Supabase SQL Editor')
        console.log('   2. Run the contents of fix-storage-bucket-simple.sql')
      }
      
    } catch (storageError) {
      console.error('❌ Storage test failed:', storageError.message)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testStorageBucket()
