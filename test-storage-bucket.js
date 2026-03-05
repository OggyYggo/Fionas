// Test script to check storage bucket
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorageBucket() {
  try {
    console.log('🔍 Testing storage bucket access...');
    
    // List buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Error listing buckets:', bucketError.message);
      return;
    }
    
    console.log('✅ Available buckets:', buckets?.map(b => b.name));
    
    const tourImagesBucket = buckets?.find(b => b.name === 'tour-images');
    
    if (!tourImagesBucket) {
      console.log('❌ tour-images bucket does not exist');
      console.log('\n💡 Please run fix-storage-bucket.sql in your Supabase SQL Editor');
    } else {
      console.log('✅ tour-images bucket exists:', tourImagesBucket);
      
      // Test upload permissions
      console.log('🔍 Testing upload permissions...');
      
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const testFileName = `test-${Date.now()}.txt`;
      const testFilePath = `tours/${testFileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(testFilePath, testFile);
      
      if (uploadError) {
        console.error('❌ Upload test failed:', uploadError.message);
        
        if (uploadError.message.includes('Permission')) {
          console.log('💡 Storage policies need to be set up. Run fix-storage-bucket.sql');
        }
      } else {
        console.log('✅ Upload test passed:', uploadData);
        
        // Clean up test file
        await supabase.storage.from('tour-images').remove([testFilePath]);
        console.log('🧹 Test file cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStorageBucket();
