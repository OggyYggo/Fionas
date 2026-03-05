import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Detailed Supabase key debugging...')
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    console.log('Raw environment variables:')
    console.log('- URL:', url)
    console.log('- ANON_KEY:', anonKey)
    console.log('- PUBLISHABLE_KEY:', publishableKey)
    
    // Determine which key will be used (same logic as in supabase.ts)
    const selectedKey = anonKey && anonKey !== 'your-supabase-anon-key' 
                        ? anonKey 
                        : publishableKey
    
    console.log('Selected key:', selectedKey)
    console.log('Key source:', selectedKey === anonKey ? 'ANON_KEY' : 'PUBLISHABLE_KEY')
    
    // Test with the exact selected key
    const { createClient } = await import('@supabase/supabase-js')
    
    console.log('Creating Supabase client with selected key...')
    const supabase = createClient(url!, selectedKey!)
    
    console.log('Testing connection...')
    const { data, error } = await supabase.from('tours').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        keyUsed: selectedKey === anonKey ? 'ANON_KEY' : 'PUBLISHABLE_KEY',
        keyValue: selectedKey?.substring(0, 30) + '...'
      })
    }
    
    console.log('✅ Connection successful!')
    return NextResponse.json({
      success: true,
      message: 'Connection working',
      keyUsed: selectedKey === anonKey ? 'ANON_KEY' : 'PUBLISHABLE_KEY',
      data: data
    })
    
  } catch (error: any) {
    console.error('❌ Test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
