// Test script to insert custom tour data directly
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'exists' : 'missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertTestData() {
  console.log('🔍 Testing direct Supabase connection...')
  
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
    }
  ]

  try {
    // Test connection first
    console.log('🔍 Testing table access...')
    const { data: testData, error: testError } = await supabase
      .from('custom_tour_submissions')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Table access error:', testError)
      return
    }

    console.log('✅ Table access successful')

    // Insert test data
    console.log('🔍 Inserting test data...')
    for (const submission of testSubmissions) {
      const { data, error } = await supabase
        .from('custom_tour_submissions')
        .insert(submission)
        .select()

      if (error) {
        console.error('❌ Insert error:', error)
      } else {
        console.log('✅ Inserted submission for:', submission.full_name)
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
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

insertTestData()
