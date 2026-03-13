import { NextRequest, NextResponse } from 'next/server'
import CustomToursService from '@/lib/custom-tours-db'

// GET /api/custom-tours/page-data - Get custom tours page data
export async function GET() {
  try {
    const result = await CustomToursService.getPageData()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Error in GET /api/custom-tours/page-data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/custom-tours/page-data - Update custom tours page data
export async function PUT(request: NextRequest) {
  try {
    const pageData = await request.json()

    // Validate required fields
    if (!pageData || typeof pageData !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid page data provided' },
        { status: 400 }
      )
    }

    const result = await CustomToursService.savePageData(pageData)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Page data updated successfully',
      data: result.data
    })
  } catch (error) {
    console.error('Error in PUT /api/custom-tours/page-data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
