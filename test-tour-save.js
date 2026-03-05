// Test script to verify tour saving functionality
// Run this in the browser console when on the admin tours page

async function testTourSave() {
  console.log('🧪 Testing tour save functionality...')
  
  // Test data
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
  
  try {
    console.log('🔍 Testing SimpleTourService.createTour...')
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    const result = await SimpleTourService.createTour(testTourData)
    console.log('✅ Tour created successfully:', result)
    return result
  } catch (error) {
    console.error('❌ Test failed:', error)
    return null
  }
}

// Test function to check if we can fetch tours
async function testTourFetch() {
  console.log('🧪 Testing tour fetch functionality...')
  
  try {
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    const tours = await SimpleTourService.getAllTours()
    console.log('✅ Tours fetched successfully:', tours.length, 'tours found')
    return tours
  } catch (error) {
    console.error('❌ Fetch test failed:', error)
    return null
  }
}

console.log('🧪 Test functions loaded. Use testTourSave() or testTourFetch() to test.')
