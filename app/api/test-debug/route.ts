import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Environment check:')
    console.log('- URL:', supabaseUrl ? '✓ Set' : '✗ Not set')
    console.log('- Anon Key:', supabaseAnonKey ? '✓ Set' : '✗ Not set')
    console.log('- Service Key:', supabaseServiceKey ? '✓ Set' : '✗ Not set')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase configuration',
        config: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
          serviceKey: !!supabaseServiceKey
        }
      })
    }
    
    // Test connection with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
    
    console.log('Testing testimonials table...')
    const { data, error, count } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact' })
      .limit(3)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    console.log('Success! Found', count, 'total testimonials')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      totalCount: count,
      sampleData: data,
      config: {
        url: !!supabaseUrl,
        anonKey: !!supabaseAnonKey,
        serviceKey: !!supabaseServiceKey
      }
    })
    
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
