type MediaFields = {
  cover_url?: string | null
  thumbnail_url?: string | null
  cover?: string | null
  thumbnail?: string | null
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

/**
 * Upload processing deletes the original `.jpeg` after writing `.jpg` + `.webp`.
 * Cover/thumbnail often keep the pre-process path, so rewrite to the durable WebP
 * sibling (same strategy gallery `display_url` uses). Gallery images are fine
 * because they resolve from the upload record after processing.
 */
export function normalizeProcessedMediaUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  // Original camera JPEGs are removed; prefer the WebP variant that processing keeps.
  if (/\.jpe?g$/i.test(trimmed)) {
    return trimmed.replace(/\.jpe?g$/i, '.webp')
  }

  return trimmed
}

/**
 * Storage path that survives async image processing (mirrors backend optimizedPath).
 * JPEG originals become `.jpg`; PNG/WebP keep their extension.
 */
export function durableCoverStoragePath(
  path: string | null | undefined,
): string | undefined {
  if (!path?.trim()) return undefined
  if (/\.jpe?g$/i.test(path)) return path.replace(/\.jpe?g$/i, '.jpg')
  return path
}

/** Thumbnail variant written by the upload processor: `{base}_thumb.webp`. */
export function durableThumbnailStoragePath(
  path: string | null | undefined,
): string | undefined {
  if (!path?.trim()) return undefined
  const base = path.replace(/\.[^.]+$/, '')
  return `${base}_thumb.webp`
}

/** Prefer absolute CDN fields from the API. Do not invent URLs from storage paths alone. */
export function resolveProjectImage(project: MediaFields): string | undefined {
  const absolute = project.cover_url || project.thumbnail_url
  if (!absolute || !isAbsoluteUrl(absolute)) return undefined
  return normalizeProcessedMediaUrl(absolute)
}
