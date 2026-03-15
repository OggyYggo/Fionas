import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create Supabase client with service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

// GET /api/testimonials/[id] - Get a single testimonial (for testing)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('GET route hit for testimonials/[id] with ID:', params.id)
    const { id } = params
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/testimonials/[id] - Update a testimonial (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Route hit! Processing PUT request for testimonials/[id]')
    const { id } = params
    const body = await request.json()
    
    console.log('PUT request received:', { id, body })
    
    // Validate testimonial exists
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
    
    console.log('Existing testimonial query:', { data: existingTestimonial, error: fetchError })
    
    if (fetchError || !existingTestimonial) {
      console.log('Testimonial not found, returning error')
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = {}
    
    if (body.customer_name !== undefined) updateData.customer_name = body.customer_name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.tour_name !== undefined) updateData.tour_name = body.tour_name
    if (body.booking_id !== undefined) updateData.booking_id = body.booking_id
    if (body.rating !== undefined) {
      if (body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be between 1 and 5' },
          { status: 400 }
        )
      }
      updateData.rating = body.rating
    }
    if (body.testimonial_text !== undefined) updateData.testimonial_text = body.testimonial_text
    if (body.status !== undefined) updateData.status = body.status
    if (body.helpful_count !== undefined) updateData.helpful_count = body.helpful_count
    if (body.date !== undefined) updateData.date = body.date
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating testimonial:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update testimonial' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials/[id] - Delete a testimonial (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE route hit for testimonials/[id] with ID:', params.id)
    const { id } = params
    
    // Validate testimonial exists
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
    
    console.log('DELETE - Existing testimonial check:', { data: existingTestimonial, error: fetchError })
    
    if (fetchError || !existingTestimonial) {
      console.log('DELETE - Testimonial not found, returning error')
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
    console.log('DELETE - Delete operation result:', { error })
    
    if (error) {
      console.error('Error deleting testimonial:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete testimonial' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
