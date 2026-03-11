'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { SimpleTourService } from '@/lib/simpleTourService'
import { Tour } from '@/types/tour'
import Header from '@/components/Landing Page/Header'
import Footer from '@/components/Footer'
import Map from '@/components/ui/map'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CardSpinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CarouselSize } from '@/components/ui/carousel-size'

export default function TourDetail() {
  const params = useParams()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'db' | 'fallback' | 'none'>('none')
  const [showAllWhyChoose, setShowAllWhyChoose] = useState(false)
  const [showAllIncluded, setShowAllIncluded] = useState(false)
  const [showAllNotIncluded, setShowAllNotIncluded] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)

  // Calculate gallery images - this hook must be called before any conditionals
  const galleryImages = useMemo(() => {
    if (!tour) return []
    
    // Start with main image
    const allImages = [tour.image]
    
    // Add gallery URLs if they exist
    if (tour.gallery_urls && tour.gallery_urls.length > 0) {
      // Filter out any empty/null URLs and add them
      const validGalleryUrls = tour.gallery_urls.filter(url => url && url.trim() !== '')
      allImages.push(...validGalleryUrls)
    }
    
    return allImages
  }, [tour])

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await SimpleTourService.getTourById(tourId)
        
        if (tourData) {
          setTour(tourData)
          setDataSource('db')
        } else {
          const { tours } = await import('@/app/tours/data/tours')
          const fallbackTour = tours.find(t => t.id === tourId)
          setTour(
            fallbackTour
              ? ({
                  ...fallbackTour,
                  gallery_urls:
                    (fallbackTour as any).gallery_urls || (fallbackTour as any).images || [],
                } as Tour)
              : null
          )
          setDataSource(fallbackTour ? 'fallback' : 'none')
        }
      } catch (error) {
        console.error('Error fetching tour:', error)
        try {
          const { tours } = await import('@/app/tours/data/tours')
          const fallbackTour = tours.find(t => t.id === tourId)
          setTour(
            fallbackTour
              ? ({
                  ...fallbackTour,
                  gallery_urls:
                    (fallbackTour as any).gallery_urls || (fallbackTour as any).images || [],
                } as Tour)
              : null
          )
          setDataSource(fallbackTour ? 'fallback' : 'none')
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setTour(null)
          setDataSource('none')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [tourId])

  useEffect(() => {
    if (!loading) {
      console.log('Tour detail data source:', dataSource, 'tourId:', tourId)
    }
  }, [loading, dataSource, tourId])

  // Debug: Log the tour data and gallery images
  console.log('Tour data:', tour)
  console.log('Gallery URLs:', tour?.gallery_urls)
  console.log('Images array:', (tour as any)?.images)
  console.log('Tour image:', tour?.image)
  console.log('Gallery images count:', galleryImages.length)
  console.log('Gallery images:', galleryImages)

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <CardSpinner text="Loading tour details..." />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!tour) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-10">The tour you're looking for doesn't exist.</p>
            <a href="/tours" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Back to Tours
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const locationText = (tour as any).location || (tour as any).tour_location || 'Bohol, Philippines'
  const cancellationText =
    (tour as any).cancellation_policy ||
    (tour as any).cancellationPolicy ||
    'Free cancellation up to 24 hours before'

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Gallery Section */}
        <div className="container mx-auto px-5 py-8" style={{maxWidth: '1440px'}}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px]">
            {/* Main Image */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-lg">
              <img
                src={galleryImages[0] || tour.image}
                alt="Main tour image"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {tour.featured && (
                <span className="absolute top-6 left-6 bg-orange-500 text-white py-2 px-4 rounded-md text-sm font-bold flex items-center gap-2">
                  ⭐ Featured Tour
                </span>
              )}
            </div>
            
            {/* Additional Images - Dynamic */}
            {galleryImages.slice(1, 4).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img
                  src={image || galleryImages[0] || tour.image}
                  alt={`Tour image ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
            
            {/* Show All Photos Button - Only show if there are more than 4 images */}
            {galleryImages.length > 4 && (
              <div className="relative overflow-hidden rounded-lg">
                <div className="relative w-full h-full">
                  <img
                    src={galleryImages[4] || galleryImages[0] || tour.image}
                    alt="Tour image 5"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay for "Show all photos" */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button
                      className="bg-white text-black hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors"
                      onClick={() => setShowPhotoGallery(true)}
                    >
                      Show all photos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-5 py-12" style={{maxWidth: '1440px'}}>
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column - Tour Details */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <a href="/" className="hover:text-[#313131] transition-colors">Home</a>
                <span>/</span>
                <a href="/tours" className="hover:text-[#313131] transition-colors">Tours</a>
                <span>/</span>
                <span className="text-[#313131] font-medium">{tour.title}</span>
              </nav>

              {/* Category Tag */}
              <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {tour.tag}
              </span>

              
              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-[#313131] mb-6">{tour.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-map-marker-alt text-lg"></i>
                  <span>{locationText}</span>
                </div>
              </div>

              {/* About This Tour */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#313131] mb-4">About This Tour</h2>
                <p className="text-[#575757] leading-relaxed text-lg">
                  {tour.description}
                </p>
              </section>

              {/* Divider */}
              <div className="border-t border-[#F4F4F4] mb-10"></div>

              {/* Tour Highlights */}
              {(tour.highlights || []).length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-[#313131] mb-4">Tour Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(tour.highlights || []).map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Divider */}
              <div className="border-t border-[#F4F4F4] mb-10"></div>

              {/* What's Included / Not Included */}
              {((tour.included || []).length > 0 || (tour.notIncluded || []).length > 0) && (
                <section className="mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* What's Included */}
                    {(tour.included || []).length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-[#313131] mb-4">What's Included</h2>
                        <ul className="space-y-3">
                          {(tour.included || []).slice(0, showAllIncluded ? undefined : 3).map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-check text-white text-xs"></i>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {(tour.included || []).length > 3 && (
                          <Button
                            variant="link"
                            onClick={() => setShowAllIncluded(!showAllIncluded)}
                            className="text-green-600 hover:text-green-700 p-0 h-auto font-medium mt-2"
                          >
                            {showAllIncluded ? 'See Less' : `See More (${(tour.included || []).length - 3} more)`}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Not Included */}
                    {(tour.notIncluded || []).length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-[#313131] mb-4">Not Included</h2>
                        <ul className="space-y-3">
                          {(tour.notIncluded || []).slice(0, showAllNotIncluded ? undefined : 3).map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-times text-white text-xs"></i>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {(tour.notIncluded || []).length > 3 && (
                          <Button
                            variant="link"
                            onClick={() => setShowAllNotIncluded(!showAllNotIncluded)}
                            className="text-red-600 hover:text-red-700 p-0 h-auto font-medium mt-2"
                          >
                            {showAllNotIncluded ? 'See Less' : `See More (${(tour.notIncluded || []).length - 3} more)`}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Divider */}
              <div className="border-t border-[#F4F4F4] mb-10"></div>

              {/* Tour Itinerary */}
              {(tour.itinerary || []).length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-[#313131] mb-4">Tour Itinerary</h2>
                  <div className="space-y-4">
                    {(tour.itinerary || []).map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          {index < (tour.itinerary || []).length - 1 && (
                            <div className="w-0.5 flex-1 bg-purple-200 mt-2"></div>
                          )}
                        </div>
                        <div className="pb-6">
                          <p className="text-gray-700 text-lg pt-2">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Divider */}
              <div className="border-t border-[#F4F4F4] mb-10"></div>

              {/* Why Choose This Tour */}
              {(tour.why_choose || []).length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-[#313131] mb-4">Why Choose This Tour</h2>
                  <ul className="space-y-2">
                    {(tour.why_choose || []).slice(0, showAllWhyChoose ? undefined : 3).map((reason, index) => (
                      <li key={index} className="text-gray-700">• {reason}</li>
                    ))}
                  </ul>
                  {(tour.why_choose || []).length > 3 && (
                    <Button
                      variant="link"
                      onClick={() => setShowAllWhyChoose(!showAllWhyChoose)}
                      className="text-indigo-600 hover:text-indigo-700 p-0 h-auto font-medium mt-2"
                    >
                      {showAllWhyChoose ? 'See Less' : `See More (${(tour.why_choose || []).length - 3} more)`}
                    </Button>
                  )}
                </section>
              )}

              {/* FAQs */}
              {(tour.faqs || []).length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-[#313131] mb-4">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full border border-[#F4F4F4] rounded-xl overflow-hidden">
                    {(tour.faqs || []).map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border-[#F4F4F4] px-5">
                        <AccordionTrigger className="text-base font-semibold text-[#313131] hover:no-underline hover:text-green-700 py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed text-base">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Divider */}
              <div className="border-t border-[#F4F4F4] mb-10"></div>

              {/* Customer Reviews */}
              {(tour.reviews || []).length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-[#313131] mb-4">Customer Reviews</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(tour.reviews || []).map((review, index) => (
                      <Card key={index} className="bg-white border-[#F4F4F4] shadow-sm py-4 px-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {review.author?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-[#313131] text-sm">{review.author}</p>
                              {review.date && <p className="text-xs text-gray-500">{review.date}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              
              {/* Tour Location */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-[#313131] mb-4">Tour Location</h2>
                <Map location={locationText} height="400px" />
              </section>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-96 lg:sticky lg:top-[100px] h-fit">
              <div className="bg-white border border-[#F4F4F4] rounded-xl p-6 shadow-lg">
                
                {/* Price */}
                <div className="text-left mb-6">
                  <p className="text-gray-500 text-sm mb-2">From</p>
                  <p className="text-4xl font-bold text-[#11B981] mb-1">{tour.price}</p>
                  <p className="text-gray-500 text-sm">per person</p>
                </div>

                {/* Book Button */}
                <button className="w-full bg-[#11B981] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#0D9F6F] transition-colors flex items-center justify-center gap-2 mb-6">
                  <i className="far fa-calendar"></i>
                  Book This Tour
                </button>

                {/* Cancellation Policy */}
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-6 bg-gray-50 p-5 rounded-lg">
                  <i className="fas fa-shield-alt text-[#11B981]"></i>
                  <span>Free cancellation up to 24 hours before</span>
                </div>

                {/* Need Help Section */}
                <div className="text-left">
                  <h3 className="font-semibold text-[#313131] mb-2">Need Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">Contact us for custom arrangements or group bookings</p>
                  <button className="w-full border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Photo Gallery Dialog */}
      <Dialog open={showPhotoGallery} onOpenChange={setShowPhotoGallery}>
        <DialogContent className="w-[95vw] max-w-[95vw] max-h-[95vh] bg-white border shadow-2xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Photo Gallery</DialogTitle>
            <DialogDescription className="text-gray-600">
              {tour.title} - {galleryImages.length} Photos
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 bg-gray-50/50">
            <CarouselSize images={galleryImages} tourTitle={tour.title} />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  )
}
