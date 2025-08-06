import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(bookmarks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, tags = [] } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Get page title and favicon
    let title = url
    let faviconUrl = null
    let summary = null

    try {
      // Fetch page metadata
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkSaver/1.0)',
        },
        timeout: 10000,
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        if (titleMatch) {
          title = titleMatch[1].trim()
        }

        // Extract favicon
        const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)
        if (faviconMatch) {
          const favicon = faviconMatch[1]
          faviconUrl = favicon.startsWith('http') ? favicon : new URL(favicon, url).href
        } else {
          // Fallback to default favicon location
          try {
            faviconUrl = new URL('/favicon.ico', url).href
          } catch {
            faviconUrl = null
          }
        }

        // Generate AI summary using Jina AI
        try {
          console.log('Generating AI summary for:', url)
          const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`
          const jinaResponse = await fetch(jinaUrl, {
            headers: {
              'Accept': 'text/plain',
              'User-Agent': 'LinkSaver/1.0',
            },
            timeout: 15000,
          })
          
          if (jinaResponse.ok) {
            const jinaText = await jinaResponse.text()
            console.log('Jina AI response length:', jinaText.length)
            
            if (jinaText && jinaText.length > 50) {
              // Clean up the text and create a proper summary
              const cleanText = jinaText
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
              
              // Take first 300-500 characters for summary
              if (cleanText.length > 300) {
                const sentences = cleanText.split(/[.!?]+/)
                let summary_text = ''
                
                for (const sentence of sentences) {
                  if ((summary_text + sentence).length < 400) {
                    summary_text += sentence.trim() + '. '
                  } else {
                    break
                  }
                }
                
                summary = summary_text.trim() || cleanText.slice(0, 300) + '...'
              } else {
                summary = cleanText
              }
              
              console.log('Generated summary:', summary?.slice(0, 100) + '...')
            }
          } else {
            console.log('Jina AI request failed:', jinaResponse.status)
          }
        } catch (error) {
          console.error('Error generating AI summary:', error)
          // Fallback: create summary from page content
          const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          if (textContent.length > 100) {
            summary = textContent.slice(0, 300) + '...'
          }
        }
      }
    } catch (error) {
      console.error('Error fetching page metadata:', error)
    }

    // If no summary was generated, create a default one
    if (!summary) {
      summary = `Bookmark saved from ${new URL(url).hostname}. AI summary will be generated when the page becomes accessible.`
    }

    // Get the highest position for ordering
    const { data: lastBookmark } = await supabase
      .from('bookmarks')
      .select('position')
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1)

    const position = lastBookmark && lastBookmark.length > 0 
      ? lastBookmark[0].position + 1 
      : 0

    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        url,
        title,
        favicon_url: faviconUrl,
        summary,
        tags,
        position,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Bookmark created with summary:', !!bookmark.summary)
    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('POST /api/bookmarks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
