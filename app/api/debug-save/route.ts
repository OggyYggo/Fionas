import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🔍 Debug save attempt:', body)
    
    // Test Supabase connection
    const { supabase } = await import('@/lib/supabase')
    
    // Test if we can connect at all
    const { data: testData, error: testError } = await supabase.from('tours').select('count').single()
    
    if (testError) {
      console.log('❌ Supabase connection error:', testError)
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: testError.message,
        fix: 'Run the SQL script to create the tours table'
      })
    }
    
    console.log('✅ Supabase connection OK, current tours:', testData?.count || 0)
    
    // Try to insert the tour
    const { data, error } = await supabase
      .from('tours')
      .insert([{
        title: body.title,
        description: body.description,
        image: body.image,
        duration: body.duration,
        max_people: body.maxPeople,
        price: body.price,
        tag: body.tag,
        featured: body.featured
      }])
      .select()
      .single()
    
    if (error) {
      console.log('❌ Insert error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to save tour',
        details: error.message,
        body: body
      })
    }
    
    console.log('✅ Tour saved successfully:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Tour saved to database!',
      tour: data,
      debug: {
        received: body,
        saved: data
      }
    })
  } catch (error) {
    console.log('❌ Server error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
