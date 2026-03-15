const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTestimonialsTable() {
  try {
    console.log('Setting up testimonials table...');
    
    // Read and execute the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, 'supabase', 'create-testimonials-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .filter(stmt => stmt.trim().length > 0 && !stmt.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        
        // Try to execute via RPC if it's a CREATE TABLE statement
        if (statement.trim().toLowerCase().includes('create table')) {
          // For CREATE TABLE, we need to use raw SQL
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          if (error) {
            console.log('RPC error, trying direct approach...');
            console.log('Error details:', error);
          }
        }
      }
    }
    
    // Test if table exists now
    console.log('Testing if testimonials table exists...');
    const { data, error } = await supabase.from('testimonials').select('count');
    if (error) {
      console.error('Table still not accessible:', error.message);
      console.log('You may need to manually run the SQL file in your Supabase dashboard:');
      console.log('1. Go to your Supabase project');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/create-testimonials-table.sql');
      console.log('4. Run the SQL');
    } else {
      console.log('✅ Testimonials table created successfully!');
      console.log('Current count:', data);
    }
    
  } catch (err) {
    console.error('Setup error:', err);
  }
}

setupTestimonialsTable();
