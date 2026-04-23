import { createClient } from '@/utils/supabase/server'
import { updateContactMessageStatus } from '../cms-actions'
import { Mail, CheckCircle, Archive, Clock, MoreVertical, MessageSquare } from 'lucide-react'

export const metadata = { title: 'Inbox & Leads - PinkLabs Admin' }

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  
  // Fetch messages, newest first
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-blue-100 text-blue-700">New</span>
      case 'read': return <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-gray-100 text-gray-700">Read</span>
      case 'replied': return <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-green-100 text-green-700">Replied</span>
      case 'archived': return <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-orange-100 text-orange-700">Archived</span>
      default: return <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-gray-100 text-gray-700">{status}</span>
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inbox & Leads</h1>
        <p className="mt-1 text-sm text-gray-500">Manage incoming messages from the contact form.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Messages</h2>
          <div className="text-xs text-gray-500 font-medium">
            Total: {messages?.length || 0}
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {messages?.map((msg) => (
            <div key={msg.id} className="p-6 transition-colors hover:bg-gray-50 group">
              <div className="flex items-start justify-between gap-6">
                
                {/* User Info & Message */}
                <div className="flex gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 mt-1">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{msg.name}</h3>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${msg.email}`} className="hover:text-pink-600 transition-colors">{msg.email}</a>
                      </span>
                      {getStatusBadge(msg.status)}
                    </div>
                    {msg.subject && (
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{msg.subject}</h4>
                    )}
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                    
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={updateContactMessageStatus.bind(null, msg.id, 'read')}>
                    <button type="submit" title="Mark as Read" className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </form>
                  <form action={updateContactMessageStatus.bind(null, msg.id, 'replied')}>
                    <button type="submit" title="Mark as Replied" className="p-2 text-gray-400 hover:text-green-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </form>
                  <form action={updateContactMessageStatus.bind(null, msg.id, 'archived')}>
                    <button type="submit" title="Archive Message" className="p-2 text-gray-400 hover:text-orange-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                      <Archive className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ))}

          {(!messages || messages.length === 0) && (
            <div className="p-16 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-base font-medium text-gray-900">Your inbox is empty</p>
              <p className="text-sm mt-1">When users submit the contact form, their messages will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
