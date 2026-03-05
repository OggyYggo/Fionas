import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { supabase } = await import('@/lib/supabase')
    
    // Test creating a tour directly
    const testTour = {
      title: 'Database Test Tour ' + Date.now(),
      description: 'This tour tests direct database connection',
      image: 'https://via.placeholder.com/400x300?text=Database+Test',
      duration: 'Half Day',
      max_people: 'Max 5',
      price: '₱500',
      tag: 'Test',
      featured: false
    }

    const { data, error } = await supabase
      .from('tours')
      .insert([testTour])
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create test tour',
        details: error.message,
        fix: 'Make sure you ran the SQL script to create the tours table'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      tour: data,
      next_steps: [
        '✅ Database table exists',
        '✅ Can insert tours',
        '✅ Admin panel should work now',
        'Go to /admin/tours to test'
      ]
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
