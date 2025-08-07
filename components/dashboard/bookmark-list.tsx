'use client'

import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { BookmarkCard } from './bookmark-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Bookmark } from '@/lib/types'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => Promise<void>
  onReorder: (bookmarks: Bookmark[]) => Promise<void>
  onBookmarksUpdate: (bookmarks: Bookmark[]) => void
}

type SortOption = 'position' | 'newest' | 'oldest' | 'title' | 'url'

export function BookmarkList({ bookmarks, onDelete, onReorder, onBookmarksUpdate }: BookmarkListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('position')
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [localBookmarks, setLocalBookmarks] = useState<Bookmark[]>([])

  // Update local bookmarks when props change
  useEffect(() => {
    setLocalBookmarks([...bookmarks])
  }, [bookmarks])

  // Get all unique tags
  const allTags = Array.from(
    new Set(localBookmarks.flatMap(bookmark => bookmark.tags))
  ).sort()

  // Filter and sort bookmarks
  const filterAndSortBookmarks = useCallback(() => {
    let filtered = [...localBookmarks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark =>
        selectedTags.every(tag => bookmark.tags.includes(tag))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return a.position - b.position
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'url':
          return a.url.localeCompare(b.url)
        default:
          return 0
      }
    })

    setFilteredBookmarks(filtered)
  }, [localBookmarks, searchTerm, selectedTags, sortBy])

  useEffect(() => {
    filterAndSortBookmarks()
  }, [filterAndSortBookmarks])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTags([])
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || sortBy !== 'position') return

    const items = Array.from(filteredBookmarks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions based on the new order
    const updatedItems = items.map((bookmark, index) => ({
      ...bookmark,
      position: index
    }))

    // Update filtered bookmarks immediately
    setFilteredBookmarks(updatedItems)

    // Update local bookmarks
    const updatedLocalBookmarks = localBookmarks.map(bookmark => {
      const updatedBookmark = updatedItems.find(item => item.id === bookmark.id)
      return updatedBookmark || bookmark
    })
    
    setLocalBookmarks(updatedLocalBookmarks)
    onBookmarksUpdate(updatedLocalBookmarks)

    try {
      await onReorder(updatedLocalBookmarks)
    } catch (error) {
      console.error('Error reordering bookmarks:', error)
      // Revert on error
      setLocalBookmarks([...bookmarks])
      filterAndSortBookmarks()
    }
  }

  const getSortIcon = () => {
    return sortBy === 'oldest' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'position': return 'Position'
      case 'newest': return 'Newest first'
      case 'oldest': return 'Oldest first'
      case 'title': return 'Title A-Z'
      case 'url': return 'URL A-Z'
      default: return 'Sort by'
    }
  }

  const isDragDisabled = sortBy !== 'position'

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 px-3 text-sm">
                  {getSortIcon()}
                  <span className="ml-2 hidden sm:inline">{getSortLabel()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('position')}>
                  Position (Drag to reorder)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title')}>
                  Title A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('url')}>
                  URL A-Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchTerm || selectedTags.length > 0) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-9 px-3 text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>

        {isDragDisabled && (
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-lg">
            💡 Switch to &quot;Position&quot; sorting to enable drag &amp; drop reordering
          </div>
        )}

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
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105 text-xs px-2 py-0.5",
                    selectedTags.includes(tag)
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {(searchTerm || selectedTags.length > 0) && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredBookmarks.length} of {localBookmarks.length} bookmarks
        </div>
      )}

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2">
              {localBookmarks.length === 0 ? 'No bookmarks yet' : 'No results found'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {localBookmarks.length === 0 
                ? 'Add your first bookmark to get started with AI-powered summaries!'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="bookmarks" isDropDisabled={isDragDisabled}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {filteredBookmarks.map((bookmark, index) => (
                  <Draggable
                    key={bookmark.id}
                    draggableId={bookmark.id}
                    index={index}
                    isDragDisabled={isDragDisabled}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BookmarkCard
                          bookmark={bookmark}
                          onDelete={onDelete}
                          isDragging={snapshot.isDragging}
                          isDragDisabled={isDragDisabled}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
