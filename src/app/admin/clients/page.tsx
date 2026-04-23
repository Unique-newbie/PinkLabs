import { createClient } from '@/utils/supabase/server'
import { updateUserRole } from '../actions'
import { Users, Shield, User } from 'lucide-react'

export const metadata = { title: 'Users & Profiles - PinkLabs Admin' }

export default async function AdminClientsPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users & Profiles</h1>
        <p className="mt-1 text-sm text-gray-500">Manage user accounts and role assignments.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {!profiles || profiles.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">No users registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {profiles.map((profile: any) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                          {profile.role === 'admin'
                            ? <Shield className="w-4 h-4 text-pink-600" />
                            : <User className="w-4 h-4 text-pink-600" />
                          }
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{profile.full_name || 'Unnamed'}</div>
                          <div className="text-xs text-gray-500">{profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        profile.role === 'admin' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.company_name || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form action={updateUserRole} className="flex items-center gap-2">
                        <input type="hidden" name="user_id" value={profile.id} />
                        <select
                          name="role"
                          defaultValue={profile.role}
                          className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-pink-500 focus:border-pink-500"
                        >
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="text-xs bg-pink-600 text-white px-3 py-1 rounded-md hover:bg-pink-700 transition-colors">
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
