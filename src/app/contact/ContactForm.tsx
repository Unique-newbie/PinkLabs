'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { submitContactForm } from './actions'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setErrorMsg('')

    const result = await submitContactForm(formData)

    if (result.error) {
      setStatus('error')
      setErrorMsg(result.error)
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-green-200/50 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-surface-900 mb-3 font-display">Message sent!</h3>
        <p className="text-surface-500 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 text-sm bg-surface-50/50 text-surface-900 placeholder-surface-400 transition-all duration-200"

  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-8 gradient-border-hover">
      <form action={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-surface-600 mb-1.5">Name</label>
            <input
              type="text" id="name" name="name" required
              placeholder="Your full name"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-600 mb-1.5">Email</label>
            <input
              type="email" id="email" name="email" required
              placeholder="you@company.com"
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-surface-600 mb-1.5">Subject</label>
          <input
            type="text" id="subject" name="subject" required
            placeholder="What's this about?"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-surface-600 mb-1.5">Message</label>
          <textarea
            id="message" name="message" rows={6} required
            placeholder="Tell us about your project, timeline, budget, and anything else we should know..."
            className={`${inputClasses} resize-none`}
          />
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  )
}
