import { NextRequest, NextResponse } from 'next/server'
import CustomToursService from '@/lib/custom-tours-db'

// GET /api/custom-tours/submissions - Get custom tour submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters = {
      status: searchParams.get('status') || undefined,
      email: searchParams.get('email') || undefined,
      destination: searchParams.get('destination') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    }

    const result = await CustomToursService.getSubmissions(filters)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        total: result.total
      }
    })
  } catch (error) {
    console.error('Error in GET /api/custom-tours/submissions:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/custom-tours/submissions - Create new custom tour submission
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'destination', 'startDate', 'budgetRange', 'agreement']
    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate date format
    if (formData.startDate && isNaN(Date.parse(formData.startDate))) {
      return NextResponse.json(
        { success: false, message: 'Invalid start date format' },
        { status: 400 }
      )
    }

    if (formData.endDate && isNaN(Date.parse(formData.endDate))) {
      return NextResponse.json(
        { success: false, message: 'Invalid end date format' },
        { status: 400 }
      )
    }

    // Validate guest numbers
    if (formData.adults < 0 || formData.children < 0) {
      return NextResponse.json(
        { success: false, message: 'Number of guests cannot be negative' },
        { status: 400 }
      )
    }

    const result = await CustomToursService.saveFormSubmission(formData)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Custom tour submission created successfully',
      data: result.data
    })
  } catch (error) {
    console.error('Error in POST /api/custom-tours/submissions:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
