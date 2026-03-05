'use client'

import { useParams } from 'next/navigation'
import { tours } from '../data/tours'
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
        {/* Hero Video */}
        <div className="container mx-auto px-5" style={{maxWidth: '1440px'}}>
          <div className="relative w-full h-[500px] overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster={tour.image}
            >
              <source src="/videos/Panglao Island Tour.MP4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1E293B] mb-6">{tour.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="far fa-clock text-lg"></i>
                  <span>Half Day (5-6 hours)</span>
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
                 The Balicasag & Virgin Island Hopping Tour offers a thrilling mix of marine adventure and relaxation.
                 The tour kicks off with an early morning dolphin watching experience, where you’ll get the chance to see playful
                 dolphins in their natural habitat as they swim and leap through the crystal-clear waters. Afterward, you’ll head
                 to Balicasag Island, a premier snorkeling and diving destination, where you can explore vibrant coral reefs teeming
                 with colorful fish, sea turtles, and other marine life. The final stop is the serene Virgin Island, famous for its
                 stunning white sandbar that emerges during low tide. Here, you can unwind, wade in the shallow waters, and take in
                 the breathtaking surroundings. This tour is perfect for those who want to combine wildlife encounters with the
                 beauty of Bohol’s marine treasures.
                </p>
              </section>

              {/* Tour Highlights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Sunrise dolphin watching</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Multiple dolphin species</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Pamilacan Island visit</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Snorkeling in marine sanctuary</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700">Local fishing village tour</span>
                  </div>
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
                    <TableRow>
                      <TableCell className="text-center p-4">1</TableCell>
                      <TableCell className="text-center p-4">₱3,500</TableCell>
                      <TableCell className="text-center p-4">1</TableCell>
                      <TableCell className="text-center p-4">$70</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">2</TableCell>
                      <TableCell className="text-center p-4">₱2,000</TableCell>
                      <TableCell className="text-center p-4">2</TableCell>
                      <TableCell className="text-center p-4">$40</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">3</TableCell>
                      <TableCell className="text-center p-4">₱1,500</TableCell>
                      <TableCell className="text-center p-4">3</TableCell>
                      <TableCell className="text-center p-4">$30</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">4</TableCell>
                      <TableCell className="text-center p-4">₱1,200</TableCell>
                      <TableCell className="text-center p-4">4</TableCell>
                      <TableCell className="text-center p-4">$25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">5</TableCell>
                      <TableCell className="text-center p-4">₱1,000</TableCell>
                      <TableCell className="text-center p-4">5</TableCell>
                      <TableCell className="text-center p-4">$20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">6</TableCell>
                      <TableCell className="text-center p-4">₱900</TableCell>
                      <TableCell className="text-center p-4">6</TableCell>
                      <TableCell className="text-center p-4">$18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">7</TableCell>
                      <TableCell className="text-center p-4">₱800</TableCell>
                      <TableCell className="text-center p-4">7</TableCell>
                      <TableCell className="text-center p-4">$16</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">8</TableCell>
                      <TableCell className="text-center p-4">₱750</TableCell>
                      <TableCell className="text-center p-4">8</TableCell>
                      <TableCell className="text-center p-4">$15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">9</TableCell>
                      <TableCell className="text-center p-4">₱700</TableCell>
                      <TableCell className="text-center p-4">9</TableCell>
                      <TableCell className="text-center p-4">$14</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center p-4">10+</TableCell>
                      <TableCell className="text-center p-4">₱650</TableCell>
                      <TableCell className="text-center p-4">10+</TableCell>
                      <TableCell className="text-center p-4">$13</TableCell>
                    </TableRow>
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
