'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ContactStepProps {
  formData: {
    destination: string
    startDate: Date | null
    endDate: Date | null
    adults: number
    children: number
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onDateChange: (date: Date | null, fieldName: 'startDate' | 'endDate') => void
  onGuestChange: (type: 'adults' | 'children', value: number) => void
  onContinue: () => void
  onCancel: () => void
  showAlert?: (message: string) => void
}

const destinations = [
  'Bohol Countryside Tour',
  'Panglao Island Tour',
  'Island Hopping',
  'Danao Adventure Park',
  'Custom Tour'
]

export default function ContactStep({ 
  formData, 
  onInputChange, 
  onDateChange, 
  onGuestChange,
  onContinue, 
  onCancel, 
  showAlert 
}: ContactStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndContinue = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.destination) {
      newErrors.destination = 'Please select a destination'
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (formData.adults === 0 && formData.children === 0) {
      newErrors.guests = 'Please select at least one guest'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please fill in all required information correctly.')
      }
      return
    }
    
    setErrors({})
    onContinue()
  }

  // Calculate trip duration
  const calculateTripDuration = () => {
    if (!formData.startDate || !formData.endDate) {
      return 0
    }
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Include both start and end dates
    return diffDays
  }

  const tripDuration = calculateTripDuration()
  const getDurationText = () => {
    if (tripDuration === 0) return 'Select dates to calculate duration'
    if (tripDuration === 1) return '1 Day'
    return `${tripDuration} Days`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Trip Details</h2>
      <p className="text-gray-600 mb-8">Tell us about your dream trip to Bohol</p>
      
      <form className="space-y-8">
        {/* Destination */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold text-base mb-3">Destination *</label>
          <select
            name="destination"
            value={formData.destination}
            onChange={onInputChange}
            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md appearance-none bg-no-repeat ${
              errors.destination ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem 1.5rem'
            }}
          >
            <option value="" className="text-gray-400">Choose your destination</option>
            {destinations.map(dest => (
              <option key={dest} value={dest} className="text-gray-700">{dest}</option>
            ))}
          </select>
          {errors.destination && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.destination}
            </p>
          )}
        </div>

        {/* Date Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-base mb-3">Start Date *</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date: Date | null) => onDateChange(date, 'startDate')}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md ${
                errors.startDate ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              placeholderText="Select start date"
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-base mb-3">End Date (Optional)</label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date: Date | null) => onDateChange(date, 'endDate')}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-sm hover:shadow-md"
              placeholderText="Select end date"
              minDate={formData.startDate || new Date()}
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        {/* Trip Duration - Auto-calculated */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold text-base mb-3">Trip Duration</label>
          <div className={`px-5 py-4 border-2 rounded-xl bg-gray-50 border-gray-200 ${
            tripDuration > 0 ? 'text-gray-800 font-medium' : 'text-gray-400'
          }`}>
            {getDurationText()}
          </div>
          {tripDuration > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Calculated from {formData.startDate?.toLocaleDateString()} to {formData.endDate?.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Number of Guests */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold text-base mb-3">Number of Guests *</label>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Adults</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => onGuestChange('adults', Math.max(0, formData.adults - 1))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-colors font-semibold text-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-gray-800">{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() => onGuestChange('adults', formData.adults + 1)}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-teal-500 transition-colors font-semibold text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Children</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => onGuestChange('children', Math.max(0, formData.children - 1))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-purple-500 transition-colors font-semibold text-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-xl text-gray-800">{formData.children}</span>
                  <button
                    type="button"
                    onClick={() => onGuestChange('children', formData.children + 1)}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-purple-500 transition-colors font-semibold text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          {errors.guests && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.guests}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-10 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-base"
          >
            Cancel
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
