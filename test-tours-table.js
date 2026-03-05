// Test script to check if tours table exists
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testToursTable() {
  try {
    console.log('🔍 Testing tours table...');
    
    // Test if tours table exists and is accessible
    const { data, error } = await supabase
      .from('tours')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Tours table error:', error.message);
      
      // If tours table doesn't exist, try tour_packages
      console.log('🔍 Testing tour_packages table...');
      const { data: pkgData, error: pkgError } = await supabase
        .from('tour_packages')
        .select('count')
        .limit(1);
      
      if (pkgError) {
        console.error('❌ tour_packages table error:', pkgError.message);
        console.log('\n💡 You need to run one of these SQL files:');
        console.log('   - supabase/setup-tours.sql (for simple tours table)');
        console.log('   - supabase/schema.sql (for complex schema)');
      } else {
        console.log('✅ tour_packages table exists');
        console.log('⚠️  But your code is trying to use tours table');
        console.log('💡 Either run setup-tours.sql OR update your code to use tour_packages');
      }
    } else {
      console.log('✅ tours table exists and is accessible');
      
      // Try to fetch actual tours
      const { data: tours, error: toursError } = await supabase
        .from('tours')
        .select('*')
        .limit(5);
      
      if (toursError) {
        console.error('❌ Error fetching tours:', toursError.message);
      } else {
        console.log(`✅ Found ${tours?.length || 0} tours in the table`);
        if (tours && tours.length > 0) {
          console.log('Sample tour:', tours[0]);
        }
      }
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testToursTable();
