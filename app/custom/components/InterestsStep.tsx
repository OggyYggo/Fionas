'use client'

import { useState } from 'react'

interface InterestsStepProps {
  formData: {
    interests: string[]
    destinations: string[]
  }
  onInterestsChange: (interests: string[]) => void
  onDestinationsChange: (destinations: string[]) => void
  onContinue: () => void
  onBack: () => void
  showAlert?: (message: string) => void
}

export default function InterestsStep({ 
  formData, 
  onInterestsChange, 
  onDestinationsChange, 
  onContinue, 
  onBack,
  showAlert 
}: InterestsStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndContinue = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please select at least one interest.')
      }
      return
    }
    
    setErrors({})
    onContinue()
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

  const destinations = [
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
  ]

  const handleInterestToggle = (interestId: string) => {
    const newInterests = formData.interests.includes(interestId)
      ? formData.interests.filter(i => i !== interestId)
      : [...formData.interests, interestId]
    onInterestsChange(newInterests)
  }

  const handleDestinationToggle = (destination: string) => {
    const newDestinations = formData.destinations.includes(destination)
      ? formData.destinations.filter(d => d !== destination)
      : [...formData.destinations, destination]
    onDestinationsChange(newDestinations)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">Your Interests</h2>
      <p className="text-gray-600 mb-6">What interests you? *</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {interests.map((interest) => (
          <div
            key={interest.id}
            onClick={() => handleInterestToggle(interest.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              formData.interests.includes(interest.id)
                ? 'border-teal-600 bg-teal-50'
                : errors.interests ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2 text-center">{interest.icon}</div>
            <p className="text-xs text-center font-medium">{interest.name}</p>
          </div>
        ))}
      </div>
      {errors.interests && (
        <p className="mb-6 text-sm text-red-600">{errors.interests}</p>
      )}

      <h3 className="text-xl font-semibold mb-4">Must-visit Destinations (Optional)</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {destinations.map((destination) => (
          <div
            key={destination}
            onClick={() => handleDestinationToggle(destination)}
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
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={validateAndContinue}
          className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
        >
          Continue
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
