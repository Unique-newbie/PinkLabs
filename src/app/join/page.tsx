import Link from 'next/link'
import { UserPlus, ArrowRight, ArrowLeft, Code2 } from 'lucide-react'
import { signup, loginWithGoogle } from '../login/actions'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'Join — PinkLabs',
  description: 'Create a new PinkLabs account to start your project.',
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: branding } = await supabase.from('site_settings').select('value').eq('key', 'brand').single()
  const brandName = branding?.value?.name || 'PinkLabs'

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Panel — Dark branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-950 relative flex-col justify-between p-12">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-[-10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-brand-600/15 blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-[-5%] left-[-8%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[110px] animate-glow-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl font-display">
            <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl p-2">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            {brandName}
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 font-display tracking-tight">
            Start building
            <br />
            <span className="text-gradient-animated">something great</span>
          </h1>
          <p className="text-surface-400 text-lg leading-relaxed max-w-md">
            Join {brandName} to get access to your client portal, track project progress, and collaborate with our team in real-time.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { label: 'Projects Delivered', value: '150+' },
              { label: 'Client Satisfaction', value: '99%' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-white font-display">{stat.value}</div>
                <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-surface-600">&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-surface-950 lg:bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Mobile background effects */}
        <div className="absolute inset-0 bg-grid-pattern-dark lg:hidden" />
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-brand-600/15 blur-[120px] lg:hidden" />
        
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Mobile back link */}
          <div className="lg:hidden">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to {brandName}
            </Link>
          </div>

          <div className="glass-panel-dark lg:glass-panel p-10 rounded-2xl lg:bg-white lg:border-surface-100 lg:shadow-xl lg:backdrop-blur-none">
            <div className="text-center mb-8">
              <div className="flex justify-center lg:hidden mb-4">
                <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-brand-500/25">
                  <UserPlus className="h-7 w-7 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white lg:text-surface-900 font-display">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-surface-400 lg:text-surface-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-400 lg:text-brand-600 hover:text-brand-300 lg:hover:text-brand-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center mb-6">
                {error}
              </div>
            )}

            <form className="space-y-5" action={signup}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-surface-400 lg:text-surface-600 mb-1.5">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3.5 bg-surface-800/50 lg:bg-surface-50 border border-white/[0.08] lg:border-surface-200 text-white lg:text-surface-900 placeholder-surface-500 lg:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 text-sm transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-surface-400 lg:text-surface-600 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3.5 bg-surface-800/50 lg:bg-surface-50 border border-white/[0.08] lg:border-surface-200 text-white lg:text-surface-900 placeholder-surface-500 lg:placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 text-sm transition-all duration-200"
                  placeholder="Create a strong password"
                />
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3.5 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08] lg:border-surface-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-surface-500 text-xs font-medium uppercase tracking-wider">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <form action={loginWithGoogle}>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-white/[0.08] lg:border-surface-200 rounded-xl bg-surface-800/30 lg:bg-white hover:bg-surface-800/60 lg:hover:bg-surface-50 text-sm font-medium text-surface-300 lg:text-surface-700 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign up with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
