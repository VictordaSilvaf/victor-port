import { apiFetch } from '@/lib/api/client'
import type {
  ContactSubmitBody,
  ContactSubmitResponse,
} from '@/lib/api/types'

export async function submitContact(
  body: ContactSubmitBody,
): Promise<ContactSubmitResponse> {
  return apiFetch<ContactSubmitResponse>('/contact', {
    method: 'POST',
    body: {
      name: body.name,
      email: body.email,
      message: body.message,
      subject: body.subject ?? null,
      ...(body.website !== undefined ? { website: body.website } : {}),
      cf_turnstile_response: body.cf_turnstile_response ?? '',
    },
  })
}
