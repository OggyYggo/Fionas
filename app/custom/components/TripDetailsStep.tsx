'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface TripDetailsStepProps {
  formData: {
    startDate: Date | null
    endDate: Date | null
    numberOfGuests: string
    budgetRange: string
  }
  onDateChange: (date: Date | null, fieldName: 'startDate' | 'endDate') => void
  onInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onContinue: () => void
  onBack: () => void
  isClient: boolean
  showAlert?: (message: string) => void
}

export default function TripDetailsStep({ 
  formData, 
  onDateChange, 
  onInputChange, 
  onContinue, 
  onBack, 
  isClient,
  showAlert 
}: TripDetailsStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateAndContinue = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.numberOfGuests) {
      newErrors.numberOfGuests = 'Number of guests is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (showAlert) {
        showAlert('Please fill in all required trip details.')
      }
      return
    }
    
    setErrors({})
    onContinue()
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">Trip Details</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Date *</label>
          {isClient && (
            <DatePicker
              selected={formData.startDate}
              onChange={(date: Date | null) => onDateChange(date, 'startDate')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-600 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholderText="Select start date"
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              wrapperClassName="w-full"
            />
          )}
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">End Date (Optional)</label>
          {isClient && (
            <DatePicker
              selected={formData.endDate}
              onChange={(date: Date | null) => onDateChange(date, 'endDate')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
              placeholderText="Select end date"
              minDate={formData.startDate || new Date()}
              dateFormat="MMMM d, yyyy"
              wrapperClassName="w-full"
            />
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Number of Guests *</label>
          <div className="relative">
            <select
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={onInputChange}
              className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:border-teal-600 appearance-none ${
                errors.numberOfGuests ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select number of guests</option>
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
          {errors.numberOfGuests && (
            <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Budget Range</label>
          <div className="relative">
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={onInputChange}
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
      </form>
    </div>
  )
}
