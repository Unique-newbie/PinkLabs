import { Search, Palette, Code, Rocket, CheckCircle2, Heart, Clock, Globe, Activity, Target, Lightbulb, Users, Shield } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Search, Palette, Code, Rocket, CheckCircle2, Heart, Clock, Globe, Activity, Target, Lightbulb, Users, Shield
}

export function Process({ steps }: { steps: any[] }) {
  if (!steps || steps.length === 0) return null

  return (
    <section id="process" className="py-28 bg-surface-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="section-badge mb-4 mx-auto w-fit">Our Process</div>
          <h2 className="section-title mb-5">How we build excellence</h2>
          <p className="section-subtitle mx-auto">A battle-tested methodology that ensures your project is delivered on time, within budget, and above expectations.</p>
        </div>

        <div className="relative">
          {/* Connecting line — horizontal on desktop, vertical on mobile */}
          <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-brand-300 via-purple-300 to-indigo-300 opacity-30 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((s, index) => {
              const Icon = ICON_MAP[s.icon_name] || Code
              return (
                <div key={s.id || index} className={`relative group text-center animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}>
                  {/* Step number circle with gradient */}
                  <div className="relative mx-auto mb-6 w-[120px] h-[120px] flex items-center justify-center">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-surface-200 group-hover:border-brand-200 transition-colors duration-500" />
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center z-10 shadow-lg shadow-brand-500/20">
                      <span className="text-xs font-bold text-white font-display">{s.step_number || index + 1}</span>
                    </div>
                    {/* Icon container */}
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-surface-100 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/10 group-hover:border-brand-200 transition-all duration-500">
                      <Icon className="w-7 h-7 text-brand-600" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-surface-900 mb-3 font-display">{s.title}</h3>
                  <p className="text-surface-500 text-sm leading-relaxed max-w-xs mx-auto">{s.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
