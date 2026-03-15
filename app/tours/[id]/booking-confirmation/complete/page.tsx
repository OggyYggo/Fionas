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

export default function BookingCompletePage() {
  const params = useParams()
  const router = useRouter()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)

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

    const fetchBookingData = () => {
      const storedTourDetails = sessionStorage.getItem('tourDetails')
      const storedGuestInfo = sessionStorage.getItem('guestInfo')
      const storedPaymentData = sessionStorage.getItem('paymentData')
      
      if (storedTourDetails && storedGuestInfo && storedPaymentData) {
        setBookingData({
          tourDetails: JSON.parse(storedTourDetails),
          guestInfo: JSON.parse(storedGuestInfo),
          paymentData: JSON.parse(storedPaymentData)
        })
      } else {
        // Redirect to booking page if data is missing
        router.push(`/tours/${tourId}/booking-confirmation`)
      }
    }

    fetchTour()
    fetchBookingData()
  }, [tourId, router])

  const handleViewTour = () => {
    // Clear sessionStorage and redirect to tour page
    sessionStorage.removeItem('tourDetails')
    sessionStorage.removeItem('guestInfo')
    sessionStorage.removeItem('paymentData')
    router.push(`/tours/${tourId}`)
  }

  const handleNewBooking = () => {
    // Clear sessionStorage and redirect to booking start
    sessionStorage.removeItem('tourDetails')
    sessionStorage.removeItem('guestInfo')
    sessionStorage.removeItem('paymentData')
    router.push(`/tours/${tourId}/booking-confirmation`)
  }

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

  if (!tour || !bookingData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-10">Please start your booking again.</p>
            <Button
              onClick={() => router.push(`/tours/${tourId}/booking-confirmation`)}
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start New Booking
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalAmount = typeof tour.price === 'string' && tour.price.includes('₱') 
    ? parseInt(tour.price.replace(/[₱,]/g, '')) * bookingData.tourDetails.numberOfGuests
    : 0

  const paidAmount = bookingData.paymentData.paidAmount || totalAmount
  const remainingAmount = bookingData.paymentData.remainingAmount || 0

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-5 py-12" style={{maxWidth: '1200px'}}>
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-green-600 text-4xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-2">Thank you for your booking</p>
            <p className="text-gray-500">A confirmation email has been sent to {bookingData.guestInfo.emailAddress}</p>
          </div>

          {/* Booking Reference */}
          <Card className="bg-green-50 border border-green-200 rounded-xl shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Booking Reference</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {bookingData.paymentData.bookingId || bookingData.paymentData.paymentId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 mb-1">Payment Status</p>
                  <p className="text-lg font-semibold text-green-800">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tour Details */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg mb-6">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#313131] mb-6">Tour Details</h2>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#313131] mb-2">{tour.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{(tour as any).location || (tour as any).tour_location || 'Bohol, Philippines'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-calendar"></i>
                          {bookingData.tourDetails.tourDate || 'Not selected'}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-users"></i>
                          {bookingData.tourDetails.numberOfGuests} Guests
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tour Date:</span>
                      <p className="font-medium text-gray-800">{bookingData.tourDetails.tourDate || 'Not selected'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Number of Guests:</span>
                      <p className="font-medium text-gray-800">{bookingData.tourDetails.numberOfGuests}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pickup Location:</span>
                      <p className="font-medium text-gray-800">{bookingData.tourDetails.pickupLocation || 'Not specified'}</p>
                    </div>
                    {bookingData.tourDetails.specialRequest && (
                      <div>
                        <span className="text-gray-500">Special Request:</span>
                        <p className="font-medium text-gray-800">{bookingData.tourDetails.specialRequest}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#313131] mb-6">Guest Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium text-gray-800">{bookingData.guestInfo.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-800">{bookingData.guestInfo.emailAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-800">{bookingData.guestInfo.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nationality:</span>
                      <p className="font-medium text-gray-800">{bookingData.guestInfo.nationality}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#313131] mb-4">Payment Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tour Price (per person)</span>
                      <span className="font-medium">{tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-medium">x {bookingData.tourDetails.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">₱{totalAmount.toLocaleString()}</span>
                    </div>
                    {remainingAmount > 0 && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-700 font-medium">Downpayment Paid</span>
                          <span className="font-bold text-blue-700">₱{paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Remaining Balance</span>
                          <span className="font-medium text-gray-700">₱{remainingAmount.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center text-lg font-semibold text-[#313131] pt-3 border-t">
                      <span>{remainingAmount > 0 ? 'Amount Paid' : 'Total Paid'}</span>
                      <span className="text-green-600">
                        ₱{paidAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Payment Method</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {bookingData.paymentData.paymentType === 'card' && (
                        <>
                          <i className="fas fa-credit-card text-blue-600"></i>
                          <span>Credit/Debit Card</span>
                        </>
                      )}
                      {bookingData.paymentData.paymentType === 'gcash' && (
                        <>
                          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">GC</span>
                          </div>
                          <span>GCash</span>
                        </>
                      )}
                      {bookingData.paymentData.paymentType === 'paymaya' && (
                        <>
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">PM</span>
                          </div>
                          <span>PayMaya</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleViewTour}
                      className="w-full h-12 bg-[#11B981] text-white hover:bg-[#0D9F6F]"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Tour Details
                    </Button>
                    <Button
                      onClick={handleNewBooking}
                      variant="outline"
                      className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Book Another Tour
                    </Button>
                  </div>

                  {/* Important Information */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Please arrive 15 minutes before departure</li>
                      <li>• Bring valid ID for verification</li>
                      <li>• Free cancellation up to 24 hours before</li>
                      <li>• Confirmation email sent to your email</li>
                      {remainingAmount > 0 && (
                        <li>• Remaining balance of ₱{remainingAmount.toLocaleString()} due on tour date</li>
                      )}
                    </ul>
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
