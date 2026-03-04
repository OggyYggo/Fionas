'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Search, Filter, Download, Users, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'

const bookings = [
  { 
    id: 'BK001', 
    customer: 'Juan Dela Cruz', 
    email: 'juan@email.com',
    tour: 'Chocolate Hills Tour', 
    date: '2024-03-04', 
    status: 'confirmed', 
    amount: '₱2,500',
    participants: 4
  },
  { 
    id: 'BK002', 
    customer: 'Maria Santos', 
    email: 'maria@email.com',
    tour: 'Loboc River Cruise', 
    date: '2024-03-04', 
    status: 'pending', 
    amount: '₱1,800',
    participants: 2
  },
  { 
    id: 'BK003', 
    customer: 'Jose Reyes', 
    email: 'jose@email.com',
    tour: 'Panglao Island Hopping', 
    date: '2024-03-03', 
    status: 'confirmed', 
    amount: '₱3,200',
    participants: 6
  },
  { 
    id: 'BK004', 
    customer: 'Ana Garcia', 
    email: 'ana@email.com',
    tour: 'Tarsier Sanctuary', 
    date: '2024-03-03', 
    status: 'completed', 
    amount: '₱800',
    participants: 3
  },
  { 
    id: 'BK005', 
    customer: 'Carlos Mendoza', 
    email: 'carlos@email.com',
    tour: 'Chocolate Hills Tour', 
    date: '2024-03-02', 
    status: 'cancelled', 
    amount: '₱2,500',
    participants: 2
  },
]

export default function BookingsPage() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bookings Management</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and track all tour bookings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-4">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="h-10 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
            <Calendar className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-teal-100 font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,234</div>
            <p className="text-teal-100 text-sm mt-1">+12% from last month</p>
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
            <div className="text-3xl font-bold text-white">892</div>
            <p className="text-green-100 text-sm mt-1">72.3% of total</p>
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
            <div className="text-3xl font-bold text-white">156</div>
            <p className="text-yellow-100 text-sm mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-100 font-medium flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₱458,290</div>
            <p className="text-blue-100 text-sm mt-1">+18.7% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <Calendar className="h-5 w-5" />
                </div>
                All Bookings
              </CardTitle>
              <CardDescription className="text-gray-600">Manage your tour bookings</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-9 px-4">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-4">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-semibold text-gray-900">Booking ID</TableHead>
                  <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-900">Tour</TableHead>
                  <TableHead className="font-semibold text-gray-900">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Participants</TableHead>
                  <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{booking.customer}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{booking.tour}</TableCell>
                    <TableCell className="text-gray-700">{booking.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{booking.participants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">{booking.amount}</TableCell>
                    <TableCell>
                      <Badge className={
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-3">View</Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
