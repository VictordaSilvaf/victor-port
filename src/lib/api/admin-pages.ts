import { apiFetch } from '@/lib/api/client'
import type { Paginated, SiteSettings } from '@/lib/api/types'

export type PageSummary = {
  id: string
  title: string
  slug: string
  status: string
  is_home: boolean
  sort_order?: number
  order?: number
  published_at?: string | null
}

export type PageBlock = {
  id?: string
  type: string
  order?: number
  payload: Record<string, unknown>
  settings?: Record<string, unknown>
}

export type PageDetail = {
  id: string
  title: string
  slug: string
  layout: string
  is_home: boolean
  status: string
  published_at?: string | null
  order?: number
  seo?: Record<string, unknown> | null
  blocks: PageBlock[]
}

export type PageWriteBody = {
  title: string
  slug?: string
  layout?: string
  is_home?: boolean
  status?: string
  seo?: Record<string, unknown>
  order?: number
  published_at?: string | null
}

export type BlockType = {
  type: string
  label: string
  schema: Record<string, unknown>
}

export async function listAdminPages(params: {
  page?: number
  per_page?: number
} = {}) {
  return apiFetch<Paginated<PageSummary>>('/admin/pages', { query: params })
}

export async function getAdminPage(id: string, with_trashed?: boolean) {
  const response = await apiFetch<{ data: PageDetail }>(`/admin/pages/${id}`, {
    query: with_trashed ? { with_trashed: true } : undefined,
  })
  return response.data
}

export async function createAdminPage(body: PageWriteBody) {
  const response = await apiFetch<{ data: PageDetail }>('/admin/pages', {
    method: 'POST',
    body,
  })
  return response.data
}

export async function updateAdminPage(id: string, body: PageWriteBody) {
  const response = await apiFetch<{ data: PageDetail }>(`/admin/pages/${id}`, {
    method: 'PUT',
    body,
  })
  return response.data
}

export async function patchAdminPage(
  id: string,
  body: Partial<PageWriteBody>,
) {
  const response = await apiFetch<{ data: PageDetail }>(`/admin/pages/${id}`, {
    method: 'PATCH',
    body,
  })
  return response.data
}

export async function publishAdminPage(id: string, published_at?: string) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/publish`,
    { method: 'PATCH', body: published_at ? { published_at } : {} },
  )
  return response.data
}

export async function archiveAdminPage(id: string) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/archive`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function draftAdminPage(id: string) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/draft`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function duplicateAdminPage(id: string) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/duplicate`,
    { method: 'POST', body: {} },
  )
  return response.data
}

export async function deleteAdminPage(id: string) {
  return apiFetch<{ message: string }>(`/admin/pages/${id}`, {
    method: 'DELETE',
  })
}

export async function forceDeleteAdminPage(id: string) {
  return apiFetch<{ message: string }>(`/admin/pages/${id}/force`, {
    method: 'DELETE',
  })
}

export async function restoreAdminPage(id: string) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/restore`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function reorderAdminPages(
  items: Array<{ id: string; sort_order: number }>,
) {
  return apiFetch<{ message: string }>('/admin/pages/order', {
    method: 'PATCH',
    body: { items },
  })
}

export async function syncPageBlocks(id: string, blocks: PageBlock[]) {
  const response = await apiFetch<{ data: PageDetail }>(
    `/admin/pages/${id}/blocks`,
    {
      method: 'PUT',
      body: {
        blocks: blocks.map(({ type, payload, settings }) => ({
          type,
          payload,
          settings: settings ?? {},
        })),
      },
    },
  )
  return response.data
}

export async function listBlockTypes() {
  const response = await apiFetch<{ data: BlockType[] }>('/block-types', {
    auth: false,
  })
  return response.data
}

export async function getAdminSiteSettings() {
  const response = await apiFetch<{ data: SiteSettings }>(
    '/admin/site/settings',
  )
  return response.data
}

export async function updateAdminSiteSettings(
  body: Partial<SiteSettings> & Record<string, unknown>,
) {
  const response = await apiFetch<{ data: SiteSettings }>(
    '/admin/site/settings',
    { method: 'PUT', body },
  )
  return response.data
}
