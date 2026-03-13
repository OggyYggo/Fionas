// Check what fields are missing from the admin display
import { config } from 'dotenv'
config({ path: '.env.local' })

// Import the service directly to test
async function checkMissingFields() {
  console.log('🔍 Checking for missing fields in CustomToursService...')
  
  try {
    // Import the service
    const { CustomToursService } = await import('./lib/custom-tours-db.js')
    
    // Get submissions
    const result = await CustomToursService.getSubmissions()
    
    if (!result.success) {
      console.error('❌ Failed to get submissions:', result.message)
      return
    }
    
    console.log(`📊 Found ${result.data.length} submissions`)
    
    if (result.data.length === 0) {
      console.log('❌ No submissions found!')
      return
    }
    
    // Check each submission for missing fields
    console.log('\n🔍 Checking each submission for missing fields:')
    
    const allFields = [
      'id', 'fullName', 'email', 'phone', 'destination', 'startDate', 'endDate',
      'adults', 'children', 'activities', 'otherActivity', 'budgetRange',
      'accommodation', 'transportation', 'tourGuide', 'specialRequests',
      'agreement', 'status', 'assignedTo', 'internalNotes', 'quoteAmount',
      'quoteCurrency', 'followUpDate', 'submissionDate', 'updatedAt'
    ]
    
    const missingReport = {}
    
    result.data.forEach((submission, index) => {
      console.log(`\n${index + 1}. ${submission.fullName || 'Unknown'} (${submission.id})`)
      
      const missing = []
      allFields.forEach(field => {
        if (submission[field] === undefined || submission[field] === null || submission[field] === '') {
          missing.push(field)
        }
      })
      
      if (missing.length > 0) {
        console.log(`   ❌ Missing fields: ${missing.join(', ')}`)
        missing.forEach(field => {
          if (!missingReport[field]) missingReport[field] = []
          missingReport[field].push(index + 1)
        })
      } else {
        console.log(`   ✅ All fields present`)
      }
      
      // Show key fields for verification
      console.log(`   📋 Key data:`)
      console.log(`      Name: ${submission.fullName}`)
      console.log(`      Email: ${submission.email}`)
      console.log(`      Destination: ${submission.destination}`)
      console.log(`      Start: ${submission.startDate}`)
      console.log(`      End: ${submission.endDate || 'N/A'}`)
      console.log(`      Adults: ${submission.adults}`)
      console.log(`      Children: ${submission.children}`)
      console.log(`      Budget: ${submission.budgetRange}`)
      console.log(`      Status: ${submission.status}`)
    })
    
    // Summary of missing fields
    if (Object.keys(missingReport).length > 0) {
      console.log('\n📊 Missing fields summary:')
      Object.entries(missingReport).forEach(([field, indices]) => {
        console.log(`   ${field}: Submissions ${indices.join(', ')}`)
      })
    } else {
      console.log('\n✅ No missing fields found!')
    }
    
    // Check if the issue is with the admin page display
    console.log('\n🔍 Checking admin page display mapping...')
    
    // Test the specific fields that the admin page expects
    const adminPageFields = [
      'id', 'fullName', 'email', 'phone', 'destination', 'startDate', 'endDate',
      'adults', 'children', 'budgetRange', 'status'
    ]
    
    result.data.forEach((submission, index) => {
      const adminMissing = adminPageFields.filter(field => 
        submission[field] === undefined || submission[field] === null || submission[field] === ''
      )
      
      if (adminMissing.length > 0) {
        console.log(`❌ Admin page missing fields for submission ${index + 1}: ${adminMissing.join(', ')}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error checking fields:', error)
  }
}

checkMissingFields()
