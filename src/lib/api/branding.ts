import {
  durableCoverStoragePath,
} from '@/lib/api/media'
import type { UploadResult } from '@/lib/api/admin-uploads'
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

/**
 * Resolve a branding image for display.
 * Prefer the durable optimized `.jpg` master — full-size `.webp` is often missing
 * (processing can skip/fail the WebP write while `.jpg` remains).
 */
export function brandingImageUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return undefined

  // Premature or missing full-size webp → durable jpg master
  if (/\.webp$/i.test(trimmed) && !/_thumb\.webp$/i.test(trimmed)) {
    return trimmed.replace(/\.webp$/i, '.jpg')
  }
  // Deleted original jpeg → durable jpg
  if (/\.jpeg$/i.test(trimmed)) {
    return trimmed.replace(/\.jpeg$/i, '.jpg')
  }

  return trimmed
}

/**
 * Build a durable public URL right after upload (before/while processing runs).
 * Uses the CDN host from the upload response + optimized storage path.
 */
export function brandingUrlFromUpload(
  uploaded: UploadResult,
): string | undefined {
  const source = uploaded.display_url || uploaded.url || undefined
  if (!source || !/^https?:\/\//i.test(source)) {
    return brandingImageUrl(source)
  }

  const durablePath = durableCoverStoragePath(uploaded.path)
  if (!durablePath) return brandingImageUrl(source)

  try {
    const url = new URL(source)
    const file = durablePath.split('/').pop()
    if (!file) return brandingImageUrl(source)
    url.pathname = url.pathname.replace(/[^/]+$/, file)
    return url.toString()
  } catch {
    return brandingImageUrl(source)
  }
}
