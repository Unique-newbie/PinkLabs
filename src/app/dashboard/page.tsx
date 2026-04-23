import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { PlusCircle, FileText, LifeBuoy, Clock, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from './actions'

export const metadata = {
  title: 'Dashboard - PinkLabs',
  description: 'Manage your projects and support tickets',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const role = profile?.role || 'client'

  if (role === 'admin') redirect('/admin')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Client Portal</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {profile?.full_name || user.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <form action={signOut}>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
              <Link href="/dashboard/new-ticket" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <LifeBuoy className="w-4 h-4" />
                Support
              </Link>
              <Link href="/dashboard/new-order" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 rounded-lg text-sm font-medium text-white hover:bg-pink-700 shadow-sm shadow-pink-200 transition-colors">
                <PlusCircle className="w-4 h-4" />
                New Order
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-600" />
                Your Orders
              </h2>

              <div className="bg-white shadow-sm rounded-xl border border-gray-100">
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
                    <div className="mt-6">
                      <Link href="/dashboard/new-order" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">
                        <PlusCircle className="w-4 h-4" />
                        New Order
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-100">
                    {orders.map((order: any) => (
                      <li key={order.id} className="flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold text-gray-900">{order.title}</p>
                            <p className="mt-1 flex items-center text-xs text-gray-500">
                              <Clock className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                              {new Date(order.created_at).toLocaleDateString()}
                              {order.project_type && <span className="ml-3 capitalize">{order.project_type.replace('_', ' ')}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-x-4">
                          <div className="hidden sm:flex sm:flex-col sm:items-end">
                            {order.budget_range && <p className="text-sm text-gray-900">{order.budget_range}</p>}
                            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}>
                              {order.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Support Tickets */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-pink-600" />
                Support Tickets
              </h2>

              <div className="bg-white shadow-sm rounded-xl border border-gray-100">
                {!tickets || tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No active support tickets.</p>
                    <Link href="/dashboard/new-ticket" className="inline-flex items-center gap-1 text-sm text-pink-600 font-medium mt-3 hover:text-pink-700 transition-colors">
                      Create a ticket
                    </Link>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-100">
                    {tickets.map((ticket: any) => (
                      <li key={ticket.id} className="p-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-pink-600 truncate">{ticket.subject}</p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">{ticket.message}</p>
                        <div className="mt-2 text-xs text-gray-400">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
