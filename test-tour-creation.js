// Test tour creation to debug the error
import { SimpleTourService } from './lib/simpleTourService.js';

async function testTourCreation() {
  try {
    console.log('🔍 Testing tour creation...');
    
    const testTour = {
      title: 'Test Tour for Debug',
      description: 'This is a test tour to debug the creation issue',
      image: 'https://example.com/test.jpg',
      duration: 'Half Day',
      maxPeople: 'Max 5',
      price: '₱1,000',
      tag: 'Test',
      featured: false
    };
    
    console.log('🔍 Creating tour with data:', testTour);
    
    const newTour = await SimpleTourService.createTour(testTour);
    
    console.log('✅ Tour created successfully:', newTour);
    
    // Clean up - delete the test tour
    await SimpleTourService.deleteTour(newTour.id);
    console.log('🧹 Test tour cleaned up');
    
  } catch (error) {
    console.error('❌ Tour creation failed:', error.message);
    console.error('Full error:', error);
  }
}

testTourCreation();
