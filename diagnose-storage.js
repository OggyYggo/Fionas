// Diagnose storage issues
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseStorage() {
  try {
    console.log('🔍 Diagnosing Supabase storage issues...\n');
    
    // Test 1: Basic connection
    console.log('1. Testing basic Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tours')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Basic connection failed:', connectionError.message);
      return;
    } else {
      console.log('✅ Basic connection working');
    }
    
    // Test 2: List storage buckets
    console.log('\n2. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Cannot list buckets:', bucketError.message);
      
      if (bucketError.message.includes('permission')) {
        console.log('💡 This suggests RLS policies might be blocking access');
      }
    } else {
      console.log('✅ Can list buckets');
      console.log('Available buckets:', buckets?.map(b => b.name) || 'None');
    }
    
    // Test 3: Try to create bucket via RPC (if possible)
    console.log('\n3. Testing bucket creation permissions...');
    try {
      const createBucketSQL = `
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('tour-images', 'tour-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
        ON CONFLICT (id) DO NOTHING;
      `;
      
      console.log('💡 You may need to run this SQL manually in Supabase Dashboard:');
      console.log('---');
      console.log(createBucketSQL);
      console.log('---');
      
    } catch (e) {
      console.error('❌ Bucket creation test failed:', e.message);
    }
    
    // Test 4: Check if user is authenticated
    console.log('\n4. Checking authentication status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('⚠️  Not authenticated:', authError.message);
      console.log('💡 Image upload requires authentication. Make sure you are logged in.');
    } else {
      console.log('✅ Authenticated as:', user?.email || 'Unknown user');
    }
    
    console.log('\n📋 Summary:');
    console.log('- If bucket listing fails: Check Supabase project permissions');
    console.log('- If bucket exists but upload fails: Check RLS policies');
    console.log('- If not authenticated: Log in to your app first');
    console.log('- If bucket missing: Run the SQL script in Supabase Dashboard');
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  }
}

diagnoseStorage();
