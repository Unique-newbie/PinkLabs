import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { Testimonials } from '@/components/home/Testimonials'
import { Process } from '@/components/home/Process'
import { FAQ } from '@/components/home/FAQ'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Code, Smartphone, Palette, ShoppingBag, Server, Blocks, Info, Sparkles, CheckCircle2 } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Code, Smartphone, Palette, ShoppingBag, Server, Blocks
}

/* =============================================
   BRANDS MARQUEE — Infinite scrolling logo strip
   ============================================= */
function BrandsMarquee({ brands }: { brands: any[] }) {
  if (!brands || brands.length === 0) return null

  // Double the array for seamless loop
  const allBrands = [...brands, ...brands]

  return (
    <section className="py-16 bg-surface-50 border-b border-surface-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <p className="text-center text-sm font-semibold text-surface-400 uppercase tracking-[0.2em]">
          Trusted by innovative companies worldwide
        </p>
      </div>
      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-50 to-transparent z-10" />
        
        <div className="flex animate-marquee">
          {allBrands.map((brand, i) => (
            brand.logo_url ? (
              <div key={`${brand.id}-${i}`} className="flex-shrink-0 mx-8 md:mx-12 flex items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <img src={brand.logo_url} alt={brand.name} className="h-8 md:h-10 w-auto object-contain" />
              </div>
            ) : (
              <div key={`${brand.id}-${i}`} className="flex-shrink-0 mx-8 md:mx-12 flex items-center opacity-30 hover:opacity-80 transition-all duration-500">
                <span className="text-lg font-bold text-surface-500 font-display whitespace-nowrap">{brand.name}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================================
   SERVICES — Gradient border cards with glow
   ============================================= */
function ServicesPreview({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null

  return (
    <section id="services" className="py-28 bg-white relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="section-badge mb-4 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="section-title mb-5 text-balance">What we can build for you</h2>
          <p className="section-subtitle mx-auto">End-to-end software development services tailored to ambitious businesses that demand excellence.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, index) => {
            const Icon = ICON_MAP[s.icon_name] || Code
            return (
              <div 
                key={s.id} 
                className="group relative bg-white p-8 rounded-2xl border border-surface-100 hover:border-transparent gradient-border-hover hover-lift"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-brand-50 to-purple-50 group-hover:from-brand-500 group-hover:to-purple-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                  <Icon className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3 font-display">{s.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed mb-5">{s.description}</p>
                {/* Feature list for extra premium feel */}
                {s.features && s.features.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-surface-50">
                    {s.features.slice(0, 3).map((feat: string) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-surface-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-14">
          <Link href="/services" className="group inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors text-sm">
            Explore all services 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* =============================================
   PORTFOLIO — Premium bento grid
   ============================================= */
function PortfolioPreview({ projects }: { projects: any[] }) {
  if (!projects || projects.length === 0) return null

  return (
    <section id="portfolio" className="py-28 bg-surface-50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-brand-100/50 blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <div className="section-badge mb-4">
              <Sparkles className="w-4 h-4" />
              Our Portfolio
            </div>
            <h2 className="section-title">Recent Projects</h2>
          </div>
          <Link href="/portfolio" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-900 text-white text-sm font-semibold hover:bg-surface-800 transition-all duration-300 shadow-lg hover:-translate-y-0.5">
            View all work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {projects.slice(0, 4).map((project, index) => (
            <Link
              href="/portfolio"
              key={project.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer block ${
                index === 0 ? 'md:row-span-2 aspect-auto min-h-[420px]' : 'aspect-video'
              }`}
            >
              {/* Image */}
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-300 flex items-center justify-center">
                  <Code className="w-12 h-12 text-surface-400" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Featured badge */}
              {index === 0 && (
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-3 py-1 text-xs font-bold text-white bg-brand-600/80 backdrop-blur-sm rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                </div>
              )}

              {/* Content — slides up on hover */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{project.category}</span>
                <h3 className="text-white text-xl font-bold mt-1.5 font-display">{project.title}</h3>
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 sm:hidden">
          <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-900 text-white text-sm font-semibold hover:bg-surface-800 transition-colors">
            View all work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}


/* =============================================
   CTA SECTION — Radial glow with shimmer CTA
   ============================================= */
function CTASection() {
  return (
    <section className="py-32 bg-surface-950 text-white text-center relative overflow-hidden">
      {/* Radial glow behind headline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[400px] h-[300px] rounded-full bg-purple-600/10 blur-[120px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Dot grid */}
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 font-display tracking-tight leading-tight text-balance">
          Ready to build something{' '}
          <span className="text-gradient-animated">amazing</span>?
        </h2>
        <p className="text-surface-400 text-lg sm:text-xl mb-12 leading-relaxed max-w-xl mx-auto">
          Let&apos;s transform your vision into a product your users will love.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/join" 
            className="btn-shimmer group inline-flex justify-center items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-brand-600/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
          >
            Start Your Project 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full glass-panel-dark text-white font-semibold hover:bg-white/10 transition-all duration-300 gradient-border"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </section>
  )
}


/* =============================================
   HOME PAGE
   ============================================= */
export default async function Home() {
  const supabase = await createClient()

  const [
    { data: hero },
    { data: services },
    { data: projects },
    { data: branding },
    { data: testimonials },
    { data: faqs },
    { data: processSteps },
    { data: brands }
  ] = await Promise.all([
    supabase.from('hero_content').select('*').eq('is_active', true).limit(1).single(),
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6),
    supabase.from('projects').select('*').eq('is_active', true).order('sort_order').limit(4),
    supabase.from('site_settings').select('*').eq('key', 'brand').single(),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('faqs').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('process_steps').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('brands').select('*').eq('is_active', true).order('sort_order')
  ])

  const showPlaceholder = !hero && !services?.length && !projects?.length

  return (
    <>
      <Navbar branding={branding?.value} />
      <main>
        {showPlaceholder && (
          <div className="pt-32 pb-10 bg-surface-950">
             <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="glass-panel-dark p-8 rounded-2xl inline-flex flex-col items-center gradient-border">
                   <Info className="w-8 h-8 text-brand-400 mb-4" />
                   <h2 className="text-xl font-bold text-white mb-2 font-display">Connected to Supabase</h2>
                   <p className="text-surface-400 text-sm max-w-md">The site is now dynamic. Use the Admin Panel to add content, and run <code className="text-brand-300">master-schema.sql</code> to initialize the database tables.</p>
                </div>
             </div>
          </div>
        )}
        
        <Hero data={hero} />
        
        {/* Smooth dark-to-light transition */}
        <div className="section-divider-dark-to-light" />
        
        <BrandsMarquee brands={brands || []} />
        <ServicesPreview services={services || []} />
        <PortfolioPreview projects={projects || []} />
        <Testimonials testimonials={testimonials || []} />
        <Process steps={processSteps || []} />
        <FAQ faqs={faqs || []} />
        
        {/* Smooth light-to-dark transition */}
        <div className="section-divider-light-to-dark" />
        
        <CTASection />
      </main>
      <Footer branding={branding?.value} />
    </>
  )
}
