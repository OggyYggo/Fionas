// Test script to verify admin tours database connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminConnection() {
  try {
    console.log('🔍 Testing admin tours database connection...\n');
    
    // Test 1: Check if we can read tours
    console.log('1. Testing read access to tours table...');
    const { data: tours, error: readError } = await supabase
      .from('tours')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('❌ Read access failed:', readError.message);
      return;
    } else {
      console.log('✅ Read access working');
      console.log(`📊 Found ${tours.length} tours in database`);
      if (tours.length > 0) {
        console.log('📝 Sample tour:', {
          id: tours[0].id,
          title: tours[0].title,
          price: tours[0].price
        });
      }
    }
    
    // Test 2: Check if we can create a test tour
    console.log('\n2. Testing write access...');
    const testTour = {
      title: 'Test Admin Connection',
      description: 'Test tour to verify admin database connection',
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
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Write access failed:', insertError.message);
      console.log('💡 This might indicate RLS policy issues');
    } else {
      console.log('✅ Write access working');
      console.log('📝 Created test tour with ID:', insertData.id);
      
      // Clean up test record
      await supabase.from('tours').delete().eq('id', insertData.id);
      console.log('🧹 Test record cleaned up');
    }
    
    // Test 3: Check storage bucket
    console.log('\n3. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .getBucket('tour-images');
    
    if (bucketError) {
      console.log('❌ Storage bucket error:', bucketError.message);
      console.log('💡 Image uploads will not work until bucket is created');
    } else {
      console.log('✅ Storage bucket accessible');
    }
    
    console.log('\n🎉 Admin connection test complete!');
    
    // Summary
    console.log('\n📋 Summary:');
    console.log('- Database connection: ✅');
    console.log('- Tours table access:', tours ? '✅' : '❌');
    console.log('- Write permissions:', insertData ? '✅' : '❌');
    console.log('- Storage bucket:', buckets ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testAdminConnection();
