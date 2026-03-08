export interface Tour {
  id: number
  title: string
  description: string
  image: string
  gallery_urls?: string[] // Support for up to 5 photos
  tourType?: 'Destinations' | 'Package'
  duration: string
  maxPeople: string
  price: string
  tag: string
  featured: boolean
  created_at?: string
  updated_at?: string
  highlights?: string[]
  included?: string[]
  notIncluded?: string[]
  pricing?: {
    local: Array<{ pax: number | string; price: string }>
    foreigner: Array<{ pax: number | string; price: string }>
  }
}
