'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Link as LinkIcon } from 'lucide-react'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: 'Account created!',
          description: 'Welcome to SnipLink. You can now start saving your links.',
        })
      }
    } catch (error: any) {
      setError(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        })
      }
    } catch (error: any) {
      setError(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error

      // The redirect will happen automatically
    } catch (error: any) {
      setError(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-[0.02] dark:opacity-[0.05]" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse-slow" />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-pulse-slow delay-500" />

      <div className="w-full max-w-md relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-premium dark:shadow-premium-dark">
            <LinkIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2 text-balance">
            Welcome to SnipLink
          </h1>
          <p className="text-muted-foreground text-balance">
            Save, organize, and summarize your favorite links
          </p>
        </div>

        {/* Main Card */}
        <Card className="glass-card premium-shadow border-0 animate-slide-up">
          <CardHeader className="space-y-1 pb-4">
            <div className="space-y-2 text-center">
              {error && (
                <Alert variant="destructive" className="text-sm animate-scale-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-11">
                <TabsTrigger 
                  value="signin" 
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border/50 input-focus placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border/50 input-focus placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 font-medium button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border/50 input-focus placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className="h-11 bg-background/50 border-border/50 input-focus placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 font-medium button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-medium tracking-wider">
                  OR
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 font-medium button-hover bg-background/50 hover:bg-background/80 border-border/50 hover:border-border"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}