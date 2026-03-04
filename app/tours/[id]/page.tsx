'use client'

import { useParams } from 'next/navigation'
import { tours } from '../data/tours'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Map from '@/components/ui/map'

export default function TourDetail() {
  const params = useParams()
  const tourId = parseInt(params.id as string)
  
  const tour = tours.find(t => t.id === tourId)

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
        {/* Hero Image */}
        <div className="container mx-auto px-5" style={{maxWidth: '1440px'}}>
          <div className="relative w-full h-[500px] overflow-hidden">
            <img 
              src={tour.image} 
              alt={tour.title} 
              className="w-full h-full object-cover"
            />
            {tour.featured && (
              <span className="absolute top-6 left-6 bg-orange-500 text-white py-2 px-4 rounded-md text-sm font-bold flex items-center gap-2">
                ⭐ Featured Tour
              </span>
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
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{tour.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="far fa-clock text-lg"></i>
                  <span>Half Day (5-6 hours)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-users text-lg"></i>
                  <span>{tour.maxPeople} guests</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-map-marker-alt text-lg"></i>
                  <span>Bohol, Philippines</span>
                </div>
              </div>

              {/* About This Tour */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Start your day with an unforgettable sunrise adventure watching dolphins and whales in their natural habitat. Bohol's waters are home to several species of dolphins and occasional whale sightings. After the marine experience, continue to Pamilacan Island for snorkeling and a relaxing beach break.
                </p>
              </section>

              {/* Tour Highlights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Sunrise dolphin watching</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Multiple dolphin species</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Pamilacan Island visit</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Snorkeling in marine sanctuary</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Local fishing village tour</span>
                  </div>
                </div>
              </section>

              {/* What's Included / Not Included */}
              <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* What's Included */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Hotel pickup and drop-off</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Boat transfers</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Snorkeling equipment</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Local guide</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Morning snacks</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Environmental fees</span>
                      </li>
                    </ul>
                  </div>

                  {/* Not Included */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Included</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-times text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Lunch</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-times text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Underwater camera</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-times text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Tips and gratuities</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-times text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Personal expenses</span>
                      </li>
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
