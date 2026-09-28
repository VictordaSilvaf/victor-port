type MediaFields = {
  cover_url?: string | null
  thumbnail_url?: string | null
  cover?: string | null
  thumbnail?: string | null
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

/** Prefer absolute CDN fields from the API. Do not invent URLs from storage paths alone. */
export function resolveProjectImage(project: MediaFields): string | undefined {
  const absolute = project.cover_url || project.thumbnail_url
  if (absolute && isAbsoluteUrl(absolute)) return absolute
  return undefined
}
