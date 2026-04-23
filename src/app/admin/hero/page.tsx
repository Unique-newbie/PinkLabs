import { createClient } from '@/utils/supabase/server'
import { updateHeroContent } from '../cms-actions'
import { Settings, Info } from 'lucide-react'

export const metadata = { title: 'Hero Content - PinkLabs Admin' }

export default async function AdminHeroPage() {
  const supabase = await createClient()
  const { data: hero } = await supabase
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero Content Editor</h1>
        <p className="mt-1 text-sm text-gray-500">Edit the hero section content that appears on the homepage.</p>
      </div>

      {!hero && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
          <Info className="w-5 h-5 shrink-0" />
          <p>No active hero content found. Run the <code>master-schema.sql</code> or insert a row to start editing.</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form action={updateHeroContent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
              <input
                name="badge_text"
                type="text"
                defaultValue={hero?.badge_text || ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
              <input
                name="title_line1"
                type="text"
                defaultValue={hero?.title_line1 || ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight</label>
              <input
                name="title_highlight"
                type="text"
                defaultValue={hero?.title_highlight || ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={hero?.description || ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Value</label>
              <input name="floating_card1_value" type="text" defaultValue={hero?.floating_card1_value || ""} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stat 1 Label</label>
              <input name="floating_card1_label" type="text" defaultValue={hero?.floating_card1_label || ""} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Value</label>
              <input name="floating_card2_value" type="text" defaultValue={hero?.floating_card2_value || ""} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stat 2 Label</label>
              <input name="floating_card2_label" type="text" defaultValue={hero?.floating_card2_label || ""} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                name="hero_image_url"
                type="url"
                defaultValue={hero?.hero_image_url || ""}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Settings className="w-4 h-4" />
              <span>Real-time updates to homepage</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
