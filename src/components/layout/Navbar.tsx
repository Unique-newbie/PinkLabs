import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { MobileNav } from './MobileNav'
import { Code2 } from 'lucide-react'

export async function Navbar({ branding }: { branding?: any }) {
  const supabase = await createClient()
  const [{ data: { user } }, { data: navData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('site_settings').select('value').eq('key', 'navigation').single()
  ])
  
  const brandName = branding?.name || "Pink Labs"
  const logoUrl = branding?.logo_url

  const navLinks = navData?.value?.main_nav || [
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/60 backdrop-blur-2xl border-b border-white/[0.06] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-8 w-auto" />
            ) : (
              <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl p-2 group-hover:shadow-lg group-hover:shadow-brand-500/25 transition-all duration-300">
                <Code2 className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="font-display font-bold tracking-tight text-lg text-white group-hover:text-brand-300 transition-colors duration-300">
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link: any) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-surface-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.05]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-surface-400 hover:text-white transition-colors duration-200 px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 hover:-translate-y-0.5"
                >
                  Start Project
                </Link>
              </>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <MobileNav links={navLinks} user={user} />
        </div>
      </div>
    </header>
  )
}
