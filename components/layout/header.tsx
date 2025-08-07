'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Menu, Zap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, loading } = useAuth()

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted animate-pulse rounded-md lg:hidden"></div>
            <div className="w-32 h-6 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu button and welcome message */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile menu button - only visible on small screens */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Welcome message - responsive text */}
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-medium text-foreground truncate">
              <Zap className="h-4 w-4 inline-block mr-1" />
              <span className="hidden sm:inline">Welcome back, </span>
              <span className="text-primary">
                {getUserDisplayName()}
              </span>
              <span className="hidden sm:inline">! 👋</span>
            </p>
          </div>
        </div>

        {/* Right side - User avatar */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            {/* User name - hidden on small screens, shown on larger screens */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            
            {/* Avatar */}
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url || "/placeholder.svg"} 
                alt={getUserDisplayName()} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                {user?.email ? getUserInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}