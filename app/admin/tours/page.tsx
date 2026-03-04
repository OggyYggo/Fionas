'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, Plus, Search, Filter, Star, Eye, Edit, Trash2 } from 'lucide-react'

const tours = [
  { 
    id: 'TR001', 
    name: 'Chocolate Hills Tour', 
    description: 'Explore the famous Chocolate Hills of Bohol',
    price: '₱2,500',
    duration: 'Full Day',
    difficulty: 'Easy',
    rating: 4.8,
    bookings: 342,
    status: 'active',
    image: '/chocolate-hills.jpg'
  },
  { 
    id: 'TR002', 
    name: 'Loboc River Cruise', 
    description: 'Scenic river cruise with floating restaurant',
    price: '₱1,800',
    duration: 'Half Day',
    difficulty: 'Easy',
    rating: 4.9,
    bookings: 289,
    status: 'active',
    image: '/loboc-river.jpg'
  },
  { 
    id: 'TR003', 
    name: 'Panglao Island Hopping', 
    description: 'Visit beautiful beaches and islands',
    price: '₱3,200',
    duration: 'Full Day',
    difficulty: 'Moderate',
    rating: 4.7,
    bookings: 198,
    status: 'active',
    image: '/panglao.jpg'
  },
  { 
    id: 'TR004', 
    name: 'Tarsier Sanctuary', 
    description: 'Meet the adorable Philippine tarsiers',
    price: '₱800',
    duration: '2 Hours',
    difficulty: 'Easy',
    rating: 4.6,
    bookings: 156,
    status: 'active',
    image: '/tarsier.jpg'
  },
  { 
    id: 'TR005', 
    name: 'Danao Adventure Park', 
    description: 'Extreme sports and adventure activities',
    price: '₱4,500',
    duration: 'Full Day',
    difficulty: 'Hard',
    rating: 4.5,
    bookings: 87,
    status: 'inactive',
    image: '/danao.jpg'
  },
]

export default function ToursPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
          <p className="text-gray-600">Manage your tour packages and activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tour
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">Active packages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,072</div>
            <p className="text-xs text-gray-500">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-gray-500">From 2,341 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱2.8M</div>
            <p className="text-xs text-gray-500">From tour sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tours</CardTitle>
              <CardDescription>Manage your tour packages</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tour.name}</div>
                      <div className="text-sm text-gray-500">{tour.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{tour.price}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>
                    <Badge variant={
                      tour.difficulty === 'Easy' ? 'default' :
                      tour.difficulty === 'Moderate' ? 'secondary' :
                      'destructive'
                    }>
                      {tour.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{tour.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tour.bookings}</TableCell>
                  <TableCell>
                    <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                      {tour.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
