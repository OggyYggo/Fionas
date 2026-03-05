// Script to verify database setup
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database setup...\n');
    
    // Test 1: Check if tours table exists and is accessible
    console.log('1. Testing tours table access...');
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('*')
      .limit(1);
    
    if (toursError) {
      console.log('❌ Tours table error:', toursError.message);
    } else {
      console.log('✅ Tours table accessible');
    }
    
    // Test 2: Check storage bucket
    console.log('\n2. Testing storage bucket...');
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .getBucket('tour-images');
    
    if (bucketError) {
      console.log('❌ Storage bucket error:', bucketError.message);
    } else {
      console.log('✅ Tour-images bucket exists');
    }
    
    // Test 3: Test insert permissions (if table exists)
    console.log('\n3. Testing insert permissions...');
    const testTour = {
      title: 'Test Tour',
      description: 'Test description for verification',
      image: 'https://example.com/test.jpg',
      duration: 'Test Duration',
      max_people: 'Test Max',
      price: 'Test Price',
      tag: 'Test',
      featured: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('tours')
      .insert([testTour])
      .select();
    
    if (insertError) {
      console.log('❌ Insert permission error:', insertError.message);
    } else {
      console.log('✅ Insert permissions working');
      // Clean up test record
      await supabase.from('tours').delete().eq('id', insertData[0].id);
      console.log('🧹 Test record cleaned up');
    }
    
    console.log('\n🎉 Database verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyDatabase();
