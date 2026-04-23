import Link from 'next/link'
import { ArrowRight, Sparkles, Trophy, Users, Play } from 'lucide-react'

type HeroData = {
  badge_text: string
  title_line1: string
  title_highlight: string
  description: string
  btn_primary_text: string
  btn_primary_link: string
  btn_secondary_text: string
  btn_secondary_link: string
  hero_image_url: string
  floating_card1_label: string
  floating_card1_value: string
  floating_card2_label: string
  floating_card2_value: string
}

export function Hero({ data }: { data?: HeroData }) {
  const hero = data || {
    badge_text: "Premium Software Development Agency",
    title_line1: "We build digital products that",
    title_highlight: "drive growth",
    description: "Transform your ideas into reality. We specialize in building enterprise-grade web and mobile applications with stunning design and robust architecture.",
    btn_primary_text: "Start Your Project",
    btn_primary_link: "/join",
    btn_secondary_text: "View Our Work",
    btn_secondary_link: "#portfolio",
    hero_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    floating_card1_label: "Successful Projects",
    floating_card1_value: "150+",
    floating_card2_label: "Client Satisfaction",
    floating_card2_value: "99%",
  }

  const imageUrl = hero.hero_image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-surface-950">
      
      {/* === Background Effects === */}
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[150px] animate-glow-pulse" />
      <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[130px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: '4s' }} />

      {/* Floating decorative orbs */}
      <div className="absolute top-[15%] right-[20%] w-3 h-3 rounded-full bg-brand-400/40 animate-float" />
      <div className="absolute top-[60%] left-[8%] w-2 h-2 rounded-full bg-purple-400/30 animate-float-delayed" />
      <div className="absolute bottom-[25%] right-[35%] w-4 h-4 rounded-full bg-indigo-400/20 animate-float" style={{ animationDelay: '1s' }} />

      {/* === Content — Split layout === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-32 pb-24 lg:pt-40 lg:pb-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left — Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-dark mb-8">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300 tracking-wide">{hero.badge_text}</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up stagger-1 font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] text-balance">
              {hero.title_line1}{' '}
              <span className="text-gradient-animated">{hero.title_highlight}</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in-up stagger-2 text-lg lg:text-xl text-surface-400 mb-10 leading-relaxed max-w-xl">
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-4">
              <Link 
                href={hero.btn_primary_link}
                className="btn-shimmer group inline-flex justify-center items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
              >
                {hero.btn_primary_text}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                href={hero.btn_secondary_link}
                className="group inline-flex justify-center items-center gap-2.5 px-8 py-4 rounded-full glass-panel-dark text-white font-semibold hover:bg-white/10 transition-all duration-300 gradient-border"
              >
                <Play className="w-4 h-4 text-brand-400" />
                {hero.btn_secondary_text}
              </Link>
            </div>

            {/* Social proof — small text */}
            <div className="animate-fade-in-up stagger-4 mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 border-2 border-surface-950 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-surface-500">
                <span className="text-surface-300 font-semibold">50+ clients</span> trust us with their digital products
              </p>
            </div>
          </div>

          {/* Right — Hero Image with premium treatment */}
          <div className="relative animate-fade-in-up stagger-3 hidden lg:block">
            {/* Glow behind the image */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-brand-600/20 via-purple-600/10 to-indigo-600/15 blur-2xl animate-glow-pulse" />
            
            {/* Main image container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/30 ring-1 ring-white/10">
              <img 
                src={imageUrl} 
                alt="PinkLabs Team" 
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-950/40 via-brand-600/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 to-transparent" />
            </div>

            {/* Floating Card 1 — top-left */}
            <div className="absolute left-4 top-8 glass-panel-dark p-4 rounded-xl animate-float shadow-2xl z-10 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-brand-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-brand-500/30">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-surface-400 font-medium">{hero.floating_card1_label}</div>
                  <div className="text-lg font-bold text-white font-display">{hero.floating_card1_value}</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 — bottom-right */}
            <div className="absolute right-4 bottom-8 glass-panel-dark p-4 rounded-xl animate-float-delayed shadow-2xl z-10 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-surface-400 font-medium">{hero.floating_card2_label}</div>
                  <div className="text-lg font-bold text-white font-display">{hero.floating_card2_value}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Row */}
        <div className="animate-fade-in-up stagger-5 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          <StatCard value={hero.floating_card1_value} label={hero.floating_card1_label} />
          <StatCard value={hero.floating_card2_value} label={hero.floating_card2_label} />
          <StatCard value="5+" label="Years Experience" />
          <StatCard value="24/7" label="Dedicated Support" />
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-panel-dark rounded-2xl p-5 text-center border border-white/[0.06] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/5 group">
      <div className="text-2xl sm:text-3xl font-bold text-white font-display mb-1 group-hover:text-gradient-animated transition-colors duration-500">{value}</div>
      <div className="text-[11px] text-surface-400 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}
