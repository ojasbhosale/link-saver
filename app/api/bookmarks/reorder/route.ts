import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookmarks } = await request.json()

    if (!Array.isArray(bookmarks)) {
      return NextResponse.json({ error: 'Invalid bookmarks data' }, { status: 400 })
    }

    // Use a transaction to update all positions atomically
    const updates = bookmarks.map((bookmark, index) => 
      supabase
        .from('bookmarks')
        .update({ position: index })
        .eq('id', bookmark.id)
        .eq('user_id', user.id)
    )

    // Execute all updates
    const results = await Promise.all(updates)
    
    // Check if any update failed
    const hasError = results.some(result => result.error)
    if (hasError) {
      console.error('Some updates failed:', results.filter(r => r.error))
      return NextResponse.json({ error: 'Failed to update some bookmarks' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reorder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
