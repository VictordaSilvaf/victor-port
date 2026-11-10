import { normalizeProcessedMediaUrl } from '@/lib/api/media'
import type { SiteBranding } from '@/lib/api/types'

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

/** Coerce API branding (`{}` or mistaken `[]`) into a typed object. */
export function parseSiteBranding(value: unknown): SiteBranding {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const record = value as Record<string, unknown>
  return {
    ...record,
    home_cta_image_id: asString(record.home_cta_image_id),
    home_cta_image_url: asString(record.home_cta_image_url),
    contact_image_id: asString(record.contact_image_id),
    contact_image_url: asString(record.contact_image_url),
  }
}

export function brandingImageUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined
  if (!/^https?:\/\//i.test(value)) return undefined
  return normalizeProcessedMediaUrl(value) ?? value
}
