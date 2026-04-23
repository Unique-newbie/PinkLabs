import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Mail, MapPin, Phone, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { ContactForm } from './ContactForm'
import Link from 'next/link'

export const metadata = {
  title: 'Contact — PinkLabs',
  description: 'Get in touch with PinkLabs for your next software development project.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const [{ data: branding }, { data: contactData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'brand').single(),
    supabase.from('site_settings').select('value').eq('key', 'contact_info').single()
  ])

  const contactInfo = contactData?.value || {
    email: 'hello@pinklabs.dev',
    phone: '+1 (555) 123-4567',
    location: 'Remote-first, Worldwide',
    hours: 'Mon – Fri, 9am – 6pm IST'
  }

  return (
    <>
      <Navbar branding={branding?.value} />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="py-24 lg:py-32 bg-surface-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern-dark" />
          <div className="absolute top-[30%] left-[30%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="section-badge mb-6 mx-auto w-fit !text-brand-300 !border-brand-500/20" style={{ background: 'rgba(236,72,153,0.1)' }}>
              <Sparkles className="w-4 h-4" />
              Contact Us
            </div>
            <h1 className="font-display text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Let&apos;s start a{' '}
              <span className="text-gradient-animated">conversation</span>
            </h1>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Drop us a message and we&apos;ll respond within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-surface-900 mb-4 font-display">Get in touch</h2>
                  <p className="text-surface-500 text-sm leading-relaxed">
                    Ready to bring your idea to life? Reach out to us through any of these channels or fill out the form.
                  </p>
                </div>

                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: contactInfo.email },
                    { icon: Phone, label: 'Phone', value: contactInfo.phone },
                    { icon: MapPin, label: 'Location', value: contactInfo.location },
                    { icon: Clock, label: 'Working Hours', value: contactInfo.hours },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 bg-gradient-to-br from-brand-50 to-purple-50 group-hover:from-brand-500 group-hover:to-purple-500 border border-brand-100/50 group-hover:border-transparent rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                        <item.icon className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">{item.label}</h3>
                        <p className="text-sm text-surface-500 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="pt-6 border-t border-surface-100">
                  <h3 className="text-sm font-semibold text-surface-900 mb-4 font-display">Quick links</h3>
                  <div className="space-y-3">
                    <Link href="/portfolio" className="group flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
                      View our portfolio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/services" className="group flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
                      Browse services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer branding={branding?.value} />
    </>
  )
}
