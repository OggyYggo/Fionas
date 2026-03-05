'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Header from '@/components/Landing Page/Header'
import Footer from '@/components/Footer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import ContactStep from './components/ContactStep'
import TripDetailsStep from './components/TripDetailsStep'
import InterestsStep from './components/InterestsStep'
import ReviewStep from './components/ReviewStep'

export default function Custom() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [alert, setAlert] = useState<{ type: 'warning' | 'success' | 'error'; message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    numberOfGuests: '1 Guest',
    budgetRange: 'Standard (₱5,000 - ₱10,000/person)',
    interests: [] as string[],
    destinations: [] as string[]
  })

  useEffect(() => {
    setIsClient(true)
    // Test alert to verify functionality
    setTimeout(() => {
      setAlert({ type: 'success', message: 'Alerts are working! This is a test message.' })
    }, 1000)
  }, [])

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (date: Date | null, fieldName: 'startDate' | 'endDate') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date
    }))
  }

  const showAlert = (message: string) => {
    setAlert({ type: 'warning', message })
  }

  const handleInterestsChange = (interests: string[]) => {
    setFormData(prev => ({
      ...prev,
      interests
    }))
  }

  const handleDestinationsChange = (destinations: string[]) => {
    setFormData(prev => ({
      ...prev,
      destinations
    }))
  }

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      startDate: null,
      endDate: null,
      numberOfGuests: '1 Guest',
      budgetRange: 'Standard (₱5,000 - ₱10,000/person)',
      interests: [],
      destinations: []
    })
    setCurrentStep(1)
  }

  const handleSubmitRequest = async () => {
    try {
      // Prepare booking data
      const bookingData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        tourType: 'Custom Tour',
        startDate: formData.startDate?.toISOString().split('T')[0],
        endDate: formData.endDate?.toISOString().split('T')[0],
        numberOfGuests: formData.numberOfGuests,
        budgetRange: formData.budgetRange,
        interests: formData.interests,
        destinations: formData.destinations,
        additionalNotes: document.querySelector('textarea')?.value || ''
      }

      // Send to API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (result.success) {
        setAlert({ 
          type: 'success', 
          message: `Request Submitted! Booking ID: ${result.data.bookingId}. Status: ${result.data.status}. We will contact you within ${result.data.estimatedResponseTime}.` 
        })
        handleCancel()
      } else {
        setAlert({ type: 'error', message: result.message || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      setAlert({ type: 'error', message: 'Unable to connect to server. Please check your connection and try again.' })
    }
  }

  return (
    <>
      <Header />
      
      {/* Alert Component */}
      {alert && (
        <div className="fixed top-20 right-4 z-[9999] max-w-md animate-in slide-in-from-top-2">
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="shadow-xl border-2">
            <div className="flex items-center">
              {alert.type === 'warning' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              {alert.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
              {alert.type === 'error' && <XCircle className="h-4 w-4 flex-shrink-0" />}
              <AlertDescription className="ml-2">
                {alert.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      
      {/* Custom Hero Section */}
      <section className="hero-custom">
        <div className="hero-content">
          <h1 className="font-primary text-[64px] font-black mb-5 leading-tight tracking-[-1.5px]">
            Design Your Dream Tour
          </h1>
          <p className="font-primary text-xl font-normal leading-relaxed mb-10 text-gray-300">
            Tell us your pereferences and we'll create a personalized iterinary for you
          </p>
        </div>
      </section>

      <main className="min-h-screen bg-white" id="tour-form">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? 'bg-teal-600 text-white'
                          : currentStep > step
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-8 h-0.5 mx-2 ${
                          currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <ContactStep
                formData={{
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone
                }}
                onInputChange={handleInputChange}
                onContinue={handleContinue}
                onCancel={handleCancel}
                showAlert={showAlert}
              />
            )}

            {/* Step 2: Trip Details */}
            {currentStep === 2 && (
              <TripDetailsStep
                formData={{
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  numberOfGuests: formData.numberOfGuests,
                  budgetRange: formData.budgetRange
                }}
                onDateChange={handleDateChange}
                onInputChange={handleInputChange}
                onContinue={handleContinue}
                onBack={handleBack}
                isClient={isClient}
                showAlert={showAlert}
              />
            )}

            {/* Step 3: Your Interests */}
            {currentStep === 3 && (
              <InterestsStep
                formData={{
                  interests: formData.interests,
                  destinations: formData.destinations
                }}
                onInterestsChange={handleInterestsChange}
                onDestinationsChange={handleDestinationsChange}
                onContinue={handleContinue}
                onBack={handleBack}
                showAlert={showAlert}
              />
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <ReviewStep
                formData={formData}
                onSubmit={handleSubmitRequest}
                onBack={handleBack}
                showAlert={showAlert}
              />
            )}

            {/* Feature Highlights - Outside the form card */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Free Consultation</h3>
                  <p className="text-sm text-gray-600">No obligation. We'll review your request and get back to you within 24 hours</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Personalized Itinerary</h3>
                  <p className="text-sm text-gray-600">Get a custom tour designed specifically for your preferences and budget</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Flexible Options</h3>
                  <p className="text-sm text-gray-600">Make changes until it's perfect. Your dream tour, your way</p>
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
