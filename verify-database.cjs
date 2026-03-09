const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  try {
    console.log('Verifying database connection...');
    
    const { data, error } = await supabase.from('tours').select('count').limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return;
    }

    console.log('Database connection verified successfully');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

verifyDatabase();
