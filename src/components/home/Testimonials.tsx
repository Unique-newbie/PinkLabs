import { Star } from 'lucide-react'

export function Testimonials({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-28 bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-[10%] w-[40%] h-[40%] rounded-full bg-purple-50 blur-[120px] opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="section-badge mb-4 mx-auto w-fit">Success Stories</div>
          <h2 className="section-title mb-5">What our clients say</h2>
          <p className="section-subtitle mx-auto">Don&apos;t just take our word for it. Hear from the leaders who trust us to build their mission-critical products.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div 
              key={t.id} 
              className={`group relative bg-surface-50/80 backdrop-blur-sm p-8 rounded-2xl border border-surface-100 hover:border-brand-200/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up stagger-${Math.min(index + 1, 3)}`}
            >
              {/* Decorative gradient accent — left border */}
              <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-gradient-to-b from-brand-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Large decorative quote */}
              <div className="absolute top-4 right-6 text-7xl font-serif text-surface-100 select-none leading-none group-hover:text-brand-100/60 transition-colors duration-500">&ldquo;</div>
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-surface-700 leading-relaxed mb-8 relative z-10">&quot;{t.quote}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-surface-100 pt-6">
                {t.avatar_url ? (
                  <div className="relative">
                    <img src={t.avatar_url} alt={t.client_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-100 group-hover:ring-brand-200 transition-all duration-300" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center font-bold text-white text-sm font-display ring-2 ring-surface-100">
                    {t.client_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-surface-900 font-display">{t.client_name}</h4>
                  <p className="text-xs text-surface-400">{t.client_role}, {t.client_company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
