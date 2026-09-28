import { apiFetch } from '@/lib/api/client'
import type { Paginated, ProjectDetail, ProjectSummary } from '@/lib/api/types'

export type ProjectStatistics = {
  published: number
  draft: number
  archived: number
  views: number
  featured: number
}

export type AdminProjectListParams = {
  page?: number
  per_page?: number
  search?: string
  status?: string
  featured?: boolean
  with_trashed?: boolean
  sort?: string
  direction?: 'asc' | 'desc'
}

export type ProjectWriteBody = {
  title: string
  slug?: string
  description?: string | null
  content?: string | null
  repository_url?: string | null
  demo_url?: string | null
  thumbnail?: string | null
  cover?: string | null
  status?: string
  featured?: boolean
  categories?: string[]
  technologies?: string[]
  tags?: string[]
  order?: number
  published_at?: string | null
}

export async function getProjectStatistics() {
  return apiFetch<ProjectStatistics>('/admin/projects/statistics')
}

export async function listAdminProjects(params: AdminProjectListParams = {}) {
  return apiFetch<Paginated<ProjectSummary>>('/admin/projects', {
    query: params,
  })
}

export async function getAdminProject(id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}`,
  )
  return response.data
}

export async function createAdminProject(body: ProjectWriteBody) {
  const response = await apiFetch<{ data: ProjectDetail }>('/admin/projects', {
    method: 'POST',
    body,
  })
  return response.data
}

export async function updateAdminProject(id: string, body: ProjectWriteBody) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}`,
    { method: 'PUT', body },
  )
  return response.data
}

export async function patchAdminProject(
  id: string,
  body: Partial<ProjectWriteBody>,
) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}`,
    { method: 'PATCH', body },
  )
  return response.data
}

export async function publishAdminProject(id: string, published_at?: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/publish`,
    { method: 'PATCH', body: published_at ? { published_at } : {} },
  )
  return response.data
}

export async function archiveAdminProject(id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/archive`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function draftAdminProject(id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/draft`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function duplicateAdminProject(id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/duplicate`,
    { method: 'POST', body: {} },
  )
  return response.data
}

export async function deleteAdminProject(id: string) {
  return apiFetch<{ message: string }>(`/admin/projects/${id}`, {
    method: 'DELETE',
  })
}

export async function forceDeleteAdminProject(id: string) {
  return apiFetch<{ message: string }>(`/admin/projects/${id}/force`, {
    method: 'DELETE',
  })
}

export async function restoreAdminProject(id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/restore`,
    { method: 'PATCH', body: {} },
  )
  return response.data
}

export async function reorderAdminProjects(
  projects: Array<{ id: string; order: number }>,
) {
  return apiFetch<{ message: string }>('/admin/projects/order', {
    method: 'PATCH',
    body: { projects },
  })
}

export async function addProjectImage(
  id: string,
  body: { image_id: string; caption?: string },
) {
  return apiFetch<{ id: string }>(`/admin/projects/${id}/images`, {
    method: 'POST',
    body,
  })
}

export async function removeProjectImage(id: string, imageId: string) {
  return apiFetch<{ message?: string }>(
    `/admin/projects/${id}/images/${imageId}`,
    { method: 'DELETE' },
  )
}

export async function reorderProjectImages(
  id: string,
  images: Array<{ id: string; order: number }>,
) {
  return apiFetch<{ message?: string }>(`/admin/projects/${id}/images/order`, {
    method: 'PATCH',
    body: { images },
  })
}

export async function setProjectThumbnail(id: string, image_id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/thumbnail`,
    { method: 'PATCH', body: { image_id } },
  )
  return response.data
}

export async function setProjectCover(id: string, image_id: string) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/cover`,
    { method: 'PATCH', body: { image_id } },
  )
  return response.data
}

export async function syncProjectCategories(id: string, categories: string[]) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/categories`,
    { method: 'PUT', body: { categories } },
  )
  return response.data
}

export async function syncProjectTechnologies(
  id: string,
  technologies: string[],
) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/technologies`,
    { method: 'PUT', body: { technologies } },
  )
  return response.data
}

export async function syncProjectTags(id: string, tags: string[]) {
  const response = await apiFetch<{ data: ProjectDetail }>(
    `/admin/projects/${id}/tags`,
    { method: 'PUT', body: { tags } },
  )
  return response.data
}
