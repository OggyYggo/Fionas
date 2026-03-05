import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection in API route...')
    
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    console.log('Environment check:')
    console.log('- URL:', url ? '✅ Set' : '❌ Not set')
    console.log('- Key:', key ? '✅ Set' : '❌ Not set')
    
    if (!url || !key) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        env: {
          url: !!url,
          key: !!key
        }
      })
    }
    
    // Import Supabase client
    const { supabase } = await import('@/lib/supabase')
    
    // Test connection
    const { data, error } = await supabase.from('tours').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    console.log('✅ Supabase connection successful')
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      data: data
    })
    
  } catch (error: any) {
    console.error('❌ API route error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
