export { ApiError, apiFetch, apiUrl, getApiBaseUrl } from '@/lib/api/client'
export { submitContact } from '@/lib/api/contact'
export { mapProjectDetail, mapProjectSummary } from '@/lib/api/mappers'
export { resolveProjectImage } from '@/lib/api/media'
export {
  getProjectBySlug as fetchProjectBySlug,
  getRelatedProjects,
  listProjects,
} from '@/lib/api/projects'
export { getSiteSettings } from '@/lib/api/site'
export type * from '@/lib/api/types'
