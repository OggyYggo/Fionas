'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SimpleTourService } from '@/lib/simpleTourService'
import { Tour } from '@/types/tour'
import { PayMongoService, PaymentData, PaymentResult } from '@/lib/paymongoService'
import { BookingService } from '@/lib/supabase'
import Header from '@/components/Landing Page/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardSpinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ReviewPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const tourId = parseInt(params.id as string)
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [tourDetails, setTourDetails] = useState<any>(null)
  const [guestInfo, setGuestInfo] = useState<any>(null)
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    paymentType: 'card' as 'card' | 'gcash' | 'paymaya',
    phoneNumber: '',
    email: ''
  })

  // Error state
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    phoneNumber: '',
    email: ''
  })

  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

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

    const fetchStoredData = () => {
      const storedTourDetails = sessionStorage.getItem('tourDetails')
      const storedGuestInfo = sessionStorage.getItem('guestInfo')
      
      if (storedTourDetails && storedGuestInfo) {
        setTourDetails(JSON.parse(storedTourDetails))
        setGuestInfo(JSON.parse(storedGuestInfo))
      } else {
        // Redirect back to step 1 if data is missing
        router.push(`/tours/${tourId}/booking-confirmation`)
      }
    }

    fetchTour()
    fetchStoredData()
  }, [tourId, router])

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = PayMongoService.formatCardNumber(value)
      setPaymentData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    if (value) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
      setPaymentError('')
    }
  }

  const validateForm = () => {
    // Use PayMongo service validation
    const validation = PayMongoService.validateCardData(paymentData)
    
    setErrors(validation.errors as typeof errors)
    
    return validation.isValid
  }

  const handleCompleteBooking = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setPaymentError('')

    try {
      // Step 1: Process payment for 50% downpayment
      const paymentResult: PaymentResult = await PayMongoService.processPayment(
        downpaymentAmount,
        `50% Downpayment for ${tour?.title || 'Tour'} - ${tourDetails.numberOfGuests} guests`,
        paymentData
      )

      if (paymentResult.success) {
        // Step 2: Create booking in database with downpayment status
        const bookingData = {
          fullName: guestInfo.fullName,
          email: guestInfo.emailAddress,
          phone: guestInfo.phoneNumber,
          tourType: 'countryside' as const, // Default tour type
          startDate: tourDetails.tourDate,
          numberOfGuests: tourDetails.numberOfGuests,
          budgetRange: 'standard' as const, // Default budget range
          destination: (tour as any).location || (tour as any).tour_location || 'Bohol, Philippines',
          specialRequests: tourDetails.specialRequest || '',
          additionalNotes: `Tour: ${tour?.title || 'Unknown Tour'}\nPickup: ${tourDetails.pickupLocation || 'Not specified'}\nPayment Method: ${paymentData.paymentType}\nPayment ID: ${paymentResult.paymentId}\nDownpayment: ₱${downpaymentAmount.toLocaleString()}\nRemaining Balance: ₱${remainingAmount.toLocaleString()}`
        }

        console.log('Creating booking in database:', bookingData)
        
        const bookingResult = await BookingService.createBooking(bookingData)
        
        if (bookingResult.success) {
          // Store payment data and show success message
          sessionStorage.setItem('paymentData', JSON.stringify({
            ...paymentData,
            paymentId: paymentResult.paymentId,
            paidAmount: downpaymentAmount,
            totalAmount: totalAmount,
            remainingAmount: remainingAmount,
            timestamp: new Date().toISOString(),
            bookingId: bookingResult.data?.bookingId
          }))
          
          setPaymentSuccess(true)
          
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push(`/tours/${tourId}/booking-confirmation/complete`)
          }, 2000)
        } else {
          // Payment succeeded but booking failed
          setPaymentError(`Payment successful but booking failed: ${bookingResult.message}`)
        }
      } else {
        setPaymentError(paymentResult.error || 'Payment failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentError('An unexpected error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    router.push(`/tours/${tourId}/booking-confirmation/guest-info`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <CardSpinner text="Loading booking review..." />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!tour || !tourDetails || !guestInfo) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-10">Please start your booking again.</p>
            <a href={`/tours/${tourId}`} className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Start Booking
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalAmount = typeof tour.price === 'string' && tour.price.includes('₱') 
    ? parseInt(tour.price.replace(/[₱,]/g, '')) * tourDetails.numberOfGuests
    : 0

  const downpaymentAmount = Math.ceil(totalAmount * 0.5) // 50% downpayment
  const remainingAmount = totalAmount - downpaymentAmount

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
                  <i className="fas fa-check text-sm"></i>
                </div>
                <span className="ml-2 text-green-600 font-medium">Guest Information</span>
              </div>
              
              {/* Separator */}
              <div className="w-16 h-0.5 bg-green-600"></div>
              
              {/* Step 3 - Final Step */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="ml-2 text-green-600 font-medium">Review & Payment</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Booking Review & Payment */}
            <div className="flex-1">
              {/* Booking Review */}
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg mb-6">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#313131] mb-6">Booking Review</h2>
                  
                  {/* Tour Information */}
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
                          {tourDetails.tourDate || 'Not selected'}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-users"></i>
                          {tourDetails.numberOfGuests} Guests
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tour Details Summary */}
                  <div className="border-t border-[#F4F4F4] pt-4 mb-4">
                    <h4 className="font-medium text-[#313131] mb-3">Tour Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tour Date:</span>
                        <p className="font-medium text-gray-800">{tourDetails.tourDate || 'Not selected'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Number of Guests:</span>
                        <p className="font-medium text-gray-800">{tourDetails.numberOfGuests}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Pickup Location:</span>
                        <p className="font-medium text-gray-800">{tourDetails.pickupLocation || 'Not specified'}</p>
                      </div>
                      {tourDetails.specialRequest && (
                        <div>
                          <span className="text-gray-500">Special Request:</span>
                          <p className="font-medium text-gray-800">{tourDetails.specialRequest}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="border-t border-[#F4F4F4] pt-4">
                    <h4 className="font-medium text-[#313131] mb-3">Guest Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium text-gray-800">{guestInfo.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium text-gray-800">{guestInfo.emailAddress}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-800">{guestInfo.phoneNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Nationality:</span>
                        <p className="font-medium text-gray-800">{guestInfo.nationality}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#313131] mb-6">Payment Information</h2>
                  
                  {/* PayMongo Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-lock text-green-600 mt-1"></i>
                      <div>
                        <p className="text-sm text-green-800 font-medium mb-1">Secure Payment by PayMongo</p>
                        <p className="text-sm text-green-700">Your payment is processed securely through PayMongo's PCI-compliant payment gateway.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-[#313131]">Select Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentType: 'card' }))}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentData.paymentType === 'card'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <i className="fas fa-credit-card text-2xl text-blue-600"></i>
                          <span className="font-medium">Credit/Debit Card</span>
                          <span className="text-sm text-gray-500">Visa, Mastercard, Amex</span>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentType: 'gcash' }))}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentData.paymentType === 'gcash'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">GC</span>
                          </div>
                          <span className="font-medium">GCash</span>
                          <span className="text-sm text-gray-500">Pay with GCash</span>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentType: 'paymaya' }))}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentData.paymentType === 'paymaya'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PM</span>
                          </div>
                          <span className="font-medium">PayMaya</span>
                          <span className="text-sm text-gray-500">Pay with PayMaya</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-6">
                    {paymentData.paymentType === 'card' && (
                      /* Card Information */
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#313131]">Card Information</h3>
                      
                      <div>
                        <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          type="text"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          placeholder="John Doe"
                          className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.cardName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            type="text"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    )}

                    {(paymentData.paymentType === 'gcash' || paymentData.paymentType === 'paymaya') && (
                      /* E-wallet Information */
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#313131]">E-wallet Information</h3>
                        
                        <div>
                          <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number *
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            value={paymentData.phoneNumber}
                            onChange={handlePaymentChange}
                            placeholder="09XXXXXXXXX"
                            maxLength={11}
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
                          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={paymentData.email}
                            onChange={handlePaymentChange}
                            placeholder="your@email.com"
                            className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                            <div>
                              <p className="text-sm text-blue-800 font-medium mb-1">E-wallet Payment</p>
                              <p className="text-sm text-blue-700">
                                You will receive a payment request on your {paymentData.paymentType === 'gcash' ? 'GCash' : 'PayMaya'} app. 
                                Please approve the payment to complete your booking.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Common fields for all payment types */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                          {paymentData.paymentType === 'card' ? 'Cardholder Name *' : 'Account Holder Name *'}
                        </Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          type="text"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          placeholder="John Doe"
                          className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.cardName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                        )}
                      </div>
                    </div>

                    {paymentData.paymentType === 'card' && (
                      /* Billing Address for card payments only */
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#313131]">Billing Address</h3>
                      
                      <div>
                        <Label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address *
                        </Label>
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          type="text"
                          value={paymentData.billingAddress}
                          onChange={handlePaymentChange}
                          placeholder="123 Main St, City, Country"
                          className={`w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {errors.billingAddress && (
                          <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Payment Processing Status */}
                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-exclamation-circle text-red-600 mt-1"></i>
                          <div>
                            <p className="text-sm text-red-800 font-medium mb-1">Payment Failed</p>
                            <p className="text-sm text-red-700">{paymentError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-check-circle text-green-600 mt-1"></i>
                          <div>
                            <p className="text-sm text-green-800 font-medium mb-1">Payment Successful!</p>
                            <p className="text-sm text-green-700">Redirecting to confirmation page...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-shield-alt text-blue-600 mt-1"></i>
                        <div>
                          <p className="text-sm text-blue-800 font-medium mb-1">Secure Payment</p>
                          <p className="text-sm text-blue-700">Your payment information is encrypted and secure. We never store your card details.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      disabled={isProcessing}
                      className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Back
                    </Button>
                    <Button
                      onClick={handleCompleteBooking}
                      disabled={isProcessing || paymentSuccess}
                      className="flex-1 h-12 bg-[#11B981] text-white hover:bg-[#0D9F6F] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay Downpayment - ₱{downpaymentAmount.toLocaleString()}
                          <i className="fas fa-arrow-right ml-2"></i>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-96">
              <Card className="bg-white border border-[#F4F4F4] rounded-xl shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#313131] mb-4">Order Summary</h3>
                  
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
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">₱{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700 font-medium">Downpayment (50%)</span>
                      <span className="font-bold text-blue-700">₱{downpaymentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className="font-medium text-gray-700">₱{remainingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold text-[#313131] pt-3 border-t">
                      <span>Amount Due Now</span>
                      <span className="text-green-600">
                        ₱{downpaymentAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Notice */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
                      <div>
                        <p className="text-sm text-yellow-800 font-medium mb-1">Payment Terms</p>
                        <p className="text-sm text-yellow-700">50% downpayment required to confirm booking. Remaining balance due on tour date.</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fab fa-cc-visa text-blue-600"></i>
                      <i className="fab fa-cc-mastercard text-red-500"></i>
                      <i className="fab fa-cc-amex text-blue-500"></i>
                      <span className="ml-2">Powered by PayMongo</span>
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
