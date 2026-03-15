'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Header from '@/components/Landing Page/Header'
import Footer from '@/components/Landing Page/Footer'
import ContactStep from './components/ContactStep'
import TripDetailsStep from './components/TripDetailsStep'
import InterestsStep from './components/InterestsStep'
import ReviewStep from './components/ReviewStep'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import AlertPortal from './components/AlertPortal'

export default function Custom() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [alert, setAlert] = useState<{ type: 'warning' | 'success' | 'error'; message: string } | null>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  
  const [formData, setFormData] = useState({
    destination: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    adults: 2,
    children: 0,
    activities: [] as string[],
    otherActivity: '',
    budgetRange: '',
    accommodation: '',
    transportation: '',
    tourGuide: '',
    specialRequests: '',
    fullName: '',
    email: '',
    phone: '+63',
    agreement: false
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleGuestChange = (type: 'adults' | 'children', value: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleActivitiesChange = (activities: string[]) => {
    setFormData(prev => ({
      ...prev,
      activities
    }))
  }

  const showAlert = (message: string) => {
    setAlert({ type: 'warning', message })
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
      destination: '',
      startDate: null,
      endDate: null,
      adults: 2,
      children: 0,
      activities: [],
      otherActivity: '',
      budgetRange: '',
      accommodation: '',
      transportation: '',
      tourGuide: '',
      specialRequests: '',
      fullName: '',
      email: '',
      phone: '+63',
      agreement: false
    })
    setCurrentStep(1)
  }

  const testSuccessAlert = () => {
    console.log('🧪 Testing success alert')
    setShowSuccessAlert(true)
    setAlert({ 
      type: 'success', 
      message: 'Test Success! This is a demo alert to verify the success message is working properly.' 
    })
    
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 5000)
  }

  const handleSubmitRequest = async () => {
    try {
      // Validate required fields
      if (!formData.fullName.trim()) {
        setAlert({ type: 'error', message: 'Please enter your full name.' })
        return
      }
      
      if (!formData.email.trim()) {
        setAlert({ type: 'error', message: 'Please enter your email address.' })
        return
      }
      
      if (!formData.phone.trim() || formData.phone === '+63') {
        setAlert({ type: 'error', message: 'Please enter a valid phone number.' })
        return
      }
      
      if (!formData.destination) {
        setAlert({ type: 'error', message: 'Please select a destination.' })
        return
      }
      
      if (!formData.startDate) {
        setAlert({ type: 'error', message: 'Please select a start date.' })
        return
      }
      
      if (formData.activities.length === 0 && !formData.otherActivity.trim()) {
        setAlert({ type: 'error', message: 'Please select at least one activity or specify other interests.' })
        return
      }
      
      if (!formData.budgetRange) {
        setAlert({ type: 'error', message: 'Please select a budget range.' })
        return
      }
      
      if (!formData.accommodation) {
        setAlert({ type: 'error', message: 'Please select accommodation preference.' })
        return
      }
      
      if (!formData.transportation) {
        setAlert({ type: 'error', message: 'Please select transportation preference.' })
        return
      }
      
      if (!formData.agreement) {
        setAlert({ type: 'error', message: 'Please agree to be contacted regarding your custom itinerary request.' })
        return
      }

      // Import CustomToursService for custom tour submissions
      const { CustomToursService } = await import('@/lib/custom-tours-db')
      
      // Prepare custom tour submission data
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        startDate: formData.startDate?.toISOString().split('T')[0],
        endDate: formData.endDate?.toISOString().split('T')[0],
        adults: formData.adults,
        children: formData.children,
        activities: formData.activities,
        otherActivity: formData.otherActivity,
        budgetRange: formData.budgetRange,
        accommodation: formData.accommodation,
        transportation: formData.transportation,
        tourGuide: formData.tourGuide,
        specialRequests: formData.specialRequests,
        agreement: formData.agreement
      }

      console.log('🔍 Submitting custom tour data:', submissionData)

      // Submit using CustomToursService
      const result = await CustomToursService.saveFormSubmission(submissionData)

      if (result.success) {
        console.log('✅ Custom tour submission successful, showing success alert')
        setShowSuccessAlert(true)
        setAlert({ 
          type: 'success', 
          message: `Request Submitted! Submission ID: ${result.data?.id || 'Pending'}. We will contact you within 24 hours to discuss your custom itinerary.` 
        })
        handleCancel()
        
        // Hide success alert after 10 seconds
        setTimeout(() => {
          setShowSuccessAlert(false)
          console.log('🔒 Hiding success alert after 10 seconds')
        }, 10000)
      } else {
        console.log('❌ Custom tour submission failed:', result.message)
        setAlert({ type: 'error', message: result.message || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      console.error('Custom tour submission error:', error)
      setAlert({ type: 'error', message: 'Unable to connect to server. Please check your connection and try again.' })
    }
  }

  return (
    <div className="relative">
      <Header />
      
      {/* Success Alert - Shadcn Alert */}
      {showSuccessAlert && (
        <div className="fixed top-20 right-4 z-[9999] max-w-md">
          <Alert className="bg-green-50 border-green-200 text-green-800 shadow-lg">
            <CheckCircledIcon className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {alert?.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Regular Alert Portal */}
      {alert && !showSuccessAlert && <AlertPortal type={alert.type} message={alert.message} />}
      
      {/* Test Button - Remove this in production */}
      <button
        onClick={testSuccessAlert}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 z-40 text-sm"
        style={{ display: 'none' }} /* Hidden by default, change to block to test */
      >
        Test Success Alert
      </button>
      
      {/* Custom Hero Section */}
      <section className="hero-custom">
        <div className="hero-content">
          <h1 className="font-primary text-[64px] font-black mb-5 leading-tight tracking-[-1.5px]">
            Plan Your Bohol Itinerary
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

            {/* Step 1: Trip Details */}
            {currentStep === 1 && (
              <ContactStep
                formData={{
                  destination: formData.destination,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  adults: formData.adults,
                  children: formData.children
                }}
                onInputChange={handleInputChange}
                onDateChange={handleDateChange}
                onGuestChange={handleGuestChange}
                onContinue={handleContinue}
                onCancel={handleCancel}
                showAlert={showAlert}
              />
            )}

            {/* Step 2: Activities / Interests */}
            {currentStep === 2 && (
              <InterestsStep
                formData={{
                  activities: formData.activities,
                  otherActivity: formData.otherActivity
                }}
                onInputChange={handleInputChange}
                onActivitiesChange={handleActivitiesChange}
                onContinue={handleContinue}
                onBack={handleBack}
                showAlert={showAlert}
              />
            )}

            {/* Step 3: Budget & Travel Preferences */}
            {currentStep === 3 && (
              <TripDetailsStep
                formData={{
                  budgetRange: formData.budgetRange,
                  accommodation: formData.accommodation,
                  transportation: formData.transportation,
                  tourGuide: formData.tourGuide,
                  specialRequests: formData.specialRequests
                }}
                onInputChange={handleInputChange}
                onContinue={handleContinue}
                onBack={handleBack}
                showAlert={showAlert}
              />
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <ReviewStep
                formData={{
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  agreement: formData.agreement,
                  destination: formData.destination,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  adults: formData.adults,
                  children: formData.children,
                  activities: formData.activities,
                  otherActivity: formData.otherActivity,
                  budgetRange: formData.budgetRange,
                  accommodation: formData.accommodation,
                  transportation: formData.transportation,
                  tourGuide: formData.tourGuide,
                  specialRequests: formData.specialRequests
                }}
                onInputChange={handleInputChange}
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
    </div>
  )
}
