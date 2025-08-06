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

    // Update positions for all bookmarks
    const updates = bookmarks.map((bookmark, index) => ({
      id: bookmark.id,
      position: index,
    }))

    for (const update of updates) {
      await supabase
        .from('bookmarks')
        .update({ position: update.position })
        .eq('id', update.id)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering bookmarks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
