'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Custom() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClient, setIsClient] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    numberOfGuests: '1 Guest',
    budgetRange: 'Standard (₱5,000 - ₱10,000/person)',
    interests: [] as string[],
    destinations: [] as string[]
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContinue = () => {
    // Basic validation for current step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: 'Please fill in all required contact information.',
          confirmButtonColor: '#14b8a6'
        })
        return
      }
    } else if (currentStep === 2) {
      if (!formData.startDate || !formData.numberOfGuests) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Details',
          text: 'Please fill in all required trip details.',
          confirmButtonColor: '#14b8a6'
        })
        return
      }
    } else if (currentStep === 3) {
      if (formData.interests.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Select Interests',
          text: 'Please select at least one interest.',
          confirmButtonColor: '#14b8a6'
        })
        return
      }
    }

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
      startDate: '',
      endDate: '',
      numberOfGuests: '1 Guest',
      budgetRange: 'Standard (₱5,000 - ₱10,000/person)',
      interests: [],
      destinations: []
    })
    setCurrentStep(1)
  }

  return (
    <>
      <Header />
      
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
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Trip Details */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Trip Details</h2>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Start Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v6m0-4h12m-6 4v8m-6 0h12" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">End Date (Optional)</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v6m0-4h12m-6 4v8m-6 0h12" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Number of Guests *</label>
                    <div className="relative">
                      <select
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 appearance-none"
                      >
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 Guests</option>
                        <option>4 Guests</option>
                        <option>5 Guests</option>
                        <option>6+ Guests</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Budget Range</label>
                    <div className="relative">
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 appearance-none"
                      >
                        <option>Standard (₱5,000 - ₱10,000/person)</option>
                        <option>Premium (₱10,000 - ₱15,000/person)</option>
                        <option>Luxury (₱15,000 - ₱25,000/person)</option>
                        <option>Ultra Luxury (₱25,000+/person)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                    >
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Your Interests */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Your Interests</h2>
                <p className="text-gray-600 mb-6">What interests you? *</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { id: 'beaches', name: 'Beaches & Islands', icon: '🏖️' },
                    { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
                    { id: 'adventure', name: 'Adventure Activities', icon: '🎯' },
                    { id: 'cultural', name: 'Cultural Sites', icon: '🏛️' },
                    { id: 'diving', name: 'Diving & Snorkeling', icon: '🤿' },
                    { id: 'food', name: 'Food Tours', icon: '🍽️' },
                    { id: 'photography', name: 'Photography', icon: '📸' },
                    { id: 'relaxation', name: 'Relaxation', icon: '🧘' }
                  ].map((interest) => (
                    <div
                      key={interest.id}
                      onClick={() => {
                        const newInterests = formData.interests.includes(interest.id)
                          ? formData.interests.filter(i => i !== interest.id)
                          : [...formData.interests, interest.id]
                        setFormData(prev => ({ ...prev, interests: newInterests }))
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.interests.includes(interest.id)
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2 text-center">{interest.icon}</div>
                      <p className="text-xs text-center font-medium">{interest.name}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">Must-visit Destinations (Optional)</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                  {[
                    'Chocolate Hills',
                    'Panglao Island',
                    'Anda Beach',
                    'Loboc River',
                    'Tarsier Sanctuary',
                    'Baclayon Church',
                    'Balicasag Island',
                    'Hinagdanan Cave',
                    'Virgin Island',
                    'Alona Beach'
                  ].map((destination) => (
                    <div
                      key={destination}
                      onClick={() => {
                        const newDestinations = formData.destinations.includes(destination)
                          ? formData.destinations.filter(d => d !== destination)
                          : [...formData.destinations, destination]
                        setFormData(prev => ({ ...prev, destinations: newDestinations }))
                      }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.destinations.includes(destination)
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs text-center font-medium">{destination}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                  >
                    Continue
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Review Your Tour Request</h2>
                <p className="text-gray-600 mb-8">Please review your information before submitting your request.</p>
                
                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Trip Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formData.startDate}</span>
                    </div>
                    {formData.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{formData.endDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Guests:</span>
                      <span className="font-medium">{formData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Range:</span>
                      <span className="font-medium">{formData.budgetRange}</span>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Interests</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interestId) => {
                        const interest = [
                          { id: 'beaches', name: 'Beaches & Islands', icon: '🏖️' },
                          { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
                          { id: 'adventure', name: 'Adventure Activities', icon: '🎯' },
                          { id: 'cultural', name: 'Cultural Sites', icon: '🏛️' },
                          { id: 'diving', name: 'Diving & Snorkeling', icon: '🤿' },
                          { id: 'food', name: 'Food Tours', icon: '🍽️' },
                          { id: 'photography', name: 'Photography', icon: '📸' },
                          { id: 'relaxation', name: 'Relaxation', icon: '🧘' }
                        ].find(i => i.id === interestId)
                        return interest ? (
                          <span key={interest.id} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                            {interest.icon} {interest.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>

                {/* Destinations */}
                {formData.destinations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Must-visit Destinations</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {formData.destinations.map((destination) => (
                          <span key={destination} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {destination}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Notes (Optional)</h3>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                    rows={4}
                    placeholder="Any special requests or additional information..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Request Submitted!',
                        text: 'Your tour request has been successfully submitted. We will contact you within 24 hours.',
                        confirmButtonColor: '#14b8a6',
                        confirmButtonText: 'Great!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleCancel()
                        }
                      })
                    }}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                  >
                    Submit Request
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
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
