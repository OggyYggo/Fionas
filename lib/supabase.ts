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
      console.log('🔍 BookingService: Creating booking with data:', bookingData)
      
      // Check Supabase connection
      console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔍 Supabase client initialized:', !!supabase)
      
      // Test basic Supabase connection first
      try {
        const { data: testData, error: testError } = await supabase
          .from('bookings')
          .select('id')
          .limit(1)
        
        console.log('🔍 Supabase connection test:', { testData, testError })
        
        if (testError) {
          console.error('❌ Supabase connection test failed:', testError)
          return {
            success: false,
            message: `Database connection failed: ${testError.message || 'Unknown error'}`
          }
        }
      } catch (connectionError) {
        console.error('❌ Supabase connection error:', connectionError)
        return {
          success: false,
          message: `Cannot connect to database: ${connectionError instanceof Error ? connectionError.message : 'Unknown error'}`
        }
      }
      
      // Only use fields that exist in the current database schema (now with custom fields)
      const dbData = {
        full_name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        tour_type: bookingData.tourType, // Main tour type (custom, countryside, etc.)
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        number_of_guests: parseInt(bookingData.numberOfGuests.toString()) || 1,
        budget_range: bookingData.budgetRange?.toLowerCase() || 'standard',
        additional_notes: bookingData.additionalNotes,
        
        // New custom tour fields (excluding travel_type to avoid conflict)
        destination: bookingData.destination || null,
        adults: bookingData.adults || 1,
        children: bookingData.children || 0,
        // Store travel preference in additional_notes to avoid field conflict
        activities: bookingData.activities || [],
        other_activity: bookingData.otherActivity || null,
        accommodation: bookingData.accommodation || null,
        transportation: bookingData.transportation || null,
        tour_guide: bookingData.tourGuide || null,
        special_requests: bookingData.specialRequests || null
      }

      // Add travel preference to additional_notes to avoid field conflict
      if (bookingData.travelType) {
        dbData.additional_notes = `${dbData.additional_notes || ''}\n\nTravel Preference: ${bookingData.travelType}`
      }

      console.log('🔍 BookingService: Using existing schema fields:', dbData)

      // Generate a unique booking number
      const generateBookingNumber = () => {
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 8).toUpperCase()
        return `BK-${timestamp}-${random}`
      }

      // Map form budget range to database enum values
      const mapBudgetRange = (formBudget: string) => {
        const budgetMapping: { [key: string]: string } = {
          'budget': 'standard',
          'standard': 'standard', 
          'premium': 'premium',
          'luxury': 'luxury',
          'ultra_luxury': 'ultra_luxury'
        }
        return budgetMapping[formBudget] || 'standard'
      }

      // Let's try with just the essential fields first to isolate the issue
      const essentialData = {
        booking_number: generateBookingNumber(),
        full_name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        tour_type: bookingData.tourType,
        number_of_guests: parseInt(bookingData.numberOfGuests.toString()) || 1,
        budget_range: mapBudgetRange(bookingData.budgetRange || 'standard') as any
      }

      console.log('🔍 BookingService: Trying with essential fields only:', essentialData)

      try {
        console.log('🔍 About to execute Supabase insert...')
        const result = await supabase
          .from('bookings')
          .insert(essentialData)  // Use essential data first
          .select()
        
        console.log('🔍 Supabase insert completed, processing response...')
        
        const { data, error } = result
        console.log('🔍 BookingService: Insert response - data length:', data?.length)
        console.log('🔍 BookingService: Insert response - error present:', !!error)

        if (error) {
          console.error('❌ Insert failed - error object:', error)
          console.error('❌ Error type:', typeof error)
          console.error('❌ Error keys:', Object.keys(error))
          console.error('❌ Error details:', {
            message: error?.message || 'No message',
            details: error?.details || 'No details', 
            hint: error?.hint || 'No hint',
            code: error?.code || 'No code'
          })
          return {
            success: false,
            message: `Database error: ${error?.message || 'Unknown error occurred'}`
          }
        }

        if (!data || data.length === 0) {
          console.error('❌ No data returned from insert')
          return {
            success: false,
            message: 'No data returned from database'
          }
        }

        const insertedRecord = data[0]
        console.log('✅ BookingService: Booking created successfully - ID:', insertedRecord.id)
        return {
          success: true,
          message: 'Booking created successfully!',
          data: {
            bookingId: insertedRecord.id || 'unknown',
            bookingNumber: insertedRecord.booking_number || 'unknown',
            status: insertedRecord.status || 'pending',
            estimatedResponseTime: '24 hours'
          }
        }
      } catch (supabaseError) {
        console.error('❌ Supabase operation threw an exception:', supabaseError)
        return {
          success: false,
          message: `Supabase operation failed: ${supabaseError instanceof Error ? supabaseError.message : 'Unknown error'}`
        }
      }
    } catch (error) {
      console.error('❌ Booking service error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        message: `Internal server error: ${errorMessage}`
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
      console.log('🔍 BookingService: Attempting to delete booking:', bookingId)
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      console.log('🔍 BookingService: Delete result:', { error })

      if (error) {
        console.error('❌ BookingService: Supabase error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return {
          success: false,
          message: error.message || 'Failed to delete booking'
        }
      }

      console.log('✅ BookingService: Delete successful')
      return {
        success: true,
        message: 'Booking deleted successfully!'
      }
    } catch (error) {
      console.error('❌ BookingService: Booking service error:', error)
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
