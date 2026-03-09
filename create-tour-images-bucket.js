const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTourImagesBucket() {
  try {
    console.log('Creating tour images storage bucket...');
    
    const { data, error } = await supabase.storage.createBucket('tour-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880, // 5MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Bucket already exists');
      } else {
        console.error('Error creating bucket:', error);
        return;
      }
    }

    console.log('Tour images bucket created successfully');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTourImagesBucket();
