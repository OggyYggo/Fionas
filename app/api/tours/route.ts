import { NextRequest, NextResponse } from 'next/server'
import { tours } from '@/app/tours/data/tours'
import fs from 'fs/promises'
import path from 'path'

// GET /api/tours - Fetch all tours
export async function GET() {
  try {
    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

// POST /api/tours - Update tours data
export async function POST(request: NextRequest) {
  try {
    const { tours: updatedTours } = await request.json()
    
    if (!Array.isArray(updatedTours)) {
      return NextResponse.json(
        { error: 'Invalid tours data' },
        { status: 400 }
      )
    }

    // Update the tours file
    const toursFilePath = path.join(process.cwd(), 'app', 'tours', 'data', 'tours.ts')
    const fileContent = `export const tours = ${JSON.stringify(updatedTours, null, 2)}`
    
    await fs.writeFile(toursFilePath, fileContent, 'utf-8')
    
    return NextResponse.json({ success: true, tours: updatedTours })
  } catch (error) {
    console.error('Error updating tours:', error)
    return NextResponse.json(
      { error: 'Failed to update tours' },
      { status: 500 }
    )
  }
}
