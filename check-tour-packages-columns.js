// Check tour_packages table structure
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTourPackagesColumns() {
  try {
    console.log('🔍 Checking tour_packages table structure...');
    
    // Get a sample record to see the columns
    const { data, error } = await supabase
      .from('tour_packages')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ tour_packages columns found:');
      console.log(Object.keys(data[0]));
      
      const sample = data[0];
      console.log('\nSample record:');
      console.log(JSON.stringify(sample, null, 2));
      
      // Check if it has the columns we need for Tour interface
      const requiredColumns = ['id', 'title', 'description', 'image', 'duration', 'max_people', 'price', 'tag', 'featured'];
      const availableColumns = Object.keys(sample);
      
      console.log('\n🔍 Column compatibility check:');
      requiredColumns.forEach(col => {
        const hasColumn = availableColumns.includes(col);
        console.log(`${hasColumn ? '✅' : '❌'} ${col}`);
      });
      
    } else {
      console.log('📝 tour_packages table is empty');
    }
  } catch (err) {
    console.error('❌ Check failed:', err.message);
  }
}

checkTourPackagesColumns();
