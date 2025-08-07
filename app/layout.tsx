import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Link Saver - AI-Powered Bookmark Manager',
  description: 'Save, organize, and summarize your favorite links with AI-powered summaries. The modern way to manage bookmarks.',
  keywords: ['bookmarks', 'links', 'AI', 'summaries', 'organization', 'productivity'],
  authors: [{ name: 'Link Saver' }],
  creator: 'Link Saver',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linksaver.app',
    title: 'Link Saver - AI-Powered Bookmark Manager',
    description: 'Save, organize, and summarize your favorite links with AI-powered summaries.',
    siteName: 'Link Saver',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Saver - AI-Powered Bookmark Manager',
    description: 'Save, organize, and summarize your favorite links with AI-powered summaries.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
