import { Booking } from '@/types/booking'

export class SimpleBookingService {
  private static async getSupabase() {
    try {
      const { supabase } = await import('@/lib/supabase')
      console.log('🔍 SimpleBookingService: Supabase import successful')
      
      // Test connection using bookings table
      const { data, error } = await supabase.from('bookings').select('count').limit(1)
      if (error) {
        console.error('❌ SimpleBookingService: Supabase connection test failed:', error)
        throw new Error(`Database connection failed: ${error.message}`)
      }
      
      console.log('✅ SimpleBookingService: Supabase connection test passed')
      return supabase
    } catch (error) {
      console.error('❌ SimpleBookingService: Failed to get Supabase client:', error)
      throw error
    }
  }

  static async getAllBookings(): Promise<Booking[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching bookings:', error)
        throw new Error(error.message)
      }

      return (data || []).map(booking => ({
        id: booking.id,
        customer: booking.full_name || booking.customer_name || 'Unknown',
        email: booking.email,
        tour: booking.tour_type || booking.tour_name || 'Unknown Tour',
        destination: booking.destination || '',
        date: booking.start_date || booking.booking_date || new Date().toISOString().split('T')[0],
        endDate: booking.end_date || '',
        status: booking.status,
        amount: booking.total_price || booking.amount || '₱0',
        participants: booking.number_of_guests || booking.participants || 1,
        adults: booking.adults || 0,
        children: booking.children || 0,
        tourType: booking.tour_type || '',
        activities: booking.activities || [],
        otherActivity: booking.other_activity || '',
        accommodation: booking.accommodation || '',
        transportation: booking.transportation || '',
        tourGuide: booking.tour_guide || '',
        specialRequests: booking.special_requests || '',
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      }))
    } catch (error) {
      console.error('❌ Error in getAllBookings:', error)
      throw error
    }
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching booking:', error)
        return null
      }

      return {
        id: data.id,
        customer: data.full_name || data.customer_name || 'Unknown',
        email: data.email,
        tour: data.tour_type || data.tour_name || 'Unknown Tour',
        destination: data.destination || '',
        date: data.start_date || data.booking_date || new Date().toISOString().split('T')[0],
        endDate: data.end_date || '',
        status: data.status,
        amount: data.total_price || data.amount || '₱0',
        participants: data.number_of_guests || data.participants || 1,
        adults: data.adults || 0,
        children: data.children || 0,
        tourType: data.tour_type || '',
        activities: data.activities || [],
        otherActivity: data.other_activity || '',
        accommodation: data.accommodation || '',
        transportation: data.transportation || '',
        tourGuide: data.tour_guide || '',
        specialRequests: data.special_requests || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('❌ Error in getBookingById:', error)
      return null
    }
  }

  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    try {
      console.log('🔍 SimpleBookingService: Creating booking:', bookingData)
      
      const supabase = await this.getSupabase()
      
      const dbData = {
        full_name: bookingData.customer,
        email: bookingData.email,
        tour_type: bookingData.tour,
        start_date: bookingData.date,
        status: bookingData.status,
        total_price: bookingData.amount,
        number_of_guests: bookingData.participants
      }

      console.log('🔍 SimpleBookingService: Prepared data for DB:', dbData)

      const { data, error } = await supabase
        .from('bookings')
        .insert([dbData])
        .select()
        .single()

      console.log('🔍 SimpleBookingService: Insert response:', { data, error })

      if (error) {
        console.error('❌ SimpleBookingService: Insert error:', error)
        throw new Error(error.message)
      }

      if (!data) {
        console.error('❌ SimpleBookingService: No data returned from insert')
        throw new Error('Failed to create booking: No data returned')
      }

      console.log('✅ SimpleBookingService: Booking saved successfully:', data)

      return {
        id: data.id,
        customer: data.full_name || data.customer_name || 'Unknown',
        email: data.email,
        tour: data.tour_type || data.tour_name || 'Unknown Tour',
        destination: data.destination || '',
        date: data.start_date || data.booking_date || new Date().toISOString().split('T')[0],
        endDate: data.end_date || '',
        status: data.status,
        amount: data.total_price || data.amount || '₱0',
        participants: data.number_of_guests || data.participants || 1,
        adults: data.adults || 0,
        children: data.children || 0,
        tourType: data.tour_type || '',
        activities: data.activities || [],
        otherActivity: data.other_activity || '',
        accommodation: data.accommodation || '',
        transportation: data.transportation || '',
        tourGuide: data.tour_guide || '',
        specialRequests: data.special_requests || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('❌ SimpleBookingService: Error creating booking:', error)
      throw error
    }
  }

  static async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking | null> {
    try {
      console.log('🔍 SimpleBookingService: Updating booking:', { id, bookingData })
      
      const supabase = await this.getSupabase()
      
      const dbData: any = {}
      
      if (bookingData.customer) dbData.full_name = bookingData.customer
      if (bookingData.email) dbData.email = bookingData.email
      if (bookingData.tour) dbData.tour_type = bookingData.tour
      if (bookingData.date) dbData.start_date = bookingData.date
      if (bookingData.status) dbData.status = bookingData.status
      if (bookingData.amount) dbData.total_price = bookingData.amount
      if (bookingData.participants) dbData.number_of_guests = bookingData.participants

      console.log('🔍 SimpleBookingService: Prepared update data:', dbData)

      const { data, error } = await supabase
        .from('bookings')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      console.log('🔍 SimpleBookingService: Update response:', { data, error })

      if (error) {
        console.error('❌ SimpleBookingService: Update error:', error)
        return null
      }

      if (!data) {
        console.error('❌ SimpleBookingService: No data returned from update')
        return null
      }

      console.log('✅ SimpleBookingService: Booking updated successfully:', data)

      return {
        id: data.id,
        customer: data.full_name || data.customer_name || 'Unknown',
        email: data.email,
        tour: data.tour_type || data.tour_name || 'Unknown Tour',
        destination: data.destination || '',
        date: data.start_date || data.booking_date || new Date().toISOString().split('T')[0],
        endDate: data.end_date || '',
        status: data.status,
        amount: data.total_price || data.amount || '₱0',
        participants: data.number_of_guests || data.participants || 1,
        adults: data.adults || 0,
        children: data.children || 0,
        tourType: data.tour_type || '',
        activities: data.activities || [],
        otherActivity: data.other_activity || '',
        accommodation: data.accommodation || '',
        transportation: data.transportation || '',
        tourGuide: data.tour_guide || '',
        specialRequests: data.special_requests || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('❌ SimpleBookingService: Error in updateBooking:', error)
      return null
    }
  }

  static async deleteBooking(id: string): Promise<boolean> {
    try {
      console.log('🔍 SimpleBookingService: Attempting to delete booking with ID:', id)
      
      const supabase = await this.getSupabase()
      console.log('🔍 SimpleBookingService: Supabase client obtained for delete')
      
      // First check if booking exists
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('id', id)
        .single()

      console.log('🔍 SimpleBookingService: Booking check result:', { existingBooking, checkError })

      if (checkError) {
        console.error('❌ SimpleBookingService: Error checking booking existence:', checkError)
        return false
      }

      if (!existingBooking) {
        console.error('❌ SimpleBookingService: Booking does not exist:', id)
        return false
      }

      console.log('✅ SimpleBookingService: Booking exists, proceeding with delete')

      // Now delete the booking
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      console.log('🔍 SimpleBookingService: Delete operation result:', { deleteError })

      if (deleteError) {
        console.error('❌ SimpleBookingService: Delete error:', deleteError)
        console.error('❌ Error details:', {
          message: deleteError.message,
          details: deleteError.details,
          hint: deleteError.hint,
          code: deleteError.code
        })
        return false
      }

      console.log('✅ SimpleBookingService: Delete operation completed successfully')
      return true
    } catch (error) {
      console.error('❌ SimpleBookingService: Error in deleteBooking:', error)
      console.error('❌ Full error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      return false
    }
  }

  static async getBookingStats(): Promise<{
    total: number
    confirmed: number
    pending: number
    completed: number
    cancelled: number
    revenue: string
  }> {
    try {
      const bookings = await this.getAllBookings()
      
      const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings
          .filter(b => b.status === 'confirmed' || b.status === 'completed')
          .reduce((total, booking) => {
            const amount = parseFloat(booking.amount.replace('₱', '').replace(',', ''))
            return total + amount
          }, 0)
          .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
      }

      return stats
    } catch (error) {
      console.error('❌ Error in getBookingStats:', error)
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        revenue: '₱0'
      }
    }
  }
}
