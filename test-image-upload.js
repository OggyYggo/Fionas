// Test Image Upload After Bucket Creation
// Run this in browser console to verify everything works

async function testImageUpload() {
  console.log('🧪 Testing image upload functionality...')
  
  try {
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    console.log('✅ SimpleTourService imported')
    
    // Create a small test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1, 1)
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('❌ Failed to create test blob')
        return
      }
      
      const testFile = new File([blob], 'test-upload.png', { type: 'image/png' })
      console.log('🔍 Created test file:', testFile.name, testFile.size, 'bytes')
      
      try {
        const imageUrl = await SimpleTourService.saveImage(testFile)
        console.log('✅ Image upload successful!')
        console.log('📸 Image URL:', imageUrl)
        
        // Test if the image is accessible
        const img = new Image()
        img.onload = () => console.log('✅ Image is accessible and loads correctly')
        img.onerror = () => console.log('❌ Image URL is not accessible')
        img.src = imageUrl
        
      } catch (uploadError) {
        console.error('❌ Image upload still failed:', uploadError)
        console.log('💡 Check if storage policies need to be set up')
      }
    }, 'image/png')
    
  } catch (error) {
    console.error('❌ Test setup failed:', error)
  }
}

// Also test the complete tour creation flow
async function testCompleteTourCreation() {
  console.log('🧪 Testing complete tour creation with image...')
  
  try {
    const { SimpleTourService } = await import('/lib/simpleTourService.js')
    
    // Create test tour data
    const testTourData = {
      title: 'Test Tour with Image',
      description: 'This is a test tour to verify image upload works',
      image: 'https://via.placeholder.com/300x200?text=Test+Image',
      duration: 'Full Day',
      maxPeople: '10',
      price: '₱2,500',
      tag: 'Adventure',
      featured: false
    }
    
    console.log('🔍 Creating test tour...')
    const newTour = await SimpleTourService.createTour(testTourData)
    console.log('✅ Tour created successfully:', newTour)
    
    // Clean up - delete the test tour
    console.log('🧹 Cleaning up test tour...')
    await SimpleTourService.deleteTour(newTour.id)
    console.log('✅ Test tour deleted')
    
  } catch (error) {
    console.error('❌ Complete test failed:', error)
  }
}

console.log('🧪 Test functions loaded:')
console.log('- Run testImageUpload() to test image upload')
console.log('- Run testCompleteTourCreation() to test full tour creation')
console.log('- Then try the tour form manually')
