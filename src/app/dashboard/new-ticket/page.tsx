import { Navbar } from '@/components/layout/Navbar'
import { createTicket } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export const metadata = {
  title: 'New Support Ticket - PinkLabs',
  description: 'Create a support ticket for your PinkLabs project',
}

export default async function NewTicketPage({
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Contact Support</h1>
            <p className="text-gray-500 text-sm mb-8">We&apos;re here to help. Describe your issue and our team will respond promptly.</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>
            )}

            <form action={createTicket} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text" id="subject" name="subject" required
                  placeholder="Brief summary of your issue"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  id="priority" name="priority"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message" name="message" rows={6} required
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-sm shadow-pink-200"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
