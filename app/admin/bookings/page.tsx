'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Search, Filter, Download, Users, DollarSign, CheckCircle, Clock, XCircle, Eye, Edit, Trash2 } from 'lucide-react'
import { BookingService } from '@/lib/supabase'
import { Booking } from '@/types/booking'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all')
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: '₱0'
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [bookings, searchTerm, statusFilter])

  const fetchData = async () => {
    try {
      console.log('🔍 Page: Fetching bookings data using BookingService')
      
      const bookingsResult = await BookingService.getBookings()
      console.log('🔍 Page: Bookings result:', bookingsResult)
      
      if (bookingsResult.success && bookingsResult.data) {
        const mappedBookings = bookingsResult.data.map(booking => ({
          id: booking.id,
          booking_number: booking.booking_number || booking.id,
          customer: booking.full_name || 'Unknown',
          email: booking.email,
          phone: booking.phone || '',
          tour: booking.tour_title || booking.tour_type || 'Unknown Tour',
          destination: booking.destination || '',
          date: booking.start_date || new Date().toISOString().split('T')[0],
          endDate: booking.end_date || '',
          status: booking.status,
          amount: String(booking.total_price || '₱0'),
          total_amount: booking.total_price || 0,
          downpayment_amount: Math.ceil((booking.total_price || 0) * 0.5), // Calculate 50% downpayment
          remaining_balance: Math.ceil((booking.total_price || 0) * 0.5), // Calculate remaining 50%
          payment_method: 'card', // Default payment method
          payment_status: booking.status === 'confirmed' ? 'paid' : 'pending',
          payment_id: booking.id,
          participants: booking.number_of_guests || 1,
          adults: booking.adults || 0,
          children: booking.children || 0,
          tourType: booking.tour_type || '',
          travelType: booking.travel_type || '',
          activities: booking.activities || [],
          otherActivity: booking.other_activity || '',
          accommodation: booking.accommodation || '',
          transportation: booking.transportation || '',
          tourGuide: booking.tour_guide || '',
          specialRequests: booking.special_requests || '',
          pickup_location: '',
          created_at: booking.created_at,
          updated_at: booking.updated_at
        }))
        
        setBookings(mappedBookings)
        
        // Calculate stats
        const statsData = {
          total: mappedBookings.length,
          confirmed: mappedBookings.filter(b => b.status === 'confirmed').length,
          pending: mappedBookings.filter(b => b.status === 'pending').length,
          completed: 0, // The existing service might not have 'completed' status
          cancelled: mappedBookings.filter(b => b.status === 'cancelled').length,
          revenue: mappedBookings
            .filter(b => b.status === 'confirmed')
            .reduce((total, booking) => total + (booking.downpayment_amount || 0), 0)
            .toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
        }
        
        setStats(statsData)
      } else {
        console.error('❌ Page: Failed to fetch bookings:', bookingsResult)
        setBookings([])
        setStats({
          total: 0,
          confirmed: 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
          revenue: '₱0'
        })
      }
    } catch (error) {
      console.error('❌ Page: Error fetching data:', error)
      setBookings([])
      setStats({
        total: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        revenue: '₱0'
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = bookings
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }
    
    setFilteredBookings(filtered)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setEditDialogOpen(true)
  }

  const handleDeleteBooking = (booking: Booking) => {
    setBookingToDelete(booking)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return
    
    console.log('🔍 Page: Attempting to delete booking using BookingService:', bookingToDelete.id, bookingToDelete.customer)
    
    try {
      const deleteResult = await BookingService.deleteBooking(bookingToDelete.id)
      console.log('🔍 Page: Delete result from BookingService:', deleteResult)
      
      if (deleteResult.success) {
        console.log('✅ Page: Booking deleted successfully, refreshing data')
        await fetchData()
        setDeleteDialogOpen(false)
        setBookingToDelete(null)
        
        // Show success message
        setSuccessMessage(`Booking for "${bookingToDelete.customer}" has been successfully deleted.`)
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } else {
        console.error('❌ Page: Delete failed - BookingService returned false')
        console.error('❌ Delete message:', deleteResult.message)
        alert(`Failed to delete booking: ${deleteResult.message}`)
      }
    } catch (error) {
      console.error('❌ Page: Error deleting booking:', error)
      alert('Error deleting booking. Please check the console for details.')
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setBookingToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600">Manage and track all tour bookings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Success!</h4>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage and track all tour bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button variant="outline" className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 h-10">
            <Calendar className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-teal-100 font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-teal-100 text-sm mt-1">All bookings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-100 font-medium flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.confirmed}</div>
            <p className="text-green-100 text-sm mt-1">{stats.total > 0 ? `${((stats.confirmed / stats.total) * 100).toFixed(1)}%` : '0%'} of total</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-100 font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pending}</div>
            <p className="text-yellow-100 text-sm mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-100 font-medium flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Downpayment Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.revenue}</div>
            <p className="text-emerald-100 text-sm mt-1">50% downpayments collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                All Bookings
              </CardTitle>
              <CardDescription className="text-gray-600">Manage your tour bookings</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border">
                {filteredBookings.length} of {bookings.length} bookings
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border-gray-200 text-gray-700 bg-white border px-3 py-1.5 rounded-lg text-sm shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table className="border-separate border-spacing-0 w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200">
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Booking ID</TableHead>
                  <TableHead className="w-[200px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="w-[150px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Destination</TableHead>
                  <TableHead className="w-[150px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Tour</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Guests</TableHead>
                  <TableHead className="w-[140px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Payment</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {filteredBookings.map((booking, index) => (
                  <TableRow 
                    key={booking.id} 
                    className={`hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-emerald-50/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="font-bold text-gray-900">{booking.id}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{booking.customer}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        {booking.phone && (
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="text-gray-700">{booking.destination}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="text-gray-700">{booking.tour}</div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div>
                        <div className="text-gray-700">{booking.date}</div>
                        {booking.endDate && (
                          <div className="text-sm text-gray-500">to {booking.endDate}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{booking.participants}</span>
                        {booking.adults > 0 && booking.children > 0 && (
                          <div className="text-xs text-gray-500">
                            {booking.adults}A {booking.children}C
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-green-700">₱{booking.downpayment_amount?.toLocaleString() || '0'}</span>
                          <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">Paid</span>
                        </div>
                        {booking.remaining_balance > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-700">₱{booking.remaining_balance?.toLocaleString() || '0'}</span>
                            <span className="text-xs text-gray-500 bg-orange-100 px-2 py-1 rounded">Due</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {booking.payment_method}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className={
                        booking.status === 'confirmed' ? 'bg-green-500 text-white border-0 shadow-md' :
                        booking.status === 'pending' ? 'bg-yellow-500 text-white border-0 shadow-md' :
                        booking.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md' :
                        'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md'
                      }>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditBooking(booking)}
                          title="Edit Booking"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteBooking(booking)} 
                          title="Delete Booking"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No bookings have been created yet'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking "{bookingToDelete?.customer}" for "{bookingToDelete?.tour}" and remove all of its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteBooking}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Booking Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Modify the booking details for "{editingBooking?.customer}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {editingBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input 
                    value={editingBooking.customer}
                    onChange={(e) => setEditingBooking({...editingBooking, customer: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={editingBooking.email}
                    onChange={(e) => setEditingBooking({...editingBooking, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tour</label>
                  <Input 
                    value={editingBooking.tour}
                    onChange={(e) => setEditingBooking({...editingBooking, tour: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input 
                    value={editingBooking.amount}
                    onChange={(e) => setEditingBooking({...editingBooking, amount: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Participants</label>
                  <Input 
                    type="number"
                    value={editingBooking.participants}
                    onChange={(e) => setEditingBooking({...editingBooking, participants: parseInt(e.target.value) || 1})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value as 'pending' | 'confirmed' | 'cancelled'})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (editingBooking) {
                  try {
                    const updateResult = await BookingService.updateBooking({
                      bookingId: editingBooking.id,
                      status: editingBooking.status,
                      adminNotes: `Updated booking for ${editingBooking.customer}`,
                      additionalNotes: `Modified via admin panel`
                    })
                    
                    if (updateResult.success) {
                      await fetchData()
                      setEditDialogOpen(false)
                      setEditingBooking(null)
                    } else {
                      console.error('❌ Page: Update failed:', updateResult.message)
                      alert(`Failed to update booking: ${updateResult.message}`)
                    }
                  } catch (error) {
                    console.error('❌ Page: Error updating booking:', error)
                    alert('Error updating booking. Please check the console for details.')
                  }
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
