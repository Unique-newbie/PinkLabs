import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight, Info, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { PortfolioClient } from '@/components/portfolio/PortfolioClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Portfolio — PinkLabs',
  description: 'Explore our recent work — web apps, mobile apps, SaaS platforms, and more.',
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  
  const [{ data: projects }, { data: branding }] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('site_settings').select('value').eq('key', 'brand').single()
  ])

  return (
    <>
      <Navbar branding={branding?.value} />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="py-24 lg:py-32 bg-surface-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-brand-600/10 blur-[120px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="section-badge mb-6 mx-auto w-fit !text-brand-300 !border-brand-500/20" style={{ background: 'rgba(236,72,153,0.1)' }}>
              <Sparkles className="w-4 h-4" />
              Our Work
            </div>
            <h1 className="font-display text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Projects that speak
              <span className="text-gradient-animated block mt-2">for themselves</span>
            </h1>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;ve helped startups and enterprises build products that users love. Here&apos;s a selection of our recent work.
            </p>
          </div>
        </section>

        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <PortfolioClient initialProjects={projects || []} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 bg-surface-950 text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 font-display tracking-tight">
              Want results like <span className="text-gradient-animated">these</span>?
            </h2>
            <p className="text-surface-400 text-lg mb-10 leading-relaxed">Let&apos;s discuss your project and create something extraordinary together.</p>
            <Link href="/contact" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-brand-600/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
              Start a Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer branding={branding?.value} />
    </>
  )
}
