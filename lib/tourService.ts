import { Tour } from '@/types/tour'

export interface TourService {
  getAllTours(): Promise<Tour[]>
  getTourById(id: number): Promise<Tour | null>
  createTour(tourData: Omit<Tour, 'id'>): Promise<Tour>
  updateTour(id: number, tourData: Partial<Tour>): Promise<Tour | null>
  deleteTour(id: number): Promise<boolean>
  saveImage(file: File): Promise<string>
}

class HybridTourService implements TourService {
  private isSupabaseAvailable: boolean = false
  private fallbackTours: Tour[] = []

  constructor() {
    this.initializeService()
  }

  private async initializeService() {
    try {
      console.log('🔍 Initializing tour service...')
      
      // Test Supabase connection
      const { supabase } = await import('@/lib/supabase')
      console.log('🔍 Supabase client loaded')
      
      const { error } = await supabase.from('tours').select('count').single()
      
      if (!error) {
        this.isSupabaseAvailable = true
        console.log('✅ Using Supabase for tour management')
      } else {
        console.log('❌ Supabase not available, using fallback storage')
        console.log('❌ Error:', error.message)
        await this.loadFallbackTours()
      }
    } catch (error) {
      console.log('❌ Supabase connection failed, using fallback storage')
      console.log('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
      await this.loadFallbackTours()
    }
  }

  private async loadFallbackTours() {
    try {
      // Load from the original tours file as fallback
      const { tours } = await import('@/app/tours/data/tours')
      this.fallbackTours = [...tours]
    } catch (error) {
      console.error('Error loading fallback tours:', error)
      this.fallbackTours = []
    }
  }

  private async saveFallbackTours() {
    try {
      // In a real implementation, you'd save to a file or localStorage
      // For now, we'll just keep it in memory
      console.log('Tours saved to fallback storage')
    } catch (error) {
      console.error('Error saving fallback tours:', error)
    }
  }

  async getAllTours(): Promise<Tour[]> {
    if (this.isSupabaseAvailable) {
      return this.getSupabaseTours()
    } else {
      return this.fallbackTours
    }
  }

  async getTourById(id: number): Promise<Tour | null> {
    if (this.isSupabaseAvailable) {
      return this.getSupabaseTourById(id)
    } else {
      return this.fallbackTours.find(tour => tour.id === id) || null
    }
  }

  async createTour(tourData: Omit<Tour, 'id'>): Promise<Tour> {
    console.log('🔍 createTour called with:', tourData)
    console.log('🔍 isSupabaseAvailable:', this.isSupabaseAvailable)
    
    if (this.isSupabaseAvailable) {
      console.log('🔍 Using Supabase to create tour')
      return this.createSupabaseTour(tourData)
    } else {
      console.log('🔍 Using fallback to create tour')
      return this.createFallbackTour(tourData)
    }
  }

  async updateTour(id: number, tourData: Partial<Tour>): Promise<Tour | null> {
    if (this.isSupabaseAvailable) {
      return this.updateSupabaseTour(id, tourData)
    } else {
      return this.updateFallbackTour(id, tourData)
    }
  }

  async deleteTour(id: number): Promise<boolean> {
    if (this.isSupabaseAvailable) {
      return this.deleteSupabaseTour(id)
    } else {
      return this.deleteFallbackTour(id)
    }
  }

  async saveImage(file: File): Promise<string> {
    if (this.isSupabaseAvailable) {
      return this.saveSupabaseImage(file)
    } else {
      return this.saveFallbackImage(file)
    }
  }

  // Supabase methods
  private async getSupabaseTours(): Promise<Tour[]> {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tours:', error)
        return []
      }

      return (data || []).map(tour => ({
        ...tour,
        maxPeople: tour.max_people
      }))
    } catch (error) {
      console.error('Error fetching tours:', error)
      return []
    }
  }

  private async getSupabaseTourById(id: number): Promise<Tour | null> {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching tour:', error)
        return null
      }

      return {
        ...data,
        maxPeople: data.max_people
      }
    } catch (error) {
      console.error('Error fetching tour:', error)
      return null
    }
  }

  private async createSupabaseTour(tourData: Omit<Tour, 'id'>): Promise<Tour> {
    try {
      console.log('🔍 Attempting to save tour to Supabase:', tourData)
      
      const { supabase } = await import('@/lib/supabase')
      const dbData = {
        title: tourData.title,
        description: tourData.description,
        image: tourData.image,
        duration: tourData.duration,
        max_people: tourData.maxPeople,
        price: tourData.price,
        tag: tourData.tag,
        featured: tourData.featured
      }

      console.log('🔍 Prepared data for Supabase:', dbData)

      const { data, error } = await supabase
        .from('tours')
        .insert([dbData])
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        throw new Error(error.message)
      }

      console.log('✅ Tour saved to Supabase successfully:', data)

      return {
        ...data,
        maxPeople: data.max_people
      }
    } catch (error) {
      console.error('❌ Error creating tour:', error)
      throw error
    }
  }

  private async updateSupabaseTour(id: number, tourData: Partial<Tour>): Promise<Tour | null> {
    try {
      const { supabase } = await import('@/lib/supabase')
      const dbData: any = {}
      
      if (tourData.title) dbData.title = tourData.title
      if (tourData.description) dbData.description = tourData.description
      if (tourData.image) dbData.image = tourData.image
      if (tourData.duration) dbData.duration = tourData.duration
      if (tourData.maxPeople) dbData.max_people = tourData.maxPeople
      if (tourData.price) dbData.price = tourData.price
      if (tourData.tag) dbData.tag = tourData.tag
      if (tourData.featured !== undefined) dbData.featured = tourData.featured

      const { data, error } = await supabase
        .from('tours')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating tour:', error)
        return null
      }

      return {
        ...data,
        maxPeople: data.max_people
      }
    } catch (error) {
      console.error('Error updating tour:', error)
      return null
    }
  }

  private async deleteSupabaseTour(id: number): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting tour:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting tour:', error)
      return false
    }
  }

  private async saveSupabaseImage(file: File): Promise<string> {
    try {
      const { supabase } = await import('@/lib/supabase')
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `tours/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        throw new Error(uploadError.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }

  // Fallback methods
  private createFallbackTour(tourData: Omit<Tour, 'id'>): Promise<Tour> {
    return new Promise((resolve) => {
      const newId = Math.max(...this.fallbackTours.map(t => t.id), 0) + 1
      const newTour: Tour = { ...tourData, id: newId }
      
      this.fallbackTours.push(newTour)
      this.saveFallbackTours()
      
      console.log('Tour created with fallback storage:', newTour)
      resolve(newTour)
    })
  }

  private updateFallbackTour(id: number, tourData: Partial<Tour>): Promise<Tour | null> {
    return new Promise((resolve) => {
      const tourIndex = this.fallbackTours.findIndex(tour => tour.id === id)
      
      if (tourIndex === -1) {
        resolve(null)
        return
      }

      this.fallbackTours[tourIndex] = { ...this.fallbackTours[tourIndex], ...tourData }
      this.saveFallbackTours()
      
      console.log('Tour updated with fallback storage:', this.fallbackTours[tourIndex])
      resolve(this.fallbackTours[tourIndex])
    })
  }

  private deleteFallbackTour(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      const initialLength = this.fallbackTours.length
      this.fallbackTours = this.fallbackTours.filter(tour => tour.id !== id)
      
      if (this.fallbackTours.length < initialLength) {
        this.saveFallbackTours()
        console.log('Tour deleted with fallback storage:', id)
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  private saveFallbackImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      // For fallback, create a fake URL or use a placeholder
      const fakeUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
      console.log('Image saved with fallback storage:', fakeUrl)
      resolve(fakeUrl)
    })
  }
}

export const tourService: TourService = new HybridTourService()
