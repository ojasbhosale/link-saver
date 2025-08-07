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
    <Card className={`glass-card premium-shadow border-0 transition-all duration-300 ${
      isDragging 
        ? 'opacity-50 rotate-1 scale-[0.98] shadow-2xl cursor-grabbing' 
        : 'hover:shadow-glow dark:hover:shadow-glow-dark hover:scale-[1.01] cursor-grab'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 p-1 rounded-md text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
            {bookmark.favicon_url && (
              <div className="flex-shrink-0 w-5 h-5 rounded overflow-hidden bg-muted/20">
                <img
                  src={bookmark.favicon_url || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground leading-tight truncate mb-1">
                {bookmark.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {bookmark.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenLink}
              className="h-9 w-9 p-0 hover:bg-muted/50 transition-all button-hover cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all button-hover cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {(bookmark.summary || bookmark.tags.length > 0) && (
        <CardContent className="pt-0 space-y-4">
          {bookmark.summary && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {bookmark.summary}
              </p>
            </div>
          )}
          
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-background/50 border-border/50 hover:bg-muted/50 transition-colors"
                >
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