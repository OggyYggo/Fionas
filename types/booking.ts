export interface Booking {
  id: string
  customer: string
  email: string
  tour: string
  tourId: number
  date: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  amount: string
  participants: number
  createdAt: string
  updatedAt: string
}
