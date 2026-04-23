import { createClient } from '@/utils/supabase/server'
import { FileText, LifeBuoy, Users, Activity } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - PinkLabs',
}

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch counts for the overview stats (handling potential errors if tables don't exist yet)
  let orderCount = 0
  let ticketCount = 0
  let clientCount = 0

  try {
    const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: tickets } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open')
    const { count: clients } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client')
    
    orderCount = orders || 0
    ticketCount = tickets || 0
    clientCount = clients || 0
  } catch (error) {
    console.error("Error fetching stats depending on db setup:", error)
  }

  const stats = [
    { name: 'Active Orders', value: orderCount, icon: FileText, change: '+2', changeType: 'positive' },
    { name: 'Open Support Tickets', value: ticketCount, icon: LifeBuoy, change: '-1', changeType: 'positive' },
    { name: 'Total Clients', value: clientCount, icon: Users, change: '+4', changeType: 'positive' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your agency's projects, incoming tickets, and clients.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-gray-100 sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-xl bg-pink-100 p-3">
                <item.icon className="h-6 w-6 text-pink-600" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-gray-400" />
          Recent Activity
        </h2>
        
        <div className="text-center py-10">
           <p className="text-gray-500 text-sm">Activity feed will be populated as clients interact with the portal.</p>
        </div>
      </div>
    </div>
  )
}
