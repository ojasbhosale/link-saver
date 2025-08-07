'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
        <div className="h-3.5 w-3.5 mr-2" />
        Theme
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-full justify-start text-xs h-8 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? (
        <Sun className="h-3.5 w-3.5 mr-2" />
      ) : (
        <Moon className="h-3.5 w-3.5 mr-2" />
      )}
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
}
