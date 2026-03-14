'use client'

import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState } from 'react'
import { toursAnimations } from '@/animations/toursAnimations'
import { Tour } from '@/types/tour'
import { TourGridSkeleton } from '@/components/ui/tour-card-skeleton'

interface ToursResponse {
  tours: Tour[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const DESCRIPTION_LIMIT = 100
const MOBILE_DESCRIPTION_LIMIT = 70

function truncateText(text: string, limit: number) {
  if (!text) return ''
  if (text.length <= limit) return text
  return text.slice(0, limit).trimEnd() + '...'
}

export default function ToursSection() {
  const [isClient, setIsClient] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && tours.length > 0) {
      const cleanup = toursAnimations()
      return cleanup
    }
  }, [isClient, loading, tours.length])

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true)
        
        // Fetch only featured tours for the landing page
        const response = await fetch('/api/tours?limit=3', { cache: 'no-store' })
        
        if (!response.ok) {
          throw new Error('Failed to fetch tours')
        }
        
        const data: ToursResponse = await response.json()
        
        // Filter for featured tours and limit to 3
        const featuredTours = data.tours
          .filter((tour: Tour) => tour.featured)
          .slice(0, 3)
        
        setTours(featuredTours)
        
      } catch (error) {
        console.error('Error fetching tours:', error)
        // Try fallback on error
        try {
          const { tours: fallbackTours } = await import('@/app/tours/data/tours')
          
          // Map fallback data and filter for featured
          const mappedFallbackTours = fallbackTours
            .map(tour => ({
              ...tour,
              gallery_urls: tour.images || []
            }))
            .filter((tour: Tour) => tour.featured)
            .slice(0, 3)
          
          setTours(mappedFallbackTours)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setTours([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTours()
  }, [isClient])

  if (loading) {
    return (
      <section id="tours" className="tours-section py-20 pt-20 pb-20 flex items-center justify-center font-primary" style={{backgroundColor: '#FCFDFE'}}>
        <div className="container max-w-[1440px] mx-auto px-5">
          <div className="section-header text-center mb-12 reveal">
            <h2 className="text-gray-800 text-[2.5rem] font-black mb-20 my-2">Popular Tour Packages</h2>
            <p className="text-gray-600 text-lg max-w-[600px] mx-auto">Handpicked adventures showcasing Bohol's natural wonders and culture</p>
          </div>
          <TourGridSkeleton />
        </div>
      </section>
    )
  }

  return (
    <section id="tours" className="tours-section py-20 pt-20 pb-20 flex items-center justify-center font-primary" style={{backgroundColor: '#FCFDFE'}}>
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="section-header text-center mb-12 reveal">
          <h2 className="text-gray-800 text-[2.5rem] font-black mb-20 my-2">Popular Tour Packages</h2>
          <p className="text-gray-600 text-lg max-w-[600px] mx-auto">Handpicked adventures showcasing Bohol's natural wonders and culture</p>
          <div className="flex justify-center mt-5">
            <a href="/tours" className="view-all-btn flex items-center gap-2 border-none text-gray-900 rounded-lg text-lg font-medium bg-transparent cursor-pointer no-underline transition-colors duration-300 hover:text-accent-green">
              View All <i className="fa-solid fa-circle-chevron-right btn-icon text-base"></i>
            </a>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-5 pr-5 py-2">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <div key={tour.id} className="tour-card flex-shrink-0 w-[320px] sm:w-[340px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 reveal snap-start">
                  <div className="card-image relative h-[230px]">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    {tour.featured && <span className="badge-featured absolute top-4 left-4 bg-warning text-white py-1 px-3 rounded-md text-xs font-bold">⭐ Featured</span>}
                    <span className="tag absolute bottom-4 left-4 bg-white py-1 px-3 rounded-2xl text-xs text-gray-800">{tour.tag}</span>
                  </div>
                  <div className="card-content p-6">
                    <h3 className="text-gray-800 text-lg mb-3 transition-colors duration-300 font-semibold">{tour.title}</h3>
                    <p className="text-[#575757] text-xs leading-relaxed mb-4">{truncateText(tour.description, MOBILE_DESCRIPTION_LIMIT)}</p>
                    <div className="tour-meta flex gap-4 text-xs text-[#A8A9B7] mb-6">
                      {tour.duration && <span><i className="far fa-clock mr-1"></i> {tour.duration}</span>}
                      {tour.maxPeople && <span><i className="fas fa-users mr-1"></i> {tour.maxPeople}</span>}
                    </div>
                    <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
                      <div className="price-box flex flex-col items-start gap-1">
                        <span className="from-text block text-xs text-[#A8A9B7]">For as Low as</span>
                        <span className="price-amount text-accent-green text-[1.8rem] font-semibold leading-none">{tour.price}</span>
                      </div>
                      <a href={`/tours/${tour.id}`} className="btn-details w-[145px] h-12 bg-gray-900 text-white no-underline rounded-lg flex items-center justify-center font-bold p-4 gap-11 transition-all duration-300 hover:bg-[#11B981] active:bg-[#11B981]">View <i className="fa-solid fa-circle-chevron-right btn-icon ml-3 text-base align-middle"></i></a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-full text-center py-12">
                <p className="text-gray-500 text-lg">No featured tours available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for amazing tour packages!</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Original Grid */}
        <div className="hidden lg:block">
          <div className="tour-grid grid grid-cols-3 gap-8 justify-center">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <div key={tour.id} className="tour-card w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 reveal">
                  <div className="card-image relative h-[310px]">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    {tour.featured && <span className="badge-featured absolute top-4 left-4 bg-warning text-white py-1 px-3 rounded-md text-xs font-bold">⭐ Featured</span>}
                    <span className="tag absolute bottom-4 left-4 bg-white py-1 px-3 rounded-2xl text-xs text-gray-800">{tour.tag}</span>
                  </div>
                  <div className="card-content p-6">
                    <h3 className="text-gray-800 text-lg mb-2 transition-colors duration-300 font-semibold">{tour.title}</h3>
                    <p className="text-[#575757] text-xs leading-relaxed mb-4">{truncateText(tour.description, DESCRIPTION_LIMIT)}</p>
                    <div className="tour-meta flex gap-4 text-xs text-[#A8A9B7] mb-6">
                      {tour.duration && <span><i className="far fa-clock mr-1"></i> {tour.duration}</span>}
                      {tour.maxPeople && <span><i className="fas fa-users mr-1"></i> {tour.maxPeople}</span>}
                    </div>
                    <div className="card-footer flex justify-between items-center border-t border-gray-100 pt-5">
                      <div className="price-box flex flex-col items-start gap-1">
                        <span className="from-text block text-xs text-[#A8A9B7]">For as Low as</span>
                        <span className="price-amount text-accent-green text-[1.8rem] font-semibold leading-none">{tour.price}</span>
                      </div>
                      <a href={`/tours/${tour.id}`} className="btn-details w-[145px] h-12 bg-gray-900 text-white no-underline rounded-lg flex items-center justify-center font-bold p-4 gap-11 transition-all duration-300 hover:bg-[#11B981] active:bg-[#11B981]">View <i className="fa-solid fa-circle-chevron-right btn-icon ml-3 text-base align-middle"></i></a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No featured tours available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for amazing tour packages!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
