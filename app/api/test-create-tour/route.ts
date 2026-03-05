import { NextResponse } from 'next/server'
import { tourService } from '@/lib/tourService'

export async function POST() {
  try {
    const testTour = {
      title: 'Test Tour ' + Date.now(),
      description: 'This is a test tour created via API',
      image: 'https://via.placeholder.com/400x300?text=Test+Tour',
      duration: 'Half Day',
      maxPeople: 'Max 5',
      price: '₱1,000',
      tag: 'Adventure',
      featured: false
    }

    const newTour = await tourService.createTour(testTour)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test tour created successfully',
      tour: newTour
    })
  } catch (error) {
    console.error('Test create tour error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
