import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Code, Smartphone, Palette, ShoppingBag, Server, Blocks, ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'Services — PinkLabs',
  description: 'Explore our full range of software development services — web apps, mobile, UI/UX, and more.',
}

const ICON_MAP: Record<string, any> = {
  Code, Smartphone, Palette, ShoppingBag, Server, Blocks
}

export default async function ServicesPage() {
  const supabase = await createClient()
  
  const [{ data: services }, { data: branding }] = await Promise.all([
    supabase.from('services').select('*').order('sort_order', { ascending: true }),
    supabase.from('site_settings').select('value').eq('key', 'brand').single()
  ])

  return (
    <>
      <Navbar branding={branding?.value} />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="py-24 lg:py-32 bg-surface-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="section-badge mb-6 mx-auto w-fit !text-brand-300 !border-brand-500/20" style={{ background: 'rgba(236,72,153,0.1)' }}>
              <Sparkles className="w-4 h-4" />
              What We Do
            </div>
            <h1 className="font-display text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Services built for
              <span className="text-gradient-animated block mt-2">your success</span>
            </h1>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
              End-to-end software development services tailored to businesses that demand premium, production-ready digital products.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {!services || services.length === 0 ? (
                <div className="text-center py-20 bg-surface-50 rounded-3xl border-2 border-dashed border-surface-200">
                    <Info className="w-10 h-10 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-surface-900 mb-2 font-display">No services found</h3>
                    <p className="text-surface-500">Run <code className="text-brand-600">seed-data.sql</code> to populate this page.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, i) => {
                  const Icon = ICON_MAP[service.icon_name] || Code
                  return (
                    <div key={i} className="group relative bg-white p-8 rounded-2xl border border-surface-100 hover:border-transparent gradient-border-hover hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 hover:-translate-y-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-brand-50 to-purple-50 group-hover:from-brand-500 group-hover:to-purple-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                        <Icon className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="text-xl font-bold text-surface-900 mb-3 font-display">{service.title}</h3>
                      <p className="text-surface-500 text-sm leading-relaxed mb-6">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                          <ul className="space-y-2">
                            {service.features.map((feat: string) => (
                              <li key={feat} className="flex items-center gap-2.5 text-sm text-surface-500">
                                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 bg-surface-950 text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 font-display tracking-tight">
              Ready to start your <span className="text-gradient-animated">project</span>?
            </h2>
            <p className="text-surface-400 text-lg mb-10 leading-relaxed">Tell us about your idea and get a free consultation within 24 hours.</p>
            <Link href="/join" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-brand-600/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer branding={branding?.value} />
    </>
  )
}
