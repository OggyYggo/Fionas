import { NextRequest, NextResponse } from 'next/server'
import CustomToursService from '@/lib/custom-tours-db'

// GET /api/custom-tours/stats - Get custom tour statistics
export async function GET() {
  try {
    console.log('🔍 API: /api/custom-tours/stats - Starting request...')
    
    const result = await CustomToursService.getSubmissionStats()
    
    console.log('🔍 API: Stats service result:', result)
    
    if (!result.success) {
      console.error('❌ API: Stats service failed:', result.message)
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to fetch statistics' },
        { status: 500 }
      )
    }

    console.log('✅ API: Stats fetched successfully')
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('❌ API: Error in GET /api/custom-tours/stats:', error)
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
