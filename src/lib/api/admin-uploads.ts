import { getApiBaseUrl, ApiError } from '@/lib/api/client'
import { getAccessToken } from '@/lib/auth/token-store'

export type UploadResult = {
  id: string
  url?: string | null
  path?: string | null
  display_url?: string | null
  thumbnail_url?: string | null
  processing_status?: string | null
}

/**
 * Upload multipart without forcing Content-Type (browser sets boundary).
 * Prefer this over apiFetch+FormData for Swoole reliability.
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  const token = getAccessToken()
  const form = new FormData()
  form.append('file', file, file.name)

  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/uploads`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  })

  const payload = (await response.json().catch(() => null)) as
    | (UploadResult & { message?: string; errors?: Record<string, string[]> })
    | null

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `Upload failed (${response.status})`,
      response.status,
      payload?.errors,
    )
  }

  return payload as UploadResult
}
