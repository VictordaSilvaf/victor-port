import { apiFetch } from '@/lib/api/client'

export type ContactMessageSummary = {
  id: string
  name: string
  email: string
  subject: string | null
  status: string
  created_at: string
}

export type ContactMessageDetail = ContactMessageSummary & {
  body: string
  ip_address?: string | null
  user_agent?: string | null
}

export type ContactMessagesResponse = {
  data: ContactMessageSummary[]
  meta: { total: number; page: number; per_page: number }
}

export async function listContactMessages(params: {
  page?: number
  per_page?: number
  status?: string
} = {}) {
  return apiFetch<ContactMessagesResponse>('/admin/contact/messages', {
    query: params,
  })
}

export async function getContactMessage(id: string) {
  return apiFetch<ContactMessageDetail>(`/admin/contact/messages/${id}`)
}

export async function updateContactMessageStatus(
  id: string,
  status: 'new' | 'read' | 'archived',
) {
  return apiFetch<{ message?: string }>(`/admin/contact/messages/${id}`, {
    method: 'PATCH',
    body: { status },
  })
}
