'use client'

import { useState } from 'react'

interface ReviewStepProps {
  formData: {
    fullName: string
    email: string
    phone: string
    startDate: Date | null
    endDate: Date | null
    numberOfGuests: string
    budgetRange: string
    interests: string[]
    destinations: string[]
  }
  onSubmit: () => void
  onBack: () => void
  showAlert?: (message: string) => void
}

export default function ReviewStep({ formData, onSubmit, onBack, showAlert }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Basic validation before submission
    if (!formData.fullName || !formData.email || !formData.phone) {
      if (showAlert) {
        showAlert('Missing contact information. Please go back and fill in all required fields.')
      }
      return
    }
    
    if (!formData.startDate) {
      if (showAlert) {
        showAlert('Missing trip details. Please select a start date.')
      }
      return
    }
    
    if (formData.interests.length === 0) {
      if (showAlert) {
        showAlert('Please select at least one interest.')
      }
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit()
    } catch (error) {
      if (showAlert) {
        showAlert('Submission failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  const interests = [
    { id: 'beaches', name: 'Beaches & Islands', icon: '🏖️' },
    { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
    { id: 'adventure', name: 'Adventure Activities', icon: '🎯' },
    { id: 'cultural', name: 'Cultural Sites', icon: '🏛️' },
    { id: 'diving', name: 'Diving & Snorkeling', icon: '🤿' },
    { id: 'food', name: 'Food Tours', icon: '🍽️' },
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'relaxation', name: 'Relaxation', icon: '🧘' }
  ]

  return (
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
            <span className="font-medium">
              {formData.startDate ? formData.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not selected'}
            </span>
          </div>
          {formData.endDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">
                {formData.endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
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
              const interest = interests.find(i => i.id === interestId)
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
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
          {!isSubmitting && (
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
