'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
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

export default function TourDetail() {
  const params = useParams()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await SimpleTourService.getTourById(tourId)
        
        // If no data from Supabase, try fallback
        if (!tourData) {
          const { tours } = await import('@/app/tours/data/tours')
          const fallbackTour = tours.find(t => t.id === tourId)
          setTour(fallbackTour || null)
        } else {
          setTour(tourData)
        }
      } catch (error) {
        console.error('Error fetching tour:', error)
        // Try fallback on error
        try {
          const { tours } = await import('@/app/tours/data/tours')
          const fallbackTour = tours.find(t => t.id === tourId)
          setTour(fallbackTour || null)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setTour(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [tourId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Loading tour details...</p>
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
            <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist.</p>
            <a href="/tours" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Back to Tours
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

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
                src={(tour as any).images?.[0] || tour.image}
                alt="Main tour image"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {tour.featured && (
                <span className="absolute top-6 left-6 bg-orange-500 text-white py-2 px-4 rounded-md text-sm font-bold flex items-center gap-2">
                  ⭐ Featured Tour
                </span>
              )}
            </div>
            
            {/* Top Right Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={(tour as any).images?.[1] || tour.image}
                alt="Tour image 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Bottom Right Images */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={(tour as any).images?.[2] || tour.image}
                alt="Tour image 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Bottom Left Images */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={(tour as any).images?.[3] || tour.image}
                alt="Tour image 4"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="relative overflow-hidden rounded-lg">
              <div className="relative w-full h-full">
                <img
                  src={(tour as any).images?.[4] || tour.image}
                  alt="Tour image 5"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay for "Show all photos" */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button
                    className="bg-white text-black hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Show all photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-5 py-12" style={{maxWidth: '1440px'}}>
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column - Tour Details */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
                <span>/</span>
                <a href="/tours" className="hover:text-gray-900 transition-colors">Tours</a>
                <span>/</span>
                <span className="text-gray-900 font-medium">{tour.title}</span>
              </nav>

              {/* Category Tag */}
              <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {tour.tag}
              </span>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1E293B] mb-6">{tour.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="far fa-clock text-lg"></i>
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-users text-lg"></i>
                  <span>{tour.maxPeople}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-map-marker-alt text-lg"></i>
                  <span>Bohol, Philippines</span>
                </div>
              </div>

              {/* About This Tour */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-[#575757] leading-relaxed text-lg">
                  {tour.description}
                </p>
              </section>

              {/* Tour Highlights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(tour.highlights || [
                    'Professional tour guide',
                    'Hotel pickup and drop-off',
                    'All entrance fees included',
                    'Small group experience'
                  ]).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Package Tour Rates */}
              <section className="mb-8">
                <h2 className="text-[24px] font-bold text-gray-900 mb-4">Package Tour Rates</h2>
                <Table className="text-[18px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center" colSpan={2}>LOCAL</TableHead>
                      <TableHead className="text-center" colSpan={2}>FOREIGNER</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-center p-4">pax</TableHead>
                      <TableHead className="text-center p-4">price / pax</TableHead>
                      <TableHead className="text-center p-4">pax</TableHead>
                      <TableHead className="text-center p-4">price / pax</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tour.pricing?.local || [
                      { pax: 1, price: '₱3,500' },
                      { pax: 2, price: '₱2,000' },
                      { pax: 3, price: '₱1,500' },
                      { pax: 4, price: '₱1,200' },
                      { pax: 5, price: '₱1,000' },
                      { pax: 6, price: '₱900' },
                      { pax: 7, price: '₱800' },
                      { pax: 8, price: '₱750' },
                      { pax: 9, price: '₱700' },
                      { pax: '10+', price: '₱650' }
                    ]).map((localRate, index) => {
                      const foreignerRate = tour.pricing?.foreigner?.[index] || [
                        { pax: 1, price: '$70' },
                        { pax: 2, price: '$40' },
                        { pax: 3, price: '$30' },
                        { pax: 4, price: '$25' },
                        { pax: 5, price: '$20' },
                        { pax: 6, price: '$18' },
                        { pax: 7, price: '$16' },
                        { pax: 8, price: '$15' },
                        { pax: 9, price: '$14' },
                        { pax: '10+', price: '$13' }
                      ][index]
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-center p-4">{localRate.pax}</TableCell>
                          <TableCell className="text-center p-4">{localRate.price}</TableCell>
                          <TableCell className="text-center p-4">{foreignerRate.pax}</TableCell>
                          <TableCell className="text-center p-4">{foreignerRate.price}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </section>

              {/* What's Included / Not Included */}
              <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* What's Included */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
                    <ul className="space-y-3">
                      {(tour.included || [
                        'Hotel pickup and drop-off',
                        'Boat transfers',
                        'Snorkeling equipment',
                        'Local guide',
                        'Morning snacks',
                        'Environmental fees'
                      ]).map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-check text-white text-xs"></i>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not Included */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Included</h2>
                    <ul className="space-y-3">
                      {(tour.notIncluded || [
                        'Lunch',
                        'Underwater camera',
                        'Tips and gratuities',
                        'Personal expenses'
                      ]).map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-times text-white text-xs"></i>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tour Location */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Location</h2>
                <Map location="Bohol, Philippines" height="400px" />
              </section>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-96 lg:sticky lg:top-8 h-fit">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm mb-2">From</p>
                  <p className="text-4xl font-bold text-green-600 mb-1">{tour.price}</p>
                  <p className="text-gray-500 text-sm">per person</p>
                </div>

                {/* Book Button */}
                <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-6">
                  <i className="far fa-calendar"></i>
                  Book This Tour
                </button>

                {/* Cancellation Policy */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <i className="fas fa-shield-alt text-green-600"></i>
                  <span>Free cancellation up to 24 hours before</span>
                </div>

                {/* Need Help Section */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
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

      <Footer />
    </>
  )
}
