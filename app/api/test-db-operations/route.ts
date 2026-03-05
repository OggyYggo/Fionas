import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing SimpleTourService database operations...')
    
    // Import SimpleTourService
    const { SimpleTourService } = await import('@/lib/simpleTourService')
    
    // Test creating a tour
    console.log('Testing tour creation...')
    const testTour = {
      title: 'Test Tour',
      description: 'A test tour for debugging',
      image: 'https://example.com/test.jpg',
      duration: '2 hours',
      maxPeople: '10',
      price: '50.00',
      tag: 'adventure',
      featured: false
    }
    
    const result = await SimpleTourService.createTour(testTour)
    
    console.log('✅ Tour creation successful:', result)
    
    return NextResponse.json({
      success: true,
      message: '✅ SimpleTourService database operations work!',
      result: result
    })
    
  } catch (error: any) {
    console.error('❌ SimpleTourService database test failed:', error)
    
    // Provide detailed error info
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      details: {
        name: error.name,
        message: error.message
      }
    })
  }
}
