// Create test submissions for custom tours using the existing service
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.log('URL:', supabaseUrl)
  console.log('Key exists:', !!supabaseKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestSubmissions() {
  console.log('🔍 Creating test custom tour submissions...')
  
  const testSubmissions = [
    {
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+63 912 345 6789',
      destination: 'Panglao Island',
      start_date: '2024-12-15',
      end_date: '2024-12-18',
      adults: 2,
      children: 1,
      activities: ['island-hopping', 'snorkeling'],
      budget_range: 'standard',
      accommodation: 'mid-range',
      transportation: 'private',
      agreement: true,
      status: 'pending',
      submission_date: new Date().toISOString()
    },
    {
      full_name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+63 913 456 7890',
      destination: 'Chocolate Hills',
      start_date: '2024-12-20',
      end_date: '2024-12-22',
      adults: 4,
      children: 2,
      activities: ['cultural-tour', 'wildlife-watching'],
      budget_range: 'premium',
      accommodation: 'luxury',
      transportation: 'private',
      agreement: true,
      status: 'accepted',
      submission_date: new Date().toISOString()
    },
    {
      full_name: 'David Chen',
      email: 'david.chen@email.com',
      phone: '+63 914 567 8901',
      destination: 'Loboc River',
      start_date: '2025-01-05',
      end_date: '2025-01-07',
      adults: 2,
      children: 0,
      activities: ['diving', 'island-hopping'],
      budget_range: 'budget',
      accommodation: 'budget',
      transportation: 'shared',
      agreement: true,
      status: 'reviewed',
      submission_date: new Date().toISOString()
    },
    {
      full_name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+63 915 678 9012',
      destination: 'Tarsier Sanctuary',
      start_date: '2025-01-10',
      end_date: '2025-01-12',
      adults: 3,
      children: 1,
      activities: ['wildlife-watching', 'cultural-tour'],
      budget_range: 'luxury',
      accommodation: 'luxury',
      transportation: 'private',
      agreement: true,
      status: 'quoted',
      submission_date: new Date().toISOString()
    },
    {
      full_name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+63 916 789 0123',
      destination: 'Panglao Island',
      start_date: '2025-01-15',
      end_date: '2025-01-18',
      adults: 2,
      children: 2,
      activities: ['island-hopping', 'snorkeling', 'diving'],
      budget_range: 'standard',
      accommodation: 'mid-range',
      transportation: 'private',
      agreement: true,
      status: 'contacted',
      submission_date: new Date().toISOString()
    }
  ]

  try {
    // First, check if table exists and is accessible
    console.log('🔍 Testing table access...')
    const { data: testData, error: testError } = await supabase
      .from('custom_tour_submissions')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Table access error:', testError)
      
      // If table doesn't exist, create it
      if (testError.message.includes('does not exist')) {
        console.log('🔧 Table does not exist. Creating table...')
        
        const createTableSQL = `
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
          
          -- Enable RLS
          ALTER TABLE custom_tour_submissions ENABLE ROW LEVEL SECURITY;
          
          -- Create policy for public read/write access
          CREATE POLICY "Public access" ON custom_tour_submissions
            FOR ALL USING (true) WITH CHECK (true);
        `
        
        console.log('⚠️  Please run this SQL in your Supabase SQL Editor:')
        console.log(createTableSQL)
        return
      }
      
      return
    }

    console.log('✅ Table access successful')

    // Clear existing test data
    console.log('🔧 Clearing existing test data...')
    const { error: deleteError } = await supabase
      .from('custom_tour_submissions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (deleteError) {
      console.error('❌ Error clearing data:', deleteError)
    } else {
      console.log('✅ Cleared existing data')
    }

    // Insert test submissions
    console.log('📝 Inserting test submissions...')
    for (const submission of testSubmissions) {
      const { data, error } = await supabase
        .from('custom_tour_submissions')
        .insert(submission)
        .select()

      if (error) {
        console.error('❌ Insert error for', submission.full_name, ':', error)
      } else {
        console.log('✅ Inserted:', submission.full_name, '- ID:', data[0].id)
      }
    }

    // Verify data
    console.log('🔍 Verifying inserted data...')
    const { data: allData, error: fetchError } = await supabase
      .from('custom_tour_submissions')
      .select('*')
      .order('submission_date', { ascending: false })

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError)
    } else {
      console.log('✅ Total submissions:', allData.length)
      console.log('📊 Submissions by status:')
      const statusCounts = {}
      allData.forEach(sub => {
        statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1
      })
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`)
      })
      
      console.log('\n📋 Sample submissions:')
      allData.slice(0, 3).forEach((sub, i) => {
        console.log(`  ${i+1}. ${sub.full_name} - ${sub.destination} (${sub.status})`)
      })
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createTestSubmissions()
