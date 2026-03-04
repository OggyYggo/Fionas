'use client'
import React, { useEffect, useState } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, Settings, LogOut } from 'lucide-react'
import { UserNav } from '@/components/layout/user-nav'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className='flex h-[100px] shrink-0 items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 shadow-sm'>
      <div className='flex items-center gap-4'>
        <SidebarTrigger className='-ml-1 h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors' />
        <Separator orientation='vertical' className='h-6 bg-gray-200/60' />
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-teal-200/50 font-medium">
            Bohol Travel
          </Badge>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='relative hidden md:block'>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search bookings, tours, customers..."
            className="pl-11 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200/60 rounded-xl w-96 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder-gray-400"
          />
        </div>
        
        <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>
        
        <Button variant="ghost" size="sm" className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="h-4 w-4 text-gray-600" />
        </Button>
        
        {user ? (
          <UserNav user={user} />
        ) : (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200/60">
            <div className="text-sm text-gray-500">Not signed in</div>
          </div>
        )}
      </div>
    </header>
  )
}
