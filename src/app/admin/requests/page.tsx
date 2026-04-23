import { createClient } from '@/utils/supabase/server'
import { Mail, Clock, MessageSquare, ChevronRight } from 'lucide-react'

export default async function AdminRequestsPage() {
  const supabase = await createClient()
  
  // Fetch contact requests (new leads)
  const { data: requests } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
        <p className="text-gray-500 text-sm">Review and manage new leads from the contact form.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject & Message</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests?.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{r.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {r.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="font-semibold text-gray-800 text-sm">{r.subject}</div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                        r.status === 'replied' ? 'bg-green-100 text-green-700' : 
                        'bg-gray-100 text-gray-700'
                    }`}>
                      {r.status || 'new'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {(!requests || requests.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets Section Placeholder */}
      <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <MessageSquare className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support Tickets</h3>
              <p className="text-sm text-gray-600 mb-6">View and respond to support tickets from active clients.</p>
              <button className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 shadow-sm hover:border-pink-200 transition-all flex items-center gap-2">
                  Coming Soon <ChevronRight className="w-4 h-4" />
              </button>
          </div>
      </div>
    </div>
  )
}
