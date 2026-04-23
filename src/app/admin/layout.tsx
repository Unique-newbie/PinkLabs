import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, Settings, Code2, ShieldAlert, LogOut, Mail, Star } from 'lucide-react'
import { adminSignOut } from './actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard') // Redirect non-admins back to client portal
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-pink-600 rounded-xl p-2">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">
              PinkLabs Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center px-3 py-2.5 bg-gray-800 rounded-lg text-sm font-medium text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3 text-pink-500" />
            Overview
          </Link>
          <Link href="/admin/requests" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Mail className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Project Requests
          </Link>
          <Link href="/admin/orders" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Clients & Projects
          </Link>
          <Link href="/admin/tickets" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <ShieldAlert className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Support Tickets
          </Link>
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CMS Settings</p>
          </div>
          <Link href="/admin/hero" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Hero Content
          </Link>
          <Link href="/admin/services" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Code2 className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Services
          </Link>
          <Link href="/admin/portfolio" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Portfolio
          </Link>
          <Link href="/admin/testimonials" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Star className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Testimonials
          </Link>
          <Link href="/admin/faqs" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            FAQs
          </Link>
          <Link href="/admin/process" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <ShieldAlert className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Process Steps
          </Link>
          <Link href="/admin/values" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Star className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Company Values
          </Link>
          <Link href="/admin/brands-stats" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Users className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Brands & Stats
          </Link>
          <Link href="/admin/leads" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Mail className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Inbox / Leads
          </Link>
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</p>
          </div>
          <Link href="/admin/settings" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Global Settings
          </Link>
          <Link href="/admin/clients" className="flex items-center px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg text-sm font-medium transition-colors">
            <Users className="w-5 h-5 mr-3 text-gray-500 hover:text-pink-400 transition-colors" />
            Users & Profiles
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-white truncate">{user.email}</span>
                <span className="text-xs text-gray-500 uppercase">Admin</span>
              </div>
            </div>
            <form action={adminSignOut}>
              <button type="submit" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 md:hidden bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-10">
           <span className="font-bold text-gray-900">PinkLabs Admin</span>
           {/* Simple mobile menu trigger placeholder */}
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
