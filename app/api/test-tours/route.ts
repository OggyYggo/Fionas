import { NextResponse } from 'next/server'
import { tourService } from '@/lib/tourService'

export async function GET() {
  try {
    const tours = await tourService.getAllTours()
    return NextResponse.json({ 
      success: true, 
      count: tours.length,
      tours: tours.slice(0, 3) // Return first 3 tours for testing
    })
  } catch (error) {
    console.error('Test tours API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
