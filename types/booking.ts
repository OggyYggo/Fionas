export interface Booking {
  id: string
  booking_number: string
  customer: string
  email: string
  phone: string
  tour: string
  destination: string
  date: string
  endDate?: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  amount: string
  total_amount: number
  downpayment_amount: number
  remaining_balance: number
  payment_method: string
  payment_status: 'paid' | 'pending' | 'partial'
  payment_id: string
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
  pickup_location: string
  created_at: string
  updated_at: string
}
