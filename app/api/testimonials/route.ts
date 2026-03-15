import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create Supabase client
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration')
  }
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
}

// GET /api/testimonials - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching testimonials...')
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const rating = searchParams.get('rating')
    const search = searchParams.get('search')
    
    const supabase = createSupabaseClient()
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply filters if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (rating && rating !== 'all') {
      query = query.eq('rating', parseInt(rating))
    }
    
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,tour_name.ilike.%${search}%,testimonial_text.ilike.%${search}%`)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('API: Database error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    console.log(`API: Successfully fetched ${data?.length || 0} testimonials`)
    
    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('API: Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create a new testimonial (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('POST testimonials API called with:', body)
    
    // Validate required fields
    const { customer_name, tour_name, rating, testimonial_text, status, date, customer_image } = body
    
    if (!customer_name || !tour_name || !rating || !testimonial_text) {
      console.error('Missing required fields:', { customer_name, tour_name, rating, testimonial_text })
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (rating < 1 || rating > 5) {
      console.error('Invalid rating:', rating)
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    const testimonialData = {
      customer_name,
      email: body.email || null,
      phone: body.phone || null,
      tour_name,
      booking_id: body.booking_id || null,
      rating: parseInt(rating),
      testimonial_text,
      status: status || 'pending',
      helpful_count: body.helpful_count || 0,
      date: date || new Date().toISOString().split('T')[0],
      customer_image: customer_image || null
    }
    
    console.log('Saving testimonial data:', testimonialData)
    
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error creating testimonial:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create testimonial: ' + error.message },
        { status: 500 }
      )
    }
    
    console.log('Testimonial created successfully:', data)
    
    return NextResponse.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Unexpected error in POST testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials - Delete a testimonial (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createSupabaseClient()
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
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

// PUT /api/testimonials - Update a testimonial (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(body)
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
