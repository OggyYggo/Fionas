'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Info, Calendar, Users, MapPin, Star, TrendingUp } from 'lucide-react'

interface InfoSidebarProps {
  side?: 'left' | 'right'
}

export function InfoSidebar({ side = 'right' }: InfoSidebarProps) {
  return (
    <div className="w-80 bg-white border-l p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Quick Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-teal-600" />
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Status</span>
              <Badge variant="default" className="bg-green-100 text-green-700">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response</span>
              <span className="text-sm text-green-600">120ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Highlights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">New Bookings</span>
              </div>
              <span className="font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm">Tours Today</span>
              </div>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-500" />
                <span className="text-sm">Revenue</span>
              </div>
              <span className="font-medium">₱24,500</span>
            </div>
          </CardContent>
        </Card>

        {/* Popular Tours */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Top Tours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Chocolate Hills</div>
                <div className="text-xs text-gray-500">342 bookings</div>
              </div>
              <Badge variant="outline" className="text-xs">4.8⭐</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Loboc River</div>
                <div className="text-xs text-gray-500">289 bookings</div>
              </div>
              <Badge variant="outline" className="text-xs">4.9⭐</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Panglao Island</div>
                <div className="text-xs text-gray-500">198 bookings</div>
              </div>
              <Badge variant="outline" className="text-xs">4.7⭐</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Customer List
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Tour Management
            </Button>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Check out our documentation or contact support for assistance.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                View Documentation
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { InfoSidebar as default }
