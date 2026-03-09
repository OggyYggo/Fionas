import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import 'dotenv/config';

// Read the SQL file
const sqlContent = readFileSync('supabase/fix-booking-delete-rls.sql', 'utf8');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  try {
    console.log('Executing SQL file...');
    console.log('SQL Content:');
    console.log(sqlContent);
    console.log('\n---\n');
    
    // For RLS policies, we need to use the service role key or admin functions
    // The publishable key won't have permission to modify RLS policies
    console.log('Note: This SQL contains RLS policy changes that require admin privileges.');
    console.log('You may need to run this manually in the Supabase dashboard or use the service role key.');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

executeSQL();
