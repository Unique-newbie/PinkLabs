import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Target, Lightbulb, Users, Rocket, Heart, Shield, ArrowRight, CheckCircle2, Clock, Globe, Activity, Search, Palette, Code, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { TeamSection } from '@/components/about/TeamSection'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About — PinkLabs',
  description: 'Learn about our team, values, and mission at PinkLabs software development agency.',
}

const ICON_MAP: Record<string, any> = {
  Target, Lightbulb, Users, Rocket, Heart, Shield, CheckCircle2, Clock, Globe, Activity, Search, Palette, Code
}

export default async function AboutPage() {
  const supabase = await createClient()
  const [
    { data: branding },
    { data: teamMembers },
    { data: values },
    { data: stats },
    { data: processSteps }
  ] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'brand').single(),
    supabase.from('team_members').select('*').order('sort_order', { ascending: true }),
    supabase.from('company_values').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('site_stats').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('process_steps').select('*').eq('is_active', true).order('sort_order')
  ])

  return (
    <>
      <Navbar branding={branding?.value} />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="py-24 lg:py-32 bg-surface-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="section-badge mb-6 !text-brand-300 !border-brand-500/20" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <Sparkles className="w-4 h-4" />
                About Us
              </div>
              <h1 className="font-display text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                We&apos;re a team of makers who care about{' '}
                <span className="text-gradient-animated">craft</span>
              </h1>
              <p className="text-lg text-surface-400 leading-relaxed max-w-2xl">
                PinkLabs was founded on a simple idea: great software starts with understanding people.
                We combine technical excellence with empathetic design to build products that truly serve their users.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <section className="py-16 bg-surface-900 border-y border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2 font-display">{stat.value}</div>
                    <div className="text-sm text-surface-400 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Values */}
        {values && values.length > 0 && (
          <section className="py-24 bg-white relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="section-badge mb-4 mx-auto w-fit">Our Values</div>
                <h2 className="section-title">What drives everything we do</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value) => {
                  const Icon = ICON_MAP[value.icon_name] || Heart
                  return (
                    <div key={value.id} className="group p-8 rounded-2xl border border-surface-100 hover:border-transparent gradient-border-hover hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 hover:-translate-y-1 bg-white">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-50 to-purple-50 group-hover:from-brand-500 group-hover:to-purple-500 text-brand-600 group-hover:text-white rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                        <Icon className="w-6 h-6 transition-colors duration-500" />
                      </div>
                      <h4 className="text-lg font-bold text-surface-900 mb-2 font-display">{value.title}</h4>
                      <p className="text-sm text-surface-500 leading-relaxed">{value.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Process */}
        {processSteps && processSteps.length > 0 && (
          <section className="py-24 bg-surface-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="section-badge mb-4 mx-auto w-fit">Our Process</div>
                <h2 className="section-title">How we bring ideas to life</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((phase, index) => (
                  <div key={phase.id} className="relative group text-center">
                    <div className="relative mx-auto mb-6">
                      <div className="text-7xl font-black text-brand-100 group-hover:text-brand-200 transition-colors duration-300 font-display">{phase.step_number || index + 1}</div>
                    </div>
                    <h4 className="text-lg font-bold text-surface-900 mb-2 font-display">{phase.title}</h4>
                    <p className="text-sm text-surface-500 leading-relaxed">{phase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        <TeamSection teamMembers={teamMembers || []} />

        {/* CTA */}
        <section className="py-28 bg-surface-950 text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 font-display tracking-tight">
              Let&apos;s build something <span className="text-gradient-animated">great</span> together
            </h2>
            <p className="text-surface-400 text-lg mb-10 leading-relaxed">Whether you have a clear vision or just an idea, we&apos;re here to help you shape it.</p>
            <Link href="/contact" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-brand-600/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
              Get in Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer branding={branding?.value} />
    </>
  )
}
