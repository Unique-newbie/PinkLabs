'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const project_type = formData.get('project_type') as string
  const budget_range = formData.get('budget_range') as string
  const timeline = formData.get('timeline') as string

  const { error } = await supabase.from('orders').insert({
    client_id: user.id,
    title,
    description,
    project_type,
    budget_range,
    timeline,
    status: 'pending',
  })

  if (error) {
    redirect('/dashboard/new-order?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function createTicket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const subject = formData.get('subject') as string
  const message = formData.get('message') as string
  const priority = formData.get('priority') as string

  const { error } = await supabase.from('support_tickets').insert({
    client_id: user.id,
    subject,
    message,
    priority: priority || 'medium',
    status: 'open',
  })

  if (error) {
    redirect('/dashboard/new-ticket?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
