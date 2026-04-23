import { createClient } from '@/utils/supabase/server'
import { upsertBrand, deleteBrand, upsertSiteStat, deleteSiteStat } from '../cms-actions'
import { Plus, Trash2, Activity, Users, Star, Trophy, Target } from 'lucide-react'

export const metadata = { title: 'Brands & Stats - PinkLabs Admin' }

const ICON_OPTIONS = [
  { name: 'Activity', icon: Activity },
  { name: 'Users', icon: Users },
  { name: 'Star', icon: Star },
  { name: 'Trophy', icon: Trophy },
  { name: 'Target', icon: Target },
]

export default async function AdminBrandsStatsPage() {
  const supabase = await createClient()
  
  const [{ data: brands }, { data: stats }] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order', { ascending: true }),
    supabase.from('site_stats').select('*').order('sort_order', { ascending: true })
  ])

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brands & Stats</h1>
        <p className="mt-1 text-sm text-gray-500">Manage partner brands and site statistics shown on the Homepage and About pages.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
        {/* ================= BRANDS SECTION ================= */}
        <div className="space-y-6">
          {/* Add New Brand */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Add / Edit Brand</h2>
            <form action={upsertBrand} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Absolute or Relative)</label>
                <input name="logo_url" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
                <input name="website_url" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" defaultValue="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_featured" type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_active" type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <Plus className="w-4 h-4" /> Save Brand
              </button>
            </form>
          </div>

          {/* Brands List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current Brands</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {brands?.map((brand) => (
                <div key={brand.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{brand.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {brand.is_featured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">Featured</span>}
                      {brand.is_active && <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">Active</span>}
                    </div>
                  </div>
                  <form action={deleteBrand.bind(null, brand.id)}>
                    <button type="submit" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
              {(!brands || brands.length === 0) && (
                <div className="p-8 text-center text-gray-500 text-sm">No brands found.</div>
              )}
            </div>
          </div>
        </div>

        {/* ================= STATS SECTION ================= */}
        <div className="space-y-6">
          {/* Add New Stat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Add / Edit Site Stat</h2>
            <form action={upsertSiteStat} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g. Clients WorldWide)</label>
                <input name="label" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (e.g. 50+)</label>
                <input name="value" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select name="icon_name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm">
                  {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" defaultValue="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_active" type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <Plus className="w-4 h-4" /> Save Stat
              </button>
            </form>
          </div>

          {/* Stats List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current Stats</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {stats?.map((stat) => {
                const IconMatch = ICON_OPTIONS.find(io => io.name === stat.icon_name)?.icon || Activity
                return (
                  <div key={stat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                        <IconMatch className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{stat.value}</h3>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                    <form action={deleteSiteStat.bind(null, stat.id)}>
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )
              })}
              {(!stats || stats.length === 0) && (
                <div className="p-8 text-center text-gray-500 text-sm">No stats found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
