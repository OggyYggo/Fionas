'use client'

import { useState } from 'react'

export default function BookingAPIDemo() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Example: Create a new booking
  const createBooking = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          tourType: 'Custom Tour',
          startDate: '2024-12-25',
          endDate: '2024-12-27',
          numberOfGuests: '2 Guests',
          budgetRange: 'Standard (₱5,000 - ₱10,000/person)',
          interests: ['beaches', 'adventure'],
          destinations: ['Chocolate Hills', 'Panglao Island'],
          additionalNotes: 'Please arrange airport pickup'
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  // Example: Get all bookings
  const getAllBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  // Example: Get pending bookings only
  const getPendingBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking?status=pending')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  // Example: Get booking by email
  const getBookingsByEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking?email=john@example.com')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  // Example: Update booking status
  const updateBookingStatus = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId,
          status: 'confirmed'
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  // Example: Delete a booking
  const deleteBooking = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/booking?bookingId=${bookingId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Network error' })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Booking API Demo</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={createBooking}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Create Booking
        </button>
        
        <button
          onClick={getAllBookings}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Get All Bookings
        </button>
        
        <button
          onClick={getPendingBookings}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Get Pending
        </button>
        
        <button
          onClick={getBookingsByEmail}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Get by Email
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">API Response:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">API Usage Examples:</h3>
        <div className="space-y-2 text-sm">
          <div><strong>POST /api/booking</strong> - Create new booking</div>
          <div><strong>GET /api/booking</strong> - Get all bookings</div>
          <div><strong>GET /api/booking?status=pending</strong> - Filter by status</div>
          <div><strong>GET /api/booking?email=user@example.com</strong> - Filter by email</div>
          <div><strong>PUT /api/booking</strong> - Update booking</div>
          <div><strong>DELETE /api/booking?bookingId=BK123</strong> - Delete booking</div>
        </div>
      </div>
    </div>
  )
}
