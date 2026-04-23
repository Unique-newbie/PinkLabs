'use client'

import { useState } from 'react'
import { upsertTestimonial } from '../cms-actions'
import { Loader2 } from 'lucide-react'

export function TestimonialForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await upsertTestimonial(formData)
      // Reset form (this is a simple uncontrolled form)
      const form = document.querySelector('form') as HTMLFormElement
      form.reset()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client Name</label>
        <input
          name="client_name"
          placeholder="e.g. John Doe"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 text-sm outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role</label>
          <input
            name="client_role"
            placeholder="e.g. CEO"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 text-sm outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company</label>
          <input
            name="client_company"
            placeholder="e.g. Tech Corp"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 text-sm outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quote</label>
        <textarea
          name="quote"
          placeholder="Client feedback..."
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 text-sm outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating (1-5)</label>
        <select 
          name="rating" 
          defaultValue="5"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 text-sm outline-none transition-all"
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Testimonial'}
      </button>
    </form>
  )
}
