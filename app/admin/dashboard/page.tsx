'use client'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/layout/page-container'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardContent
} from '@/components/ui/card'
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Calendar, Users, DollarSign, MapPin, TrendingUp, Activity, Clock, Star, MessageSquare } from 'lucide-react'
import { BookingService, TourPackageService, DestinationService } from '@/lib/supabase'
import { Booking } from '@/types/supabase'
import TestimonialsComponent from '@/components/admin/Testimonials'

interface DashboardStats {
  totalRevenue: number
  totalBookings: number
  activeTours: number
  pendingBookings: number
  confirmedBookings: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    activeTours: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch booking statistics
        const bookingStats = await BookingService.getBookingStats()
        if (bookingStats.success && bookingStats.data) {
          setStats({
            totalRevenue: bookingStats.data.totalRevenue,
            totalBookings: bookingStats.data.totalBookings,
            activeTours: 0, // Will be updated below
            pendingBookings: bookingStats.data.pendingBookings,
            confirmedBookings: bookingStats.data.confirmedBookings
          })
        }

        // Fetch active tours
        const toursData = await TourPackageService.getTourPackages({ active: true })
        if (toursData.success) {
          setStats(prev => ({
            ...prev,
            activeTours: toursData.data.length
          }))
        }

        // Fetch recent bookings
        const bookingsData = await BookingService.getBookings({ limit: 5 })
        if (bookingsData.success) {
          setRecentBookings(bookingsData.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount)
  }
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>
            Welcome back, Admin 👋
          </h2>
          <p className='text-gray-600 mt-2 text-lg'>
            Here's your business overview for today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="text-xs font-medium text-gray-700">Just now</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="relative pb-3">
            <CardDescription className="text-teal-100 font-medium">Total Revenue</CardDescription>
            <CardTitle className='text-3xl font-bold text-white tabular-nums'>
              {loading ? '...' : formatCurrency(stats.totalRevenue)}
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <IconTrendingUp className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">+18.7%</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className='relative text-sm text-teal-100'>
            <div className='flex items-center gap-2'>
              <TrendingUp className="h-4 w-4" />
              <span>vs last month</span>
            </div>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="relative pb-3">
            <CardDescription className="text-blue-100 font-medium">Total Bookings</CardDescription>
            <CardTitle className='text-3xl font-bold text-white tabular-nums'>
              {loading ? '...' : stats.totalBookings.toLocaleString()}
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <IconTrendingUp className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">+12.3%</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className='relative text-sm text-blue-100'>
            <div className='flex items-center gap-2'>
              <Activity className="h-4 w-4" />
              <span>{stats.confirmedBookings} confirmed</span>
            </div>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="relative pb-3">
            <CardDescription className="text-purple-100 font-medium">Active Tours</CardDescription>
            <CardTitle className='text-3xl font-bold text-white tabular-nums'>
              {loading ? '...' : stats.activeTours}
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <IconTrendingUp className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">+2</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className='relative text-sm text-purple-100'>
            <div className='flex items-center gap-2'>
              <MapPin className="h-4 w-4" />
              <span>available</span>
            </div>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="relative pb-3">
            <CardDescription className="text-orange-100 font-medium">Pending Bookings</CardDescription>
            <CardTitle className='text-3xl font-bold text-white tabular-nums'>
              {loading ? '...' : stats.pendingBookings}
            </CardTitle>
            <CardAction>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <IconTrendingUp className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">+5.2%</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className='relative text-sm text-orange-100'>
            <div className='flex items-center gap-2'>
              <Users className="h-4 w-4" />
              <span>awaiting confirmation</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Recent Bookings */}
        <div className='lg:col-span-2'>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Calendar className="h-5 w-5" />
                </div>
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-gray-600">Latest tour bookings and their status</CardDescription>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading bookings...</div>
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">No bookings found</div>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200'>
                    <div className='flex items-center gap-4'>
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-teal-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className='font-semibold text-gray-900 truncate'>{booking.full_name}</div>
                        <div className='text-sm text-gray-600 truncate'>{booking.tour_type?.replace('_', ' ').toUpperCase() || 'Custom Tour'}</div>
                        <div className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'No date set'}
                        </div>
                      </div>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <Badge className={`${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      } mb-2 font-medium`}>
                        {booking.status}
                      </Badge>
                      <div className='font-bold text-lg text-gray-900'>
                        {booking.total_price ? formatCurrency(booking.total_price) : 'Price TBD'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Popular Tours */}
        <div>
          <Card className="border-0 shadow-lg h-full">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Star className="h-5 w-5" />
                </div>
                Popular Tours
              </CardTitle>
              <CardDescription className="text-gray-600">Most booked tour packages</CardDescription>
            </CardHeader>
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                  <div className='w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0'>
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className='font-semibold text-gray-900 text-sm truncate'>Chocolate Hills</div>
                    <div className='text-xs text-gray-600'>342 bookings</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium flex-shrink-0">
                  4.8 ⭐
                </Badge>
              </div>

              <div className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0'>
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className='font-semibold text-gray-900 text-sm truncate'>Loboc River</div>
                    <div className='text-xs text-gray-600'>289 bookings</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium flex-shrink-0">
                  4.9 ⭐
                </Badge>
              </div>

              <div className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100'>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0'>
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className='font-semibold text-gray-900 text-sm truncate'>Panglao Island</div>
                    <div className='text-xs text-gray-600'>198 bookings</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium flex-shrink-0">
                  4.7 ⭐
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-1'>
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              Customer Reviews
            </CardTitle>
            <CardDescription className="text-gray-600">Latest feedback from our valued customers</CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <TestimonialsComponent />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 h-full">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Calendar className="h-4 w-4" />
              </div>
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-3'>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Chocolate Hills Tour</span>
              <span className='text-gray-500 font-medium flex-shrink-0 ml-2'>9:00 AM</span>
            </div>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Loboc River Cruise</span>
              <span className='text-gray-500 font-medium flex-shrink-0 ml-2'>2:00 PM</span>
            </div>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Tarsier Sanctuary</span>
              <span className='text-gray-500 font-medium flex-shrink-0 ml-2'>4:00 PM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 h-full">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              New Customers
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-3'>
            <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0'>
                JD
              </div>
              <div className="min-w-0 flex-1">
                <div className='font-semibold text-sm text-gray-900 truncate'>Juan Dela Cruz</div>
                <div className='text-xs text-gray-500'>Joined today</div>
              </div>
            </div>
            <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0'>
                MS
              </div>
              <div className="min-w-0 flex-1">
                <div className='font-semibold text-sm text-gray-900 truncate'>Maria Santos</div>
                <div className='text-xs text-gray-500'>Joined today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 h-full">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
                <MapPin className="h-4 w-4" />
              </div>
              Tour Locations
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-3'>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Chocolate Hills</span>
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 flex-shrink-0 ml-2">Active</Badge>
            </div>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Loboc River</span>
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 flex-shrink-0 ml-2">Active</Badge>
            </div>
            <div className='flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg'>
              <span className="text-gray-700 font-medium truncate">Panglao Island</span>
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 flex-shrink-0 ml-2">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
