'use client'

import { useState } from 'react'

interface TripDetailsStepProps {
  formData: {
    budgetRange: string
    accommodation: string
    transportation: string
    tourGuide: string
    specialRequests: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onContinue: () => void
  onBack: () => void
  showAlert?: (message: string) => void
}

const budgetRanges = [
  { id: 'budget', label: 'Budget', price: '₱2,000 – ₱5,000 / person' },
  { id: 'standard', label: 'Standard', price: '₱5,000 – ₱10,000 / person' },
  { id: 'premium', label: 'Premium', price: '₱10,000+ / person' }
]

const accommodations = [
  'No accommodation needed',
  'Budget hotel',
  'Mid-range hotel',
  'Luxury resort'
]

const transportationOptions = [
  'Car',
  'Van',
  'Motorcycle',
  'E-bike',
  'Tuk-tuk',
  'Already have transport'
]

export default function TripDetailsStep({ 
  formData, 
  onInputChange, 
  onContinue, 
  onBack,
  showAlert 
}: TripDetailsStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndContinue = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Please select a budget range'
    }
    
    if (!formData.accommodation) {
      newErrors.accommodation = 'Please select accommodation preference'
    }
    
    if (!formData.transportation) {
      newErrors.transportation = 'Please select transportation preference'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please fill in all required preferences.')
      }
      return
    }
    
    setErrors({})
    onContinue()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Budget & Travel Preferences</h2>
        <p className="text-gray-600">Tell us your budget range and preferred type of accommodation for your Bohol trip.</p>
      </div>
      
      <form className="space-y-8">
        {/* Budget Range */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-semibold text-base">Budget Range *</label>
          <div className="space-y-3">
            {budgetRanges.map((budget) => (
              <label
                key={budget.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.budgetRange === budget.id
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : errors.budgetRange 
                    ? 'border-red-300 hover:border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="budgetRange"
                  value={budget.id}
                  checked={formData.budgetRange === budget.id}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    formData.budgetRange === budget.id
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.budgetRange === budget.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <span className={`font-medium block ${
                      formData.budgetRange === budget.id ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      {budget.label}
                    </span>
                    <span className="text-sm text-gray-500">{budget.price}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.budgetRange && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.budgetRange}
            </p>
          )}
        </div>

        {/* Accommodation Preference */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-semibold text-base">Accommodation Preference *</label>
          <div className="space-y-3">
            {accommodations.map((accommodation) => (
              <label
                key={accommodation}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.accommodation === accommodation
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : errors.accommodation 
                    ? 'border-red-300 hover:border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="accommodation"
                  value={accommodation}
                  checked={formData.accommodation === accommodation}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    formData.accommodation === accommodation
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.accommodation === accommodation && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    formData.accommodation === accommodation ? 'text-teal-700' : 'text-gray-700'
                  }`}>
                    {accommodation}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.accommodation && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.accommodation}
            </p>
          )}
        </div>

        {/* Transportation Needed */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-semibold text-base">Transportation Needed *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {transportationOptions.map((transport) => (
              <label
                key={transport}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.transportation === transport
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : errors.transportation 
                    ? 'border-red-300 hover:border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="transportation"
                  value={transport}
                  checked={formData.transportation === transport}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    formData.transportation === transport
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.transportation === transport && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`font-medium text-sm ${
                    formData.transportation === transport ? 'text-teal-700' : 'text-gray-700'
                  }`}>
                    {transport}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.transportation && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.transportation}
            </p>
          )}
        </div>

        {/* Tour Guide */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-semibold text-base">Tour Guide</label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="tourGuide"
                value="yes"
                checked={formData.tourGuide === 'yes'}
                onChange={onInputChange}
                className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <span className="ml-3 font-medium text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tourGuide"
                value="no"
                checked={formData.tourGuide === 'no'}
                onChange={onInputChange}
                className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <span className="ml-3 font-medium text-gray-700">No</span>
            </label>
          </div>
          <p className="text-sm text-gray-500">Optional - Add a professional tour guide to enhance your experience</p>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold text-base">Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={onInputChange}
            rows={4}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md resize-none"
            placeholder="Any special requests or additional information we should know about your trip..."
          />
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
            onClick={validateAndContinue}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
