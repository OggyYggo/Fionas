'use client'

import { useState } from 'react'

interface ReviewStepProps {
  formData: {
    fullName: string
    email: string
    phone: string
    agreement: boolean
    destination: string
    startDate: Date | null
    endDate: Date | null
    adults: number
    children: number
    activities: string[]
    otherActivity: string
    budgetRange: string
    accommodation: string
    transportation: string
    tourGuide: string
    specialRequests: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onBack: () => void
  showAlert?: (message: string) => void
}

export default function ReviewStep({ 
  formData, 
  onInputChange,
  onSubmit, 
  onBack, 
  showAlert 
}: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndSubmit = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      // More lenient phone validation - just check if it starts with +63 and has reasonable length
      const cleanPhone = formData.phone.replace(/\s/g, '')
      if (!cleanPhone.startsWith('+63') || cleanPhone.length < 12) {
        newErrors.phone = 'Please enter a valid Philippine phone number'
      }
    }
    
    if (!formData.agreement) {
      newErrors.agreement = 'You must agree to be contacted'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please fill in all required contact information correctly.')
      }
      return
    }
    
    setErrors({})
    setIsSubmitting(true)
    
    try {
      onSubmit()
    } catch (error) {
      if (showAlert) {
        showAlert('Submission failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    
    // Remove any non-digit characters except +
    value = value.replace(/[^\d+]/g, '')
    
    // Ensure it starts with +63
    if (!value.startsWith('+63')) {
      if (value.startsWith('63')) {
        value = '+63' + value.slice(2)
      } else if (value.startsWith('+')) {
        value = '+63' + value.slice(1)
      } else {
        value = '+63' + value
      }
    }
    
    // Limit to +63 + 10 digits (total 13 characters)
    if (value.length > 13) {
      value = value.slice(0, 13)
    }
    
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onInputChange(syntheticEvent)
  }

  const calculateTripDuration = () => {
    if (!formData.startDate || !formData.endDate) {
      return 0
    }
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getBudgetLabel = () => {
    switch(formData.budgetRange) {
      case 'budget': return 'Budget (₱2,000 – ₱5,000 / person)'
      case 'standard': return 'Standard (₱5,000 – ₱10,000 / person)'
      case 'premium': return 'Premium (₱10,000+ / person)'
      default: return formData.budgetRange
    }
  }

  const tripDuration = calculateTripDuration()

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Contact Information</h2>
        <p className="text-gray-600">Enter your contact details so we can send your personalized Bohol itinerary.</p>
      </div>
      
      <form className="space-y-8">
        {/* Contact Information */}
        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-base">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md ${
                errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-base">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-base">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="+63 912 345 6789"
            />
            <p className="text-sm text-gray-500">Format: +63 XXX XXX XXXX (Philippines)</p>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={onInputChange}
              className={`w-5 h-5 text-teal-600 border-2 rounded focus:ring-teal-500 focus:ring-2 mt-1 ${
                errors.agreement ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <span className={`text-sm leading-relaxed ${
              errors.agreement ? 'text-red-600' : 'text-gray-700'
            }`}>
              I agree to be contacted regarding my custom itinerary request.
            </span>
          </label>
          {errors.agreement && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.agreement}
            </p>
          )}
        </div>

        {/* Trip Summary */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Destination:</span>
              <span className="font-medium text-gray-800">{formData.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dates:</span>
              <span className="font-medium text-gray-800">
                {formData.startDate?.toLocaleDateString() || 'Not selected'} 
                {formData.endDate && ` - ${formData.endDate.toLocaleDateString()}`}
                {tripDuration > 0 && ` (${tripDuration} days)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium text-gray-800">
                {formData.adults} adults{formData.children > 0 && `, ${formData.children} children`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium text-gray-800">{getBudgetLabel()}</span>
            </div>
            {formData.activities.length > 0 && (
              <div>
                <span className="text-gray-600">Activities:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.activities.slice(0, 3).map((activity) => (
                    <span key={activity} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                      {activity}
                    </span>
                  ))}
                  {formData.activities.length > 3 && (
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      +{formData.activities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-10 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-base"
          >
            Back
          </button>
          <button
            type="button"
            onClick={validateAndSubmit}
            disabled={isSubmitting}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
