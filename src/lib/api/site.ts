import { apiFetch } from '@/lib/api/client'
import type { SiteSettings, SiteSettingsResponse } from '@/lib/api/types'

export async function getSiteSettings(): Promise<SiteSettings> {
  const response = await apiFetch<SiteSettingsResponse>('/site/settings')
  return response.data
}
