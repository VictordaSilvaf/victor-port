import { apiFetch, getApiBaseUrl } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/token-store'

export type UploadResult = {
  id: string
  url?: string | null
  path?: string | null
  display_url?: string | null
  thumbnail_url?: string | null
  processing_status?: string | null
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  return apiFetch<UploadResult>('/admin/uploads', {
    method: 'POST',
    body: form,
  })
}

/** Low-level helper if FormData + Content-Type needs full control */
export async function uploadFileRaw(file: File): Promise<UploadResult> {
  const token = getAccessToken()
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/uploads`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: (() => {
      const form = new FormData()
      form.append('file', file)
      return form
    })(),
  })
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload?.message || 'Upload failed')
  }
  return payload as UploadResult
}
