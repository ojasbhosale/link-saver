'use client'

import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { BookmarkCard } from './bookmark-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X, Filter, SortAsc, SortDesc, Bookmark } from 'lucide-react'
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
}

type SortOption = 'newest' | 'oldest' | 'title' | 'url'

export function BookmarkList({ bookmarks, onDelete, onReorder }: BookmarkListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])

  // Get all unique tags
  const allTags = Array.from(
    new Set(bookmarks.flatMap(bookmark => bookmark.tags))
  ).sort()

  // Filter and sort bookmarks
  const filterAndSortBookmarks = useCallback(() => {
    let filtered = [...bookmarks]

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
  }, [bookmarks, searchTerm, selectedTags, sortBy])

  useEffect(() => {
    filterAndSortBookmarks()
  }, [filterAndSortBookmarks, bookmarks])

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
    if (!result.destination) return

    const items = Array.from(filteredBookmarks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions based on the new order
    const updatedBookmarks = items.map((bookmark, index) => ({
      ...bookmark,
      position: index
    }))

    // Update the filtered bookmarks immediately for UI
    setFilteredBookmarks(updatedBookmarks)
    
    // Also update the original bookmarks array to maintain consistency
    const updatedOriginalBookmarks = bookmarks.map(bookmark => {
      const updatedBookmark = updatedBookmarks.find(ub => ub.id === bookmark.id)
      return updatedBookmark || bookmark
    })

    try {
      await onReorder(updatedOriginalBookmarks)
    } catch (error) {
      // Revert on error
      filterAndSortBookmarks()
    }
  }

  const getSortIcon = () => {
    return sortBy === 'oldest' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'newest': return 'Newest first'
      case 'oldest': return 'Oldest first'
      case 'title': return 'Title A-Z'
      case 'url': return 'URL A-Z'
      default: return 'Sort by'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-card premium-shadow border-0 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-background/50 border-border/50 input-focus text-base placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-4 bg-background/50 border-border/50 hover:bg-muted/50 button-hover"
                >
                  {getSortIcon()}
                  <span className="ml-2 font-medium">{getSortLabel()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-0 premium-shadow">
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
                className="h-12 px-4 bg-background/50 border-border/50 hover:bg-muted/50 button-hover text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1 font-medium",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background/50 border-border/50 hover:bg-muted/50 hover:border-primary/50 hover:text-primary"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-2 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        {(searchTerm || selectedTags.length > 0) && (
          <div className="text-sm text-muted-foreground pt-2 border-t border-border/50">
            Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
          </div>
        )}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="glass-card premium-shadow border-0 rounded-2xl p-8 max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/50 rounded-2xl mb-6">
              {bookmarks.length === 0 ? (
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Search className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {bookmarks.length === 0 ? 'No bookmarks yet' : 'No results found'}
            </h3>
            <p className="text-muted-foreground text-balance leading-relaxed">
              {bookmarks.length === 0 
                ? 'Add your first bookmark to get started with AI-powered summaries and smart organization!'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="bookmarks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 animate-fade-in"
              >
                {filteredBookmarks.map((bookmark, index) => (
                  <Draggable
                    key={`${bookmark.id}-${bookmark.position}`}
                    draggableId={bookmark.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="animate-slide-up"
                        style={{ 
                          ...provided.draggableProps.style,
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <BookmarkCard
                          bookmark={bookmark}
                          onDelete={onDelete}
                          isDragging={snapshot.isDragging}
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