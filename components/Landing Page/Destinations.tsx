'use client'

import { useEffect, useState } from 'react'
import { destinationsAnimations } from '@/animations/destinationsAnimations'
import PhotoGallery from './PhotoGallery'
import TestimonialsSection from './Testimonials'

interface Destination {
  number: string
  image: string
  title: string
}

export default function DestinationsSection() {
  const [isClient, setIsClient] = useState(false)
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({})
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

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

  const destinations: Destination[] = [
    {
      number: '02',
      image: 'https://i.pinimg.com/1200x/d8/e5/31/d8e531299e463d7185cf4e1071fecafb.jpg',
      title: 'Tarsier Sanctuary'
    },
    {
      number: '03',
      image: 'https://i.pinimg.com/1200x/01/cc/b8/01ccb885b9140da317faf9fcb2a11d3c.jpg',
      title: 'Loboc River Cruise'
    },
    {
      number: '04',
      image: 'https://i.pinimg.com/1200x/2d/68/97/2d689751ecf948ec79f62faf0a1c95c5.jpg',
      title: 'Man Made Forest'
    },
    {
      number: '05',
      image: 'https://i.pinimg.com/1200x/ca/ab/91/caab91c6b26d164d8200815391de75c3.jpg',
      title: 'Panglao Island'
    }
  ]

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
              <div className="flex justify-center mt-5">
                <button className="view-all-btn flex items-center gap-2 border-none text-gray-900 rounded-lg text-lg font-medium bg-transparent cursor-pointer no-underline transition-colors duration-300 hover:text-accent-green">
                  View All <i className="fa-solid fa-circle-chevron-right btn-icon text-base"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="destinations-layout grid grid-cols-2 gap-10 items-stretch w-full">
            {/* Featured Large Left Image */}
            <div className="featured-card relative h-[480px] rounded-2xl overflow-hidden bg-gray-50">
              {imageLoading['featured'] && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
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
                  src="https://i.pinimg.com/736x/3f/8f/fa/3f8ffaded6ac0f091eebbe77b07c4903.jpg" 
                  alt="Chocolate Hills" 
                  className="w-full h-full object-cover transition-transform duration-300"
                  onLoad={() => handleImageLoad('featured')}
                  onError={() => handleImageError('featured')}
                  onLoadStart={() => handleImageStart('featured')}
                />
              )}
              <div className="featured-overlay absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-[rgba(34,53,68,0.95)] to-transparent text-white flex flex-col gap-3">
                <span className="location text-[#9ee7cc] inline-flex items-center gap-1.5 text-sm font-semibold"><i className="fas fa-map-marker-alt"></i> Carmen, Bohol</span>
                <h3 className="text-[2.2rem] font-black m-0 leading-tight">Chocolate Hills</h3>
                <p className="text-sm leading-relaxed m-0 opacity-95">The Chocolate Hills are Bohol's most famous landmark. Over 1,268 perfectly cone-shaped hills spread across 50 square kilometers.</p>
              </div>
            </div>

            {/* Right Side 2x2 Grid */}
            <div className="destinations-grid grid grid-cols-2 gap-6">
              {destinations.map((dest, index) => {
                const imageKey = `dest-${index}`
                return (
                  <div key={index} className="destination-item relative h-[228px] rounded-2xl overflow-hidden bg-gray-50 cursor-pointer transition-all duration-300">
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
                    <span className="dest-number absolute top-4 left-4 bg-white/95 text-gray-800 w-11 h-11 rounded-full flex items-center justify-center font-black text-xl z-10">{dest.number}</span>
                    <div className="destination-overlay absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 transition-opacity duration-300">
                      <h4 className="text-base font-bold m-0">{dest.title}</h4>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <PhotoGallery />
    </>
  )
}
