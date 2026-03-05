import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing with image file...')
    
    const { supabase } = await import('@/lib/supabase')
    
    // Create a small test image (1x1 PNG) with correct MIME type
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
    
    const { data, error } = await supabase.storage
      .from('tour-images')
      .upload('test-image.png', pngData, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png'
      })
    
    if (error) {
      console.error('❌ Image upload test failed:', error)
      
      if (error.message.includes('Bucket not found')) {
        return NextResponse.json({
          success: false,
          error: 'Bucket does not exist',
          details: error.message
        })
      } else if (error.message.includes('permission') || error.message.includes('Policies')) {
        return NextResponse.json({
          success: false,
          error: 'RLS policies missing',
          details: error.message,
          suggestion: 'Run the RLS policies SQL script'
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'Upload failed',
          details: error.message
        })
      }
    }
    
    console.log('✅ Image upload successful:', data)
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('tour-images')
      .getPublicUrl('test-image.png')
    
    // Clean up
    await supabase.storage.from('tour-images').remove(['test-image.png'])
    
    return NextResponse.json({
      success: true,
      message: '✅ tour-images bucket exists and works perfectly!',
      uploadTest: data,
      publicUrl: publicUrl
    })
    
  } catch (error: any) {
    console.error('❌ Image test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
