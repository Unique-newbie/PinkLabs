'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'

interface MobileNavProps {
  links: { name: string; href: string }[]
  user: User | null
}

export function MobileNav({ links, user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-surface-400 hover:text-white transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-surface-950/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl p-5 flex flex-col gap-2 z-50">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-medium text-surface-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-px bg-white/[0.06] my-2" />
          
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl shadow-lg shadow-brand-600/20"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-4 py-3 text-base font-medium text-surface-300 border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/join"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl shadow-lg shadow-brand-600/20"
              >
                Start Project
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
