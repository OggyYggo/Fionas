import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        details: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
          fix: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
        }
      })
    }

    // Test Supabase connection
    const { supabase } = await import('@/lib/supabase')
    
    // Test if tours table exists
    const { data, error } = await supabase.from('tours').select('count').single()
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Cannot connect to tours table',
        details: error.message,
        fix: 'Run the SQL script in supabase/create-tours-table.sql'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      details: {
        url: supabaseUrl,
        tableExists: true,
        tourCount: data?.count || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Supabase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
