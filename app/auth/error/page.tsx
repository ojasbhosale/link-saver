'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('message') || 'An unknown error occurred'

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <CardTitle className="text-xl">Authentication Error</CardTitle>
        <CardDescription className="text-base">
          {error}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This could be due to an expired link, network issues, or configuration problems.
        </p>
        <Button asChild className="w-full">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
            <Loader2 className="h-8 w-8 text-slate-600 dark:text-slate-400 animate-spin" />
          </div>
        </div>
        <CardTitle className="text-xl">Loading...</CardTitle>
        <CardDescription className="text-base">
          Please wait while we process your request.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4">
      <Suspense fallback={<LoadingFallback />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}