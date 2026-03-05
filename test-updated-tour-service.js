// Test Updated Tour Service
// Run this in browser console to test the fixed tour functionality

async function testUpdatedTourService() {
  console.log('🧪 Testing updated SimpleTourService with tour_packages table...')
  
  try {
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    console.log('✅ SimpleTourService imported')
    
    // Test 1: Get all tours
    console.log('🔍 Test 1: Getting all tours...')
    try {
      const tours = await SimpleTourService.getAllTours()
      console.log('✅ getAllTours successful:', tours.length, 'tours found')
      if (tours.length > 0) {
        console.log('📋 Sample tour structure:', tours[0])
        console.log('📋 Available columns:', Object.keys(tours[0]))
      }
    } catch (error) {
      console.error('❌ getAllTours failed:', error)
    }
    
    // Test 2: Create a test tour (if table structure allows)
    console.log('🔍 Test 2: Creating a test tour...')
    try {
      const testTourData = {
        title: 'Test Tour Package',
        description: 'This is a test tour created via script',
        image: 'https://via.placeholder.com/300x200?text=Test+Tour',
        duration: 'Full Day',
        maxPeople: '10',
        price: '₱2,500',
        tag: 'Adventure',
        featured: false
      }
      
      const newTour = await SimpleTourService.createTour(testTourData)
      console.log('✅ createTour successful:', newTour)
      
      // Test 3: Update the tour
      console.log('🔍 Test 3: Updating the test tour...')
      const updatedTour = await SimpleTourService.updateTour(newTour.id, {
        title: 'Updated Test Tour Package'
      })
      console.log('✅ updateTour successful:', updatedTour)
      
      // Test 4: Delete the test tour
      console.log('🔍 Test 4: Deleting the test tour...')
      const deleteResult = await SimpleTourService.deleteTour(newTour.id)
      console.log('✅ deleteTour successful:', deleteResult)
      
    } catch (error) {
      console.error('❌ Tour operations failed:', error)
      console.log('💡 This might be due to table structure differences')
    }
    
    // Test 5: Check table structure
    console.log('🔍 Test 5: Checking tour_packages table structure...')
    try {
      const { supabase } = await import('/lib/supabase.js')
      const { data: sampleData, error } = await supabase
        .from('tour_packages')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('❌ Error checking table structure:', error)
      } else if (sampleData && sampleData.length > 0) {
        console.log('✅ Table structure found:', Object.keys(sampleData[0]))
        console.log('📋 Sample data:', sampleData[0])
      } else {
        console.log('ℹ️ Table is empty or no data returned')
      }
    } catch (error) {
      console.error('❌ Structure check failed:', error)
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
  }
}

console.log('🧪 Updated test suite loaded. Run testUpdatedTourService() to test all functionality.')
