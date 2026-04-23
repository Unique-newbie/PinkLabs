import { Navbar } from '@/components/layout/Navbar'
import { createOrder } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export const metadata = {
  title: 'New Order - PinkLabs',
  description: 'Start a new software development project with PinkLabs',
}

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Start a New Project</h1>
            <p className="text-gray-500 text-sm mb-8">Tell us about your project and we&apos;ll get back to you within 24 hours.</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>
            )}

            <form action={createOrder} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text" id="title" name="title" required
                  placeholder="e.g., E-commerce Platform Rebuild"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select
                  id="project_type" name="project_type" required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                >
                  <option value="">Select type...</option>
                  <option value="web_app">Web Application</option>
                  <option value="mobile_app">Mobile App</option>
                  <option value="ui_ux">UI/UX Design</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="saas">SaaS Platform</option>
                  <option value="api">API Development</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                <textarea
                  id="description" name="description" rows={5} required
                  placeholder="Describe your project goals, features, and any technical requirements..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <select
                    id="budget_range" name="budget_range" required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  >
                    <option value="">Select budget...</option>
                    <option value="$1k-$5k">$1,000 - $5,000</option>
                    <option value="$5k-$15k">$5,000 - $15,000</option>
                    <option value="$15k-$50k">$15,000 - $50,000</option>
                    <option value="$50k+">$50,000+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <select
                    id="timeline" name="timeline" required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                  >
                    <option value="">Select timeline...</option>
                    <option value="1-2 weeks">1–2 Weeks</option>
                    <option value="2-4 weeks">2–4 Weeks</option>
                    <option value="1-2 months">1–2 Months</option>
                    <option value="3+ months">3+ Months</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-sm shadow-pink-200"
              >
                <Send className="w-4 h-4" />
                Submit Order
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
