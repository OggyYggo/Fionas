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

export default function GuestInfoPage() {
  const params = useParams()
  const router = useRouter()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [tourDetails, setTourDetails] = useState<any>(null)
  
  // Guest information form state
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    nationality: ''
  })

  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    nationality: ''
  })

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

    const fetchTourDetails = () => {
      const stored = sessionStorage.getItem('tourDetails')
      if (stored) {
        setTourDetails(JSON.parse(stored))
      } else {
        // Redirect back to step 1 if no tour details
        router.push(`/tours/${tourId}/booking-confirmation`)
      }
    }

    fetchTour()
    fetchTourDetails()
  }, [tourId, router])

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setGuestInfo(prev => ({
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
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      nationality: ''
    }

    let isValid = true

    if (!guestInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
      isValid = false
    }

    if (!guestInfo.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
      isValid = false
    }

    if (!guestInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
      isValid = false
    }

    if (!guestInfo.nationality) {
      newErrors.nationality = 'Nationality is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleContinue = () => {
    if (validateForm()) {
      // Store guest info and proceed to review and payment
      sessionStorage.setItem('guestInfo', JSON.stringify(guestInfo))
      router.push(`/tours/${tourId}/booking-confirmation/review-payment`)
    }
  }

  const handleBack = () => {
    router.push(`/tours/${tourId}/booking-confirmation`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <CardSpinner text="Loading guest information..." />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!tour || !tourDetails) {
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
                  <i className="fas fa-check text-sm"></i>
                </div>
                <span className="ml-2 text-green-600 font-medium">Tour Details</span>
              </div>
              
              {/* Separator */}
              <div className="w-16 h-0.5 bg-green-600"></div>
              
              {/* Step 2 */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="ml-2 text-green-600 font-medium">Guest Information</span>
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
            {/* Left Column - Guest Information Form */}
            <div className="flex-1">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg">
                <CardContent className="p-8">
                  <h1 className="text-3xl font-bold text-[#313131] mb-2">Guest Information</h1>
                  <p className="text-gray-600 mb-8">Please provide your contact details</p>
                  
                  {/* Guest Information Form */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={guestInfo.fullName}
                        onChange={handleGuestInfoChange}
                        placeholder="Enter your full name"
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </Label>
                      <Input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        value={guestInfo.emailAddress}
                        onChange={handleGuestInfoChange}
                        placeholder="Enter your email address"
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.emailAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={guestInfo.phoneNumber}
                        onChange={handleGuestInfoChange}
                        placeholder="+63 912 345 6789"
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality *
                      </Label>
                      <select
                        id="nationality"
                        name="nationality"
                        value={guestInfo.nationality}
                        onChange={handleGuestInfoChange}
                        className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.nationality ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select nationality</option>
                        <option value="Filipino">Filipino</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="Canadian">Canadian</option>
                        <option value="Australian">Australian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Singaporean">Singaporean</option>
                        <option value="Malaysian">Malaysian</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.nationality && (
                        <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="flex-1 h-12 bg-[#11B981] text-white hover:bg-[#0D9F6F]"
                    >
                      Continue to Payment
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tour Summary */}
            <div className="lg:w-96">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#313131] mb-4">Booking Summary</h3>
                  
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
                      <h4 className="font-semibold text-[#313131]">{tour.title}</h4>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{(tour as any).location || (tour as any).tour_location || 'Bohol, Philippines'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tour Details Summary */}
                  <div className="border-t border-[#F4F4F4] pt-4 mb-4">
                    <h4 className="font-medium text-[#313131] mb-3">Tour Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tour Date:</span>
                        <span className="font-medium">{tourDetails.tourDate || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Guests:</span>
                        <span className="font-medium">{tourDetails.numberOfGuests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Location:</span>
                        <span className="font-medium">{tourDetails.pickupLocation || 'Not specified'}</span>
                      </div>
                      {tourDetails.specialRequest && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Special Request:</span>
                          <span className="font-medium text-xs truncate max-w-[150px]">{tourDetails.specialRequest}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-[#F4F4F4] pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Tour Price (per person)</span>
                      <span className="font-medium">{tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-medium">x {tourDetails.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-[#313131] pt-3 border-t">
                      <span>Total Amount</span>
                      <span className="text-green-600">
                        ₱{(parseInt(tour.price.replace(/[₱,]/g, '')) * tourDetails.numberOfGuests).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 space-y-2">
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
