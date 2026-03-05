import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🎯 Creating sample tours for testing...')
    
    const { SimpleTourService } = await import('@/lib/simpleTourService')
    
    // Create sample tours
    const sampleTours = [
      {
        title: 'Chocolate Hills Adventure',
        description: 'Experience the iconic Chocolate Hills with a guided tour that includes hiking, photography spots, and breathtaking panoramic views of Bohol\'s most famous geological formation.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        duration: 'Full Day',
        maxPeople: 15,
        price: 89.99,
        tag: 'nature',
        featured: true
      },
      {
        title: 'Loboc River Cruise',
        description: 'Enjoy a relaxing floating restaurant cruise along the scenic Loboc River, complete with live music, buffet lunch, and stunning views of tropical landscapes.',
        image: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop',
        duration: 'Half Day',
        maxPeople: 20,
        price: 65.00,
        tag: 'nature',
        featured: true
      },
      {
        title: 'Panglao Island Hopping',
        description: 'Discover pristine beaches, vibrant coral reefs, and marine life on this exciting island hopping adventure around Panglao and nearby islands.',
        image: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop',
        duration: 'Full Day',
        maxPeople: 12,
        price: 120.00,
        tag: 'beach',
        featured: true
      }
    ]
    
    const createdTours = []
    
    for (const tourData of sampleTours) {
      try {
        const tour = await SimpleTourService.createTour(tourData)
        createdTours.push(tour)
        console.log(`✅ Created tour: ${tour.title}`)
      } catch (error) {
        console.error(`❌ Failed to create tour: ${tourData.title}`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdTours.length} sample tours`,
      tours: createdTours.map(t => ({
        id: t.id,
        title: t.title,
        featured: t.featured
      }))
    })
    
  } catch (error: any) {
    console.error('❌ Error creating sample tours:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
