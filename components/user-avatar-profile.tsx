'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@supabase/supabase-js'

interface UserAvatarProfileProps {
  user: User
  className?: string
}

export function UserAvatarProfile({ user, className }: UserAvatarProfileProps) {
  const initials = user.email 
    ? user.email.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <Avatar className={className}>
      <AvatarImage src={user.user_metadata?.avatar_url} />
      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
