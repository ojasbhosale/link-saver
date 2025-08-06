'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { FileText, ExternalLink, Search, Sparkles, Calendar, Filter } from 'lucide-react'
import type { Bookmark } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default function SummariesPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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

  // Filter bookmarks that have summaries
  const bookmarksWithSummaries = bookmarks.filter(bookmark => bookmark.summary)

  // Apply search and tag filters
  const filteredBookmarks = bookmarksWithSummaries.filter(bookmark => {
    const matchesSearch = searchTerm === '' || 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.summary!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => bookmark.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  // Get all unique tags from bookmarks with summaries
  const allTags = Array.from(
    new Set(bookmarksWithSummaries.flatMap(bookmark => bookmark.tags))
  ).sort()

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          AI Summaries
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse AI-generated summaries of your bookmarked content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-1.5 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {bookmarksWithSummaries.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI Summaries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(bookmarksWithSummaries.reduce((acc, b) => acc + (b.summary?.length || 0), 0) / bookmarksWithSummaries.length) || 0}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Avg. Length
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 dark:bg-green-900/20 p-1.5 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {bookmarksWithSummaries.filter(b => 
                    new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This Week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-all duration-200 hover:scale-105 text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {(searchTerm || selectedTags.length > 0) && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredBookmarks.length} of {bookmarksWithSummaries.length} summaries
        </div>
      )}

      {/* Summaries List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 max-w-md mx-auto">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2">
              {bookmarksWithSummaries.length === 0 ? 'No summaries yet' : 'No results found'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {bookmarksWithSummaries.length === 0 
                ? 'Add some bookmarks to see AI-generated summaries here!'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="border-0 shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {bookmark.favicon_url && (
                      <img
                        src={bookmark.favicon_url || "/placeholder.svg"}
                        alt=""
                        className="w-4 h-4 flex-shrink-0 mt-0.5 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                        {bookmark.title}
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
                        {bookmark.url}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                    className="flex-shrink-0 h-7 w-7 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {bookmark.summary}
                  </p>
                </div>
                
                {bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {bookmark.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
