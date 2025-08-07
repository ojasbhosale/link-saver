'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, X, Link as LinkIcon, Tag, Sparkles } from 'lucide-react'
import type { BookmarkFormData } from '@/lib/types'

interface BookmarkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BookmarkFormData) => Promise<void>
  isLoading?: boolean
}

export function BookmarkModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading = false 
}: BookmarkModalProps) {
  const [url, setUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      })
      return
    }

    try {
      await onSubmit({ url: url.trim(), tags })
      // Reset form on success
      setUrl('')
      setTags([])
      setTagInput('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting bookmark:', error)
      // Error handling is done in the parent component
    }
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen)
      if (!newOpen) {
        // Reset form when closing
        setUrl('')
        setTags([])
        setTagInput('')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-card premium-shadow border-0 max-w-md animate-scale-in">
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-premium dark:shadow-premium-dark">
              <LinkIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Add New Bookmark
              </DialogTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI will generate summary and tags
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-3">
            <Label htmlFor="modal-url" className="text-sm font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="modal-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 bg-background/50 border-border/50 input-focus text-base placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="modal-tags" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags (optional)
            </Label>
            <div className="flex gap-3">
              <Input
                id="modal-tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                disabled={isLoading || tags.length >= 10}
                className="flex-1 h-12 bg-background/50 border-border/50 input-focus text-base placeholder:text-muted-foreground/60"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={addTag}
                disabled={isLoading || !tagInput.trim() || tags.length >= 10}
                variant="outline"
                className="h-12 px-4 bg-background/50 border-border/50 hover:bg-muted/50 button-hover"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Tags ({tags.length}/10)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="flex items-center gap-2 px-3 py-1 bg-background/50 hover:bg-muted/50 transition-colors"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={isLoading}
                        className="hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {tags.length >= 10 && (
              <p className="text-xs text-muted-foreground">
                Maximum of 10 tags allowed
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-12 font-medium bg-background/50 border-border/50 hover:bg-muted/50 button-hover"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !url.trim()}
              className="flex-1 h-12 font-medium button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium dark:shadow-premium-dark"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Bookmark'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}