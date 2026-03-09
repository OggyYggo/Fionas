const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabase() {
  try {
    console.log('Setting up Supabase...');
    
    // Create tours table
    const { error: toursError } = await supabase.rpc('create_tours_table');
    if (toursError) console.error('Tours table error:', toursError);
    
    // Create storage bucket
    const { error: bucketError } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760,
    });
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Bucket error:', bucketError);
    }

    console.log('Supabase setup completed');
  } catch (err) {
    console.error('Setup error:', err);
  }
}

setupSupabase();
