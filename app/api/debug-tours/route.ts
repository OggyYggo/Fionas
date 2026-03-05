import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic Supabase connection
    const { supabase } = await import('@/lib/supabase')
    
    // Test if we can connect to Supabase at all
    const { data, error } = await supabase.from('tours').select('count').single()
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Cannot connect to tours table - likely not created yet',
        hint: 'Run the SQL script in supabase/setup-tours.sql'
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check your Supabase configuration in .env.local'
    })
  }
}
