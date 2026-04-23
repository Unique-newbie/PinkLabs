import { createClient } from '@/utils/supabase/server'
import { upsertProject } from '../cms-actions'
import { Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'

export const metadata = { title: 'Portfolio Management - PinkLabs Admin' }

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
        <p className="mt-1 text-sm text-gray-500">Exhibit your best work to potential clients.</p>
      </div>

      {/* Add New Project */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Add / Edit Project</h2>
        <form action={upsertProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" placeholder="e.g. SaaS Platform" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
            <input name="tags" placeholder="Next.js, Tailwind, AI" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input name="image_url" type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project URL (Optional)</label>
            <input name="project_url" type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="flex gap-4">
             <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_featured" type="checkbox" className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_active" type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus className="w-4 h-4" /> Save Project
            </button>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="aspect-video relative bg-gray-100">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                   <ImageIcon className="w-8 h-8" />
                </div>
              )}
              {project.is_featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-pink-600 text-white text-[10px] font-bold rounded uppercase">Featured</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{project.title}</h3>
                  <p className="text-xs text-pink-500 font-medium">{project.category}</p>
                </div>
                <div className="flex gap-1">
                   <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
