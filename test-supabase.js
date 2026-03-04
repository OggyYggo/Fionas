// Test file to verify Supabase connection
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('tour_packages')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    }
    
    console.log('✅ Connection successful!')
    
    // Test sample data
    const { data: packages, error: packageError } = await supabase
      .from('tour_packages')
      .select('*')
      .limit(3)
    
    if (packageError) {
      console.error('❌ Failed to fetch packages:', packageError.message)
      return
    }
    
    console.log('📦 Sample tour packages:')
    packages.forEach(pkg => {
      console.log(`  - ${pkg.title} (₱${pkg.base_price})`)
    })
    
    // Test booking creation
    console.log('\n🧪 Testing booking creation...')
    const testBooking = {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      tour_type: 'custom',
      number_of_guests: 2,
      budget_range: 'standard'
    }
    
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select()
      .single()
    
    if (bookingError) {
      console.error('❌ Failed to create booking:', bookingError.message)
      return
    }
    
    console.log(`✅ Test booking created: ${booking.booking_number}`)
    
    // Clean up test booking
    await supabase
      .from('bookings')
      .delete()
      .eq('id', booking.id)
    
    console.log('🧹 Test booking cleaned up')
    console.log('\n🎉 All tests passed! Supabase is ready to use.')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()
