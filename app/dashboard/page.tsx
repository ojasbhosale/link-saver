'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookmarkModal } from '@/components/dashboard/bookmark-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Plus, Bookmark, TrendingUp, Sparkles, ExternalLink, Calendar, ArrowUpRight, BarChart3 } from 'lucide-react'
import type { Bookmark as BookmarkType, BookmarkFormData } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { toast } = useToast()

  const fetchBookmarksFromAPI = useCallback(async () => {
    try {
      const response = await fetch('/api/bookmarks')
      if (!response.ok) throw new Error('Failed to fetch bookmarks')
      
      const data = await response.json()
      setBookmarks(data)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load bookmarks. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBookmarksFromAPI()
  }, [fetchBookmarksFromAPI])

  const handleAddBookmark = async (formData: BookmarkFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add bookmark')
      }

      const newBookmark = await response.json()
      setBookmarks(prev => [newBookmark, ...prev])
      
      toast({
        title: 'Bookmark saved!',
        description: 'Your bookmark has been saved with AI summary.',
      })
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const recentBookmarks = bookmarks.slice(0, 3)
  const totalBookmarks = bookmarks.length
  const bookmarksThisWeek = bookmarks.filter(
    bookmark => new Date(bookmark.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  const summariesCount = bookmarks.filter(b => b.summary && b.summary.length > 50).length

  const stats = [
    {
      title: 'Total Bookmarks',
      value: totalBookmarks,
      icon: Bookmark,
      description: 'Links saved',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50',
      iconBg: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'This Week',
      value: bookmarksThisWeek,
      icon: TrendingUp,
      description: 'New additions',
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50',
      iconBg: 'bg-emerald-500',
      change: '+23%',
    },
    {
      title: 'AI Summaries',
      value: summariesCount,
      icon: Sparkles,
      description: 'Generated',
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50',
      iconBg: 'bg-purple-500',
      change: '+8%',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="h-8 bg-muted/50 rounded-lg w-1/3 animate-pulse"></div>
          <div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      

      {/* Action Button */}
      <div className="flex sm:justify-end lg:justify-end">
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 px-8 h-12 button-hover group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          Add Bookmark
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`border-0 premium-shadow hover:shadow-glow transition-all duration-300 animate-slide-up ${stat.bgColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookmarks */}
      <Card className="border-0 premium-shadow bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                Recent Bookmarks
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Your latest saved links with AI-powered summaries
              </CardDescription>
            </div>
            <Button variant="outline" asChild className="button-hover">
              <a href="/dashboard/bookmarks" className="flex items-center gap-2">
                View All
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card rounded-3xl p-10 max-w-md mx-auto animate-scale-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                  <div className="relative bg-primary p-4 rounded-2xl shadow-xl mx-auto w-fit">
                    <Bookmark className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No bookmarks yet
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Start saving your favorite links and get AI-powered summaries instantly!
                </p>
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="button-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bookmark
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="group p-6 rounded-2xl bg-accent/30 border border-border/50 hover:bg-accent/50 hover:border-border transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {bookmark.favicon_url && (
                      <div className="flex-shrink-0 mt-1">
                        <img
                          src={bookmark.favicon_url || "/placeholder.svg"}
                          alt=""
                          className="w-6 h-6 rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-1 mb-2 text-lg">
                          {bookmark.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                          {bookmark.url}
                        </p>
                      </div>
                      {bookmark.summary && bookmark.summary.length > 50 && (
                        <div className="glass-card rounded-xl p-4 border border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">AI Summary</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {bookmark.summary}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      

      {/* Bookmark Modal */}
      <BookmarkModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddBookmark}
        isLoading={isSubmitting}
      />
    </div>
  )
}