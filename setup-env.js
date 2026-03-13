// Setup script to create proper .env.local file
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

console.log('🔧 Setting up environment for custom tours...')

// Read current .env.local
const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
  console.log('📖 Found existing .env.local file')
} else {
  console.log('❌ .env.local file not found')
  console.log('Please create a .env.local file with your Supabase credentials:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key')
  process.exit(1)
}

// Extract current values
const lines = envContent.split('\n')
const envVars = {}
lines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=')
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

console.log('🔍 Current environment variables:')
console.log('URL:', envVars.NEXT_PUBLIC_SUPABASE_URL || 'missing')
console.log('Key:', envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing')

// Test connection
if (envVars.NEXT_PUBLIC_SUPABASE_URL && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const supabase = createClient(
      envVars.NEXT_PUBLIC_SUPABASE_URL,
      envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Test basic connection
    const { data, error } = await supabase
      .from('custom_tour_submissions')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection test failed:', error.message)
      
      if (error.message.includes('does not exist')) {
        console.log('🔧 Table does not exist. Creating...')
        
        // Try to create table using RPC or suggest manual creation
        const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS custom_tour_submissions (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              full_name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT,
              destination TEXT NOT NULL,
              start_date DATE NOT NULL,
              end_date DATE,
              adults INTEGER DEFAULT 1,
              children INTEGER DEFAULT 0,
              activities TEXT[],
              other_activity TEXT,
              budget_range TEXT NOT NULL,
              accommodation TEXT,
              transportation TEXT,
              tour_guide TEXT,
              special_requests TEXT,
              agreement BOOLEAN NOT NULL DEFAULT false,
              status TEXT DEFAULT 'pending',
              assigned_to TEXT,
              internal_notes TEXT,
              quote_amount NUMERIC,
              quote_currency TEXT,
              follow_up_date DATE,
              submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Public access" ON custom_tour_submissions
              FOR ALL USING (true) WITH CHECK (true);
          `
        })
        
        if (createError) {
          console.log('⚠️  Auto-creation failed. Please run this SQL manually in Supabase:')
          console.log(`
CREATE TABLE IF NOT EXISTS custom_tour_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  activities TEXT[],
  other_activity TEXT,
  budget_range TEXT NOT NULL,
  accommodation TEXT,
  transportation TEXT,
  tour_guide TEXT,
  special_requests TEXT,
  agreement BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  internal_notes TEXT,
  quote_amount NUMERIC,
  quote_currency TEXT,
  follow_up_date DATE,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access" ON custom_tour_submissions
  FOR ALL USING (true) WITH CHECK (true);
          `)
        } else {
          console.log('✅ Table created successfully')
        }
      }
    } else {
      console.log('✅ Connection successful!')
      
      // Check if table has data
      const { data: existingData, error: dataError } = await supabase
        .from('custom_tour_submissions')
        .select('*')
        .limit(5)
      
      if (dataError) {
        console.log('❌ Error checking data:', dataError.message)
      } else {
        console.log('📊 Found', existingData.length, 'existing submissions')
        
        if (existingData.length === 0) {
          console.log('🔧 No data found. Inserting test data...')
          
          // Insert test data
          const testSubmission = {
            full_name: 'Test User',
            email: 'test@example.com',
            phone: '+63 912 345 6789',
            destination: 'Panglao Island',
            start_date: '2024-12-15',
            end_date: '2024-12-18',
            adults: 2,
            children: 0,
            activities: ['island-hopping'],
            budget_range: 'standard',
            accommodation: 'mid-range',
            transportation: 'private',
            agreement: true,
            status: 'pending'
          }
          
          const { data: insertData, error: insertError } = await supabase
            .from('custom_tour_submissions')
            .insert(testSubmission)
            .select()
          
          if (insertError) {
            console.log('❌ Insert failed:', insertError.message)
          } else {
            console.log('✅ Test data inserted successfully!')
            console.log('📋 Submission ID:', insertData[0].id)
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Connection test error:', error)
  }
} else {
  console.log('❌ Missing Supabase configuration')
  console.log('Please update your .env.local file with proper Supabase credentials')
}
