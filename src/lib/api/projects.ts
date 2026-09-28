import { apiFetch } from '@/lib/api/client'
import type {
  Paginated,
  ProjectDetail,
  ProjectDetailResponse,
  ProjectSummary,
  RelatedProjectsResponse,
} from '@/lib/api/types'

export type ListProjectsParams = {
  page?: number
  per_page?: number
  featured?: boolean
  sort?: string
  direction?: 'asc' | 'desc'
  search?: string
  technology?: string
  category?: string
  tag?: string
}

export async function listProjects(
  params: ListProjectsParams = {},
): Promise<Paginated<ProjectSummary>> {
  return apiFetch<Paginated<ProjectSummary>>('/projects', {
    query: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 100,
      featured: params.featured,
      sort: params.sort ?? 'sort_order',
      direction: params.direction ?? 'asc',
      search: params.search,
      technology: params.technology,
      category: params.category,
      tag: params.tag,
    },
  })
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  try {
    const response = await apiFetch<ProjectDetailResponse>(
      `/projects/${encodeURIComponent(slug)}`,
    )
    return response.data
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as { status: number }).status === 404
    ) {
      return null
    }
    throw error
  }
}

export async function getRelatedProjects(
  slug: string,
): Promise<ProjectSummary[]> {
  const response = await apiFetch<RelatedProjectsResponse>(
    `/projects/${encodeURIComponent(slug)}/related`,
  )
  return response.data
}
