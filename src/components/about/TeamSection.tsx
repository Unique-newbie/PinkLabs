'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export function TeamSection({ teamMembers }: { teamMembers: any[] }) {
  const [activeMember, setActiveMember] = useState<string | null>(null)

  if (!teamMembers || teamMembers.length === 0) return null

  const founders = teamMembers.filter((m) => m.role.toLowerCase().includes('founder') || m.role.toLowerCase().includes('ceo'))
  const leads = teamMembers.filter((m) => m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('director') || m.role.toLowerCase().includes('cto'))
  const others = teamMembers.filter(
    (m) => !founders.find((f) => f.id === m.id) && !leads.find((l) => l.id === m.id)
  )

  const toggleMember = (id: string) => {
    setActiveMember(activeMember === id ? null : id)
  }

  const renderCard = (member: any, tier: string) => {
    const isActive = activeMember === member.id
    
    return (
      <button
        key={member.id}
        onClick={() => toggleMember(member.id)}
        className={`group relative text-left w-full sm:w-72 rounded-2xl border overflow-hidden transition-all duration-500 focus:outline-none ${
          isActive 
            ? 'border-brand-500/30 shadow-xl shadow-brand-500/10 bg-white' 
            : 'border-surface-100 shadow-sm bg-white hover:border-brand-200/50 hover-lift'
        }`}
      >
        {/* Gradient accent top */}
        <div className={`h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500 transition-opacity duration-500 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />

        <div className="p-6">
          {/* Tier badge */}
          <span className="absolute top-5 right-5 text-[10px] font-bold tracking-wider uppercase text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">
            {tier}
          </span>

          <div className="flex gap-4 items-center mb-4">
            {member.avatar_url ? (
              <div className="relative">
                <img 
                  src={member.avatar_url} 
                  alt={member.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-surface-100 group-hover:border-brand-200 transition-all duration-300" 
                />
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 text-white flex items-center justify-center font-bold text-xl border-2 border-brand-200/20 font-display shadow-lg shadow-brand-500/15">
                {member.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-surface-900 leading-tight font-display">{member.name}</h4>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mt-1">{member.role}</p>
            </div>
          </div>
          
          <div 
            className={`grid transition-all duration-300 ease-in-out ${
              isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-surface-500 leading-relaxed border-t border-surface-100 pt-4">
                {member.bio}
              </p>
            </div>
          </div>
          
          <p className={`text-xs text-brand-600 font-medium text-center transition-all duration-300 ${
            isActive ? 'mt-4 opacity-0 h-0 hidden' : 'mt-4 opacity-100 h-auto'
          }`}>
            Click to read more
          </p>
        </div>
      </button>
    )
  }

  return (
    <section className="py-24 bg-white relative border-t border-surface-100">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-badge mb-4 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            The Brains
          </div>
          <h2 className="section-title mb-5">Meet our exceptional team</h2>
          <p className="section-subtitle mx-auto">Talented individuals who are passionate about building exceptional digital products.</p>
        </div>

        <div className="flex flex-col items-center gap-8 lg:gap-12 w-full max-w-5xl mx-auto">
          {founders.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {founders.map((member) => renderCard(member, 'Founder'))}
            </div>
          )}
          
          {leads.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {leads.map((member) => renderCard(member, 'Lead'))}
            </div>
          )}
          
          {others.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {others.map((member) => renderCard(member, 'Team'))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
