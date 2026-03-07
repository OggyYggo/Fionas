'use client'

import { useState } from 'react'

interface InterestsStepProps {
  formData: {
    activities: string[]
    otherActivity: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onActivitiesChange: (activities: string[]) => void
  onContinue: () => void
  onBack: () => void
  showAlert?: (message: string) => void
}

const activities = [
  'Chocolate Hills',
  'Tarsier Sanctuary',
  'Loboc River Cruise',
  'Panglao Island Hopping',
  'Snorkeling / Diving',
  'Dolphin Watching',
  'Danao Adventure Park',
  'Waterfalls Tour',
  'Cultural / Heritage Tour',
  'Food Experience'
]

export default function InterestsStep({ 
  formData, 
  onInputChange, 
  onActivitiesChange,
  onContinue, 
  onBack,
  showAlert 
}: InterestsStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndContinue = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.activities.length === 0 && !formData.otherActivity.trim()) {
      newErrors.activities = 'Please select at least one activity or specify other interests'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please select at least one activity or specify other interests.')
      }
      return
    }
    
    setErrors({})
    onContinue()
  }

  const handleActivityToggle = (activity: string) => {
    const newActivities = formData.activities.includes(activity)
      ? formData.activities.filter(a => a !== activity)
      : [...formData.activities, activity]
    onActivitiesChange(newActivities)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Experiences</h2>
        <p className="text-gray-600">Select the activities you’d like to enjoy during your trip in Bohol.</p>
      </div>
      
      <form className="space-y-8">
        {/* Select Activities */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-semibold text-base">Select Activities *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <label
                key={activity}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.activities.includes(activity)
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : errors.activities 
                    ? 'border-red-300 hover:border-red-400 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.activities.includes(activity)}
                  onChange={() => handleActivityToggle(activity)}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                    formData.activities.includes(activity)
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.activities.includes(activity) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium ${
                    formData.activities.includes(activity) ? 'text-teal-700' : 'text-gray-700'
                  }`}>
                    {activity}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.activities && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.activities}
            </p>
          )}
        </div>

        {/* Other Activity */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold text-base">Other Activity</label>
          <p className="text-sm text-gray-500 mb-3">Optional - Tell us about any other specific activities you'd like to experience</p>
          <textarea
            name="otherActivity"
            value={formData.otherActivity}
            onChange={onInputChange}
            rows={3}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md resize-none"
            placeholder="Example: Sunset cruise, Private photography tour, Local cooking class..."
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
