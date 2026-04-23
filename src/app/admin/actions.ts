'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('order_id') as string
  const status = formData.get('status') as string

  await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  revalidatePath('/admin/orders')
}

export async function updateTicketStatus(formData: FormData) {
  const supabase = await createClient()
  const ticketId = formData.get('ticket_id') as string
  const status = formData.get('status') as string

  await supabase
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  revalidatePath('/admin/tickets')
}

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const role = formData.get('role') as string

  await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  revalidatePath('/admin/clients')
}

export async function adminSignOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
