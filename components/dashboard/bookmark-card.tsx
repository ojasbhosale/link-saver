'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ExternalLink, Trash2, GripVertical, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Bookmark } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

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
    } catch {
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
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 border-0 shadow-lg bg-white dark:bg-slate-900",
      isDragging && "opacity-50 rotate-1 shadow-xl"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <GripVertical className="h-5 w-5 text-slate-400 cursor-grab mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
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
          
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2 mb-2 text-base">
                {bookmark.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-3">
                {bookmark.url}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            {bookmark.summary && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">AI Summary</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {bookmark.summary}
                </p>
              </div>
            )}
            
            {bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Always visible action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenLink}
              className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
              title="Delete bookmark"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
