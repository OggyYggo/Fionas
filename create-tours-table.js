const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createToursTable() {
  try {
    console.log('Creating tours table...');
    
    const { data, error } = await supabase.rpc('create_tours_table');

    if (error) {
      console.error('Error creating tours table:', error);
      return;
    }

    console.log('Tours table created successfully');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createToursTable();
