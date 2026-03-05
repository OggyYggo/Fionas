import { NextRequest, NextResponse } from 'next/server'
import { SimpleTourService } from '@/lib/simpleTourService'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Testing tour creation API...')
    
    const testTour = {
      title: 'API Test Tour',
      description: 'This is a test tour from the API',
      image: 'https://example.com/test.jpg',
      duration: 'Half Day',
      maxPeople: 'Max 5',
      price: '₱1,000',
      tag: 'Test',
      featured: false
    }
    
    console.log('🔍 Creating tour with data:', testTour)
    
    const newTour = await SimpleTourService.createTour(testTour)
    
    console.log('✅ Tour created successfully:', newTour)
    
    // Clean up - delete the test tour
    await SimpleTourService.deleteTour(newTour.id)
    console.log('🧹 Test tour cleaned up')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tour creation test passed!',
      testResult: newTour 
    })
    
  } catch (error) {
    console.error('❌ Tour creation test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    )
  }
}
