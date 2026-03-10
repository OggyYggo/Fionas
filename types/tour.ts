export interface Tour {
  id: number
  title: string
  description: string
  image: string
  gallery_urls?: string[] // Support for up to 5 photos
  images?: string[]
  tourType?: 'Destinations' | 'Package'
  price: string
  tag: string
  featured: boolean
  duration?: string
  maxPeople?: string
  created_at?: string
  updated_at?: string
  highlights?: string[]
  itinerary?: string[]
  included?: string[]
  notIncluded?: string[]
  why_choose?: string[]
  reviews?: Array<{
    author: string
    rating: number
    comment: string
    date?: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
  pricing?: {
    local: Array<{ pax: number | string; price: string }>
    foreigner: Array<{ pax: number | string; price: string }>
  }
}
