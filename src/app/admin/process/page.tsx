import { createClient } from '@/utils/supabase/server'
import { upsertProcessStep, deleteProcessStep } from '../cms-actions'
import { Plus, Trash2, Search, Zap, Code, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Process Steps - PinkLabs Admin' }

const ICON_OPTIONS = [
  { name: 'Search', icon: Search },
  { name: 'Zap', icon: Zap },
  { name: 'Code', icon: Code },
  { name: 'ShieldCheck', icon: ShieldCheck },
]

export default async function AdminProcessStepsPage() {
  const supabase = await createClient()
  const { data: steps } = await supabase
    .from('process_steps')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Process Steps Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage the 'Our Process' steps shown on the About and Homepage.</p>
      </div>

      {/* Add New Process Step */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Add / Edit Step</h2>
        <form action={upsertProcessStep} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step Number (e.g. '01')</label>
            <input name="step_number" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <select name="icon_name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 text-sm">
              {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
            </select>
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
          <div className="flex items-end">
            <button type="submit" className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus className="w-4 h-4" /> Save Step
            </button>
          </div>
        </form>
      </div>

      {/* Process Steps List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current Process Steps</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {steps?.map((step) => {
            const IconMatch = ICON_OPTIONS.find(io => io.name === step.icon_name)?.icon || Search
            return (
            <div key={step.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                   <h4 className="text-xs font-black">{step.step_number}</h4>
                </div>
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconMatch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${step.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {step.is_active ? 'Active' : 'Inactive'}
                </span>
                <form action={deleteProcessStep.bind(null, step.id)}>
                  <button type="submit" className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
            )
          })}
          {(!steps || steps.length === 0) && (
            <div className="p-10 text-center text-gray-500 text-sm">
              No process steps found. Add your first one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
