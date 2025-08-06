export interface Bookmark {
  id: string
  user_id: string
  url: string
  title: string
  favicon_url?: string
  summary?: string
  tags: string[]
  position: number
  created_at: string
  updated_at: string
}

export interface BookmarkFormData {
  url: string
  tags?: string[]
}
