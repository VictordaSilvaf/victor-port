import { apiFetch } from '@/lib/api/client'
import type { TaxonomyItem } from '@/lib/api/types'

export async function createCategory(name: string) {
  const response = await apiFetch<{ data: TaxonomyItem }>('/admin/categories', {
    method: 'POST',
    body: { name },
  })
  return response.data
}

export async function createTechnology(name: string) {
  const response = await apiFetch<{ data: TaxonomyItem }>(
    '/admin/technologies',
    {
      method: 'POST',
      body: { name },
    },
  )
  return response.data
}

export async function createTag(name: string) {
  const response = await apiFetch<{ data: TaxonomyItem }>('/admin/tags', {
    method: 'POST',
    body: { name },
  })
  return response.data
}
