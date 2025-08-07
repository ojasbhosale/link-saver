'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, X, Link as LinkIcon, Tag } from 'lucide-react'
import type { BookmarkFormData } from '@/lib/types'

interface BookmarkFormProps {
  onSubmit: (data: BookmarkFormData) => Promise<void>
  isLoading?: boolean
}

export function BookmarkForm({ onSubmit, isLoading = false }: BookmarkFormProps) {
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
      setUrl('')
      setTags([])
      setTagInput('')
    } catch (error) {
        console.error('Error submitting bookmark:', error)
      // Error handling is done in the parent component
    }
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
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

  return (
    <Card className="glass-card premium-shadow border-0">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-sm">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">Add New Bookmark</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Save any link with AI-powered summarization and smart tagging.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-sm font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="h-12 bg-background/50 border-border/50 input-focus text-base placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags (optional)
            </Label>
            <div className="flex gap-3">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 h-12 bg-background/50 border-border/50 input-focus text-base placeholder:text-muted-foreground/60"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={addTag}
                variant="outline"
                className="h-12 px-4 bg-background/50 border-border/50 hover:bg-muted/50 button-hover"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
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
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 font-medium text-base button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium dark:shadow-premium-dark" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Saving Bookmark...' : 'Save Bookmark'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}