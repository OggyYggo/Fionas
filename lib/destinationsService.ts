import { Tour } from '@/types/tour'

export interface PaginatedDestinationsResponse {
  destinations: Tour[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export class DestinationsService {
  private static async getSupabase() {
    try {
      const { supabase } = await import('@/lib/supabase')
      console.log('🔍 DestinationsService: Supabase import successful')
      
      // Test connection using tours table (destinations are stored in tours table with tour_type='Destinations')
      const { error } = await supabase
        .from('tours')
        .select('id', { head: true, count: 'exact' })
        .eq('tour_type', 'Destinations')
      if (error) {
        console.error('❌ DestinationsService: Supabase connection test failed:', error)
        throw new Error(`Database connection failed: ${error.message}`)
      }
      
      console.log('✅ DestinationsService: Supabase connection test passed')
      return supabase
    } catch (error) {
      console.error('❌ DestinationsService: Failed to get Supabase client:', error)
      throw error
    }
  }

  static async getDestinationsPaginated(
    page: number = 1,
    limit: number = 9,
    search?: string,
    category?: string
  ): Promise<PaginatedDestinationsResponse> {
    try {
      const supabase = await this.getSupabase()
      
      let query = supabase
        .from('tours')
        .select('*', { count: 'exact' })
        .eq('tour_type', 'Destinations') // Only get destinations
      
      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }
      
      if (category && category !== 'All Categories') {
        query = query.eq('tag', category)
      }
      
      // Apply pagination and ordering
      const { data, error, count } = await query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) {
        console.error('❌ Error fetching paginated destinations:', error)
        throw new Error(error.message)
      }

      const destinations = (data || []).map(destination => ({
        ...destination,
        maxPeople: destination.max_people,
        notIncluded: destination.not_included,
        tourType: 'Destinations'
      }))
      
      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / limit)

      return {
        destinations,
        totalCount,
        currentPage: page,
        totalPages
      }
    } catch (error) {
      console.error('❌ Error in getDestinationsPaginated:', error)
      throw error
    }
  }

  static async getAllDestinations(): Promise<Tour[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('tour_type', 'Destinations') // Only get destinations
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching destinations:', error)
        throw new Error(error.message)
      }

      return (data || []).map(destination => ({
        ...destination,
        maxPeople: destination.max_people,
        notIncluded: destination.not_included,
        gallery_urls: destination.gallery_urls || [],
        tourType: 'Destinations'
      }))
    } catch (error) {
      console.error('❌ Error in getAllDestinations:', error)
      throw error
    }
  }

  static async getDestinationById(id: number): Promise<Tour | null> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .eq('tour_type', 'Destinations') // Only get destinations
        .single()

      if (error) {
        console.error('❌ Error fetching destination:', error)
        return null
      }

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: 'Destinations'
      }
    } catch (error) {
      console.error('❌ Error in getDestinationById:', error)
      return null
    }
  }

  static async createDestination(destinationData: Omit<Tour, 'id'>): Promise<Tour> {
    try {
      console.log('🔍 DestinationsService: Creating destination:', destinationData)
      
      const supabase = await this.getSupabase()
      console.log('🔍 DestinationsService: Supabase client obtained')

      const dbData = {
        title: destinationData.title,
        description: destinationData.description,
        image: destinationData.image,
        gallery_urls: destinationData.gallery_urls || [],
        tour_type: 'Destinations', // Always set to Destinations
        price: destinationData.price,
        tag: destinationData.tag,
        featured: destinationData.featured,
        highlights: destinationData.highlights || [],
        itinerary: destinationData.itinerary || [],
        included: destinationData.included || [],
        not_included: destinationData.notIncluded || [],
        why_choose: destinationData.why_choose || [],
        reviews: destinationData.reviews || [],
        faqs: destinationData.faqs || [],
        pricing: destinationData.pricing || {}
      }

      console.log('🔍 DestinationsService: Prepared data for DB:', dbData)

      console.log('🔍 DestinationsService: Making INSERT call to tours table...')
      const { data, error } = await supabase
        .from('tours')
        .insert([dbData])
        .select()
        .single()

      console.log('🔍 DestinationsService: Insert response:', { data, error })

      if (error) {
        console.error('❌ DestinationsService: Insert error:', error)
        throw new Error(error.message)
      }

      if (!data) {
        console.error('❌ DestinationsService: No data returned from insert')
        throw new Error('Failed to create destination: No data returned')
      }

      console.log('✅ DestinationsService: Destination saved successfully:', data)

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: 'Destinations'
      }
    } catch (error) {
      console.error('❌ DestinationsService: Error creating destination:', error)
      throw error
    }
  }

  static async updateDestination(id: number, destinationData: Partial<Tour>): Promise<Tour | null> {
    try {
      console.log('🔍 DestinationsService: Updating destination:', { id, destinationData })
      
      const supabase = await this.getSupabase()
      
      const dbData: any = {}
      
      if (destinationData.title) dbData.title = destinationData.title
      if (destinationData.description) dbData.description = destinationData.description
      if (destinationData.image) dbData.image = destinationData.image
      if (destinationData.price) dbData.price = destinationData.price
      if (destinationData.tag) dbData.tag = destinationData.tag
      if (destinationData.featured !== undefined) dbData.featured = destinationData.featured
      if (destinationData.gallery_urls) dbData.gallery_urls = destinationData.gallery_urls
      if (destinationData.highlights) dbData.highlights = destinationData.highlights
      if (destinationData.itinerary) dbData.itinerary = destinationData.itinerary
      if (destinationData.included) dbData.included = destinationData.included
      if (destinationData.notIncluded) dbData.not_included = destinationData.notIncluded
      if (destinationData.why_choose) dbData.why_choose = destinationData.why_choose
      if (destinationData.reviews) dbData.reviews = destinationData.reviews
      if (destinationData.faqs) dbData.faqs = destinationData.faqs
      if (destinationData.pricing) dbData.pricing = destinationData.pricing

      console.log('🔍 DestinationsService: Prepared update data:', dbData)

      const { data, error } = await supabase
        .from('tours')
        .update(dbData)
        .eq('id', id)
        .eq('tour_type', 'Destinations') // Ensure we only update destinations
        .select()
        .single()

      console.log('🔍 DestinationsService: Update response:', { data, error })

      if (error) {
        console.error('❌ DestinationsService: Update error:', error)
        return null
      }

      if (!data) {
        console.error('❌ DestinationsService: No data returned from update')
        return null
      }

      console.log('✅ DestinationsService: Destination updated successfully:', data)

      return {
        ...data,
        maxPeople: data.max_people,
        notIncluded: data.not_included,
        gallery_urls: data.gallery_urls || [],
        tourType: 'Destinations'
      }
    } catch (error) {
      console.error('❌ DestinationsService: Error in updateDestination:', error)
      return null
    }
  }

  static async deleteDestination(id: number): Promise<boolean> {
    try {
      const supabase = await this.getSupabase()
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id)
        .eq('tour_type', 'Destinations') // Ensure we only delete destinations

      if (error) {
        console.error('❌ Error deleting destination:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('❌ Error in deleteDestination:', error)
      return false
    }
  }

  static async saveImage(file: File): Promise<string> {
    try {
      console.log('🔍 DestinationsService: Starting image upload:', file.name, file.size, file.type)
      
      const supabase = await this.getSupabase()
      
      // Validate file
      if (!file) {
        throw new Error('No file provided')
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size must be less than 5MB')
      }
      
      const fileName = `${Date.now()}-destination-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `destinations/${fileName}`
      
      console.log('🔍 DestinationsService: Upload details:', { fileName, filePath, fileSize: file.size })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('🔍 DestinationsService: Upload response:', { uploadData, uploadError })

      if (uploadError) {
        console.error('❌ DestinationsService: Upload error:', uploadError)
        
        // Provide more specific error messages
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket "tour-images" not found. Please create it in Supabase Dashboard.')
        } else if (uploadError.message.includes('Permission')) {
          throw new Error('Permission denied. Check Supabase storage policies.')
        } else if (uploadError.message.includes('size')) {
          throw new Error('File too large. Maximum size is 5MB.')
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }
      }

      if (!uploadData) {
        console.error('❌ DestinationsService: No upload data returned')
        throw new Error('Upload failed: No data returned')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      console.log('✅ DestinationsService: Image uploaded successfully:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ DestinationsService: Error saving image:', error)
      throw error
    }
  }
}
