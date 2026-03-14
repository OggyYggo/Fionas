'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { destinationsAnimations } from '@/animations/destinationsAnimations'
import PhotoGallery from './PhotoGallery'
import TestimonialsSection from './Testimonials'
import { DestinationsService } from '@/lib/destinationsService'
import { Tour } from '@/types/tour'

interface Destination {
  number: string
  image: string
  title: string
}

export default function DestinationsSection() {
  const [isClient, setIsClient] = useState(false)
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({})
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  const [destinationsData, setDestinationsData] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredDestination, setFeaturedDestination] = useState<Tour | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const cleanup = destinationsAnimations()
        return cleanup
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isClient])

  const fetchDestinations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const allDestinations = await DestinationsService.getAllDestinations()
      
      // Set featured destination (first one or marked as featured)
      const featured = allDestinations.find(dest => dest.featured) || allDestinations[0]
      setFeaturedDestination(featured || null)
      
      // Get remaining destinations (excluding featured) for the grid
      const remainingDestinations = featured 
        ? allDestinations.filter(dest => dest.id !== featured.id).slice(0, 4)
        : allDestinations.slice(0, 4)
      
      setDestinationsData(remainingDestinations)
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load destinations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchDestinations()
    }
  }, [isClient])

  const handleImageLoad = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: false }))
  }

  const handleImageError = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: false }))
    setImageErrors(prev => ({ ...prev, [key]: true }))
  }

  const handleImageStart = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: true }))
  }

  return (
    <>
      <section id="destinations" className="destinations-section py-20 bg-white">
        <div className="container max-w-[1440px] mx-auto px-5">
          <div className="destinations-header mb-16">
            <div className="destinations-content text-center">
              {/* <span className="subtitle text-accent-green font-bold text-sm tracking-wider">MUST VISIT PLACES</span> */}
              <h2 className="text-gray-800 text-[40px] font-black mb-3">Iconic Destinations</h2>
              <p className="text-gray-600 text-lg max-w-[500px] leading-relaxed mx-auto">Explore Bohol’s breathtaking attractions loved by travelers worldwide</p>
              <div className="flex justify-end mt-5">
                <Link href="/destinations">
                  <button className="view-all-btn flex items-center gap-2 border-none text-gray-900 rounded-lg text-lg font-medium bg-transparent cursor-pointer no-underline transition-colors duration-300 hover:text-accent-green mx-auto">
                    View All <i className="fa-solid fa-circle-chevron-right btn-icon text-base"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="destinations-layout grid grid-cols-2 gap-10 items-stretch w-full">
            {/* Featured Large Left Image */}
            <div className="featured-card relative h-[480px] rounded-2xl overflow-hidden bg-gray-50">
              {isLoading ? (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              ) : error ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <i className="fas fa-exclamation-triangle text-4xl mb-2"></i>
                    <p>Failed to load destinations</p>
                  </div>
                </div>
              ) : !featuredDestination ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <i className="fas fa-image text-4xl mb-2"></i>
                    <p>No featured destination available</p>
                  </div>
                </div>
              ) : (
                <>
                  {imageLoading['featured'] && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                      <div className="text-gray-400">Loading...</div>
                    </div>
                  )}
                  {imageErrors['featured'] ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <i className="fas fa-image text-4xl mb-2"></i>
                        <p>Image unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={featuredDestination.image} 
                      alt={featuredDestination.title} 
                      className="w-full h-full object-cover transition-transform duration-300"
                      onLoad={() => handleImageLoad('featured')}
                      onError={() => handleImageError('featured')}
                      onLoadStart={() => handleImageStart('featured')}
                    />
                  )}
                  <div className="featured-overlay absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-[rgba(34,53,68,0.95)] to-transparent text-white flex flex-col gap-3">
                    <span className="location text-[#9ee7cc] inline-flex items-center gap-1.5 text-sm font-semibold">
                      <i className="fas fa-map-marker-alt"></i> {featuredDestination.tag || 'Bohol'}
                    </span>
                    <h3 className="text-[2.2rem] font-black m-0 leading-tight">{featuredDestination.title}</h3>
                    <p className="text-sm leading-relaxed m-0 opacity-95">
                      {featuredDestination.description?.slice(0, 150) || 'Discover this amazing destination in Bohol'}
                      {featuredDestination.description && featuredDestination.description.length > 150 ? '...' : ''}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right Side 2x2 Grid */}
            <div className="destinations-grid grid grid-cols-2 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="destination-item relative h-[228px] rounded-2xl overflow-hidden bg-gray-50">
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                  </div>
                ))
              ) : destinationsData.length > 0 ? (
                destinationsData.map((dest: Tour, index: number) => {
                  const imageKey = `dest-${index}`
                  const displayNumber = String(index + 2).padStart(2, '0') // Start from 02 like original
                  return (
                    <div key={dest.id} className="destination-item relative h-[228px] rounded-2xl overflow-hidden bg-gray-50 cursor-pointer transition-all duration-300">
                      {imageLoading[imageKey] && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-5">
                          <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                      )}
                      {imageErrors[imageKey] ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <i className="fas fa-image text-2xl mb-1"></i>
                            <p className="text-xs">Image unavailable</p>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={dest.image} 
                          alt={dest.title} 
                          className="w-full h-full object-cover transition-transform duration-300"
                          onLoad={() => handleImageLoad(imageKey)}
                          onError={() => handleImageError(imageKey)}
                          onLoadStart={() => handleImageStart(imageKey)}
                        />
                      )}
                      <span className="dest-number absolute top-4 left-4 bg-white/95 text-gray-800 w-11 h-11 rounded-full flex items-center justify-center font-black text-xl z-10">{displayNumber}</span>
                      <div className="destination-overlay absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 transition-opacity duration-300">
                        <h4 className="text-base font-bold m-0">{dest.title}</h4>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <div className="text-gray-500">
                    <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
                    <p>No destinations available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <PhotoGallery />
    </>
  )
}
