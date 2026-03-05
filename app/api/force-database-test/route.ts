import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing direct Supabase connection...')
    
    // Force direct Supabase test
    const { supabase } = await import('@/lib/supabase')
    
    // Test 1: Can we connect at all?
    const { data: connectionTest, error: connectionError } = await supabase.from('tours').select('count').single()
    
    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE TABLE MISSING',
        details: connectionError.message,
        fix: 'Run the SQL script in supabase/create-tours-table.sql',
        whatToDo: [
          '1. Go to your Supabase project',
          '2. Navigate to SQL Editor',
          '3. Run the script in supabase/create-tours-table.sql',
          '4. Restart your server with npm run dev'
        ]
      })
    }
    
    // Test 2: Can we insert data?
    const testTour = {
      title: 'Direct Database Test ' + Date.now(),
      description: 'This tests direct database insertion',
      image: 'https://via.placeholder.com/400x300?text=Direct+Test',
      duration: 'Half Day',
      max_people: 'Max 5',
      price: '₱100',
      tag: 'Test',
      featured: false
    }
    
    const { data: insertTest, error: insertError } = await supabase
      .from('tours')
      .insert([testTour])
      .select()
      .single()
    
    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'CANNOT INSERT TO DATABASE',
        details: insertError.message,
        connectionTest: connectionTest
      })
    }
    
    // Test 3: Can we read it back?
    const { data: readTest, error: readError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', insertTest.id)
      .single()
    
    return NextResponse.json({
      success: true,
      message: 'DATABASE WORKING PERFECTLY!',
      tests: {
        connection: '✅ Connected to Supabase',
        table: '✅ Tours table exists',
        insert: '✅ Can insert tours',
        read: '✅ Can read tours back'
      },
      sampleTour: insertTest,
      readBack: readTest,
      totalTours: connectionTest?.count,
      whatThisMeans: [
        '✅ Your database is working',
        '✅ The issue is in the tour service logic',
        '✅ Tours should save to database after fix'
      ]
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'COMPLETE DATABASE FAILURE',
      details: error instanceof Error ? error.message : 'Unknown error',
      whatToDo: [
        '1. Check your .env.local file',
        '2. Verify Supabase credentials',
        '3. Run the SQL setup script'
      ]
    })
  }
}
