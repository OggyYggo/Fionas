// Script to apply database changes
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyDatabaseChanges() {
  try {
    console.log('🚀 Applying database changes...');
    
    // Read the complete SQL script
    const fs = require('fs');
    const sqlScript = fs.readFileSync('supabase/create-tours-table.sql', 'utf8');
    
    console.log('📝 Executing SQL script...');
    
    // Try to execute via RPC (if available)
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      console.log('⚠️  RPC execution failed:', error.message);
      console.log('\n📋 Manual setup required:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Click "New query"');
      console.log('4. Copy and paste the SQL script below');
      console.log('5. Click "Run"');
      console.log('\n' + '='.repeat(50));
      console.log(sqlScript);
      console.log('='.repeat(50));
    } else {
      console.log('✅ Database changes applied successfully!');
    }
    
    // Test the connection
    console.log('\n🧪 Testing database connection...');
    const { data: tours, error: testError } = await supabase
      .from('tours')
      .select('count(*)')
      .single();
    
    if (testError) {
      console.log('❌ Database test failed:', testError.message);
    } else {
      console.log('✅ Database connection verified!');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

applyDatabaseChanges();
