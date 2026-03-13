'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  Waves,
  Mountain,
  TreePine,
  Route
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    url: '/admin/bookings',
    icon: Calendar,
  },
  {
    title: 'Custom Tours',
    url: '/admin/custom-tours',
    icon: Route,
  },
  {
    title: 'Tours',
    url: '/admin/tours',
    icon: MapPin,
  },
  {
    title: 'Customers',
    url: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Payments',
    url: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Reports',
    url: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Content',
    url: '/admin/content',
    icon: FileText,
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="w-72 border-r border-gray-200/60 bg-white/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-200/60 bg-white/90">
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25">
            <Waves className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-gray-900">Bohol Travel</span>
            <span className="text-xs font-medium text-gray-500">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white/50">
        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.url
              
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "h-11 w-full rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 font-semibold shadow-sm shadow-teal-500/10 border border-teal-200/50" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-4">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                        isActive 
                          ? "bg-teal-600 text-white shadow-sm" 
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6 px-4">
          <SidebarGroupLabel className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Overview
          </SidebarGroupLabel>
          <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 mx-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100">
                    <Mountain className="h-3 w-3 text-teal-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Active Tours</span>
                </div>
                <span className="text-xs font-bold text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Today</span>
                </div>
                <span className="text-xs font-bold text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                    <TreePine className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Locations</span>
                </div>
                <span className="text-xs font-bold text-gray-900">12</span>
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200/60 bg-white/90">
        <div className="px-6 py-4">
          <div className="text-xs font-medium text-gray-500 mb-1">Bohol Travel Agency</div>
          <div className="text-xs text-gray-400">Dashboard v2.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
