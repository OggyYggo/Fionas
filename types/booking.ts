export interface Booking {
  id: string
  customer: string
  email: string
  tour: string
  destination: string
  date: string
  endDate: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  amount: string
  participants: number
  adults: number
  children: number
  tourType: string
  activities: string[]
  otherActivity: string
  accommodation: string
  transportation: string
  tourGuide: string
  specialRequests: string
  createdAt: string
  updatedAt: string
}
