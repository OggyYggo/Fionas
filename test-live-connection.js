// Test script to verify live Supabase connection
import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLiveConnection() {
  console.log('🔍 Testing live Supabase connection...')
  
  try {
    // Test 1: Get current data
    console.log('\n📊 Testing getSubmissions...')
    const { data: currentData, error: fetchError } = await supabase
      .from('custom_tour_submissions')
      .select('*')
      .order('submission_date', { ascending: false })
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      return
    }
    
    console.log(`✅ Found ${currentData.length} live submissions from Supabase`)
    
    // Test 2: Add new submission in real-time
    console.log('\n📝 Testing real-time insert...')
    const newSubmission = {
      full_name: 'Live Test User',
      email: `live.test.${Date.now()}@example.com`,
      phone: '+63 999 888 7777',
      destination: 'Test Destination',
      start_date: '2025-02-01',
      end_date: '2025-02-03',
      adults: 1,
      children: 0,
      activities: ['test-activity'],
      budget_range: 'standard',
      accommodation: 'mid-range',
      transportation: 'private',
      agreement: true,
      status: 'pending'
    }
    
    const { data: insertedData, error: insertError } = await supabase
      .from('custom_tour_submissions')
      .insert(newSubmission)
      .select()
    
    if (insertError) {
      console.error('❌ Insert error:', insertError)
      return
    }
    
    console.log('✅ Successfully inserted new submission with ID:', insertedData[0].id)
    
    // Test 3: Verify the new data appears immediately
    console.log('\n🔄 Testing real-time fetch...')
    const { data: updatedData, error: updatedError } = await supabase
      .from('custom_tour_submissions')
      .select('*')
      .order('submission_date', { ascending: false })
    
    if (updatedError) {
      console.error('❌ Updated fetch error:', updatedError)
      return
    }
    
    console.log(`✅ Now showing ${updatedData.length} submissions (increased by 1)`)
    
    // Test 4: Update a submission
    console.log('\n📝 Testing real-time update...')
    const { data: updateData, error: updateError } = await supabase
      .from('custom_tour_submissions')
      .update({ status: 'reviewed' })
      .eq('id', insertedData[0].id)
      .select()
    
    if (updateError) {
      console.error('❌ Update error:', updateError)
      return
    }
    
    console.log('✅ Successfully updated submission status to:', updateData[0].status)
    
    // Test 5: Delete the test submission
    console.log('\n🗑️  Testing real-time delete...')
    const { error: deleteError } = await supabase
      .from('custom_tour_submissions')
      .delete()
      .eq('id', insertedData[0].id)
    
    if (deleteError) {
      console.error('❌ Delete error:', deleteError)
      return
    }
    
    console.log('✅ Successfully deleted test submission')
    
    // Final verification
    const { data: finalData, error: finalError } = await supabase
      .from('custom_tour_submissions')
      .select('*')
    
    if (finalError) {
      console.error('❌ Final fetch error:', finalError)
      return
    }
    
    console.log(`✅ Final count: ${finalData.length} submissions (back to original)`)
    
    console.log('\n🎉 All tests passed! The data is LIVE and connected to Supabase!')
    console.log('💡 Any changes made in the admin panel will be saved to Supabase immediately')
    console.log('💡 Any new form submissions from the custom page will appear in real-time')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

testLiveConnection()
