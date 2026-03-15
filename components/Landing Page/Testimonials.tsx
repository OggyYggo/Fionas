'use client'

import { useEffect, useState } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'

interface Testimonial {
  id: string
  customer_name: string
  tour_name: string
  rating: number
  testimonial_text: string
  helpful_count: number
  date: string
  created_at: string
  updated_at: string
  customer_image?: string
  status?: string
}

export default function TestimonialsSection() {
  const [isClient, setIsClient] = useState(false)
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({})
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      destinationsAnimations()
      fetchTestimonials()
    }
  }, [isClient])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/testimonials?status=approved')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Only show approved testimonials on landing page
        const approvedTestimonials = result.data.filter((t: Testimonial) => t.status === 'approved')
        
        if (approvedTestimonials.length === 0) {
          console.log('No approved testimonials found, using fallback data')
          useFallbackData()
        } else {
          setTestimonials(approvedTestimonials.slice(0, 8)) // Show all approved (max 8)
        }
      } else {
        console.error('Failed to fetch testimonials:', result.error)
        // Use fallback data if API fails
        useFallbackData()
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Use fallback data if network fails
      useFallbackData()
    } finally {
      setLoading(false)
    }
  }

  const useFallbackData = () => {
    console.log('Using fallback testimonials data')
    const fallbackTestimonials: Testimonial[] = [
      {
        id: 'fallback-1',
        customer_name: 'Sarah Johnson',
        tour_name: 'Chocolate Hills Adventure',
        rating: 5,
        testimonial_text: 'Absolutely amazing experience! The tour guide was knowledgeable and the scenery was breathtaking. Highly recommend this tour to anyone visiting Bohol.',
        helpful_count: 24,
        date: '2024-03-10',
        created_at: '2024-03-10T10:00:00Z',
        updated_at: '2024-03-10T10:00:00Z',
        status: 'approved'
      },
      {
        id: 'fallback-2',
        customer_name: 'Michael Chen',
        tour_name: 'Loboc River Cruise',
        rating: 4,
        testimonial_text: 'Great cruise experience with delicious lunch buffet. The floating restaurants were unique and the scenery along the river was beautiful.',
        helpful_count: 18,
        date: '2024-03-08',
        created_at: '2024-03-08T14:30:00Z',
        updated_at: '2024-03-08T14:30:00Z',
        status: 'approved'
      },
      {
        id: 'fallback-3',
        customer_name: 'Emma Wilson',
        tour_name: 'Panglao Island Beach Tour',
        rating: 5,
        testimonial_text: 'Paradise! The beaches were pristine and the water was crystal clear. Our guide made sure we had the best experience possible.',
        helpful_count: 31,
        date: '2024-03-05',
        created_at: '2024-03-05T09:15:00Z',
        updated_at: '2024-03-05T09:15:00Z',
        status: 'approved'
      },
      {
        id: 'fallback-4',
        customer_name: 'Carlos Rodriguez',
        tour_name: 'Tarsier Sanctuary Visit',
        rating: 5,
        testimonial_text: 'Fascinating to see the tarsiers up close! The sanctuary is well-maintained and the staff were very informative about conservation efforts.',
        helpful_count: 15,
        date: '2024-03-03',
        created_at: '2024-03-03T11:20:00Z',
        updated_at: '2024-03-03T11:20:00Z',
        status: 'approved'
      }
    ]
    setTestimonials(fallbackTestimonials)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const handleImageLoad = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: false }))
  }

  const handleImageError = (key: string) => {
    console.log('Image failed to load for:', key)
    setImageLoading(prev => ({ ...prev, [key]: false }))
    setImageErrors(prev => ({ ...prev, [key]: true }))
  }

  const handleImageStart = (key: string) => {
    setImageLoading(prev => ({ ...prev, [key]: true }))
  }

  if (loading) {
    return (
      <section className="testimonials-section py-[80px] relative" style={{backgroundColor: '#FAFAF9'}}>
        <div className="container max-w-[1440px] mx-auto px-5">
          <div className="testimonials-header text-center mb-20 max-w-[800px] mx-auto">
            <h2 className="text-gray-800 text-[40px] lg:text-[40px] md:text-[32px] sm:text-[28px] font-black mb-3 leading-tight">What Our Clients Are Saying</h2>
            <p className="text-gray-600 text-[18px] lg:text-[18px] md:text-[16px] sm:text-[14px] leading-[1.7]">Loading testimonials...</p>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section py-[80px] relative" style={{backgroundColor: '#FAFAF9'}}>
        <div className="container max-w-[1440px] mx-auto px-5">
          <div className="testimonials-header text-center mb-20 max-w-[800px] mx-auto">
            <h2 className="text-gray-800 text-[40px] lg:text-[40px] md:text-[32px] sm:text-[28px] font-black mb-3 leading-tight">What Our Clients Are Saying</h2>
            <p className="text-gray-600 text-[18px] lg:text-[18px] md:text-[16px] sm:text-[14px] leading-[1.7]">No testimonials available yet. Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="testimonials-section py-[80px] relative" style={{backgroundColor: '#FAFAF9'}}>
      <div className="container max-w-[1440px] mx-auto px-5">
        <div className="testimonials-header text-center mb-20 max-w-[800px] mx-auto">
          {/* <span className="subtitle inline-block text-accent-green py-2.5">TRAVELER STORIES</span> */}
          <h2 className="text-gray-800 text-[40px] lg:text-[40px] md:text-[32px] sm:text-[28px] font-black mb-3 leading-tight">What Our Clients Are Saying</h2>
          <p className="text-gray-600 text-[18px] lg:text-[18px] md:text-[16px] sm:text-[14px] leading-[1.7]">Don't just take our word for it hear from travelers who've experienced the magic of Bohol with us</p>
          <div className="rating-info">
          </div>
        </div>
        
        {/* Desktop Single Line Layout */}
        <div className="testimonials-grid hidden lg:flex lg:flex-row lg:gap-6 lg:overflow-x-auto lg:scrollbar-hide lg:pb-4 mb-20">
          {testimonials.map((testimonial: Testimonial) => {
            const imageKey = `testimonial-${testimonial.id}`
            return (
              <div key={testimonial.id} className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-400 opacity-0 translate-y-8 animate-fade-in-up hover:-translate-y-2.5 hover:shadow-xl hover:border-accent-teal flex-shrink-0 w-80 flex flex-col">
                <div className="flex flex-col h-full">
                  <div className="testimonial-content flex-grow">
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="testimonial-text text-gray-700 text-[1rem] leading-relaxed mb-3 italic relative">"{truncateText(testimonial.testimonial_text, 100)}"</p>
                    <div className="mt-auto">
                      <p className="text-sm text-accent-teal font-semibold mb-2">{testimonial.tour_name}</p>
                    </div>
                  </div>
                  <div className="testimonial-author flex items-center gap-3 pt-3 border-t border-gray-100 mt-3">
                    <div className="author-avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                      {imageLoading[imageKey] && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                          <div className="text-gray-400 text-xs">Loading...</div>
                        </div>
                      )}
                      {imageErrors[imageKey] ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-gray-500 text-center">
                            <i className="fas fa-user text-sm"></i>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={testimonial.customer_image || `https://i.pravatar.cc/150?img=${testimonial.id.charCodeAt(0) % 70 + 1}`} 
                          alt={testimonial.customer_name} 
                          className="w-full h-full object-cover"
                          onLoad={() => handleImageLoad(imageKey)}
                          onError={() => handleImageError(imageKey)}
                          onLoadStart={() => handleImageStart(imageKey)}
                        />
                      )}
                    </div>
                    <div className="author-info flex-1">
                      <h4 className="text-gray-800 text-sm font-bold mb-1 m-0">{testimonial.customer_name}</h4>
                      <p className="text-gray-500 text-xs font-medium m-0">Verified Traveler</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Horizontal Scroll Layout */}
        <div className="testimonials-scroll lg:hidden mb-20">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 sm:gap-4 px-3 sm:px-5 py-2" style={{ scrollSnapType: 'x mandatory' }}>
              {testimonials.map((testimonial: Testimonial) => {
                const imageKey = `testimonial-mobile-${testimonial.id}`
                return (
                  <div 
                    key={testimonial.id} 
                    className="testimonial-card bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-400 opacity-0 translate-y-8 animate-fade-in-up hover:-translate-y-2.5 hover:shadow-xl hover:border-accent-teal flex-shrink-0 w-[300px] h-full flex flex-col"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="testimonial-content flex-grow">
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="testimonial-text text-gray-700 text-[0.95rem] leading-relaxed mb-3 italic relative">"{truncateText(testimonial.testimonial_text, 100)}"</p>
                        <div className="mt-auto">
                          <p className="text-xs text-accent-teal font-semibold mb-2">{testimonial.tour_name}</p>
                        </div>
                      </div>
                      <div className="testimonial-author flex items-center gap-3 pt-3 border-t border-gray-100 mt-3">
                        <div className="author-avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                          {imageLoading[imageKey] && (
                            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                              <div className="text-gray-400 text-xs">Loading...</div>
                            </div>
                          )}
                          {imageErrors[imageKey] ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <div className="text-gray-500 text-center">
                                <i className="fas fa-user text-sm"></i>
                              </div>
                            </div>
                          ) : (
                            <img 
                              src={testimonial.customer_image || `https://i.pravatar.cc/150?img=${testimonial.id.charCodeAt(0) % 70 + 1}`} 
                              alt={testimonial.customer_name} 
                              className="w-full h-full object-cover"
                              onLoad={() => handleImageLoad(imageKey)}
                              onError={() => handleImageError(imageKey)}
                              onLoadStart={() => handleImageStart(imageKey)}
                            />
                          )}
                        </div>
                        <div className="author-info flex-1">
                          <h4 className="text-gray-800 text-sm font-bold mb-1 m-0">{testimonial.customer_name}</h4>
                          <p className="text-gray-500 text-xs font-medium m-0">Verified Traveler</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="testimonials-footer text-center">
          <button className="see-all-reviews-btn inline-flex items-center gap-2 bg-accent-teal text-white py-3 px-8 rounded-full border-none text-base font-bold cursor-pointer transition-all duration-300 hover:bg-accent-green hover:-translate-y-0.5 hover:shadow-lg">
            See All Reviews <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
