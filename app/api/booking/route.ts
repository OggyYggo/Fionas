import { NextRequest, NextResponse } from 'next/server'
import { BookingService } from '@/lib/supabase'

// Mock database for demo purposes
// In production, you'd use a real database like PostgreSQL, MongoDB, etc.
interface Booking {
  id: string
  fullName: string
  email: string
  phone: string
  tourType: string
  startDate: string
  endDate?: string
  numberOfGuests: string
  budgetRange: string
  interests: string[]
  destinations: string[]
  additionalNotes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  totalPrice?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'tourType', 'numberOfGuests']
    const missingFields = requiredFields.filter(field => !body[field])
    
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      )
    }

    // Create booking using Supabase service
    const result = await BookingService.createBooking({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      tourType: body.tourType,
      startDate: body.startDate,
      endDate: body.endDate,
      numberOfGuests: body.numberOfGuests,
      budgetRange: body.budgetRange,
      interests: body.interests,
      destinations: body.destinations,
      additionalNotes: body.additionalNotes
    })

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const email = searchParams.get('email')
    const bookingId = searchParams.get('bookingId')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Get bookings using Supabase service
    const result = await BookingService.getBookings({
      status: status || undefined,
      email: email || undefined,
      bookingId: bookingId || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    })

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }

  } catch (error) {
    console.error('Get bookings API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, status, additionalNotes } = body

    if (!bookingId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Booking ID is required' 
        },
        { status: 400 }
      )
    }

    // Update booking using Supabase service
    const result = await BookingService.updateBooking({
      bookingId,
      status,
      additionalNotes
    })

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Update booking API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    if (!bookingId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Booking ID is required' 
        },
        { status: 400 }
      )
    }

    // Delete booking using Supabase service
    const result = await BookingService.deleteBooking(bookingId)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Delete booking API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}