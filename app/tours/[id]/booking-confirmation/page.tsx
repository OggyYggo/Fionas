'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SimpleTourService } from '@/lib/simpleTourService'
import { Tour } from '@/types/tour'
import Header from '@/components/Landing Page/Header'
import Footer from '@/components/Landing Page/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardSpinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BookingConfirmation() {
  const params = useParams()
  const router = useRouter()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Tour details form state
  const [tourDetails, setTourDetails] = useState({
    tourDate: '',
    numberOfGuests: 1,
    pickupLocation: '',
    specialRequest: ''
  })

  // Error state
  const [errors, setErrors] = useState({
    tourDate: '',
    pickupLocation: ''
  })

  const handleTourDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTourDetails(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (value) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      tourDate: '',
      pickupLocation: ''
    }

    let isValid = true

    if (!tourDetails.tourDate) {
      newErrors.tourDate = 'Tour date is required'
      isValid = false
    }

    if (!tourDetails.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleContinue = () => {
    if (validateForm()) {
      // Store tour details and proceed to guest information
      sessionStorage.setItem('tourDetails', JSON.stringify(tourDetails))
      router.push(`/tours/${tourId}/booking-confirmation/guest-info`)
    }
  }

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = await SimpleTourService.getTourById(tourId)
        
        if (tourData) {
          setTour(tourData)
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
        }
      } catch (error) {
        console.error('Error fetching tour:', error)
        setTour(null)
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
            <CardSpinner text="Loading booking confirmation..." />
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

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-5 py-12" style={{maxWidth: '1200px'}}>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="ml-2 text-green-600 font-medium">Tour Details</span>
              </div>
              
              {/* Separator */}
              <div className="w-16 h-0.5 bg-gray-300"></div>
              
              {/* Step 2 */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="ml-2 text-gray-500 font-medium">Guest Information</span>
              </div>
              
              {/* Separator */}
              <div className="w-16 h-0.5 bg-gray-300"></div>
              
              {/* Step 3 - Final Step */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="ml-2 text-gray-500 font-medium">Review & Payment</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Booking Form */}
            <div className="flex-1">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg">
                <CardContent className="p-8">
                  <h1 className="text-3xl font-bold text-[#313131] mb-2">Tour Details</h1>
                  <p className="text-gray-600 mb-8">Please provide your tour preferences</p>
                  
                  {/* Tour Details Form */}
                  <div className="space-y-6">
                    {/* Tour Date */}
                    <div>
                      <Label htmlFor="tourDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Tour Date *
                      </Label>
                      <Input
                        id="tourDate"
                        name="tourDate"
                        type="date"
                        value={tourDetails.tourDate}
                        onChange={handleTourDetailsChange}
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.tourDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.tourDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.tourDate}</p>
                      )}
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <Label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </Label>
                      <select
                        id="numberOfGuests"
                        name="numberOfGuests"
                        value={tourDetails.numberOfGuests}
                        onChange={handleTourDetailsChange}
                        className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={5}>5 Guests</option>
                        <option value={6}>6 Guests</option>
                        <option value={7}>7 Guests</option>
                        <option value={8}>8 Guests</option>
                        <option value={9}>9 Guests</option>
                        <option value={10}>10 Guests</option>
                      </select>
                    </div>

                    {/* Pickup Location */}
                    <div>
                      <Label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location *
                      </Label>
                      <Input
                        id="pickupLocation"
                        name="pickupLocation"
                        type="text"
                        value={tourDetails.pickupLocation}
                        onChange={handleTourDetailsChange}
                        placeholder="Enter your pickup location"
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.pickupLocation && (
                        <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
                      )}
                    </div>

                    {/* Special Request */}
                    <div>
                      <Label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700 mb-2">
                        Special Request
                      </Label>
                      <textarea
                        id="specialRequest"
                        name="specialRequest"
                        value={tourDetails.specialRequest}
                        onChange={handleTourDetailsChange}
                        placeholder="Any special requests or requirements..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleContinue}
                    className="h-12 bg-[#11B981] text-white px-6 rounded-lg font-semibold hover:bg-[#0D9F6F] transition-colors mt-8"
                    style={{width: '150px'}}
                  >
                    Continue
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tour Summary */}
            <div className="lg:w-96">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg sticky top-24">
                <CardContent className="p-6">
                  {/* Tour Info */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#313131]">{tour.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{(tour as any).location || (tour as any).tour_location || 'Bohol, Philippines'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-[#F4F4F4] pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Tour Price</span>
                      <span className="font-medium">{tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">x {tourDetails.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-[#313131] pt-3 border-t">
                      <span>Total</span>
                      <span className="text-green-600">
                        {typeof tour.price === 'string' && tour.price.includes('₱') 
                          ? `₱${(parseInt(tour.price.replace(/[₱,]/g, '')) * tourDetails.numberOfGuests).toLocaleString()}`
                          : tour.price
                        }
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-bolt text-green-600"></i>
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-shield-alt text-green-600"></i>
                      <span>Free cancellation (24h before)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
