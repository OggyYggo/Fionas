// Verify data in Supabase vs what the admin page shows
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyData() {
  console.log('🔍 Verifying custom tours data...')
  
  try {
    // 1. Check table exists and get all data
    console.log('\n📊 Checking table and all data...')
    const { data: allData, error: allError } = await supabase
      .from('custom_tour_submissions')
      .select('*')
      .order('submission_date', { ascending: false })
    
    if (allError) {
      console.error('❌ Error fetching all data:', allError)
      return
    }
    
    console.log(`✅ Found ${allData.length} total submissions`)
    
    if (allData.length === 0) {
      console.log('❌ No data found in table!')
      return
    }
    
    // 2. Show detailed data for each submission
    console.log('\n📋 Detailed submission data:')
    allData.forEach((submission, index) => {
      console.log(`\n${index + 1}. ID: ${submission.id}`)
      console.log(`   Name: ${submission.full_name}`)
      console.log(`   Email: ${submission.email}`)
      console.log(`   Phone: ${submission.phone || 'MISSING'}`)
      console.log(`   Destination: ${submission.destination}`)
      console.log(`   Start Date: ${submission.start_date}`)
      console.log(`   End Date: ${submission.end_date || 'MISSING'}`)
      console.log(`   Adults: ${submission.adults}`)
      console.log(`   Children: ${submission.children}`)
      console.log(`   Activities: ${JSON.stringify(submission.activities || [])}`)
      console.log(`   Other Activity: ${submission.other_activity || 'MISSING'}`)
      console.log(`   Budget Range: ${submission.budget_range}`)
      console.log(`   Accommodation: ${submission.accommodation || 'MISSING'}`)
      console.log(`   Transportation: ${submission.transportation || 'MISSING'}`)
      console.log(`   Tour Guide: ${submission.tour_guide || 'MISSING'}`)
      console.log(`   Special Requests: ${submission.special_requests || 'MISSING'}`)
      console.log(`   Agreement: ${submission.agreement}`)
      console.log(`   Status: ${submission.status}`)
      console.log(`   Submission Date: ${submission.submission_date}`)
    })
    
    // 3. Check for missing required fields
    console.log('\n🔍 Checking for missing required fields...')
    const requiredFields = ['full_name', 'email', 'destination', 'start_date', 'budget_range', 'agreement']
    const missingFields = {}
    
    allData.forEach((submission, index) => {
      requiredFields.forEach(field => {
        if (!submission[field]) {
          if (!missingFields[field]) missingFields[field] = []
          missingFields[field].push(index + 1)
        }
      })
    })
    
    if (Object.keys(missingFields).length > 0) {
      console.log('❌ Missing required fields found:')
      Object.entries(missingFields).forEach(([field, indices]) => {
        console.log(`   ${field}: Submissions ${indices.join(', ')}`)
      })
    } else {
      console.log('✅ All required fields present')
    }
    
    // 4. Check for missing optional fields
    console.log('\n🔍 Checking optional fields availability...')
    const optionalFields = ['phone', 'end_date', 'activities', 'other_activity', 'accommodation', 'transportation', 'tour_guide', 'special_requests']
    const optionalStats = {}
    
    optionalFields.forEach(field => {
      const count = allData.filter(s => s[field]).length
      optionalStats[field] = count
      console.log(`   ${field}: ${count}/${allData.length} submissions have this field`)
    })
    
    // 5. Test the service layer
    console.log('\n🔍 Testing CustomToursService.getSubmissions()...')
    try {
      // Import and test the service
      const CustomToursService = require('./lib/custom-tours-db.ts').default || require('./lib/custom-tours-db.ts').CustomToursService
      
      const serviceResult = await CustomToursService.getSubmissions()
      console.log(`✅ Service returned ${serviceResult.data?.length || 0} submissions`)
      
      if (serviceResult.success && serviceResult.data) {
        console.log('📊 Service data comparison:')
        console.log(`   Direct query: ${allData.length} submissions`)
        console.log(`   Service query: ${serviceResult.data.length} submissions`)
        
        if (allData.length !== serviceResult.data.length) {
          console.log('⚠️  Mismatch found between direct query and service!')
        } else {
          console.log('✅ Data counts match')
        }
      }
    } catch (serviceError) {
      console.log('❌ Service test failed:', serviceError.message)
    }
    
    // 6. Summary
    console.log('\n📈 Summary:')
    console.log(`   Total submissions: ${allData.length}`)
    console.log(`   Status breakdown:`)
    const statusCounts = {}
    allData.forEach(sub => {
      statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1
    })
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Verification error:', error)
  }
}

verifyData()
