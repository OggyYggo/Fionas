const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStorageBucket() {
  try {
    console.log('Creating storage bucket...');
    
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }

    console.log('Storage bucket created successfully:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createStorageBucket();
