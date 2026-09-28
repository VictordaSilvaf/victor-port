import { apiFetch } from '@/lib/api/client'
import type { TaxonomyItem } from '@/lib/api/types'

export type AdminUserListItem = {
  id: string
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export type AdminUserDetail = {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export type AdminUsersListResponse = {
  total: number
  items: AdminUserListItem[]
}

export type RoleItem = {
  id: string
  name: string
  slug: string
  is_system?: boolean
  permissions?: PermissionItem[]
}

export type PermissionItem = {
  id: string
  slug: string
  description?: string | null
}

export async function listAdminUsers(params: {
  page?: number
  per_page?: number
  search?: string
} = {}) {
  return apiFetch<AdminUsersListResponse>('/admin/users', { query: params })
}

export async function getAdminUser(id: string) {
  return apiFetch<AdminUserDetail>(`/admin/users/${id}`)
}

export async function createAdminUser(body: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) {
  return apiFetch<{ id: string; message: string }>('/admin/users', {
    method: 'POST',
    body,
  })
}

export async function updateAdminUser(
  id: string,
  body: { name: string; email: string },
) {
  return apiFetch<{ message: string }>(`/admin/users/${id}`, {
    method: 'PUT',
    body,
  })
}

export async function syncUserRoles(id: string, role_ids: string[]) {
  return apiFetch<{ message: string }>(`/admin/users/${id}/roles`, {
    method: 'PUT',
    body: { role_ids },
  })
}

export async function listRoles() {
  const response = await apiFetch<{ data?: RoleItem[] } | RoleItem[]>(
    '/admin/roles',
  )
  if (Array.isArray(response)) return response
  return response.data ?? []
}

export async function createRole(body: { name: string; slug: string }) {
  return apiFetch<{ id: string; message: string }>('/admin/roles', {
    method: 'POST',
    body,
  })
}

export async function deleteRole(id: string) {
  return apiFetch<{ message: string }>(`/admin/roles/${id}`, {
    method: 'DELETE',
  })
}

export async function syncRolePermissions(
  id: string,
  permission_ids: string[],
) {
  return apiFetch<{ message: string }>(`/admin/roles/${id}/permissions`, {
    method: 'PUT',
    body: { permission_ids },
  })
}

export async function listPermissions() {
  const response = await apiFetch<{ data: PermissionItem[] }>(
    '/admin/permissions',
  )
  return response.data
}

export async function listTechnologies() {
  const response = await apiFetch<{ data: TaxonomyItem[] }>('/technologies', {
    auth: false,
  })
  return response.data
}

export async function listCategories() {
  const response = await apiFetch<{ data: TaxonomyItem[] }>('/categories', {
    auth: false,
  })
  return response.data
}

export async function listTags() {
  const response = await apiFetch<{ data: TaxonomyItem[] }>('/tags', {
    auth: false,
  })
  return response.data
}
