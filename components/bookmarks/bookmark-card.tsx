'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ExternalLink, Trash2, GripVertical } from 'lucide-react'
import type { Bookmark } from '@/lib/types'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => Promise<void>
  isDragging?: boolean
}

export function BookmarkCard({ bookmark, onDelete, isDragging = false }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(bookmark.id)
      toast({
        title: 'Bookmark deleted',
        description: 'The bookmark has been removed successfully.',
      })
    } catch (error) {
        console.error('Error deleting bookmark:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete bookmark. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenLink = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-2' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            {bookmark.favicon_url && (
              <img
                src={bookmark.favicon_url || "/placeholder.svg"}
                alt=""
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm leading-tight truncate">
                {bookmark.title}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {bookmark.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenLink}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {(bookmark.summary || bookmark.tags.length > 0) && (
        <CardContent className="pt-0">
          {bookmark.summary && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {bookmark.summary}
            </p>
          )}
          
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmark.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
