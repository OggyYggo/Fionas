import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('File received:', file ? {
      name: file.name,
      type: file.type,
      size: file.size
    } : 'No file')
    
    if (!file) {
      console.error('No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const imagePath = path.join(process.cwd(), 'public', 'images', 'tours', filename)
    
    console.log('Saving to:', imagePath)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(imagePath), { recursive: true })
    
    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(imagePath, buffer)
    
    console.log('File saved successfully')
    
    // Return public URL
    const publicUrl = `/images/tours/${filename}`
    
    console.log('Returning URL:', publicUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
