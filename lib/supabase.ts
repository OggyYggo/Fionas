import { createClient } from '@supabase/supabase-js'
import { Booking, CreateBookingRequest, CreateBookingResponse, UpdateBookingRequest, UpdateBookingResponse, GetBookingsResponse } from '@/types/supabase'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key' 
                       ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                       : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Booking service functions
export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      // Format data for Supabase
      const dbData = {
        full_name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        tour_type: bookingData.tourType.toLowerCase().replace(' tour', ''),
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        number_of_guests: parseInt(bookingData.numberOfGuests.toString()) || 1,
        budget_range: bookingData.budgetRange?.toLowerCase().split(' ')[0] || 'standard',
        interests: bookingData.interests,
        destinations: bookingData.destinations,
        additional_notes: bookingData.additionalNotes
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(dbData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return {
          success: false,
          message: error.message || 'Failed to create booking'
        }
      }

      return {
        success: true,
        message: 'Booking created successfully!',
        data: {
          bookingId: data.id,
          bookingNumber: data.booking_number,
          status: data.status,
          estimatedResponseTime: '24 hours'
        }
      }
    } catch (error) {
      console.error('Booking service error:', error)
      return {
        success: false,
        message: 'Internal server error'
      }
    }
  }

  // Get bookings with filtering
  static async getBookings(filters?: {
    status?: string
    email?: string
    bookingId?: string
    limit?: number
    offset?: number
  }): Promise<GetBookingsResponse> {
    try {
      let query = supabase
        .from('bookings')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.email) {
        query = query.eq('email', filters.email)
      }
      if (filters?.bookingId) {
        query = query.eq('id', filters.bookingId)
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      // Order by creation date
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) {
        console.error('Supabase error:', error)
        return {
          success: false,
          data: [],
          total: 0
        }
      }

      return {
        success: true,
        data: data || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Booking service error:', error)
      return {
        success: false,
        data: [],
        total: 0
      }
    }
  }

  // Update booking
  static async updateBooking(updateData: UpdateBookingRequest): Promise<UpdateBookingResponse> {
    try {
      const dbData: any = {}
      
      if (updateData.status) {
        dbData.status = updateData.status
        if (updateData.status === 'confirmed') {
          dbData.confirmed_at = new Date().toISOString()
        } else if (updateData.status === 'cancelled') {
          dbData.cancelled_at = new Date().toISOString()
        }
      }
      
      if (updateData.adminNotes) {
        dbData.admin_notes = updateData.adminNotes
      }
      
      if (updateData.additionalNotes !== undefined) {
        dbData.additional_notes = updateData.additionalNotes
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(dbData)
        .eq('id', updateData.bookingId)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return {
          success: false,
          message: error.message || 'Failed to update booking'
        }
      }

      return {
        success: true,
        message: 'Booking updated successfully!',
        data
      }
    } catch (error) {
      console.error('Booking service error:', error)
      return {
        success: false,
        message: 'Internal server error'
      }
    }
  }

  // Delete booking
  static async deleteBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        console.error('Supabase error:', error)
        return {
          success: false,
          message: error.message || 'Failed to delete booking'
        }
      }

      return {
        success: true,
        message: 'Booking deleted successfully!'
      }
    } catch (error) {
      console.error('Booking service error:', error)
      return {
        success: false,
        message: 'Internal server error'
      }
    }
  }

  // Get booking statistics (for admin dashboard)
  static async getBookingStats(): Promise<{
    success: boolean
    data?: {
      totalBookings: number
      pendingBookings: number
      confirmedBookings: number
      cancelledBookings: number
      totalRevenue: number
    }
  }> {
    try {
      // Get counts by status
      const { data: statusData, error: statusError } = await supabase
        .from('bookings')
        .select('status, total_price')

      if (statusError) {
        console.error('Supabase error:', statusError)
        return { success: false }
      }

      const stats = {
        totalBookings: statusData?.length || 0,
        pendingBookings: statusData?.filter((b: any) => b.status === 'pending').length || 0,
        confirmedBookings: statusData?.filter((b: any) => b.status === 'confirmed').length || 0,
        cancelledBookings: statusData?.filter((b: any) => b.status === 'cancelled').length || 0,
        totalRevenue: statusData?.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0) || 0
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Booking service error:', error)
      return { success: false }
    }
  }
}

// Tour packages service
export class TourPackageService {
  static async getTourPackages(filters?: {
    tourType?: string
    budgetRange?: string
    featured?: boolean
    active?: boolean
  }) {
    try {
      let query = supabase
        .from('tours')
        .select('*')

      if (filters?.tourType) {
        query = query.eq('tag', filters.tourType)
      }
      if (filters?.budgetRange) {
        // For the simple tours table, we don't have budget_range, so we'll filter by price ranges
        // This is a simplified approach
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.active !== undefined) {
        // For the simple tours table, we don't have is_active, so we'll skip this filter
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Tour package service error:', error)
      return { success: false, data: [] }
    }
  }
}

// Destinations service
export class DestinationService {
  static async getDestinations(filters?: {
    category?: string
    featured?: boolean
    active?: boolean
  }) {
    try {
      let query = supabase
        .from('destinations')
        .select('*')

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.active !== undefined) {
        query = query.eq('is_active', filters.active)
      }

      const { data, error } = await query.order('name')

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, data: [] }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Destination service error:', error)
      return { success: false, data: [] }
    }
  }
}

// Authentication helpers
export class AuthService {
  static async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Auth service error:', error)
      return { success: false, message: 'Internal server error' }
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { success: false, message: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Auth service error:', error)
      return { success: false, message: 'Internal server error' }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Supabase auth error:', error)
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Auth service error:', error)
      return { success: false, message: 'Internal server error' }
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return { success: true, user }
    } catch (error) {
      console.error('Auth service error:', error)
      return { success: false, user: null }
    }
  }
}

export default supabase
