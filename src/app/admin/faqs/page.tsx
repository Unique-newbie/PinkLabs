import { createClient } from '@/utils/supabase/server'
import { upsertFaq, deleteFaq } from '../cms-actions'
import { Plus, Trash2, HelpCircle } from 'lucide-react'

export const metadata = { title: 'FAQs Management - PinkLabs Admin' }

export default async function AdminFaqsPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">FAQs Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage frequently asked questions on the platform.</p>
      </div>

      {/* Add New FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Add / Edit FAQ</h2>
        <form action={upsertFaq} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input name="question" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea name="answer" required rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" defaultValue="General" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input name="sort_order" type="number" defaultValue="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="is_active" type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex items-end md:col-span-2">
            <button type="submit" className="w-full md:w-auto py-2 px-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus className="w-4 h-4" /> Save FAQ
            </button>
          </div>
        </form>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current FAQs</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs?.map((faq) => (
            <div key={faq.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                   <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{faq.question}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-200 text-gray-700">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {faq.is_active ? 'Active' : 'Inactive'}
                </span>
                <form action={deleteFaq.bind(null, faq.id)}>
                  <button type="submit" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!faqs || faqs.length === 0) && (
            <div className="p-10 text-center text-gray-500 text-sm">
              No FAQs found. Add your first FAQ above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
