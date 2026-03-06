import { NextRequest, NextResponse } from 'next/server'
import { tours } from '@/app/tours/data/tours'
import fs from 'fs/promises'
import path from 'path'
import { SimpleTourService } from '@/lib/simpleTourService'

interface ToursResponse {
  tours: any[]
  totalCount: number
  currentPage: number
  totalPages: number
}

// GET /api/tours - Fetch tours with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search')?.toLowerCase() || ''
    const category = searchParams.get('category')?.toLowerCase() || ''
    
    let allTours: any[] = []
    
    // Try to get tours from SimpleTourService first
    try {
      allTours = await SimpleTourService.getAllTours()
    } catch (error) {
      console.log('SimpleTourService failed, using fallback tours')
      allTours = tours
    }
    
    // If no tours from service, use fallback
    if (!allTours || allTours.length === 0) {
      allTours = tours
    }
    
    // Server-side filtering
    let filteredTours = allTours.filter((tour) => {
      const matchesSearch = !search || 
        tour.title.toLowerCase().includes(search) ||
        tour.description.toLowerCase().includes(search)
      
      const matchesCategory = !category || 
        tour.tag.toLowerCase() === category
      
      return matchesSearch && matchesCategory
    })
    
    // Sort by featured first, then by created_at if available
    filteredTours.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
    
    const totalCount = filteredTours.length
    const totalPages = Math.ceil(totalCount / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTours = filteredTours.slice(startIndex, endIndex)
    
    const response: ToursResponse = {
      tours: paginatedTours,
      totalCount,
      currentPage: page,
      totalPages
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
    
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
