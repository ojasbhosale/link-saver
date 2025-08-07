'use client'

import { useAuth } from '@/lib/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  Link as LinkIcon, 
  LayoutDashboard, 
  Bookmark, 
  FileText, 
  LogOut, 
  X, 
  Sparkles,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Bookmarks',
    href: '/dashboard/bookmarks',
    icon: Bookmark,
  },
  {
    name: 'Summaries',
    href: '/dashboard/summaries',
    icon: FileText,
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      })
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose() // Close mobile sidebar after navigation
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 h-screen 
        bg-background/95 backdrop-blur-xl border-r border-border/50
        flex flex-col overflow-hidden premium-shadow
        transform transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:z-30
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 flex-shrink-0 h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <div className="relative bg-primary p-2.5 rounded-xl shadow-lg">
                <LinkIcon className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-foreground">
                SnipLink
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                AI-Powered
              </p>
            </div>
          </div>
          
          {/* Close button - only visible on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl 
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Theme Toggle */}      
        <div className="px-4 pb-4 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 justify-start h-10"
          >
            {/* Show moon icon when switching to dark, sun when switching to light */}
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}

            {/* Label text */}
            <span className="ml-6 lg:ml-7">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-border/30">
            <Avatar className="h-9 w-9 ring-2 ring-primary/20">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url || "/placeholder.svg"} 
                alt={user?.email} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                {user?.email ? getUserInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 group transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}