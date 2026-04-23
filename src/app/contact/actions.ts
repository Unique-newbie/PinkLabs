'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    subject,
    message,
  })

  if (error) {
    console.error('Contact form error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
