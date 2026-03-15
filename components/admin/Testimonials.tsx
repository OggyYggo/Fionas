'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react'

interface Testimonial {
  id: string
  customer_name: string
  tour_name: string
  rating: number
  testimonial_text: string
  date: string
  status: 'approved' | 'pending' | 'rejected'
  helpful_count: number
}

export default function TestimonialsComponent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        customer_name: 'Sarah Johnson',
        tour_name: 'Chocolate Hills Adventure',
        rating: 5,
        testimonial_text: 'Absolutely amazing experience! The tour guide was knowledgeable and the scenery was breathtaking. Highly recommend this tour to anyone visiting Bohol.',
        date: '2024-03-10',
        status: 'approved',
        helpful_count: 24
      },
      {
        id: '2',
        customer_name: 'Michael Chen',
        tour_name: 'Loboc River Cruise',
        rating: 4,
        testimonial_text: 'Great cruise experience with delicious lunch buffet. The floating restaurants were unique and the scenery along the river was beautiful.',
        date: '2024-03-08',
        status: 'approved',
        helpful_count: 18
      },
      {
        id: '3',
        customer_name: 'Emma Wilson',
        tour_name: 'Panglao Island Beach Tour',
        rating: 5,
        testimonial_text: 'Paradise! The beaches were pristine and the water was crystal clear. Our guide made sure we had the best experience possible.',
        date: '2024-03-05',
        status: 'pending',
        helpful_count: 12
      },
      {
        id: '4',
        customer_name: 'Carlos Rodriguez',
        tour_name: 'Tarsier Sanctuary Visit',
        rating: 5,
        testimonial_text: 'Fascinating to see the tarsiers up close! The sanctuary is well-maintained and the staff were very informative about conservation efforts.',
        date: '2024-03-03',
        status: 'approved',
        helpful_count: 31
      }
    ]
    
    setTimeout(() => {
      setTestimonials(mockTestimonials)
      setLoading(false)
    }, 1000)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading testimonials...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Customer Testimonials</h3>
        <Button variant="outline" size="sm">
          View All Testimonials
        </Button>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-teal-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {testimonial.customer_name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{testimonial.tour_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(testimonial.status)}>
                    {testimonial.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-600">({testimonial.rating}.0)</span>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {testimonial.testimonial_text}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(testimonial.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{testimonial.helpful_count} helpful</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
