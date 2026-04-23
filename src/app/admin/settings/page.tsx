import { createClient } from '@/utils/supabase/server'
import { updateBranding } from '../cms-actions'
import { Globe, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Brand Settings - PinkLabs Admin' }

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: setting } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'brand')
    .single()

  const brand = setting?.value as { name: string, logo_url: string } || { name: 'Pink Labs', logo_url: '' }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brand Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Global branding and site configuration.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={updateBranding} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
            <input 
              name="name" 
              required 
              defaultValue={brand.name}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" 
            />
            <p className="mt-1.5 text-xs text-gray-500">This name appears in the Navbar and Footer.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input 
              name="logo_url" 
              type="url"
              defaultValue={brand.logo_url}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" 
            />
            <p className="mt-1.5 text-xs text-gray-500">Provide a URL to your logo image. If empty, the agency name will be used.</p>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              <Globe className="w-3 h-3" />
              <span>Public Settings</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Save Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
