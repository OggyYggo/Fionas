import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Checking current tours...')
    
    const { SimpleTourService } = await import('@/lib/simpleTourService')
    
    // Get all tours
    const tours = await SimpleTourService.getAllTours()
    
    console.log(`Found ${tours.length} tours:`)
    tours.forEach((tour, index) => {
      console.log(`${index + 1}. ID: ${tour.id}, Title: ${tour.title}`)
    })
    
    return NextResponse.json({
      success: true,
      message: `Found ${tours.length} tours`,
      tours: tours.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description?.substring(0, 50) + '...',
        featured: t.featured
      }))
    })
    
  } catch (error: any) {
    console.error('❌ Error checking tours:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}

export async function DELETE() {
  try {
    console.log('🗑️ Removing all tours...')
    
    const { SimpleTourService } = await import('@/lib/simpleTourService')
    
    // Get all tours first
    const tours = await SimpleTourService.getAllTours()
    
    if (tours.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tours to remove'
      })
    }
    
    // Delete each tour
    const deleteResults = []
    for (const tour of tours) {
      console.log(`Deleting tour: ${tour.title} (ID: ${tour.id})`)
      const success = await SimpleTourService.deleteTour(tour.id)
      deleteResults.push({
        id: tour.id,
        title: tour.title,
        deleted: success
      })
    }
    
    const deletedCount = deleteResults.filter(r => r.deleted).length
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} out of ${tours.length} tours`,
      results: deleteResults
    })
    
  } catch (error: any) {
    console.error('❌ Error deleting tours:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
