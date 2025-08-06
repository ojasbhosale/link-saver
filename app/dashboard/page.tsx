'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { BookmarkModal } from '@/components/dashboard/bookmark-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Plus, Bookmark, TrendingUp, Sparkles, ExternalLink, Calendar, ArrowUpRight } from 'lucide-react'
import type { Bookmark as BookmarkType, BookmarkFormData } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
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

  const stats = [
    {
      title: 'Total Bookmarks',
      value: totalBookmarks,
      icon: Bookmark,
      description: 'Links saved',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
    },
    {
      title: 'This Week',
      value: bookmarksThisWeek,
      icon: TrendingUp,
      description: 'New additions',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+23%',
    },
    {
      title: 'AI Summaries',
      value: bookmarks.filter(b => b.summary && b.summary.length > 50).length,
      icon: Sparkles,
      description: 'Generated',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here&apos;s an overview of your saved links and AI summaries.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 px-6"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Bookmark
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </p>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookmarks */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Bookmarks</CardTitle>
              <CardDescription className="text-base mt-1">Your latest saved links with AI summaries</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <a href="/dashboard/bookmarks" className="flex items-center gap-2">
                View All
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Start saving your favorite links with AI-powered summaries!
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bookmark
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  {bookmark.favicon_url && (
                    <img
                      src={bookmark.favicon_url || "/placeholder.svg"}
                      alt=""
                      className="w-5 h-5 flex-shrink-0 mt-1 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                        {bookmark.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                        {bookmark.url}
                      </p>
                    </div>
                    {bookmark.summary && bookmark.summary.length > 50 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {bookmark.summary}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Ready to save more links? 🚀
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Add bookmarks and get AI-powered summaries instantly
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="font-medium">AI-powered</span>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Bookmark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
