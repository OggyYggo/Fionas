const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Service Key:', supabaseServiceKey ? 'Found' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('Testing testimonials table access...');
    const { data, error } = await supabase.from('testimonials').select('count');
    if (error) {
      console.log('Error accessing testimonials table:', error.message);
      console.log('This might mean the table doesn\'t exist or RLS policies are blocking access');
      
      // Try to test a simple insert
      console.log('Testing insert permissions...');
      const testData = {
        customer_name: 'Test User',
        tour_name: 'Test Tour',
        rating: 5,
        testimonial_text: 'Test testimonial',
        status: 'pending'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('testimonials')
        .insert(testData)
        .select();
        
      if (insertError) {
        console.log('Insert error:', insertError.message);
      } else {
        console.log('Insert successful:', insertData);
      }
    } else {
      console.log('Testimonials table is accessible');
      console.log('Count:', data);
    }
  } catch (err) {
    console.log('Connection error:', err.message);
  }
}

testConnection();
