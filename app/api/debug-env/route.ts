import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Debugging environment variables...')
    
    // Show all environment variables that start with NEXT_PUBLIC_SUPABASE
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      NODE_ENV: process.env.NODE_ENV
    }
    
    console.log('Environment variables loaded:')
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`- ${key}: ${value ? '✅ Set (' + value.substring(0, 20) + '...)' : '❌ Not set'}`)
    })
    
    // Show which key will be used
    const url = envVars.NEXT_PUBLIC_SUPABASE_URL
    const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    
    return NextResponse.json({
      success: true,
      envVars: {
        ...envVars,
        NEXT_PUBLIC_SUPABASE_URL: url ? url.substring(0, 30) + '...' : null,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : null,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.substring(0, 20) + '...' : null,
      },
      usingKey: key ? (key === envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ANON_KEY' : 'PUBLISHABLE_DEFAULT_KEY') : 'NONE'
    })
    
  } catch (error: any) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
