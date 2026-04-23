'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * HERO CONTENT
 */
export async function updateHeroContent(formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    badge_text: formData.get('badge_text') as string,
    title_line1: formData.get('title_line1') as string,
    title_highlight: formData.get('title_highlight') as string,
    description: formData.get('description') as string,
    hero_image_url: formData.get('hero_image_url') as string,
    floating_card1_label: formData.get('floating_card1_label') as string,
    floating_card1_value: formData.get('floating_card1_value') as string,
    floating_card2_label: formData.get('floating_card2_label') as string,
    floating_card2_value: formData.get('floating_card2_value') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('hero_content')
    .update(updates)
    .eq('is_active', true)

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/hero')
  return { success: true }
}

/**
 * SERVICES
 */
export async function upsertService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const service = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    icon_name: formData.get('icon_name') as string || 'Code',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('services').update(service).eq('id', id)
  } else {
    result = await supabase.from('services').insert([service])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/services')
  revalidatePath('/admin/services')
  return { success: true }
}

/**
 * PROJECTS (Portfolio)
 */
export async function upsertProject(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const project = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    tags: (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean),
    image_url: formData.get('image_url') as string,
    project_url: formData.get('project_url') as string,
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_featured: formData.get('is_featured') === 'on',
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('projects').update(project).eq('id', id)
  } else {
    result = await supabase.from('projects').insert([project])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
  return { success: true }
}

/**
 * SITE SETTINGS
 */
export async function updateBranding(formData: FormData) {
  const supabase = await createClient()
  
  const brand = {
    name: formData.get('name') as string,
    logo_url: formData.get('logo_url') as string,
  }

  const { error } = await supabase
    .from('site_settings')
    .update({ value: brand })
    .eq('key', 'brand')

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

/**
 * TESTIMONIALS
 */
export async function upsertTestimonial(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const testimonial = {
    client_name: formData.get('client_name') as string,
    client_role: formData.get('client_role') as string,
    client_company: formData.get('client_company') as string,
    quote: formData.get('quote') as string,
    rating: parseInt(formData.get('rating') as string || '5'),
    avatar_url: formData.get('avatar_url') as string,
  }

  let result
  if (id) {
    result = await supabase.from('testimonials').update(testimonial).eq('id', id)
  } else {
    result = await supabase.from('testimonials').insert([testimonial])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

/**
 * FAQS
 */
export async function upsertFaq(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const faq = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    category: formData.get('category') as string || 'General',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('faqs').update(faq).eq('id', id)
  } else {
    result = await supabase.from('faqs').insert([faq])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/faqs')
  return { success: true }
}

export async function deleteFaq(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/faqs')
  return { success: true }
}

/**
 * PROCESS STEPS
 */
export async function upsertProcessStep(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const step = {
    step_number: formData.get('step_number') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    icon_name: formData.get('icon_name') as string || 'Search',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('process_steps').update(step).eq('id', id)
  } else {
    result = await supabase.from('process_steps').insert([step])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/process')
  return { success: true }
}

export async function deleteProcessStep(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('process_steps').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/process')
  return { success: true }
}

/**
 * COMPANY VALUES
 */
export async function upsertCompanyValue(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const value = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    icon_name: formData.get('icon_name') as string || 'Heart',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('company_values').update(value).eq('id', id)
  } else {
    result = await supabase.from('company_values').insert([value])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/values')
  return { success: true }
}

export async function deleteCompanyValue(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('company_values').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/values')
  return { success: true }
}

/**
 * BRANDS
 */
export async function upsertBrand(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const brand = {
    name: formData.get('name') as string,
    logo_url: formData.get('logo_url') as string,
    website_url: formData.get('website_url') as string,
    is_featured: formData.get('is_featured') === 'on',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('brands').update(brand).eq('id', id)
  } else {
    result = await supabase.from('brands').insert([brand])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/brands-stats')
  return { success: true }
}

export async function deleteBrand(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/brands-stats')
  return { success: true }
}

/**
 * SITE STATS
 */
export async function upsertSiteStat(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const stat = {
    label: formData.get('label') as string,
    value: formData.get('value') as string,
    icon_name: formData.get('icon_name') as string || 'Activity',
    sort_order: parseInt(formData.get('sort_order') as string || '0'),
    is_active: formData.get('is_active') === 'on',
  }

  let result
  if (id) {
    result = await supabase.from('site_stats').update(stat).eq('id', id)
  } else {
    result = await supabase.from('site_stats').insert([stat])
  }

  if (result.error) throw new Error(result.error.message)
  
  revalidatePath('/')
  revalidatePath('/admin/brands-stats')
  return { success: true }
}

export async function deleteSiteStat(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_stats').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/admin/brands-stats')
  return { success: true }
}

/**
 * CONTACT MESSAGES (Leads)
 */
export async function updateContactMessageStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/leads')
  return { success: true }
}
