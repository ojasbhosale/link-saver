'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookmarkModal } from '@/components/dashboard/bookmark-modal'
import { BookmarkList } from '@/components/dashboard/bookmark-list'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Plus, BookmarkIcon } from 'lucide-react'
import type { Bookmark, BookmarkFormData } from '@/lib/types'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
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

  const handleDeleteBookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
    } catch {
      throw new Error('Failed to delete bookmark')
    }
  }

  const handleReorderBookmarks = async (reorderedBookmarks: Bookmark[]) => {
    try {
      const response = await fetch('/api/bookmarks/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarks: reorderedBookmarks }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder bookmarks')
      }

      // Success - update the main state
      setBookmarks(reorderedBookmarks)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder bookmarks. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }

  const handleBookmarksUpdate = (updatedBookmarks: Bookmark[]) => {
    setBookmarks(updatedBookmarks)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted/50 rounded-lg w-1/3"></div>
            <div className="h-5 bg-muted/30 rounded w-2/3"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="glass-card h-32 rounded-xl premium-shadow"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-premium dark:shadow-premium-dark">
              <BookmarkIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            All Bookmarks
          </h1>
          <p className="text-muted-foreground text-balance max-w-2xl">
            Manage and organize your saved links with AI-powered summaries and smart categorization.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 font-medium button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium dark:shadow-premium-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      {/* Bookmarks List */}
      <BookmarkList
        bookmarks={bookmarks}
        onDelete={handleDeleteBookmark}
        onReorder={handleReorderBookmarks}
        onBookmarksUpdate={handleBookmarksUpdate}
      />

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