export { ApiError, apiFetch, apiUrl, getApiBaseUrl } from '@/lib/api/client'
export { submitContact } from '@/lib/api/contact'
export {
  mapProjectDetail,
  mapProjectGallery,
  mapProjectSummary,
} from '@/lib/api/mappers'
export {
  durableCoverStoragePath,
  durableThumbnailStoragePath,
  normalizeProcessedMediaUrl,
  resolveProjectImage,
} from '@/lib/api/media'
export {
  getProjectBySlug as fetchProjectBySlug,
  getRelatedProjects,
  listProjects,
} from '@/lib/api/projects'
export {
  brandingImageUrl,
  parseSiteBranding,
} from '@/lib/api/branding'
export { getSiteSettings } from '@/lib/api/site'
export type * from '@/lib/api/types'
