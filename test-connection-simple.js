// Simple test to check if we can connect to the custom tours service
import CustomToursService from './lib/custom-tours-db.ts'

async function testConnection() {
  console.log('🔍 Testing CustomToursService connection...')
  
  try {
    // Test fetching submissions
    const result = await CustomToursService.getSubmissions()
    console.log('📊 getSubmissions result:', result)
    
    if (result.success) {
      console.log('✅ Connection successful!')
      console.log('📈 Found', result.data.length, 'submissions')
      
      if (result.data.length === 0) {
        console.log('❌ No data found. Let\'s try to insert some test data...')
        
        // Try to insert test data
        const testSubmission = {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+63 912 345 6789',
          destination: 'Panglao Island',
          startDate: '2024-12-15',
          endDate: '2024-12-18',
          adults: 2,
          children: 0,
          activities: ['island-hopping'],
          budgetRange: 'standard',
          accommodation: 'mid-range',
          transportation: 'private',
          agreement: true
        }
        
        const insertResult = await CustomToursService.saveFormSubmission(testSubmission)
        console.log('📝 Insert result:', insertResult)
        
        if (insertResult.success) {
          console.log('✅ Test data inserted successfully!')
          
          // Fetch again to verify
          const verifyResult = await CustomToursService.getSubmissions()
          console.log('📊 After insert - Found', verifyResult.data.length, 'submissions')
        } else {
          console.log('❌ Insert failed:', insertResult.message)
        }
      } else {
        console.log('📋 Sample submissions:')
        result.data.slice(0, 3).forEach((sub, i) => {
          console.log(`  ${i+1}. ${sub.fullName} - ${sub.destination} (${sub.status})`)
        })
      }
    } else {
      console.log('❌ Connection failed:', result.message)
    }
    
    // Test stats
    console.log('🔍 Testing stats...')
    const statsResult = await CustomToursService.getSubmissionStats()
    console.log('📊 Stats result:', statsResult)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testConnection()
