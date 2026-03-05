import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing SimpleTourService image upload...')
    
    // Import SimpleTourService directly
    const { SimpleTourService } = await import('@/lib/simpleTourService')
    
    // Create a test image file (like the service expects)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xCC, 0x7B, 0x1E, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ])
    
    // Create a File object as the service expects
    const file = new File([pngData], 'test-image.png', { type: 'image/png' })
    
    console.log('Testing SimpleTourService.saveImage...')
    const result = await SimpleTourService.saveImage(file)
    
    console.log('✅ SimpleTourService.saveImage successful:', result)
    
    return NextResponse.json({
      success: true,
      message: '✅ SimpleTourService image upload works perfectly!',
      result: result
    })
    
  } catch (error: any) {
    console.error('❌ SimpleTourService test failed:', error)
    
    // Provide specific guidance based on error
    if (error.message.includes('bucket does not exist')) {
      return NextResponse.json({
        success: false,
        error: 'Bucket creation failed',
        suggestion: 'Recreate bucket via Supabase Storage UI'
      })
    } else if (error.message.includes('Permission denied') || error.message.includes('policy')) {
      return NextResponse.json({
        success: false,
        error: 'RLS policy issue',
        details: error.message,
        suggestion: 'Check if RLS policies were applied correctly'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: error.message
      })
    }
  }
}
