import Link from 'next/link'
import { Code2, Mail, MapPin, Phone, Globe, ExternalLink, MessageCircle, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export async function Footer({ branding }: { branding?: any }) {
  const supabase = await createClient()
  const [{ data: navData }, { data: contactData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'navigation').single(),
    supabase.from('site_settings').select('value').eq('key', 'contact_info').single()
  ])

  const currentYear = new Date().getFullYear()
  const brandName = branding?.name || "Pink Labs"
  const logoUrl = branding?.logo_url

  const footerLinks = {
    services: navData?.value?.footer_services || [
      { name: 'Web Applications', href: '/services' },
      { name: 'Mobile Apps', href: '/services' },
      { name: 'UI/UX Design', href: '/services' },
    ],
    company: navData?.value?.footer_company || [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Contact', href: '/contact' },
    ],
    support: navData?.value?.footer_support || [
      { name: 'Client Portal', href: '/dashboard' },
      { name: 'New Project', href: '/join' },
    ],
  }

  const contactInfo = contactData?.value || {
    email: 'hello@pinklabs.dev',
    phone: '+1 (555) 123-4567',
    location: 'Remote-first, Worldwide',
    socials: {}
  }

  return (
    <footer className="bg-surface-950 text-surface-400 relative overflow-hidden">
      {/* Gradient divider at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand — takes 2 columns */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-5">
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="h-8 w-auto brightness-0 invert" />
              ) : (
                <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl p-2">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="font-display font-bold tracking-tight text-xl text-white">{brandName}</span>
            </Link>
            <p className="text-sm text-surface-500 leading-relaxed mb-8 max-w-sm">
              We transform ideas into digital excellence. Premium software development for businesses that demand the best.
            </p>
            
            {/* Social icons with glow hover */}
            <div className="flex gap-2">
              {[
                { icon: MessageCircle, label: 'Chat' },
                { icon: Globe, label: 'Web' },
                { icon: ExternalLink, label: 'Link' }
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-surface-800/50 hover:bg-brand-600 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/20 hover:-translate-y-0.5 border border-surface-700/50 hover:border-brand-500/50"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-5">Services</h3>
            <ul className="space-y-3.5">
              {footerLinks.services.map((link: any) => (
                <li key={link.name}>
                  <Link href={link.href} className="group/link text-sm text-surface-500 hover:text-white transition-colors duration-200 flex items-center gap-1">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-5">Company</h3>
            <ul className="space-y-3.5">
              {footerLinks.company.map((link: any) => (
                <li key={link.name}>
                  <Link href={link.href} className="group/link text-sm text-surface-500 hover:text-white transition-colors duration-200 flex items-center gap-1">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-5 mt-8">Support</h3>
            <ul className="space-y-3.5">
              {footerLinks.support.map((link: any) => (
                <li key={link.name}>
                  <Link href={link.href} className="group/link text-sm text-surface-500 hover:text-white transition-colors duration-200 flex items-center gap-1">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.2em] mb-5">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span className="text-sm text-surface-500">{contactInfo.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span className="text-sm text-surface-500">{contactInfo.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span className="text-sm text-surface-500">{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-800/50 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">© {currentYear} {brandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-surface-600 hover:text-surface-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-surface-600 hover:text-surface-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
