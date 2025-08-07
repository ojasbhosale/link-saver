'use client'

import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Loader2, Link as LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-[0.02] dark:opacity-[0.05]" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-pulse-slow delay-500" />

        <div className="text-center space-y-6 relative z-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 premium-shadow">
            <LinkIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground text-lg font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden gradient-bg relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-[0.02] dark:opacity-[0.05]" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/10 rounded-full animate-pulse-slow" />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/15 rounded-full animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/12 rounded-full animate-pulse-slow delay-500" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/10 rounded-full animate-pulse-slow delay-700" />

      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}