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
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    let allTours: any[] = []
    
    // Try to get tours from SimpleTourService first
    try {
      const paginated = await SimpleTourService.getToursPaginated(page, limit, search, category)
      const response: ToursResponse = {
        tours: paginated.tours,
        totalCount: paginated.totalCount,
        currentPage: paginated.currentPage,
        totalPages: paginated.totalPages
      }

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      })
    } catch (error) {
      console.log('SimpleTourService failed, using fallback tours')
      allTours = tours.map(tour => ({
        ...tour,
        gallery_urls: tour.images || [] // Map images to gallery_urls for consistency
      }))
    }
    
    // If no tours from service, use fallback
    if (!allTours || allTours.length === 0) {
      allTours = tours.map(tour => ({
        ...tour,
        gallery_urls: tour.images || [] // Map images to gallery_urls for consistency
      }))
    }
    
    // Server-side filtering
    const normalizedSearch = search.toLowerCase()
    const normalizedCategory = category.toLowerCase()

    let filteredTours = allTours.filter((tour) => {
      const matchesSearch = !normalizedSearch ||
        tour.title.toLowerCase().includes(normalizedSearch) ||
        tour.description.toLowerCase().includes(normalizedSearch)

      const matchesCategory = !normalizedCategory ||
        tour.tag.toLowerCase() === normalizedCategory

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
        'Cache-Control': 'no-store, max-age=0'
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
